import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Heart, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Don confirmé — Loré Foundation" };

export default function DonSuccesPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-lore-cream dark:bg-lore-night px-5">
      <div className="max-w-md text-center flex flex-col items-center gap-6">

        {/* Animation succès */}
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/15">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          </div>
          <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-lore-blue text-white text-sm">
            🇭🇹
          </div>
        </div>

        <div>
          <h1 className="font-display text-3xl font-extrabold text-lore-ink dark:text-white">
            Mèsi anpil ! 🙏
          </h1>
          <p className="mt-1 text-lg font-semibold text-lore-ink/70 dark:text-white/70">
            Votre don a été confirmé avec succès.
          </p>
        </div>

        <p className="text-lore-ink/60 dark:text-white/60 leading-relaxed">
          Votre contribution va directement aider Loré Foundation à former des jeunes,
          renforcer des communautés et construire un avenir meilleur pour Haïti.
          Un reçu a été envoyé à votre adresse email si vous l&apos;avez fournie.
        </p>

        <div className="w-full rounded-2xl border border-lore-blue/15 bg-lore-blue/5 dark:border-lore-blue/20 dark:bg-lore-blue/10 px-6 py-4">
          <p className="text-sm font-semibold text-lore-ink dark:text-white flex items-center justify-center gap-2">
            <Heart className="h-4 w-4 text-rose-500" />
            Partagez notre mission
          </p>
          <p className="mt-1 text-xs text-lore-ink/60 dark:text-white/60">
            Parlez de Loré Foundation autour de vous et aidez-nous à toucher encore plus de personnes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link href="/don"
            className="flex-1 flex items-center justify-center gap-2 rounded-full border border-lore-dark/10 px-5 py-3 text-sm font-semibold text-lore-ink hover:bg-lore-dark/5 dark:border-white/10 dark:text-white dark:hover:bg-white/5 transition-colors">
            Faire un autre don
          </Link>
          <Link href="/"
            className="flex-1 flex items-center justify-center gap-2 rounded-full bg-lore-blue px-5 py-3 text-sm font-semibold text-white hover:bg-lore-blue/90 transition-colors">
            Retour à l&apos;accueil
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
