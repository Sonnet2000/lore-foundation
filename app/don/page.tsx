import type { Metadata } from "next";
import DonClient from "./DonClient";

export const metadata: Metadata = {
  title: "Faire un don — Loré Foundation",
  description:
    "Soutenez Loré Foundation par un don sécurisé en moins de 2 minutes. Paiement par carte Visa/Mastercard (Stripe), MonCash, NatCash ou Zelle.",
  // Paj sa a pa lye nan navigasyon sit la ankò — nou pa vle Google endekse l
  // epi l parèt nan rechèch tankou li se yon paj prensipal sou sit la.
  robots: { index: false, follow: false },
};

export default function DonPage() {
  return <DonClient />;
}
