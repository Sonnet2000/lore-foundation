import type { Metadata } from "next";
import ProjetsClient from "./ProjetsClient";
export const metadata: Metadata = {
  title: "Nos Projets — Loré Foundation",
  description: "Découvrez et financez les projets de Loré Foundation en Haïti. Éducation, numérique, leadership et engagement communautaire.",
};
export default function ProjetsPage() { return <ProjetsClient />; }
