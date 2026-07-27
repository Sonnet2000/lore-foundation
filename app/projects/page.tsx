import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import ProjetsClient from "./ProjetsClient";
import { listPublishedProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nos Projets — Loré Foundation",
  description: "Découvrez et financez les projets de Loré Foundation en Haïti. Éducation, numérique, leadership et engagement communautaire.",
  alternates: { canonical: "/projects" },
};
export default async function ProjetsPage() {
  const initialProjects = await listPublishedProjects(50);
  return (
    <SiteChrome>
      <ProjetsClient initialProjects={initialProjects} />
    </SiteChrome>
  );
}
