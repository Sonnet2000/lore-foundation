import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/ecole-portail/server";
import { requireStaff } from "@/lib/ecole-portail/guards";

export async function GET(request: NextRequest, { params }: { params: { courseId: string } }) {
  const { error } = await requireStaff();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  if (!date) return NextResponse.json({ error: "date obligatwa (YYYY-MM-DD)." }, { status: 400 });

  const supabase = await createClient();

  const [{ data: session }, { data: enrollments }, { data: records }] = await Promise.all([
    supabase.from("attendance_sessions").select("cutoff_time").eq("course_id", params.courseId).eq("date", date).maybeSingle(),
    supabase.from("enrollments").select("student_id").eq("course_id", params.courseId),
    supabase.from("attendance").select("student_id, status").eq("course_id", params.courseId).eq("date", date),
  ]);

  const studentIds = (enrollments ?? []).map((e) => e.student_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", studentIds.length ? studentIds : ["00000000-0000-0000-0000-000000000000"]);

  const roster = studentIds.map((id) => ({
    student_id: id,
    full_name: profiles?.find((p) => p.id === id)?.full_name ?? "—",
    status: records?.find((r) => r.student_id === id)?.status ?? null,
  }));

  return NextResponse.json({ cutoff_time: session?.cutoff_time ?? "08:00", roster });
}

// Body: { date, cutoff_time?, records: [{student_id, status}] }
export async function POST(request: NextRequest, { params }: { params: { courseId: string } }) {
  const { user, error } = await requireStaff();
  if (error) return error;

  const { date, cutoff_time, records } = await request.json();
  if (!date || !Array.isArray(records)) {
    return NextResponse.json({ error: "date ak records obligatwa." }, { status: 400 });
  }

  const supabase = await createClient();

  await supabase
    .from("attendance_sessions")
    .upsert(
      { course_id: params.courseId, date, cutoff_time: cutoff_time ?? "08:00", created_by: user!.id },
      { onConflict: "course_id,date" }
    );

  const payload = records.map((r: { student_id: string; status: string }) => ({
    course_id: params.courseId,
    student_id: r.student_id,
    date,
    status: r.status,
    recorded_by: user!.id,
  }));

  const { error: dbError } = await supabase
    .from("attendance")
    .upsert(payload, { onConflict: "course_id,student_id,date" });

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
