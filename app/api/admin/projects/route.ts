import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

function slugify(text: string) {
  return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("projects").select("*").order("sort_order").order("created_at", { ascending: false });
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

    let slug = slugify(title);
    const { data: ex } = await supabase.from("projects").select("slug").eq("slug", slug).single();
    if (ex) slug = `${slug}-${Date.now().toString(36)}`;

    const { data, error } = await supabase.from("projects").insert({
      title, slug,
      description:   (body.description ?? "").trim(),
      short_desc:    (body.short_desc ?? "").trim().slice(0, 200),
      category:      body.category || "education",
      goal_amount:   Number(body.goal_amount) || 0,
      raised_amount: 0,
      currency:      body.currency || "HTG",
      media:         Array.isArray(body.media) ? body.media : [],
      cover_url:     body.cover_url || null,
      location:      (body.location ?? "Cap-Haïtien, Haïti").trim(),
      beneficiaries: Number(body.beneficiaries) || 0,
      start_date:    body.start_date || null,
      end_date:      body.end_date || null,
      is_published:  body.is_published === true,
      is_featured:   body.is_featured === true,
      status:        body.status || "actif",
      sort_order:    Number(body.sort_order) || 0,
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ item: data }, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
