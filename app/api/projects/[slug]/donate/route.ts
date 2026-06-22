import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    const supabase = getSupabase();
    const body = await request.json().catch(() => ({}));

    const { data: project } = await supabase.from("projects")
      .select("id,raised_amount").eq("slug", params.slug).single();
    if (!project) return NextResponse.json({ error: "Projet non trouvé." }, { status: 404 });

    const amount = Number(body.amount) || 0;
    const isAnon = body.is_anonymous === true;

    const { data, error } = await supabase.from("project_donations").insert({
      project_id:   project.id,
      donor_name:   isAnon ? "Anonyme" : (body.donor_name ?? "Anonyme").trim(),
      donor_email:  (!isAnon && body.donor_email) ? body.donor_email : null,
      amount,
      currency:     body.currency || "HTG",
      method:       body.method || "autre",
      message:      (body.message ?? "").trim().slice(0, 500),
      is_anonymous: isAnon,
      reference:    (body.reference ?? "").trim(),
      proof_url:    body.proof_url || null,
      status:       "pending",
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Update raised_amount optimistically
    await supabase.from("projects")
      .update({ raised_amount: (project.raised_amount ?? 0) + amount })
      .eq("id", project.id);

    return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
