import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const limit    = Math.min(50, Number(searchParams.get("limit") || 20));

    const supabase = getSupabase();
    let query = supabase
      .from("blog_posts")
      .select("id,slug,title,excerpt,cover_url,category,tags,author_name,author_photo,is_featured,read_time_minutes,views,published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (category) query = query.eq("category", category);
    if (featured === "1") query = query.eq("is_featured", true);

    const { data, error } = await query;
    if (error) return NextResponse.json({ items: [] });
    return NextResponse.json({ items: data ?? [] });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
