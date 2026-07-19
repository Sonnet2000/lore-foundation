import "server-only";
import { getSupabase } from "@/lib/supabase";
import type { BlogPost } from "@/app/admin/_components/types";

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error || !data) return null;
    return data as BlogPost;
  } catch {
    return null;
  }
}
