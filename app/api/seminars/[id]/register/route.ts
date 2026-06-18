import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

/** Strip HTML/script tags and trim to max length. */
function sanitize(value: string, maxLen: number): string {
  return value.replace(/<[^>]*>/g, "").trim().slice(0, maxLen);
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Rate limit: 5 registrations per IP per hour
  const ip = getClientIp(request);
  const { allowed } = rateLimit({
    key: `register:${ip}`,
    limit: 5,
    windowSeconds: 3600,
  });

  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessayez plus tard." },
      { status: 429 }
    );
  }

  // Validate seminar UUID format to prevent injection via path param
  if (!/^[0-9a-f-]{36}$/i.test(params.id)) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);

  const name  = sanitize((body?.name  ?? "").toString(), 100);
  const email = sanitize((body?.email ?? "").toString(), 254).toLowerCase();
  const phone = sanitize((body?.phone ?? "").toString(), 30);

  if (!name || !email) {
    return NextResponse.json(
      { error: "Le nom et l'email sont requis." },
      { status: 400 }
    );
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
      { error: "Les inscriptions ne sont pas ouvertes pour ce séminaire." },
      { status: 403 }
    );
  }

  const { error } = await supabase
    .from("seminar_registrations")
    .insert({ seminar_id: params.id, name, email, phone });

  if (error) {
    return NextResponse.json({ error: "Erreur lors de l'inscription." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
