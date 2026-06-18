import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

export async function POST(request: Request) {
  // Rate limit: 3 subscriptions per IP per hour
  const ip = getClientIp(request);
  const { allowed } = rateLimit({ key: `subscribe:${ip}`, limit: 3, windowSeconds: 3600 });

  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessayez plus tard." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const email = (body?.email ?? "").toString().trim().toLowerCase().slice(0, 254);

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
  }

  const supabase = getSupabase();
  const { error } = await supabase.from("subscribers").insert({ email });

  // Duplicate → already subscribed, treat as success silently
  if (error && error.code !== "23505") {
    return NextResponse.json({ error: "Erreur lors de l'inscription." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
