import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requestEnrollment } from "@/lib/school";

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
  const reference = typeof body.payment_reference === "string" ? body.payment_reference.trim().slice(0, 200) : "";
  const proof_url = typeof body.payment_proof_url === "string" ? body.payment_proof_url.trim().slice(0, 500) : "";
  const method = typeof body.payment_method === "string" ? body.payment_method.trim().slice(0, 40) : "";

  try {
    const enrollment = await requestEnrollment(
      id,
      user.id,
      method || reference || proof_url ? { method: method || "binance", reference, proof_url } : undefined
    );
    return NextResponse.json({ enrollment });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
