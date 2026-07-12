import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("advertisements")
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
  const body = await request.json().catch(() => ({}));

  const title = (body.title ?? "").trim();
  const image_url = (body.image_url ?? "").trim();
  if (!title) return NextResponse.json({ error: "Tit la obligatwa." }, { status: 400 });
  if (!image_url) return NextResponse.json({ error: "Yon foto obligatwa." }, { status: 400 });

  const { data: maxRow } = await supabase
    .from("advertisements")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await supabase
    .from("advertisements")
    .insert({
      title,
      description: body.description ?? "",
      image_url,
      link_url: body.link_url || null,
      cta_label: body.cta_label?.trim() || "En savoir plus",
      is_published: body.is_published ?? true,
      sort_order: (maxRow?.sort_order ?? -1) + 1,
      starts_at: body.starts_at || null,
      ends_at: body.ends_at || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data }, { status: 201 });
}
