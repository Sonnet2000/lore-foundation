import { NextResponse } from "next/server";
import { validateUUID } from "@/lib/validate-id";
import { getSupabase } from "@/lib/supabase";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const invalid = validateUUID(params.id);
  if (invalid) return invalid;

  const supabase = getSupabase();

  const { data: submissions, error } = await supabase
    .from("assignment_submissions")
    .select("*")
    .eq("assignment_id", params.id)
    .order("submitted_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const ids = (submissions ?? []).map((s) => s.user_id);

  const [{ data: profiles }, { data: authData }] = await Promise.all([
    supabase.from("profiles").select("id, full_name").in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]),
    supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
  const emailMap = new Map((authData?.users ?? []).map((u) => [u.id, u.email]));

  const items = (submissions ?? []).map((s) => ({
    ...s,
    full_name: profileMap.get(s.user_id)?.full_name || "",
    email: emailMap.get(s.user_id) || "",
  }));

  return NextResponse.json({ items });
}
