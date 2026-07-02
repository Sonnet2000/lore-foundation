import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabase();

    // 1. Tout kont ki enskri (Supabase Auth) — jiska 1000 pou kounye a,
    //    amplman sifizan pou echèl yon fondasyon lokal.
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (authError) return NextResponse.json({ error: authError.message }, { status: 500 });

    const users = authData.users;
    const ids = users.map((u) => u.id);

    // 2. Enfo konplemantè (non, telefòn) + aktivite (don, peman, seminè)
    const [{ data: profiles }, { data: donations }, { data: payments }, { data: regs }] =
      await Promise.all([
        supabase.from("profiles").select("id, full_name, phone, avatar_url").in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]),
        supabase.from("project_donations").select("user_id, amount, status").in("user_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]),
        supabase.from("payments").select("user_id, amount, status").in("user_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]),
        supabase.from("seminar_registrations").select("user_id").in("user_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]),
      ]);

    const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

    type Activity = { donationsCount: number; donationsTotal: number; paymentsCount: number; paymentsTotal: number; seminarsCount: number };
    const activityMap = new Map<string, Activity>();
    const ensure = (id: string) => {
      if (!activityMap.has(id)) {
        activityMap.set(id, { donationsCount: 0, donationsTotal: 0, paymentsCount: 0, paymentsTotal: 0, seminarsCount: 0 });
      }
      return activityMap.get(id)!;
    };

    for (const d of donations ?? []) {
      if (!d.user_id) continue;
      const a = ensure(d.user_id);
      a.donationsCount += 1;
      if (d.status === "confirmed") a.donationsTotal += Number(d.amount) || 0;
    }
    for (const p of payments ?? []) {
      if (!p.user_id) continue;
      const a = ensure(p.user_id);
      a.paymentsCount += 1;
      if (p.status === "confirmed") a.paymentsTotal += Number(p.amount) || 0;
    }
    for (const r of regs ?? []) {
      if (!r.user_id) continue;
      ensure(r.user_id).seminarsCount += 1;
    }

    const items = users
      .map((u) => {
        const profile = profileMap.get(u.id);
        const activity = activityMap.get(u.id);
        return {
          id: u.id,
          email: u.email ?? "",
          full_name: profile?.full_name || (u.user_metadata?.full_name as string) || "",
          phone: profile?.phone || "",
          avatar_url: profile?.avatar_url || (u.user_metadata?.avatar_url as string) || null,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at ?? null,
          banned: !!(u.banned_until && new Date(u.banned_until) > new Date()),
          provider: u.app_metadata?.provider || "email",
          donationsCount: activity?.donationsCount ?? 0,
          donationsTotal: activity?.donationsTotal ?? 0,
          paymentsCount: activity?.paymentsCount ?? 0,
          paymentsTotal: activity?.paymentsTotal ?? 0,
          seminarsCount: activity?.seminarsCount ?? 0,
        };
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ items });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg, items: [] }, { status: 500 });
  }
}
