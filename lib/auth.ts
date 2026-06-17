/**
 * Minimal signed-session helper for the admin area.
 *
 * Uses the Web Crypto API (available in both the Edge middleware runtime
 * and modern Node.js) instead of Node's `crypto` module, so the same code
 * works in `middleware.ts` and in Route Handlers without extra dependencies.
 *
 * The "session" is just `${expiresAt}.${hmacSignature}` — there's no
 * server-side session store, which keeps this compatible with Vercel's
 * stateless serverless functions.
 */

export const SESSION_COOKIE = "lore_admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

const encoder = new TextEncoder();

async function getKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(secret: string): Promise<string> {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const key = await getKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(String(expiresAt)));
  return `${expiresAt}.${toHex(signature)}`;
}

export async function verifySessionToken(
  token: string | undefined | null,
  secret: string
): Promise<boolean> {
  if (!token) return false;

  const [expiresAtRaw, signature] = token.split(".");
  if (!expiresAtRaw || !signature) return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;

  const key = await getKey(secret);
  const expectedSignature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(expiresAtRaw)
  );

  return toHex(expectedSignature) === signature;
}
