import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { submitFeePayment, getPublishedCourseById } from "@/lib/school";
import { getContactInfo } from "@/lib/site-info-server";
import { sendBulkNotification, emailLayout } from "@/lib/email";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lore-foundation.vercel.app";

const FEE_LABELS: Record<string, string> = {
  participation: "Frè patisipasyon",
  materials: "Frè maliyo/badj",
};

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
  const fee = typeof body.fee === "string" ? body.fee : "";
  if (!["participation", "materials"].includes(fee)) {
    return NextResponse.json({ error: "Frè envalid." }, { status: 400 });
  }

  const reference = typeof body.payment_reference === "string" ? body.payment_reference.trim().slice(0, 200) : "";
  const proof_url = typeof body.payment_proof_url === "string" ? body.payment_proof_url.trim().slice(0, 500) : "";
  const method = typeof body.payment_method === "string" ? body.payment_method.trim().slice(0, 40) : "";

  if (!reference && !proof_url) {
    return NextResponse.json(
      { error: "Ajoute referans tranzaksyon an oswa yon kapti ekran." },
      { status: 400 }
    );
  }

  const course = await getPublishedCourseById(id);
  if (!course) {
    return NextResponse.json({ error: "Kou sa a pa egziste ankò." }, { status: 404 });
  }

  try {
    const enrollment = await submitFeePayment(id, user.id, fee, {
      method: method || "moncash",
      reference,
      proof_url,
    });

    void notifyAdminOfFeePayment({ course, fee, reference, proof_url, studentEmail: user.email ?? "" });

    return NextResponse.json({ enrollment });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

async function notifyAdminOfFeePayment({
  course,
  fee,
  reference,
  proof_url,
  studentEmail,
}: {
  course: { title: string };
  fee: string;
  reference: string;
  proof_url: string;
  studentEmail: string;
}) {
  try {
    const contact = await getContactInfo();
    if (!contact.email) return;
    const label = FEE_LABELS[fee] ?? fee;

    await sendBulkNotification({
      recipients: [contact.email],
      subject: `Nouvo peman ${label} — ${course.title}`,
      html: emailLayout({
        heading: `Nouvo peman: ${label}`,
        body: `${studentEmail || "Yon elèv"} soumèt yon peman pou <strong>${label}</strong> nan kou <strong>${course.title}</strong>.${
          reference ? `<br/>Referans: ${reference}` : ""
        }${proof_url ? `<br/>Kapti ekran: ${proof_url}` : ""}`,
        ctaLabel: "Verifye nan panel admin",
        ctaUrl: `${SITE_URL}/admin`,
      }),
    });
  } catch {
    // Silence — imèl la pa dwe janm bloke soumèt peman an.
  }
}
