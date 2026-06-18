import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = getSupabase();
  const body = await request.json();

  const updates: Record<string, unknown> = {};
  if (typeof body.title === "string") updates.title = body.title;
  if (typeof body.description === "string") updates.description = body.description;
  if ("starts_at" in body) updates.starts_at = body.starts_at || null;
  if (typeof body.location === "string") updates.location = body.location;
  if (typeof body.registration_open === "boolean") updates.registration_open = body.registration_open;
  if (typeof body.is_published === "boolean") updates.is_published = body.is_published;
  if (Array.isArray(body.media)) updates.media = body.media;
  if (typeof body.sort_order === "number") updates.sort_order = body.sort_order;

  const { data, error } = await supabase
    .from("seminars")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = getSupabase();
  const { error } = await supabase.from("seminars").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
