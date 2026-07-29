import "server-only";
import { getSupabase } from "@/lib/supabase";

export type AppCatalogRow = {
  id: string;
  name: string;
  description: string;
  category: string;
  icon_url: string | null;
  exe_url: string | null;
  exe_version: string;
  exe_size_mb: number;
  apk_url: string | null;
  apk_version: string;
  apk_size_mb: number;
  playstore_url: string | null;
  website_url: string | null;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
};

export async function listPublishedApps(): Promise<AppCatalogRow[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("apps_catalog")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data as AppCatalogRow[];
  } catch {
    return [];
  }
}
