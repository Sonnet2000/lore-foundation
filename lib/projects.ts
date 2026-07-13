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
