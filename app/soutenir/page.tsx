import type { Metadata } from "next";
import SoutenirClient from "./SoutenirClient";

export const metadata: Metadata = {
  title: "Soutenir nos projets — Loré Foundation",
  description: "Découvrez toutes les façons de soutenir les projets de Loré Foundation. Contribution anonyme possible.",
  // Paj sa a pa lye nan navigasyon sit la ankò — nou pa vle Google endekse l
  // epi l parèt nan rechèch tankou li se yon paj prensipal sou sit la.
  robots: { index: false, follow: false },
};

export default function SoutenirPage() {
  return <SoutenirClient />;
}
