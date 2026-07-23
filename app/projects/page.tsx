import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import ProjetsClient from "./ProjetsClient";
export const metadata: Metadata = {
  title: "Nos Projets — Loré Foundation",
  description: "Découvrez et financez les projets de Loré Foundation en Haïti. Éducation, numérique, leadership et engagement communautaire.",
  alternates: { canonical: "/projects" },
};
export default function ProjetsPage() {
  return (
    <SiteChrome>
      <ProjetsClient />
    </SiteChrome>
  );
}
