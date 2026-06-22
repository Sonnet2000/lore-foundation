import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("projects").select("*")
      .eq("slug", params.slug).eq("is_published", true).single();
    if (error || !data) return NextResponse.json({ error: "Projet non trouvé." }, { status: 404 });
    return NextResponse.json({ item: data });
  } catch { return NextResponse.json({ error: "Erreur serveur." }, { status: 500 }); }
}
