import type { Metadata } from "next";
import BlogListClient from "./BlogListClient";

export const metadata: Metadata = {
  title: "Blog — Loré Foundation",
  description: "Articles sur la technologie, l'éducation, l'IA, l'entrepreneuriat et les activités de Loré Foundation en Haïti.",
};

export default function BlogPage() {
  return <BlogListClient />;
}
