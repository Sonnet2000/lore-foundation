import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import BlogListClient from "./BlogListClient";
import { listPublishedPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog — Loré Foundation",
  description: "Articles sur la technologie, l'éducation, l'IA, l'entrepreneuriat et les activités de Loré Foundation en Haïti.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const initialPosts = await listPublishedPosts(50);
  return (
    <SiteChrome>
      <BlogListClient initialPosts={initialPosts} />
    </SiteChrome>
  );
}
