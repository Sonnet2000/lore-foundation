import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = getSupabase();
  const body = await request.json();

  const updates: Record<string, unknown> = {};
  if (typeof body.title === "string") updates.title = body.title;
  if (typeof body.category === "string") updates.category = body.category;
  if (typeof body.description === "string") updates.description = body.description;
  if (Array.isArray(body.images)) updates.images = body.images;
  if (typeof body.sort_order === "number") updates.sort_order = body.sort_order;

  const { data, error } = await supabase
    .from("portfolio_items")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = getSupabase();
  const { error } = await supabase.from("portfolio_items").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
