import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null);

  const name = (body?.name ?? "").toString().trim();
  const email = (body?.email ?? "").toString().trim();
  const phone = (body?.phone ?? "").toString().trim();

  if (!name || !email) {
    return NextResponse.json({ error: "Le nom et l'email sont requis." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
  }

  const supabase = getSupabase();

  const { data: seminar, error: seminarError } = await supabase
    .from("seminars")
    .select("id, registration_open, is_published")
    .eq("id", params.id)
    .maybeSingle();

  if (seminarError || !seminar) {
    return NextResponse.json({ error: "Séminaire introuvable." }, { status: 404 });
  }
  if (!seminar.is_published || !seminar.registration_open) {
    return NextResponse.json(
      { error: "Les inscriptions ne sont pas (ou plus) ouvertes pour ce séminaire." },
      { status: 403 }
    );
  }

  const { error } = await supabase
    .from("seminar_registrations")
    .insert({ seminar_id: params.id, name, email, phone });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
