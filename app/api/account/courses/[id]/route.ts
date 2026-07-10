import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCourseForStudent } from "@/lib/school";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const supabaseAuth = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  try {
    const result = await getCourseForStudent(id, user.id);
    if (!result) return NextResponse.json({ error: "Kou a pa egziste." }, { status: 404 });
    return NextResponse.json(result);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
