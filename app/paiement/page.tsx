import type { Metadata } from "next";
import { getPaymentSettings } from "@/lib/site-info-server";
import PaiementClient from "./PaiementClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Paiement",
  description: "Payez un service Loré Foundation via Binance Pay.",
  robots: { index: false, follow: false },
};

export default async function PaiementPage() {
  const settings = await getPaymentSettings();
  return <PaiementClient settings={settings} />;
}
