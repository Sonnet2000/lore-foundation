import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const courses = data ?? [];
    const ids = courses.map((c) => c.id);

    const statsByCourse = new Map<string, { pending: number; approved: number; rejected: number }>();
    if (ids.length) {
      const { data: enrollments } = await supabase
        .from("course_enrollments")
        .select("course_id, status")
        .in("course_id", ids);

      for (const e of enrollments ?? []) {
        const cur = statsByCourse.get(e.course_id) ?? { pending: 0, approved: 0, rejected: 0 };
        if (e.status === "pending") cur.pending += 1;
        else if (e.status === "approved") cur.approved += 1;
        else if (e.status === "rejected") cur.rejected += 1;
        statsByCourse.set(e.course_id, cur);
      }
    }

    const items = courses.map((c) => ({
      ...c,
      stats: statsByCourse.get(c.id) ?? { pending: 0, approved: 0, rejected: 0 },
    }));

    return NextResponse.json({ items });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg, items: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = getSupabase();
  const body = await request.json().catch(() => ({}));

  const title = (body.title ?? "").trim();
  if (!title) {
    return NextResponse.json({ error: "Tit kou a obligatwa." }, { status: 400 });
  }

  let slug = slugify(body.slug || title);
  if (!slug) slug = `kou-${Date.now()}`;

  const { data: existing } = await supabase.from("courses").select("id").eq("slug", slug).maybeSingle();
  if (existing) slug = `${slug}-${Date.now().toString().slice(-5)}`;

  const { data: maxRow } = await supabase
    .from("courses")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await supabase
    .from("courses")
    .insert({
      title,
      slug,
      description: body.description ?? "",
      cover_url: body.cover_url || null,
      price: body.price ?? "",
      duration: body.duration ?? "",
      format: ["online", "in_person", "hybrid"].includes(body.format) ? body.format : "in_person",
      is_published: body.is_published ?? true,
      sort_order: (maxRow?.sort_order ?? -1) + 1,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data }, { status: 201 });
}
