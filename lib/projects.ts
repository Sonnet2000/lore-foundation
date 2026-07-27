import "server-only";
import { getSupabase } from "@/lib/supabase";
import type { Project } from "@/app/admin/_components/types";

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error || !data) return null;
    return data as Project;
  } catch {
    return null;
  }
}

/**
 * Lis pwojè piblye yo pou paj /projects la. Rele sou serveur la pou
 * Googlebot ka wè kontni an dirèkteman nan premye HTML la, san l pa
 * depann sou yon fetch JavaScript ki fèt apre paj la fin chaje.
 */
export async function listPublishedProjects(limit = 50): Promise<Project[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("projects")
      .select(
        "id,slug,title,short_desc,category,goal_amount,raised_amount,currency,cover_url,media,location,beneficiaries,is_featured,status,end_date"
      )
      .eq("is_published", true)
      .order("sort_order")
      .limit(limit);

    if (error || !data) return [];
    return data as Project[];
  } catch {
    return [];
  }
}
