import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const METHODS = ["moncash", "natcash", "sogebank", "autre"] as const;
const PURPOSES = ["sponsor", "service", "seminar", "autre"] as const;

export async function GET() {
  try {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg, items: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = getSupabase();
  const body = await request.json().catch(() => ({}));

  const sender_name = (body.sender_name ?? "").trim();
  const method = body.method;
  if (!sender_name) return NextResponse.json({ error: "Nom requis." }, { status: 400 });
  if (!METHODS.includes(method)) return NextResponse.json({ error: "Méthode invalide." }, { status: 400 });

  const { data, error } = await supabase
    .from("payments")
    .insert({
      sponsor_id: body.sponsor_id || null,
      purpose: PURPOSES.includes(body.purpose) ? body.purpose : "autre",
      amount: Number(body.amount) || 0,
      currency: body.currency === "USD" ? "USD" : "HTG",
      method,
      sender_name,
      sender_phone: (body.sender_phone ?? "").trim(),
      reference: (body.reference ?? "").trim(),
      proof_url: body.proof_url || null,
      note: (body.note ?? "").trim().slice(0, 500),
      status: "pending",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data }, { status: 201 });
}
