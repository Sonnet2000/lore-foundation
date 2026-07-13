import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

/** Route publique — retourne les méthodes actives pour le site */
export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("payment_methods")
      .select("id, type, label, number, details, instructions, icon, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) return NextResponse.json({ items: [] });
    return NextResponse.json({ items: data ?? [] });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
