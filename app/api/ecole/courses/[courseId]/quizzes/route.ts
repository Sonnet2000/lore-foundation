import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/ecole-portail/server";
import { requireAdmin } from "@/lib/ecole-portail/guards";

export async function GET(_request: NextRequest, { params }: { params: { courseId: string } }) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("quiz_exams")
    .select("id, kind, title, is_published, mode")
    .eq("course_id", params.courseId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ quizzes: data });
}

// Admin sèlman — RLS (quiz_exams_admin_all) ap bloke tout lòt moun.
export async function POST(request: NextRequest, { params }: { params: { courseId: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { title, description, seconds_per_question } = await request.json();
  if (!title) return NextResponse.json({ error: "Tit kiz la obligatwa." }, { status: 400 });

  const supabase = createClient();
  const { data, error: dbError } = await supabase
    .from("quiz_exams")
    .insert({
      kind: "quiz",
      mode: "mcq",
      title,
      description: description ?? null,
      course_id: params.courseId,
      seconds_per_question: seconds_per_question ?? 10,
      is_published: false,
    })
    .select()
    .single();

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ quiz: data });
}
