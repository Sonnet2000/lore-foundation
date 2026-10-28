import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import BlogListClient from "./BlogListClient";
import { listPublishedPosts } from "@/lib/blog";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog — Loré Fondation",
  description: "Articles sur la technologie, l'éducation, l'IA, l'entrepreneuriat et les activités de Loré Fondation en Haïti.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({ searchParams }: { searchParams?: { categorie?: string } }) {
  const requested = searchParams?.categorie;
  const initialCategory = BLOG_CATEGORIES.some((c) => c.id === requested) ? (requested as string) : "all";
  const all = await listPublishedPosts(50);
  const initialPosts = initialCategory === "all" ? all : all.filter((p) => p.category === initialCategory);
  return (
    <SiteChrome>
      <BlogListClient initialPosts={initialPosts} initialCategory={initialCategory} />
    </SiteChrome>
  );
}
