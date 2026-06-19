import type { Metadata } from "next";
import PartenaireClient from "./PartenaireClient";

export const metadata: Metadata = {
  title: "Devenir Partenaire — Loré Foundation",
  description: "Rejoignez le réseau de partenaires de Loré Foundation et contribuez à transformer des vies en Haïti.",
};

export default function PartenairePage() {
  return <PartenaireClient />;
}
