import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;

  if (!adminPassword || !secret) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD ou SESSION_SECRET non configuré sur le serveur." },
      { status: 500 }
    );
  }

  let password: string | undefined;
  try {
    const body = await request.json();
    password = body?.password;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

  const token = await createSessionToken(secret);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
