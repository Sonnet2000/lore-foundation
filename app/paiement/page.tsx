import type { Metadata } from "next";
import PaiementClient from "./PaiementClient";

export const metadata: Metadata = {
  title: "Soutenir nos projets — Loré Foundation",
  description: "Soutenez les projets de Loré Foundation via MonCash, NatCash ou Sogebank. Contribution anonyme possible.",
};

export default function PaiementPage() {
  return <PaiementClient />;
}
