import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendBulkNotification, emailLayout } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const supabase = getSupabase();

  const { data: announcement, error: fetchError } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (fetchError || !announcement) {
    return NextResponse.json({ error: "Annonce introuvable." }, { status: 404 });
  }

  const { data: subscribers, error: subError } = await supabase
    .from("subscribers")
    .select("email");

  if (subError) {
    return NextResponse.json({ error: subError.message }, { status: 500 });
  }

  const siteUrl = process.env.SITE_URL;
  const html = emailLayout({
    heading: "Nouvelle annonce",
    body: announcement.message,
    ctaLabel: announcement.link_label || (siteUrl ? "Visiter le site" : undefined),
    ctaUrl: announcement.link_url || siteUrl,
  });

  const { sent, error } = await sendBulkNotification({
    recipients: (subscribers ?? []).map((s) => s.email),
    subject: "Loré Foundation — Nouvelle annonce",
    html,
  });

  if (error) {
    return NextResponse.json({ error }, { status: 502 });
  }

  await supabase
    .from("announcements")
    .update({ notified_at: new Date().toISOString() })
    .eq("id", params.id);

  return NextResponse.json({ sent });
}
