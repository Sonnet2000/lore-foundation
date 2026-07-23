import type { Metadata } from "next";
import Link from "next/link";
import { Target } from "lucide-react";
import { getProjectBySlug } from "@/lib/projects";
import SiteChrome from "@/components/SiteChrome";
import ProjetClient from "./ProjetClient";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: "Projet non trouvé" };

  const description = project.short_desc || project.description.replace(/<[^>]+>/g, "").slice(0, 160);
  const image = project.cover_url || project.media?.[0]?.url;

  return {
    title: project.title,
    description,
    openGraph: {
      title: project.title,
      description,
      images: image ? [{ url: image }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
    },
  };
}

export default async function ProjetPage({ params }: Props) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    return (
      <SiteChrome>
        <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-lore-cream dark:bg-lore-night px-5 text-center">
          <Target className="h-16 w-16 text-lore-ink/20 dark:text-white/20" />
          <h1 className="font-display text-2xl font-bold text-lore-ink dark:text-white">Projet non trouvé</h1>
          <Link href="/projects" className="rounded-full bg-lore-blue px-6 py-3 text-sm font-bold text-white hover:bg-lore-blue/90 transition-colors">
            Voir tous les projets
          </Link>
        </div>
      </SiteChrome>
    );
  }

  return (
    <SiteChrome>
      <ProjetClient project={project} />
    </SiteChrome>
  );
}
