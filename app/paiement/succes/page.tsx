import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Paiement confirmé — Loré Foundation" };

export default function PaiementSuccesPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-lore-night px-5">
      <div className="max-w-md text-center flex flex-col items-center gap-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/15">
          <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        </div>

        <div>
          <h1 className="font-display text-3xl font-extrabold text-white">Mèsi! 🙏</h1>
          <p className="mt-1 text-lg font-semibold text-white/70">Votre paiement a été confirmé avec succès.</p>
        </div>

        <p className="text-white/60 leading-relaxed">
          Notre équipe a bien reçu votre paiement et va traiter votre demande très bientôt.
          Un reçu a été envoyé à votre adresse email si vous l&apos;avez fournie.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link href="/"
            className="flex-1 flex items-center justify-center gap-2 rounded-full bg-lore-gold px-5 py-3 text-sm font-semibold text-lore-dark hover:scale-[1.02] transition-transform">
            Retour à l&apos;accueil
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
