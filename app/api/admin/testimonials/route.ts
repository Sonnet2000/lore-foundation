import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  try {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg, items: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = getSupabase();
  const body = await request.json();

  const name = (body.name ?? "").trim();
  const quote = (body.quote ?? "").trim();
  if (!name || !quote) {
    return NextResponse.json({ error: "Le nom et le témoignage sont requis." }, { status: 400 });
  }

  const { data: maxRow } = await supabase
    .from("testimonials")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const initials =
    body.initials ||
    name
      .split(/\s+/)
      .map((part: string) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const { data, error } = await supabase
    .from("testimonials")
    .insert({
      name,
      role: body.role ?? "",
      quote,
      initials,
      sort_order: (maxRow?.sort_order ?? -1) + 1,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data }, { status: 201 });
}
