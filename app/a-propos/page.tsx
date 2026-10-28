import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import PageHeader from "@/components/lore/PageHeader";
import Identity from "@/components/lore/Identity";
import MissionValues from "@/components/lore/MissionValues";
import Anthem from "@/components/lore/Anthem";
import RegisterCta from "@/components/lore/RegisterCta";
import { siteInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: "À propos — Loré Fondation",
  description:
    "Loré Fondation est un centre de formation en informatique : notre mission, nos valeurs, notre identité et notre hymne officiel.",
  alternates: { canonical: "/a-propos" },
};

export default function AProposPage() {
  return (
    <SiteChrome>
      <main id="contenu">
        <PageHeader label="À propos" title="Un centre de formation en informatique, au service d’Haïti">
          <p>{siteInfo.mission}</p>
        </PageHeader>
        <MissionValues />
        <Identity />
        <Anthem />
        <RegisterCta />
      </main>
    </SiteChrome>
  );
}
