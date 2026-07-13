import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed } = rateLimit({ key: `payment-request:${ip}`, limit: 5, windowSeconds: 3600 });
  if (!allowed) {
    return NextResponse.json({ error: "Twòp demand. Eseye ankò pita." }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));

  const full_name = (body.full_name ?? "").toString().trim().slice(0, 120);
  const email = (body.email ?? "").toString().trim().toLowerCase().slice(0, 254);
  const phone = (body.phone ?? "").toString().trim().slice(0, 40);
  const subject = (body.subject ?? "").toString().trim().slice(0, 200);
  const amount = (body.amount ?? "").toString().trim().slice(0, 60);
  const reference = (body.reference ?? "").toString().trim().slice(0, 200);
  const proof_url = (body.proof_url ?? "").toString().trim().slice(0, 500);
  const methodRaw = (body.method ?? "binance").toString().trim().toLowerCase().slice(0, 40);
  const method = methodRaw || "binance";

  if (!full_name) return NextResponse.json({ error: "Non an obligatwa." }, { status: 400 });
  if (!email || !isValidEmail(email)) return NextResponse.json({ error: "Imèl envalid." }, { status: 400 });
  if (!subject) return NextResponse.json({ error: "Presize pou ki sa peman an ye." }, { status: 400 });
  if (!reference && !proof_url) {
    return NextResponse.json({ error: "Ajoute referans tranzaksyon an oswa yon kapti ekran." }, { status: 400 });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("payment_requests")
    .insert({
      full_name, email, phone, subject, amount,
      method,
      reference,
      proof_url: proof_url || null,
      status: "pending",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data }, { status: 201 });
}
