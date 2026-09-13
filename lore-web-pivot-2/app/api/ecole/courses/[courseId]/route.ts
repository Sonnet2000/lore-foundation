import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getEcoleProfile } from "@/lib/supabase/server";

export async function GET(_request: NextRequest, { params }: { params: { courseId: string } }) {
  const { user, profile } = await getEcoleProfile();
  if (!user) return NextResponse.json({ error: "Ou dwe konekte." }, { status: 401 });

  const supabase = createClient();

  const [{ data: course, error: courseError }, { data: modules }, { data: documents }, { data: assignments }] =
    await Promise.all([
      supabase.from("courses").select("id, name, code, description, content, teacher_id, is_published").eq("id", params.courseId).single(),
      supabase.from("course_modules").select("id, month_number, order_index, title, description").eq("course_id", params.courseId).order("month_number").order("order_index"),
      supabase.from("course_documents").select("id, title, file_path, file_size").eq("course_id", params.courseId),
      supabase.from("assignments").select("id, title, description, due_date, max_score").eq("course_id", params.courseId).order("due_date"),
    ]);

  if (courseError || !course) return NextResponse.json({ error: "Kou a pa jwenn oswa pa aksesib." }, { status: 404 });

  let grades: any[] = [];
  if (profile?.role === "student") {
    const { data } = await supabase.from("grades").select("assignment_id, score, feedback, graded_at").eq("student_id", user.id);
    grades = data ?? [];
  } else {
    const assignmentIds = (assignments ?? []).map((a) => a.id);
    const { data } = await supabase
      .from("grades")
      .select("assignment_id, student_id, score, feedback, graded_at")
      .in("assignment_id", assignmentIds.length ? assignmentIds : ["00000000-0000-0000-0000-000000000000"]);
    grades = data ?? [];
  }

  return NextResponse.json({ course, modules, documents, assignments, grades });
}
