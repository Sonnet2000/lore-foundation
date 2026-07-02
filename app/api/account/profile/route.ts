import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabase } from "@/lib/supabase";

// Route liée à l'utilisateur connecté : jamais de pré-génération au build.
export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const supabaseAuth = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const fullName = typeof body.fullName === "string" ? body.fullName.trim().slice(0, 120) : undefined;
  const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 30) : undefined;

  if (fullName !== undefined && fullName.length === 0) {
    return NextResponse.json({ error: "Le nom ne peut pas être vide." }, { status: 400 });
  }

  const update: Record<string, string> = { updated_at: new Date().toISOString() };
  if (fullName !== undefined) update.full_name = fullName;
  if (phone !== undefined) update.phone = phone;

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", user.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Impossible de mettre à jour le profil." }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}
