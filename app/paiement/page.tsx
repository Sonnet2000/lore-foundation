import type { Metadata } from "next";
import { Suspense } from "react";
import { getPaymentSettings } from "@/lib/site-info-server";
import PaiementClient from "./PaiementClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Paiement",
  description: "Payez un service Loré Foundation via Binance Pay, MonCash, NatCash, Sogebank ou carte Visa/Mastercard.",
  robots: { index: false, follow: false },
};

export default async function PaiementPage() {
  const settings = await getPaymentSettings();
  return (
    <Suspense fallback={null}>
      <PaiementClient settings={settings} />
    </Suspense>
  );
}
