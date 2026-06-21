import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateId } from "@/lib/validate-id";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const invalid = validateId(params.id);
  if (invalid) return invalid;

  try {
    const supabase = getSupabase();
    const body = await request.json().catch(() => ({}));
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (typeof body.title        === "string") updates.title        = body.title.trim();
    if (typeof body.excerpt      === "string") updates.excerpt      = body.excerpt.trim().slice(0, 300);
    if (typeof body.content      === "string") updates.content      = body.content.trim();
    if (typeof body.cover_url    === "string") updates.cover_url    = body.cover_url || null;
    if (typeof body.category     === "string") updates.category     = body.category;
    if (Array.isArray(body.tags))              updates.tags         = body.tags.slice(0, 10);
    if (typeof body.author_name  === "string") updates.author_name  = body.author_name.trim();
    if (typeof body.author_photo === "string") updates.author_photo = body.author_photo || null;
    if (typeof body.is_featured  === "boolean") updates.is_featured = body.is_featured;
    if (typeof body.read_time_minutes === "number") updates.read_time_minutes = body.read_time_minutes;

    if (typeof body.is_published === "boolean") {
      updates.is_published = body.is_published;
      if (body.is_published) updates.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("blog_posts").update(updates).eq("id", params.id).select().single();

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
    const { error } = await supabase.from("blog_posts").delete().eq("id", params.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
