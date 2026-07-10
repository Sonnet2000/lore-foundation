import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("courses")
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
  if (!title) {
    return NextResponse.json({ error: "Tit kou a obligatwa." }, { status: 400 });
  }

  let slug = slugify(body.slug || title);
  if (!slug) slug = `kou-${Date.now()}`;

  const { data: existing } = await supabase.from("courses").select("id").eq("slug", slug).maybeSingle();
  if (existing) slug = `${slug}-${Date.now().toString().slice(-5)}`;

  const { data: maxRow } = await supabase
    .from("courses")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await supabase
    .from("courses")
    .insert({
      title,
      slug,
      description: body.description ?? "",
      cover_url: body.cover_url || null,
      price: body.price ?? "",
      duration: body.duration ?? "",
      is_published: body.is_published ?? true,
      sort_order: (maxRow?.sort_order ?? -1) + 1,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data }, { status: 201 });
}
