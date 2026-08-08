import "server-only";
import { getSupabase } from "@/lib/supabase";

export type CourseFormat = "online" | "in_person" | "hybrid";

export type CourseRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_url: string | null;
  price: string;
  registration_fee: string;
  materials_fee: string;
  duration: string;
  schedule: string;
  format: CourseFormat;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};

export type EnrollmentStatus = "pending" | "approved" | "rejected";

export type FeeEntry = {
  status: "unpaid" | "pending" | "paid" | "rejected";
  method?: string;
  reference?: string;
  proof_url?: string;
  submitted_at?: string;
  decided_at?: string;
};

export type EnrollmentRow = {
  id: string;
  course_id: string;
  user_id: string;
  status: EnrollmentStatus;
  note: string;
  payment_method: string | null;
  payment_reference: string | null;
  payment_proof_url: string | null;
  full_name: string;
  phone: string;
  address: string;
  birth_date: string | null;
  id_document_url: string | null;
  fees: Record<string, FeeEntry>;
  created_at: string;
  decided_at: string | null;
};

export type LessonRow = {
  id: string;
  course_id: string;
  title: string;
  description: string;
  video_url: string | null;
  content: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};

export type AssignmentRow = {
  id: string;
  course_id: string;
  title: string;
  description: string;
  attachment_url: string | null;
  due_at: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};

export type SubmissionRow = {
  id: string;
  assignment_id: string;
  user_id: string;
  text_response: string;
  link_url: string | null;
  file_url: string | null;
  status: "submitted" | "graded";
  grade: string | null;
  feedback: string | null;
  submitted_at: string;
  graded_at: string | null;
};

/** Detèmine si yon pri kou vle di "gratis" (menm lojik ak paj enskripsyon an). */
export function isFreeCoursePrice(price: string) {
  const p = (price || "").trim().toLowerCase();
  return !p || /gratis|gratuit|free|0 htg|0\$/.test(p);
}

/** Tout kou piblik yo, san enfo sou okenn elèv (pou paj piblik /ecole). */
export async function listPublishedCourses() {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  return (data ?? []) as CourseRow[];
}

/** Yon sèl kou piblik (pa id), pou paj enskripsyon piblik la. Null si li pa egziste/pa publye. */
export async function getPublishedCourseById(courseId: string) {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .eq("is_published", true)
    .maybeSingle();
  return (data as CourseRow | null) ?? null;
}

/** Tout kou piblik yo, ak estati enskripsyon elèv la (si li konekte). */
export async function listCoursesForStudent(userId: string) {
  const supabase = getSupabase();

  const [coursesRes, enrollRes] = await Promise.all([
    supabase.from("courses").select("*").eq("is_published", true).order("sort_order", { ascending: true }),
    supabase.from("course_enrollments").select("*").eq("user_id", userId),
  ]);

  const courses = (coursesRes.data ?? []) as CourseRow[];
  const enrollments = (enrollRes.data ?? []) as EnrollmentRow[];
  const byCourse = new Map(enrollments.map((e) => [e.course_id, e]));

  return courses.map((c) => ({ course: c, enrollment: byCourse.get(c.id) ?? null }));
}

/** Detay yon kou pou yon elèv espesifik : kou a, estati enskripsyon, ak devwa yo (si apwouve). */
export async function getCourseForStudent(courseId: string, userId: string) {
  const supabase = getSupabase();

  const { data: course } = await supabase.from("courses").select("*").eq("id", courseId).maybeSingle();
  if (!course) return null;

  const { data: enrollment } = await supabase
    .from("course_enrollments")
    .select("*")
    .eq("course_id", courseId)
    .eq("user_id", userId)
    .maybeSingle();

  let assignments: (AssignmentRow & { submission: SubmissionRow | null })[] = [];
  let lessons: LessonRow[] = [];

  if (enrollment?.status === "approved") {
    const { data: assignmentRows } = await supabase
      .from("assignments")
      .select("*")
      .eq("course_id", courseId)
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    const { data: submissionRows } = await supabase
      .from("assignment_submissions")
      .select("*")
      .eq("user_id", userId)
      .in("assignment_id", (assignmentRows ?? []).map((a) => a.id));

    const byAssignment = new Map((submissionRows ?? []).map((s) => [s.assignment_id, s as SubmissionRow]));

    assignments = (assignmentRows ?? []).map((a) => ({
      ...(a as AssignmentRow),
      submission: byAssignment.get(a.id) ?? null,
    }));

    const { data: lessonRows } = await supabase
      .from("course_lessons")
      .select("*")
      .eq("course_id", courseId)
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    lessons = (lessonRows ?? []) as LessonRow[];
  }

  return {
    course: course as CourseRow,
    enrollment: (enrollment as EnrollmentRow | null) ?? null,
    assignments,
    lessons,
  };
}

