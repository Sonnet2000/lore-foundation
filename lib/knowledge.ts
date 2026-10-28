import "server-only";
import { tryGetSupabase } from "@/lib/supabase";
import { listPublishedCourses } from "@/lib/school";
import { PLATFORMS } from "@/lib/brand";

export type KnowledgeItem = {
  id: string;
  title: string;
  href: string;
  kind: "formation" | "article" | "plateforme";
  /** Identifiant de catégorie (articles) ou libellé court. */
  category?: string;
  excerpt?: string;
  external?: boolean;
};

export type ArticleLite = {
  id: string;
  slug: string;
  title: string;
  category: string;
  published_at: string | null;
};

export type Knowledge = {
  items: KnowledgeItem[];
  articles: ArticleLite[];
  courseCount: number;
};

/**
 * Index de recherche construit UNIQUEMENT à partir de données réelles :
 * cours publiés (table `courses`), articles publiés (`blog_posts`) et les quatre
 * plateformes officielles. Les compteurs affichés en découlent ; rien n'est inventé.
 * Si Supabase est indisponible, on retourne les plateformes seules.
 */
export async function getKnowledge(): Promise<Knowledge> {
  const platformItems: KnowledgeItem[] = PLATFORMS.map((p) => ({
    id: `plateforme-${p.id}`,
    title: p.title,
    excerpt: p.description,
    href: p.href,
    kind: "plateforme",
    external: true,
  }));

  const supabase = tryGetSupabase();
  const [coursesRes, postsRes] = await Promise.allSettled([
    listPublishedCourses(),
    supabase
      ? supabase
          .from("blog_posts")
          .select("id,slug,title,excerpt,category,published_at")
          .eq("is_published", true)
          .order("published_at", { ascending: false })
          .limit(300)
      : Promise.resolve({ data: [] as unknown[] }),
  ]);

  const courses = coursesRes.status === "fulfilled" ? coursesRes.value : [];
  const posts =
    postsRes.status === "fulfilled" && Array.isArray((postsRes.value as { data?: unknown[] }).data)
      ? ((postsRes.value as { data: (ArticleLite & { excerpt?: string })[] }).data)
      : [];

  const items: KnowledgeItem[] = [
    ...courses.map<KnowledgeItem>((c) => ({
      id: `formation-${c.id}`,
      title: c.title,
      excerpt: c.description,
      href: `/ecole/${c.id}/inscription`,
      kind: "formation",
    })),
    ...posts.map<KnowledgeItem>((p) => ({
      id: `article-${p.id}`,
      title: p.title,
      excerpt: p.excerpt,
      href: `/blog/${p.slug}`,
      kind: "article",
      category: p.category,
    })),
    ...platformItems,
  ];

  return {
    items,
    articles: posts.map(({ id, slug, title, category, published_at }) => ({ id, slug, title, category, published_at })),
    courseCount: courses.length,
  };
}
