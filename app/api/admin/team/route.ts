import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
}

export async function POST(request: Request) {
  const supabase = getSupabase();
  const body = await request.json();

  const name = (body.name ?? "").trim();
  if (!name) {
    return NextResponse.json({ error: "Le nom est requis." }, { status: 400 });
  }

  const { data: maxRow } = await supabase
    .from("team_members")
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
    .from("team_members")
    .insert({
      name,
      role: body.role ?? "",
      initials,
      photo_url: body.photo_url || null,
      show_social: Boolean(body.show_social),
      sort_order: (maxRow?.sort_order ?? -1) + 1,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data }, { status: 201 });
}
