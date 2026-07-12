import { NextResponse } from "next/server";
import { validateUUID } from "@/lib/validate-id";
import { getSupabase } from "@/lib/supabase";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const invalid = validateUUID(params.id);
  if (invalid) return invalid;

  const supabase = getSupabase();
  const body = await request.json().catch(() => ({}));

  const updates: Record<string, unknown> = {};
  if (typeof body.title === "string") updates.title = body.title.slice(0, 200);
  if (typeof body.description === "string") updates.description = body.description.slice(0, 1000);
  if (typeof body.image_url === "string" && body.image_url) updates.image_url = body.image_url;
  if ("link_url" in body) updates.link_url = body.link_url || null;
  if (typeof body.cta_label === "string") updates.cta_label = body.cta_label.slice(0, 40) || "En savoir plus";
  if (typeof body.is_published === "boolean") updates.is_published = body.is_published;
  if (typeof body.sort_order === "number") updates.sort_order = body.sort_order;
  if ("starts_at" in body) updates.starts_at = body.starts_at || null;
  if ("ends_at" in body) updates.ends_at = body.ends_at || null;

  const { data, error } = await supabase
    .from("advertisements")
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
  const { error } = await supabase.from("advertisements").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
