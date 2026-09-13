import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/ecole-portail/server";
import { requireTeacher } from "@/lib/ecole-portail/guards";

// Body: { student_id, score, feedback? }
export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string; assignmentId: string } }
) {
  const { error } = await requireTeacher();
  if (error) return error;

  const { student_id, score, feedback } = await request.json();
  if (!student_id || score === undefined) {
    return NextResponse.json({ error: "student_id ak score obligatwa." }, { status: 400 });
  }

  const supabase = createClient();

  // RLS (grades_teacher_manage) verifye deja ke moun k ap ekri a se
  // reyèlman pwofesè kou sa a — si se pa li, upsert la ap echwe.
  const { data, error: dbError } = await supabase
    .from("grades")
    .upsert(
      {
        assignment_id: params.assignmentId,
        student_id,
        score,
        feedback: feedback ?? null,
        graded_at: new Date().toISOString(),
      },
      { onConflict: "assignment_id,student_id" }
    )
    .select()
    .single();

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ grade: data });
}
