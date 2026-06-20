import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/** Constant-time string comparison to prevent timing attacks. */
async function safeCompare(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const ka = await crypto.subtle.importKey("raw", enc.encode(a), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const kb = await crypto.subtle.importKey("raw", enc.encode(b), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const nonce = crypto.getRandomValues(new Uint8Array(32));
  const [sigA, sigB] = await Promise.all([
    crypto.subtle.sign("HMAC", ka, nonce),
    crypto.subtle.sign("HMAC", kb, nonce),
  ]);
  const arrA = new Uint8Array(sigA);
  const arrB = new Uint8Array(sigB);
  let diff = 0;
  for (let i = 0; i < arrA.length; i++) diff |= arrA[i] ^ arrB[i];
  return diff === 0;
}

export async function POST(request: Request) {
  // ── Rate limit: 5 attempts per IP per 15 minutes ──────────────────────────
  const ip = getClientIp(request);
  const { allowed, remaining, resetAt } = rateLimit({
    key: `login:${ip}`,
    limit: 5,
    windowSeconds: 15 * 60,
  });

  if (!allowed) {
    const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans quelques minutes." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // ── Env checks ─────────────────────────────────────────────────────────────
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();
  const secret = process.env.SESSION_SECRET?.trim();

  if (!adminPassword || !secret) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD ou SESSION_SECRET non configuré sur le serveur." },
      { status: 500 }
    );
  }

  // ── Parse body ─────────────────────────────────────────────────────────────
  let password: string | undefined;
  try {
    const body = await request.json();
    password = typeof body?.password === "string" ? body.password.trim() : undefined;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (!password) {
    return NextResponse.json({ error: "Mot de passe requis." }, { status: 400 });
  }

  // ── Constant-time password check ───────────────────────────────────────────
  const match = await safeCompare(password, adminPassword);

  if (!match) {
    return NextResponse.json(
      { error: "Mot de passe incorrect." },
      {
        status: 401,
        headers: { "X-RateLimit-Remaining": String(remaining) },
      }
    );
  }

  // ── Issue session ──────────────────────────────────────────────────────────
  const token = await createSessionToken(secret);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
