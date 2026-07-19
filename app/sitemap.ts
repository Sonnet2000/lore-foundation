import type { MetadataRoute } from "next";
import { tryGetSupabase } from "@/lib/supabase";

const SITE_URL = "https://www.lorefondation.com";

/**
 * Sitemap dinamik. Next.js jenere l otomatikman sou /sitemap.xml.
 * Li mete tout paj piblik yo (statik) + tout atik blog ki pibliye yo
 * (chaje dirèkteman nan Supabase, menm jan ak /api/blog).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/a-propos`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/ecole`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/projects`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/partenaire`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/politique-de-confidentialite`, changeFrequency: "yearly", priority: 0.3 },
  ];

  let blogRoutes: MetadataRoute.Sitemap = [];
  let projectRoutes: MetadataRoute.Sitemap = [];

  try {
    const supabase = tryGetSupabase();
    if (supabase) {
      const { data } = await supabase
        .from("blog_posts")
        .select("slug,published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      blogRoutes = (data ?? []).map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: post.published_at ? new Date(post.published_at) : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
    }
  } catch {
    // Si Supabase pa reponn pandan build la, nou kite sitemap la ak paj statik yo sèlman.
  }

  try {
    const supabase = tryGetSupabase();
    if (supabase) {
      const { data } = await supabase
        .from("projects")
        .select("slug,updated_at")
        .eq("is_published", true);

      projectRoutes = (data ?? []).map((project) => ({
        url: `${SITE_URL}/projects/${project.slug}`,
        lastModified: project.updated_at ? new Date(project.updated_at) : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
    }
  } catch {
    // Si Supabase pa reponn pandan build la, nou kite sitemap la san paj pwojè endividyèl yo.
  }

  return [...staticRoutes, ...blogRoutes, ...projectRoutes];
}
