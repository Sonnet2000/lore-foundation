import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("course_id");
  if (!courseId) return NextResponse.json({ error: "course_id obligatwa." }, { status: 400 });

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("course_lessons")
    .select("*")
    .eq("course_id", courseId)
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
}

export async function POST(request: Request) {
  const supabase = getSupabase();
  const body = await request.json().catch(() => ({}));

  const title = (body.title ?? "").trim();
  const courseId = body.course_id;
  if (!title) return NextResponse.json({ error: "Tit leson an obligatwa." }, { status: 400 });
  if (!courseId) return NextResponse.json({ error: "course_id obligatwa." }, { status: 400 });

  const { data: maxRow } = await supabase
    .from("course_lessons")
    .select("sort_order")
    .eq("course_id", courseId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await supabase
    .from("course_lessons")
    .insert({
      course_id: courseId,
      title,
      description: body.description ?? "",
      video_url: body.video_url || null,
      content: body.content ?? "",
      is_published: body.is_published ?? true,
      sort_order: (maxRow?.sort_order ?? -1) + 1,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data }, { status: 201 });
}
