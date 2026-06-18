import { NextResponse } from "next/server";
import { validateId } from "@/lib/validate-id";
import { getSupabase } from "@/lib/supabase";
import { sendBulkNotification, emailLayout } from "@/lib/email";

export const dynamic = "force-dynamic";

function formatDate(iso: string | null) {
  if (!iso) return "Date à confirmer";
  return new Date(iso).toLocaleString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const invalid = validateId(params.id);
  if (invalid) return invalid;

  const supabase = getSupabase();

  const { data: seminar, error: fetchError } = await supabase
    .from("seminars")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (fetchError || !seminar) {
    return NextResponse.json({ error: "Séminaire introuvable." }, { status: 404 });
  }

  const { data: subscribers, error: subError } = await supabase
    .from("subscribers")
    .select("email");

  if (subError) {
    return NextResponse.json({ error: subError.message }, { status: 500 });
  }

  const siteUrl = process.env.SITE_URL;
  const bodyParts = [
    formatDate(seminar.starts_at),
    seminar.location ? `Lieu : ${seminar.location}` : null,
    seminar.description || null,
  ].filter(Boolean);

  const html = emailLayout({
    heading: seminar.title,
    body: bodyParts.join(" — "),
    ctaLabel: seminar.registration_open ? "S'inscrire" : undefined,
    ctaUrl: seminar.registration_open && siteUrl ? `${siteUrl}/#seminaires` : undefined,
  });

  const { sent, error } = await sendBulkNotification({
    recipients: (subscribers ?? []).map((s) => s.email),
    subject: `Loré Foundation — Nouveau séminaire : ${seminar.title}`,
    html,
  });

  if (error) {
    return NextResponse.json({ error }, { status: 502 });
  }

  await supabase
    .from("seminars")
    .update({ notified_at: new Date().toISOString() })
    .eq("id", params.id);

  return NextResponse.json({ sent });
}
