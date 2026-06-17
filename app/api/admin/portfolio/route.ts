import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
}

export async function POST(request: Request) {
  const supabase = getSupabase();
  const body = await request.json();

  const title = (body.title ?? "").trim();
  if (!title) {
    return NextResponse.json({ error: "Le titre est requis." }, { status: 400 });
  }

  const { data: maxRow } = await supabase
    .from("portfolio_items")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  let id = slugify(title) || `projet-${Date.now()}`;
  const { data: existing } = await supabase
    .from("portfolio_items")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  if (existing) id = `${id}-${Date.now().toString().slice(-4)}`;

  const { data, error } = await supabase
    .from("portfolio_items")
    .insert({
      id,
      title,
      category: body.category ?? "",
      description: body.description ?? "",
      images: Array.isArray(body.images) ? body.images : [],
      sort_order: (maxRow?.sort_order ?? -1) + 1,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data }, { status: 201 });
}
