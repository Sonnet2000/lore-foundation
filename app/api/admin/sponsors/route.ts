import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  try {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("sponsors")
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

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  if (!name || !email) {
    return NextResponse.json({ error: "Nom et email requis." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("sponsors")
    .insert({
      name,
      organization: (body.organization ?? "").trim(),
      email,
      phone: (body.phone ?? "").trim(),
      tier: ["bronze", "silver", "gold"].includes(body.tier) ? body.tier : "bronze",
      message: (body.message ?? "").trim().slice(0, 1000),
      website_url: (body.website_url ?? "").trim() || null,
      status: "pending",
      is_public: false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data }, { status: 201 });
}
