import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateId } from "@/lib/validate-id";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const invalid = validateId(params.id);
  if (invalid) return invalid;

  try {
    const supabase = getSupabase();
    const body = await request.json().catch(() => ({}));
    const updates: Record<string, unknown> = {};

    if (typeof body.label        === "string") updates.label        = body.label.trim();
    if (typeof body.number       === "string") updates.number       = body.number.trim();
    if (typeof body.details      === "string") updates.details      = body.details.trim();
    if (typeof body.instructions === "string") updates.instructions = body.instructions.trim();
    if (typeof body.icon === "string" || body.icon === null) updates.icon = (body.icon || "").trim() || null;
    if (typeof body.is_active    === "boolean") updates.is_active   = body.is_active;
    if (typeof body.sort_order   === "number") updates.sort_order   = body.sort_order;
    if (typeof body.type === "string" && ["moncash","natcash","sogebank","autre"].includes(body.type))
      updates.type = body.type;

    const { data, error } = await supabase
      .from("payment_methods")
      .update(updates)
      .eq("id", params.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ item: data });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const invalid = validateId(params.id);
  if (invalid) return invalid;

  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("payment_methods").delete().eq("id", params.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
