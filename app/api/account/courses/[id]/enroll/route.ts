import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requestEnrollment, getPublishedCourseById, isFreeCoursePrice } from "@/lib/school";
import { getContactInfo } from "@/lib/site-info-server";
import { sendBulkNotification, emailLayout } from "@/lib/email";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lore-foundation.vercel.app";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const supabaseAuth = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const course = await getPublishedCourseById(id);
  if (!course) {
    return NextResponse.json({ error: "Kou sa a pa egziste ankò." }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const reference = typeof body.payment_reference === "string" ? body.payment_reference.trim().slice(0, 200) : "";
  const proof_url = typeof body.payment_proof_url === "string" ? body.payment_proof_url.trim().slice(0, 500) : "";
  const method = typeof body.payment_method === "string" ? body.payment_method.trim().slice(0, 40) : "";

  // Verifikasyon sèvè: yon kou peyan dwe gen omwen yon referans tranzaksyon oswa yon kapti ekran
  // anvan demand lan ka soumèt (pa fè konfyans sèlman nan verifikasyon kote kliyan an).
  if (!isFreeCoursePrice(course.price) && !reference && !proof_url) {
    return NextResponse.json(
      { error: "Ajoute referans tranzaksyon an oswa yon kapti ekran pou konfime peman an." },
      { status: 400 }
    );
  }

  try {
    const enrollment = await requestEnrollment(
      id,
      user.id,
      method || reference || proof_url ? { method: method || "binance", reference, proof_url } : undefined
    );

    // Notifikasyon imèl (pa bloke repons lan si sa echwe — pi enpòtan enskripsyon an rive nan baz done a).
    void sendEnrollmentEmails({ course, enrollment, studentEmail: user.email ?? "", studentName: user.user_metadata?.full_name ?? "" });

    return NextResponse.json({ enrollment });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

async function sendEnrollmentEmails({
  course,
  enrollment,
  studentEmail,
  studentName,
}: {
  course: { title: string };
  enrollment: { status: string; payment_reference: string | null; payment_proof_url: string | null };
  studentEmail: string;
  studentName: string;
}) {
  try {
    const contact = await getContactInfo();

    // Konfimasyon bay elèv la
    if (studentEmail) {
      await sendBulkNotification({
        recipients: [studentEmail],
        subject: `Demand enskripsyon w resevwa — ${course.title}`,
        html: emailLayout({
          heading: "Demand enskripsyon w resevwa",
          body: `Bonjou${studentName ? " " + studentName : ""}, nou byen resevwa demand enskripsyon w pou kou <strong>${course.title}</strong>. Yon admin Loré Foundation ap verifye enfo peman ou yo epi ou ap resevwa yon lòt imèl depi demand lan apwouve oswa refize.`,
          ctaLabel: "Gade estati demand mwen",
          ctaUrl: `${SITE_URL}/compte/kou`,
        }),
      });
    }

    // Notifikasyon bay admin — pou l ka verifye peman an pi vit
    if (contact.email) {
      await sendBulkNotification({
        recipients: [contact.email],
        subject: `Nouvo demand enskripsyon — ${course.title}`,
        html: emailLayout({
          heading: "Nouvo demand enskripsyon",
          body: `${studentName || "Yon elèv"} (${studentEmail || "imèl pa disponib"}) mande enskri nan <strong>${course.title}</strong>.${
            enrollment.payment_reference ? `<br/>Referans peman: ${enrollment.payment_reference}` : ""
          }${enrollment.payment_proof_url ? `<br/>Kapti ekran: ${enrollment.payment_proof_url}` : ""}`,
          ctaLabel: "Verifye nan panel admin",
          ctaUrl: `${SITE_URL}/admin`,
        }),
      });
    }
  } catch {
    // Silence — imèl la pa dwe janm bloke oswa fè echwe demand enskripsyon an.
  }
}
