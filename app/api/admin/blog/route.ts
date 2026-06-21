import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message, items: [] }, { status: 500 });
    return NextResponse.json({ items: data ?? [] });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e), items: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabase();
    const body = await request.json().catch(() => ({}));

    const title = (body.title ?? "").trim();
    if (!title) return NextResponse.json({ error: "Titre requis." }, { status: 400 });

    // Générer slug unique
    let slug = slugify(title);
    const { data: existing } = await supabase
      .from("blog_posts").select("slug").eq("slug", slug).single();
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const isPublished = body.is_published === true;

    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        slug,
        title,
        excerpt:            (body.excerpt ?? "").trim().slice(0, 300),
        content:            (body.content ?? "").trim(),
        cover_url:          body.cover_url || null,
        category:           body.category || "actualites",
        tags:               Array.isArray(body.tags) ? body.tags.slice(0, 10) : [],
        author_name:        (body.author_name ?? "Loré Foundation").trim(),
        author_photo:       body.author_photo || null,
        is_published:       isPublished,
        is_featured:        body.is_featured === true,
        read_time_minutes:  Number(body.read_time_minutes) || 5,
        published_at:       isPublished ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ item: data }, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
