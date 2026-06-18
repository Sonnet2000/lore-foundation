import { NextResponse } from "next/server";
import { validateId } from "@/lib/validate-id";
import { getSupabase } from "@/lib/supabase";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const invalid = validateId(params.id);
  if (invalid) return invalid;

  const supabase = getSupabase();
  const body = await request.json().catch(() => ({}));

  const updates: Record<string, unknown> = {};
  if (typeof body.name === "string") updates.name = body.name.slice(0, 100);
  if (typeof body.role === "string") updates.role = body.role.slice(0, 100);
  if (typeof body.quote === "string") updates.quote = body.quote.slice(0, 1000);
  if (typeof body.initials === "string") updates.initials = body.initials.slice(0, 2).toUpperCase();
  if (typeof body.sort_order === "number") updates.sort_order = body.sort_order;

  const { data, error } = await supabase
    .from("testimonials")
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
  const { error } = await supabase.from("testimonials").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
