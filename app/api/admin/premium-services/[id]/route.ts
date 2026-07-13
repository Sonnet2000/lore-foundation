import { NextResponse } from "next/server";
import { validateUUID } from "@/lib/validate-id";
import { getSupabase } from "@/lib/supabase";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const invalid = validateUUID(params.id);
  if (invalid) return invalid;

  const supabase = getSupabase();
  const body = await request.json().catch(() => ({}));

  const updates: Record<string, unknown> = {};
  if (typeof body.title === "string") updates.title = body.title.slice(0, 120);
  if (typeof body.description === "string") updates.description = body.description.slice(0, 500);
  if (typeof body.price === "string") updates.price = body.price.slice(0, 60);
  if (typeof body.icon === "string") updates.icon = body.icon;
  if (Array.isArray(body.features)) updates.features = body.features.slice(0, 12);
  if (typeof body.is_published === "boolean") updates.is_published = body.is_published;
  if (typeof body.is_featured === "boolean") updates.is_featured = body.is_featured;
  if (typeof body.sort_order === "number") updates.sort_order = body.sort_order;

  const { data, error } = await supabase
    .from("premium_services")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const invalid = validateUUID(params.id);
  if (invalid) return invalid;

  const supabase = getSupabase();
  const { error } = await supabase.from("premium_services").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
