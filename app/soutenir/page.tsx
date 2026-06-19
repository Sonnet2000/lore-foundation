import type { Metadata } from "next";
import SoutenirClient from "./SoutenirClient";

export const metadata: Metadata = {
  title: "Soutenir nos projets — Loré Foundation",
  description: "Découvrez toutes les façons de soutenir les projets de Loré Foundation. Contribution anonyme possible.",
};

export default function SoutenirPage() {
  return <SoutenirClient />;
}
