import type { Metadata } from "next";
import DonClient from "./DonClient";

export const metadata: Metadata = {
  title: "Faire un don — Loré Foundation",
  description:
    "Soutenez Loré Foundation par un don sécurisé en moins de 2 minutes. Paiement par carte Visa/Mastercard (Stripe), MonCash, NatCash ou Zelle.",
};

export default function DonPage() {
  return <DonClient />;
}
