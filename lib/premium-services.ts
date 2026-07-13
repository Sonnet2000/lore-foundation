import "server-only";
import { getSupabase } from "@/lib/supabase";

export type PremiumServiceRow = {
  id: string;
  title: string;
  description: string;
  price: string;
  image_url: string | null;
  icon: string;
  features: string[];
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
};

export async function listPublishedPremiumServices(): Promise<PremiumServiceRow[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("premium_services")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data as PremiumServiceRow[];
  } catch {
    return [];
  }
}
