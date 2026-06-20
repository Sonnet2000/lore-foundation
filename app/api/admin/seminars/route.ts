import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  try {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("seminars")
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

  const title = (body.title ?? "").trim();
  if (!title) {
    return NextResponse.json({ error: "Le titre est requis." }, { status: 400 });
  }

  const { data: maxRow } = await supabase
    .from("seminars")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await supabase
    .from("seminars")
    .insert({
      title,
      description: body.description ?? "",
      starts_at: body.starts_at || null,
      location: body.location ?? "",
      registration_open: body.registration_open ?? true,
      is_published: body.is_published ?? true,
      media: Array.isArray(body.media) ? body.media : [],
      sort_order: (maxRow?.sort_order ?? -1) + 1,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data }, { status: 201 });
}
