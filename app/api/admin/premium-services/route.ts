import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("premium_services")
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
  if (!title) return NextResponse.json({ error: "Tit la obligatwa." }, { status: 400 });

  const { data: maxRow } = await supabase
    .from("premium_services")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await supabase
    .from("premium_services")
    .insert({
      title,
      description: body.description ?? "",
      price: body.price ?? "",
      icon: body.icon || "Sparkles",
      features: Array.isArray(body.features) ? body.features : [],
      is_published: body.is_published ?? true,
      is_featured: body.is_featured ?? false,
      sort_order: (maxRow?.sort_order ?? -1) + 1,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data }, { status: 201 });
}
