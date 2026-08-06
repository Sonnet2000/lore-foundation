import { NextResponse } from "next/server";
import { validateUUID } from "@/lib/validate-id";
import { getSupabase } from "@/lib/supabase";
import { sendBulkNotification, emailLayout } from "@/lib/email";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lore-foundation.vercel.app";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const invalid = validateUUID(params.id);
  if (invalid) return invalid;

  const body = await request.json().catch(() => ({}));
  const status = body.status;

  if (!["approved", "rejected", "pending"].includes(status)) {
    return NextResponse.json({ error: "Estati envalid." }, { status: 400 });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("course_enrollments")
    .update({ status, decided_at: new Date().toISOString() })
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (status === "approved" || status === "rejected") {
    void notifyStudentOfDecision(data);
  }

  return NextResponse.json({ item: data });
}

async function notifyStudentOfDecision(enrollment: {
  course_id: string;
  user_id: string;
  status: string;
}) {
  try {
    const supabase = getSupabase();
    const [{ data: course }, { data: userData }] = await Promise.all([
      supabase.from("courses").select("title").eq("id", enrollment.course_id).maybeSingle(),
      supabase.auth.admin.getUserById(enrollment.user_id),
    ]);

    const email = userData?.user?.email;
    if (!email) return;

    const courseTitle = course?.title ?? "kou a";
    const approved = enrollment.status === "approved";

    await sendBulkNotification({
      recipients: [email],
      subject: approved ? `Ou apwouve nan ${courseTitle} 🎉` : `Nouvèl sou demand ou pou ${courseTitle}`,
      html: emailLayout({
        heading: approved ? "Demand enskripsyon w apwouve!" : "Demand enskripsyon w pa apwouve",
        body: approved
          ? `Bòn nouvèl! Demand enskripsyon w pou <strong>${courseTitle}</strong> apwouve. Ou ka kounye a antre nan kou a pou wè leçons ak devwa yo.`
          : `Demand enskripsyon w pou <strong>${courseTitle}</strong> pa t apwouve, souvan paske enfo peman an pa t konplè oswa pa t verifye. Ou ka soumèt yon nouvo demand ak enfo peman ki kòrèk, oswa kontakte nou si w kwè gen yon erè.`,
        ctaLabel: approved ? "Antre nan kou a" : "Gade kou m yo",
        ctaUrl: `${SITE_URL}/compte/kou`,
      }),
    });
  } catch {
    // Silence — yon echèk imèl pa dwe janm anpeche desizyon admin la anrejistre.
  }
}
