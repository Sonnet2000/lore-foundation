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

/**
 * Lis atik piblye yo pou paj /blog la. Rele sou serveur la (Server Component)
 * pou premye paj HTML Googlebot wè a gen tan gen kontni reyèl ladan l —
 * olye li rete vid pandan JS ap chaje sou navigatè a (mauvais pou SEO/indexation).
 */
export async function listPublishedPosts(limit = 50): Promise<BlogPost[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "id,slug,title,excerpt,cover_url,category,tags,author_name,author_photo,is_featured,read_time_minutes,views,published_at"
      )
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data as BlogPost[];
  } catch {
    return [];
  }
}
