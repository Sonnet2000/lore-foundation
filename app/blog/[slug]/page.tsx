import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getBlogPostBySlug } from "@/lib/blog";
import BlogArticleClient from "./BlogArticleClient";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) {
    return { title: "Article non trouvé", robots: { index: false, follow: false } };
  }

  const description = post.excerpt || post.content.replace(/<[^>]+>/g, "").slice(0, 160);

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description,
      images: post.cover_url ? [{ url: post.cover_url }] : undefined,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      authors: post.author_name ? [post.author_name] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.cover_url ? [post.cover_url] : undefined,
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-lore-cream dark:bg-lore-night px-5 text-center">
        <BookOpen className="h-16 w-16 text-lore-ink/20 dark:text-white/20" />
        <h1 className="font-display text-2xl font-bold text-lore-ink dark:text-white">Article non trouvé</h1>
        <Link href="/blog" className="rounded-full bg-lore-blue px-6 py-3 text-sm font-bold text-white hover:bg-lore-blue/90 transition-colors">
          Retour au blog
        </Link>
      </div>
    );
  }

  return <BlogArticleClient post={post} />;
}
