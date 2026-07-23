import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import AProposClient from "./AProposClient";

export const metadata: Metadata = {
  title: "À propos — Loré Foundation",
  description:
    "Découvrez l'histoire, la mission, la vision et les valeurs de Loré Foundation — une organisation dédiée au développement humain, à l'éducation et à l'inclusion numérique en Haïti.",
  alternates: { canonical: "/a-propos" },
};

export default function AProposPage() {
  return (
    <SiteChrome>
      <AProposClient />
    </SiteChrome>
  );
}
