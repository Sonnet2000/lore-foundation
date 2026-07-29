import { NextResponse } from "next/server";
import { validateUUID } from "@/lib/validate-id";
import { getSupabase } from "@/lib/supabase";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const invalid = validateUUID(params.id);
  if (invalid) return invalid;

  const supabase = getSupabase();
  const body = await request.json().catch(() => ({}));

  const updates: Record<string, unknown> = {};
  if (typeof body.name === "string") updates.name = body.name.slice(0, 120);
  if (typeof body.description === "string") updates.description = body.description.slice(0, 1000);
  if (typeof body.category === "string") updates.category = body.category.slice(0, 60);
  if (typeof body.icon_url === "string" || body.icon_url === null) updates.icon_url = body.icon_url || null;
  if (typeof body.exe_url === "string" || body.exe_url === null) updates.exe_url = body.exe_url || null;
  if (typeof body.exe_version === "string") updates.exe_version = body.exe_version.slice(0, 30);
  if (typeof body.exe_size_mb === "number") updates.exe_size_mb = body.exe_size_mb;
  if (typeof body.apk_url === "string" || body.apk_url === null) updates.apk_url = body.apk_url || null;
  if (typeof body.apk_version === "string") updates.apk_version = body.apk_version.slice(0, 30);
  if (typeof body.apk_size_mb === "number") updates.apk_size_mb = body.apk_size_mb;
  if (typeof body.playstore_url === "string" || body.playstore_url === null) updates.playstore_url = body.playstore_url || null;
  if (typeof body.website_url === "string" || body.website_url === null) updates.website_url = body.website_url || null;
  if (typeof body.is_published === "boolean") updates.is_published = body.is_published;
  if (typeof body.is_featured === "boolean") updates.is_featured = body.is_featured;
  if (typeof body.sort_order === "number") updates.sort_order = body.sort_order;

  const { data, error } = await supabase
    .from("apps_catalog")
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
  const { error } = await supabase.from("apps_catalog").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
