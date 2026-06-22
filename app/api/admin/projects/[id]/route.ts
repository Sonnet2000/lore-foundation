import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateId } from "@/lib/validate-id";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const inv = validateId(params.id); if (inv) return inv;
  try {
    const supabase = getSupabase();
    const body = await request.json().catch(() => ({}));
    const u: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (typeof body.title        === "string") u.title        = body.title.trim();
    if (typeof body.description  === "string") u.description  = body.description.trim();
    if (typeof body.short_desc   === "string") u.short_desc   = body.short_desc.trim().slice(0, 200);
    if (typeof body.category     === "string") u.category     = body.category;
    if (typeof body.goal_amount  === "number") u.goal_amount  = body.goal_amount;
    if (typeof body.raised_amount=== "number") u.raised_amount= body.raised_amount;
    if (typeof body.currency     === "string") u.currency     = body.currency;
    if (Array.isArray(body.media))             u.media        = body.media;
    if (typeof body.cover_url    === "string") u.cover_url    = body.cover_url || null;
    if (typeof body.location     === "string") u.location     = body.location.trim();
    if (typeof body.beneficiaries=== "number") u.beneficiaries= body.beneficiaries;
    if (typeof body.start_date   === "string") u.start_date   = body.start_date || null;
    if (typeof body.end_date     === "string") u.end_date     = body.end_date || null;
    if (typeof body.is_published === "boolean") u.is_published = body.is_published;
    if (typeof body.is_featured  === "boolean") u.is_featured  = body.is_featured;
    if (typeof body.status       === "string") u.status       = body.status;
    if (typeof body.sort_order   === "number") u.sort_order   = body.sort_order;

    const { data, error } = await supabase.from("projects").update(u).eq("id", params.id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ item: data });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const inv = validateId(params.id); if (inv) return inv;
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("projects").delete().eq("id", params.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
