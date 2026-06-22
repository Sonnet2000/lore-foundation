import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateId } from "@/lib/validate-id";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const inv = validateId(params.id); if (inv) return inv;
  try {
    const supabase = getSupabase();
    const body = await request.json().catch(() => ({}));
    const u: Record<string, unknown> = {};
    if (typeof body.status === "string" && ["pending","confirmed","rejected"].includes(body.status))
      u.status = body.status;
    if (typeof body.raised_amount === "number") {
      // Update raised_amount on the project
      await supabase.from("projects").update({ raised_amount: body.raised_amount }).eq("id", body.project_id);
    }
    const { data, error } = await supabase.from("project_donations").update(u).eq("id", params.id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ item: data });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
