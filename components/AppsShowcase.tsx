import Image from "next/image";
import { AppWindow } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import SmartAppDownloadButton from "@/components/SmartAppDownloadButton";
import { listPublishedApps } from "@/lib/apps-catalog";

export default async function AppsShowcase() {
  const apps = await listPublishedApps();
  if (apps.length === 0) return null;

  return (
    <section
      id="applications"
      className="relative overflow-hidden bg-lore-cream px-5 py-20 dark:bg-lore-night sm:px-8 sm:py-28 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Nos applications"
          title="Des logiciels pensés pour vous"
          description="Découvrez toutes les applications développées par Loré Foundation. Le site détecte automatiquement votre appareil pour vous proposer le bon fichier — .exe sur ordinateur, .apk sur téléphone."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app, i) => (
            <AnimatedSection key={app.id} direction="up" delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-3xl border border-lore-dark/5 bg-white p-6 shadow-premium dark:border-white/5 dark:bg-lore-night-surface">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-lore-gold/10 shadow-gold-lg">
                    {app.icon_url ? (
                      <Image src={app.icon_url} alt={app.name} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lore-gold-dark">
                        <AppWindow className="h-7 w-7" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-lore-ink dark:text-white">{app.name}</h3>
                    {app.category && (
                      <span className="text-xs font-semibold uppercase tracking-wide text-lore-emerald dark:text-lore-emerald-light">
                        {app.category}
                      </span>
                    )}
                  </div>
                  {app.is_featured && (
                    <span className="ml-auto rounded-full bg-lore-gold/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-lore-gold-dark">
                      Populaire
                    </span>
                  )}
                </div>

                {app.description && (
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-lore-ink/60 dark:text-white/60">
                    {app.description}
                  </p>
                )}

                <div className="mt-6 text-lore-ink dark:text-white">
                  <SmartAppDownloadButton
                    exeUrl={app.exe_url}
                    exeVersion={app.exe_version}
                    exeSizeMb={app.exe_size_mb}
                    apkUrl={app.apk_url}
                    apkVersion={app.apk_version}
                    apkSizeMb={app.apk_size_mb}
                    playstoreUrl={app.playstore_url}
                    websiteUrl={app.website_url}
                  />
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
