import { NextResponse } from "next/server";
import { validateId } from "@/lib/validate-id";
import { getSupabase } from "@/lib/supabase";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const invalid = validateId(params.id);
  if (invalid) return invalid;

  const supabase = getSupabase();
  const body = await request.json().catch(() => ({}));

  const updates: Record<string, unknown> = {};
  if (typeof body.title === "string") updates.title = body.title.slice(0, 200);
  if (typeof body.category === "string") updates.category = body.category.slice(0, 100);
  if (typeof body.description === "string") updates.description = body.description.slice(0, 1000);
  if (Array.isArray(body.images)) updates.images = body.images.slice(0, 20);
  if (typeof body.sort_order === "number") updates.sort_order = body.sort_order;

  const { data, error } = await supabase
    .from("portfolio")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const invalid = validateId(params.id);
  if (invalid) return invalid;

  const supabase = getSupabase();
  const { error } = await supabase.from("portfolio").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
