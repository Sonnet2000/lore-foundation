import { NextResponse } from "next/server";
import { validateUUID } from "@/lib/validate-id";
import { getSupabase } from "@/lib/supabase";
import { sendBulkNotification, emailLayout } from "@/lib/email";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lore-foundation.vercel.app";

const FEE_LABELS: Record<string, string> = {
  registration: "Frè enskripsyon",
  participation: "Frè patisipasyon",
  materials: "Frè maliyo/badj",
};

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const invalid = validateUUID(params.id);
  if (invalid) return invalid;

  const body = await request.json().catch(() => ({}));
  const supabase = getSupabase();

  // Mòd 1: apwouve/rejte yon frè espesifik (patisipasyon/materyèl), san touche
  // estati global enskripsyon an.
  if (typeof body.fee === "string" && ["participation", "materials"].includes(body.fee) && typeof body.fee_status === "string") {
    if (!["paid", "rejected"].includes(body.fee_status)) {
      return NextResponse.json({ error: "Estati frè envalid." }, { status: 400 });
    }
    const { data: existing, error: findError } = await supabase
      .from("course_enrollments")
      .select("*")
      .eq("id", params.id)
      .single();
    if (findError || !existing) return NextResponse.json({ error: findError?.message ?? "Pa jwenn." }, { status: 404 });

    const mergedFees = {
      ...(existing.fees ?? {}),
      [body.fee]: { ...(existing.fees?.[body.fee] ?? {}), status: body.fee_status, decided_at: new Date().toISOString() },
    };
    const { data, error } = await supabase
      .from("course_enrollments")
      .update({ fees: mergedFees })
      .eq("id", params.id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    void notifyStudentOfFeeDecision(data, body.fee, body.fee_status);
    return NextResponse.json({ item: data });
  }

  // Mòd 2: desizyon global sou enskripsyon an (aksepte/rejte elèv la nan kou a).
  const status = body.status;

  if (!["approved", "rejected", "pending"].includes(status)) {
    return NextResponse.json({ error: "Estati envalid." }, { status: 400 });
  }

  const { data: existingRow } = await supabase.from("course_enrollments").select("fees").eq("id", params.id).maybeSingle();
  const mergedFees =
    status === "approved" || status === "rejected"
      ? {
          ...(existingRow?.fees ?? {}),
          registration: {
            ...(existingRow?.fees?.registration ?? {}),
            status: status === "approved" ? "paid" : "rejected",
            decided_at: new Date().toISOString(),
          },
        }
      : existingRow?.fees;

  const { data, error } = await supabase
    .from("course_enrollments")
    .update({ status, decided_at: new Date().toISOString(), ...(mergedFees ? { fees: mergedFees } : {}) })
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (status === "approved" || status === "rejected") {
    void notifyStudentOfDecision(data);
  }

  return NextResponse.json({ item: data });
}

async function notifyStudentOfFeeDecision(
  enrollment: { course_id: string; user_id: string },
  fee: string,
  feeStatus: string
) {
  try {
    const supabase = getSupabase();
    const [{ data: course }, { data: userData }] = await Promise.all([
      supabase.from("courses").select("title").eq("id", enrollment.course_id).maybeSingle(),
      supabase.auth.admin.getUserById(enrollment.user_id),
    ]);
    const email = userData?.user?.email;
    if (!email) return;

    const courseTitle = course?.title ?? "kou a";
    const label = FEE_LABELS[fee] ?? fee;
    const paid = feeStatus === "paid";

    await sendBulkNotification({
      recipients: [email],
      subject: paid ? `${label} konfime — ${courseTitle}` : `Pwoblèm ak ${label} — ${courseTitle}`,
      html: emailLayout({
        heading: paid ? `${label} konfime ✓` : `${label} pa t verifye`,
        body: paid
          ? `Peman ou pou <strong>${label}</strong> nan kou <strong>${courseTitle}</strong> konfime. Mèsi!`
          : `Peman ou pou <strong>${label}</strong> nan kou <strong>${courseTitle}</strong> pa t verifye. Tanpri soumèt li ankò ak enfo ki kòrèk, oswa kontakte nou.`,
        ctaLabel: "Gade kou m yo",
        ctaUrl: `${SITE_URL}/compte/kou`,
      }),
    });
  } catch {
    // Silence.
  }
}

async function notifyStudentOfDecision(enrollment: {
  id: string;
  course_id: string;
  user_id: string;
  status: string;
  payment_method: string | null;
  payment_reference: string | null;
  decided_at: string | null;
}) {
  try {
    const supabase = getSupabase();
    const [{ data: course }, { data: userData }] = await Promise.all([
      supabase.from("courses").select("title, price").eq("id", enrollment.course_id).maybeSingle(),
      supabase.auth.admin.getUserById(enrollment.user_id),
    ]);

    const email = userData?.user?.email;
    if (!email) return;

    const courseTitle = course?.title ?? "kou a";
    const approved = enrollment.status === "approved";
    // Nimewo resi jenere apati ID enskripsyon an — pa bezwen okenn chanjman nan baz done a.
    const receiptNo = `LF-${enrollment.id.slice(0, 8).toUpperCase()}`;
    const decidedDate = enrollment.decided_at
      ? new Date(enrollment.decided_at).toLocaleDateString("fr-HT", { year: "numeric", month: "long", day: "numeric" })
      : "";

    const receiptBlock = approved
      ? `<br/><br/>——<br/>
         <strong>Resi #${receiptNo}</strong><br/>
         Kou: ${courseTitle}${course?.price ? `<br/>Montan: ${course.price}` : ""}${
           enrollment.payment_method ? `<br/>Metòd peman: ${enrollment.payment_method}` : ""
         }${enrollment.payment_reference ? `<br/>Referans: ${enrollment.payment_reference}` : ""}${
           decidedDate ? `<br/>Dat: ${decidedDate}` : ""
         }<br/>——`
      : "";

    await sendBulkNotification({
      recipients: [email],
      subject: approved ? `Ou apwouve nan ${courseTitle} 🎉` : `Nouvèl sou demand ou pou ${courseTitle}`,
      html: emailLayout({
        heading: approved ? "Demand enskripsyon w apwouve!" : "Demand enskripsyon w pa apwouve",
        body: approved
          ? `Bòn nouvèl! Demand enskripsyon w pou <strong>${courseTitle}</strong> apwouve. Ou ka kounye a antre nan kou a pou wè leçons ak devwa yo.${receiptBlock}`
          : `Demand enskripsyon w pou <strong>${courseTitle}</strong> pa t apwouve, souvan paske enfo peman an pa t konplè oswa pa t verifye. Ou ka soumèt yon nouvo demand ak enfo peman ki kòrèk, oswa kontakte nou si w kwè gen yon erè.`,
        ctaLabel: approved ? "Antre nan kou a" : "Gade kou m yo",
        ctaUrl: `${SITE_URL}/compte/kou`,
      }),
    });
  } catch {
    // Silence — yon echèk imèl pa dwe janm anpeche desizyon admin la anrejistre.
  }
}
