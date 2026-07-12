import { NextResponse } from "next/server";
import { validateUUID } from "@/lib/validate-id";
import { getSupabase } from "@/lib/supabase";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const invalid = validateUUID(params.id);
  if (invalid) return invalid;

  const body = await request.json().catch(() => ({}));
  const status = body.status;
  if (!["pending", "confirmed", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Estati envalid." }, { status: 400 });
  }

  const supabase = getSupabase();
  const updates: Record<string, unknown> = { status };
  if (status === "confirmed") updates.confirmed_at = new Date().toISOString();
  if (typeof body.notes === "string") updates.notes = body.notes.slice(0, 1000);

  const { data, error } = await supabase
    .from("payment_requests")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}
