import { NextResponse } from "next/server";
import { validateUUID } from "@/lib/validate-id";
import { getSupabase } from "@/lib/supabase";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const invalid = validateUUID(params.id);
  if (invalid) return invalid;

  const supabase = getSupabase();

  const { data: enrollments, error } = await supabase
    .from("course_enrollments")
    .select("*")
    .eq("course_id", params.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const ids = (enrollments ?? []).map((e) => e.user_id);

  const [{ data: profiles }, { data: authData }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, phone").in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]),
    supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
  const emailMap = new Map((authData?.users ?? []).map((u) => [u.id, u.email]));

  const items = (enrollments ?? []).map((e) => ({
    ...e,
    full_name: profileMap.get(e.user_id)?.full_name || "",
    phone: profileMap.get(e.user_id)?.phone || "",
    email: emailMap.get(e.user_id) || "",
  }));

  return NextResponse.json({ items });
}
