import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/ecole-portail/server";
import { requireStaff } from "@/lib/ecole-portail/guards";

export async function GET(_request: NextRequest, { params }: { params: { courseId: string } }) {
  const { error } = await requireStaff();
  if (error) return error;

  const supabase = createClient();
  const { data: enrollments, error: dbError } = await supabase
    .from("enrollments")
    .select("student_id")
    .eq("course_id", params.courseId);

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  const studentIds = (enrollments ?? []).map((e) => e.student_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, matricule")
    .in("id", studentIds.length ? studentIds : ["00000000-0000-0000-0000-000000000000"]);

  return NextResponse.json({ roster: profiles ?? [] });
}
