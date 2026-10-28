import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import PageHeader from "@/components/lore/PageHeader";
import Programs from "@/components/lore/Programs";
import DigitalHub from "@/components/lore/DigitalHub";
import RegisterCta from "@/components/lore/RegisterCta";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Formations — Loré Fondation",
  description:
    "Les formations en informatique de Loré Fondation, centre de formation. Découvrez-les et inscrivez-vous en ligne.",
  alternates: { canonical: "/ecole" },
};

export default function EcolePage() {
  return (
    <SiteChrome>
      <main id="contenu">
        <PageHeader label="Formations" title="Nos formations en informatique">
          <p>Chaque formation ouverte par Loré Fondation est présentée ici. L’inscription se fait en ligne.</p>
        </PageHeader>
        <Programs />
        <DigitalHub />
        <RegisterCta />
      </main>
    </SiteChrome>
  );
}
