import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/supabase/guards";

// Body: { title, file_path, file_size? } — file_path se chemen nan
// bucket "course-documents" (piblik) apre kliyan an fin telechaje l
// dirèkteman ak createClient() (menm apwòch ak lòt bucket sit la).
export async function POST(request: NextRequest, { params }: { params: { courseId: string } }) {
  const { user, error } = await requireStaff();
  if (error) return error;

  const { title, file_path, file_size } = await request.json();
  if (!title || !file_path) {
    return NextResponse.json({ error: "title ak file_path obligatwa." }, { status: 400 });
  }

  const supabase = createClient();
  const { data, error: dbError } = await supabase
    .from("course_documents")
    .insert({ course_id: params.courseId, title, file_path, file_size: file_size ?? null, uploaded_by: user!.id })
    .select()
    .single();

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ document: data });
}
