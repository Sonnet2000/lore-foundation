/**
 * In-memory rate limiter (Edge/Node compatible).
 * Vercel serverless: state resets per cold start — sufficient for throttling
 * brute-force bursts within a single function instance.
 */

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();

/** Clean stale keys every N calls to avoid memory bloat. */
let callCount = 0;
function maybePrune() {
  if (++callCount % 200 !== 0) return;
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}

export interface RateLimitOptions {
  /** Unique key (e.g. IP + route). */
  key: string;
  /** Max requests in the window. */
  limit: number;
  /** Window in seconds. */
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // epoch ms
}

export function rateLimit({ key, limit, windowSeconds }: RateLimitOptions): RateLimitResult {
  maybePrune();
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  let entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    entry = { count: 0, resetAt: now + windowMs };
    store.set(key, entry);
  }

  entry.count += 1;

  const allowed = entry.count <= limit;
  const remaining = Math.max(0, limit - entry.count);

  return { allowed, remaining, resetAt: entry.resetAt };
}

/** Extract best-effort client IP from Next.js request headers. */
export function getClientIp(request: Request): string {
  const headers = request.headers;
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
