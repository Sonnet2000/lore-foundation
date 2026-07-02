import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateUUID } from "@/lib/validate-id";

export const dynamic = "force-dynamic";

// Ban "pèmanan" nan Supabase Auth se yon dire trè long (~100 an).
const BAN_FOREVER = "876000h";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const invalid = validateUUID(params.id);
  if (invalid) return invalid;

  const body = await request.json().catch(() => ({}));
  const banned = typeof body?.banned === "boolean" ? body.banned : null;
  if (banned === null) {
    return NextResponse.json({ error: "Paramèt 'banned' obligatwa." }, { status: 400 });
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase.auth.admin.updateUserById(params.id, {
      ban_duration: banned ? BAN_FOREVER : "none",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const invalid = validateUUID(params.id);
  if (invalid) return invalid;

  try {
    const supabase = getSupabase();
    // Efase kont Auth la — trigger/FK "on delete cascade" retire `profiles`
    // otomatikman; don ak enskripsyon yo rete (user_id vin null) pou istorik.
    const { error } = await supabase.auth.admin.deleteUser(params.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
