import "server-only";
import { getSupabase } from "@/lib/supabase";

export type AdRow = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string | null;
  cta_label: string;
  is_published: boolean;
  sort_order: number;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
};

/** Tout piblisite ki aktif kounye a (publye e nan fenèt dat la, si gen dat). */
export async function listActiveAds(): Promise<AdRow[]> {
  try {
    const supabase = getSupabase();
    const nowIso = new Date().toISOString();

    const { data, error } = await supabase
      .from("advertisements")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error || !data) return [];

    return (data as AdRow[]).filter((ad) => {
      if (ad.starts_at && ad.starts_at > nowIso) return false;
      if (ad.ends_at && ad.ends_at < nowIso) return false;
      return true;
    });
  } catch {
    return [];
  }
}
