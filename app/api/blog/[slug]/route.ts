import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", params.slug)
      .eq("is_published", true)
      .single();

    if (error || !data) return NextResponse.json({ error: "Article non trouvé." }, { status: 404 });

    // Incrémenter vues
    await supabase.from("blog_posts")
      .update({ views: (data.views ?? 0) + 1 })
      .eq("id", data.id);

    return NextResponse.json({ item: data });
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
