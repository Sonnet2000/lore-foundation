import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = (body?.email ?? "").toString().trim().toLowerCase();

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
  }

  const supabase = getSupabase();
  const { error } = await supabase.from("subscribers").insert({ email });

  // A duplicate email (unique constraint violation, Postgres code 23505) is
  // not an error from the visitor's point of view — they're already
  // subscribed, so we treat it as success.
  if (error && error.code !== "23505") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
