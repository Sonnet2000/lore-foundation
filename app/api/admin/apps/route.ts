import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("apps_catalog")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ items: data });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg, items: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = getSupabase();
  const body = await request.json().catch(() => ({}));

  const name = (body.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "Non app la obligatwa." }, { status: 400 });

  const { data: maxRow } = await supabase
    .from("apps_catalog")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await supabase
    .from("apps_catalog")
    .insert({
      name,
      description: body.description ?? "",
      category: body.category ?? "",
      icon_url: body.icon_url || null,
      exe_url: body.exe_url || null,
      exe_version: body.exe_version || "1.0.0",
      exe_size_mb: typeof body.exe_size_mb === "number" ? body.exe_size_mb : 0,
      apk_url: body.apk_url || null,
      apk_version: body.apk_version || "1.0.0",
      apk_size_mb: typeof body.apk_size_mb === "number" ? body.apk_size_mb : 0,
      playstore_url: body.playstore_url || null,
      website_url: body.website_url || null,
      is_published: body.is_published ?? true,
      is_featured: body.is_featured ?? false,
      sort_order: (maxRow?.sort_order ?? -1) + 1,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data }, { status: 201 });
}
