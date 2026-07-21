import Image from "next/image";
import Link from "next/link";
import { Smartphone, Download, ShieldCheck, WifiOff, BellRing } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { schoolAppConfig } from "@/lib/school-app-config";

const features = [
  {
    icon: WifiOff,
    title: "Fonctionne hors ligne",
    description: "Consultez vos notes et votre horaire même sans connexion.",
  },
  {
    icon: BellRing,
    title: "Notifications en temps réel",
    description: "Un rappel avant chaque cours, des annonces importantes, directement sur votre téléphone.",
  },
  {
    icon: ShieldCheck,
    title: "Sécurisé",
    description: "Vos données sont protégées — accès réservé aux élèves, parents et personnel de l'école.",
  },
];

export default function AppDownload() {
  return (
    <section
      id="app"
      className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28 lg:px-12 bg-lore-gradient dark:bg-lore-gradient-dark"
    >
      <div
        className="absolute right-0 top-0 h-[480px] w-[480px] pointer-events-none opacity-50"
        style={{
          background: "radial-gradient(ellipse at 100% 0%, rgba(212,175,55,0.18) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-7xl relative grid gap-14 lg:grid-cols-2 lg:items-center">
        <div>
          <AnimatedSection direction="left">
            <SectionHeading
              eyebrow="Application mobile"
              title="L'école Loré dans votre poche"
              description="Élèves, parents et personnel : téléchargez l'application École Loré pour suivre l'horaire, les notes, les paiements et les annonces — où que vous soyez."
              align="left"
              light
            />
          </AnimatedSection>

          <AnimatedSection direction="left" delay={0.1}>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {features.map((f) => (
                <div key={f.title} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <f.icon className="h-6 w-6 text-lore-gold" />
                  <h3 className="mt-3 font-display text-sm font-bold text-white">{f.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/60">{f.description}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection direction="left" delay={0.2}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={schoolAppConfig.apkPath}
                download
                className="btn-gold focus-ring inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-bold text-lore-ink transition-transform hover:scale-[1.02]"
              >
                <Download className="h-5 w-5" />
                Télécharger pour Android
              </a>

              {schoolAppConfig.playStoreUrl ? (
                <Link
                  href={schoolAppConfig.playStoreUrl}
                  className="focus-ring inline-flex items-center gap-2.5 rounded-full border border-white/20 px-7 py-4 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10"
                >
                  <Smartphone className="h-5 w-5" />
                  Disponible sur Google Play
                </Link>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-xs font-medium text-white/40">
                  Bientôt sur Google Play
                </span>
              )}
            </div>

            <p className="mt-4 text-xs text-white/40">
              Version {schoolAppConfig.version} · ~{schoolAppConfig.approxSizeMb} Mo · Android 8 et plus
            </p>
          </AnimatedSection>
        </div>

        <AnimatedSection direction="right" delay={0.15}>
          <div className="relative mx-auto flex max-w-xs items-center justify-center">
            <div
              className="absolute inset-0 -z-10 rounded-[3rem] blur-3xl opacity-40"
              style={{ background: "radial-gradient(circle, rgba(212,175,55,0.5) 0%, transparent 70%)" }}
            />
            <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-6 shadow-premium backdrop-blur-sm">
              <div className="overflow-hidden rounded-[1.75rem] shadow-gold-lg">
                <Image
                  src="/app/lore-school-icon.png"
                  alt="Icône de l'application École Loré"
                  width={280}
                  height={280}
                  className="h-auto w-full"
                />
              </div>
              <p className="mt-5 text-center font-display text-sm font-bold text-white">École Loré</p>
              <p className="text-center text-xs text-white/50">Gestion scolaire</p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
