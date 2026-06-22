import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const limit = Math.min(50, Number(searchParams.get("limit") || 20));
    const supabase = getSupabase();
    let query = supabase.from("projects")
      .select("id,slug,title,short_desc,category,goal_amount,raised_amount,currency,cover_url,media,location,beneficiaries,is_featured,status,end_date")
      .eq("is_published", true)
      .order("sort_order").limit(limit);
    if (featured === "1") query = query.eq("is_featured", true);
    const { data, error } = await query;
    if (error) return NextResponse.json({ items: [] });
    return NextResponse.json({ items: data ?? [] });
  } catch { return NextResponse.json({ items: [] }); }
}