/** Elèv la mande pou l enskri nan yon kou (kreye/re-aktive yon demand "pending"). */
export async function requestEnrollment(
  courseId: string,
  userId: string,
  payment?: { method: string; reference: string; proof_url: string },
  student?: { full_name: string; phone: string; address: string; birth_date: string; id_document_url: string }
) {
  const supabase = getSupabase();
  const paymentFields = payment
    ? {
        payment_method: payment.method || null,
        payment_reference: payment.reference || null,
        payment_proof_url: payment.proof_url || null,
      }
    : {};
  const studentFields = student
    ? {
        full_name: student.full_name || "",
        phone: student.phone || "",
        address: student.address || "",
        birth_date: student.birth_date || null,
        id_document_url: student.id_document_url || null,
      }
    : {};
  // Frè enskripsyon an antre nan `fees.registration` tou, pou l swiv menm modèl
  // ak frè patisipasyon/materyèl yo (chak youn verifye poukont li pa admin).
  const feesFields = payment
    ? {
        fees: {
          registration: {
            status: "pending" as const,
            method: payment.method || undefined,
            reference: payment.reference || undefined,
            proof_url: payment.proof_url || undefined,
            submitted_at: new Date().toISOString(),
          },
        },
      }
    : {};

  const { data: existing } = await supabase
    .from("course_enrollments")
    .select("*")
    .eq("course_id", courseId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    if (existing.status === "rejected") {
      const mergedFees = { ...(existing.fees ?? {}), ...(feesFields.fees ?? {}) };
      const { data, error } = await supabase
        .from("course_enrollments")
        .update({ status: "pending", decided_at: null, ...paymentFields, ...studentFields, fees: mergedFees })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as EnrollmentRow;
    }
    return existing as EnrollmentRow;
  }

  const { data, error } = await supabase
    .from("course_enrollments")
    .insert({ course_id: courseId, user_id: userId, status: "pending", ...paymentFields, ...studentFields, ...feesFields })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as EnrollmentRow;
}

/**
 * Elèv la soumèt peman pou yon frè espesifik (patisipasyon/materyèl) sou yon
 * enskripsyon ki deja egziste — endepandan de frè enskripsyon an. Sa pèmèt
 * moun nan peye enskripsyon kounye a epi peye rès frè yo pita.
 */
export async function submitFeePayment(
  courseId: string,
  userId: string,
  feeKey: string,
  payment: { method: string; reference: string; proof_url: string }
) {
  const supabase = getSupabase();
  const { data: existing, error: findError } = await supabase
    .from("course_enrollments")
    .select("*")
    .eq("course_id", courseId)
    .eq("user_id", userId)
    .maybeSingle();

  if (findError) throw new Error(findError.message);
  if (!existing) throw new Error("Ou dwe enskri nan kou a anvan ou peye lòt frè yo.");

  const mergedFees: Record<string, FeeEntry> = {
    ...(existing.fees ?? {}),
    [feeKey]: {
      status: "pending",
      method: payment.method || undefined,
      reference: payment.reference || undefined,
      proof_url: payment.proof_url || undefined,
      submitted_at: new Date().toISOString(),
    },
  };

  const { data, error } = await supabase
    .from("course_enrollments")
    .update({ fees: mergedFees })
    .eq("id", existing.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as EnrollmentRow;
}

/** Elèv la soumèt (oswa re-soumèt) yon devwa. Verifye li apwouve nan kou a anvan. */
export async function submitAssignment(
  assignmentId: string,
  userId: string,
  payload: { text_response: string; link_url: string; file_url: string }
) {
  const supabase = getSupabase();

  const { data: assignment } = await supabase
    .from("assignments")
    .select("id, course_id")
    .eq("id", assignmentId)
    .maybeSingle();

  if (!assignment) throw new Error("Devwa a pa egziste.");

  const { data: enrollment } = await supabase
    .from("course_enrollments")
    .select("status")
    .eq("course_id", assignment.course_id)
    .eq("user_id", userId)
    .maybeSingle();

  if (!enrollment || enrollment.status !== "approved") {
    throw new Error("Ou pa apwouve nan kou sa a.");
  }

  const { data, error } = await supabase
    .from("assignment_submissions")
    .upsert(
      {
        assignment_id: assignmentId,
        user_id: userId,
        text_response: payload.text_response,
        link_url: payload.link_url || null,
        file_url: payload.file_url || null,
        status: "submitted",
        grade: null,
        feedback: null,
        submitted_at: new Date().toISOString(),
        graded_at: null,
      },
      { onConflict: "assignment_id,user_id" }
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as SubmissionRow;
}
