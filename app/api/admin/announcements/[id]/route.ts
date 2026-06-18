import { NextResponse } from "next/server";
import { validateId } from "@/lib/validate-id";
import { getSupabase } from "@/lib/supabase";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const invalid = validateId(params.id);
  if (invalid) return invalid;

  const supabase = getSupabase();
  const body = await request.json().catch(() => ({}));

  const updates: Record<string, unknown> = {};
  if (typeof body.message === "string") updates.message = body.message.slice(0, 500);
  if ("link_url" in body) updates.link_url = body.link_url || null;
  if ("link_label" in body) updates.link_label = body.link_label || null;
  if (typeof body.is_active === "boolean") updates.is_active = body.is_active;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Aucun champ à mettre à jour." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("announcements")
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
  const { error } = await supabase.from("announcements").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
