import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { submitAssignment } from "@/lib/school";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const supabaseAuth = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const text_response = typeof body.text_response === "string" ? body.text_response.trim().slice(0, 8000) : "";
  const link_url = typeof body.link_url === "string" ? body.link_url.trim().slice(0, 500) : "";
  const file_url = typeof body.file_url === "string" ? body.file_url.trim().slice(0, 500) : "";

  if (!text_response && !link_url && !file_url) {
    return NextResponse.json(
      { error: "Ajoute yon repons tèks, yon lyen, oswa yon fichye anvan ou soumèt." },
      { status: 400 }
    );
  }

  try {
    const submission = await submitAssignment(id, user.id, { text_response, link_url, file_url });
    return NextResponse.json({ submission });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
