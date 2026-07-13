import Link from "next/link";
import Image from "next/image";
import { Check, Star } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { listPublishedPremiumServices } from "@/lib/premium-services";
import { resolveIcon } from "@/lib/icon-map";

export default async function PremiumServices() {
  const services = await listPublishedPremiumServices();
  if (services.length === 0) return null;

  return (
    <section className="relative px-5 py-20 sm:px-8 sm:py-28 lg:px-12 bg-white dark:bg-lore-night overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Services Premium"
            title="Des services prêts à commander"
            description="Choisissez un service, payez via Binance, MonCash, NatCash, Sogebank ou carte Visa/Mastercard, et notre équipe s'occupe du reste."
          />
        </AnimatedSection>

        <div className="mt-14 grid gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = resolveIcon(s.icon);
            return (
              <div
                key={s.id}
                className={`card-lift relative flex flex-col gap-4 rounded-3xl border p-6 ${
                  s.is_featured
                    ? "border-lore-gold/30 bg-gradient-to-br from-lore-gold/10 to-transparent dark:from-lore-gold/15"
                    : "border-lore-dark/5 bg-lore-cream dark:border-white/5 dark:bg-lore-night-card"
                }`}
              >
                {s.is_featured && (
                  <span className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-lore-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-lore-dark">
                    <Star className="h-2.5 w-2.5" />Populaire
                  </span>
                )}

                {s.image_url && (
                  <div className="relative -mx-6 -mt-6 h-40 overflow-hidden rounded-t-3xl">
                    <Image src={s.image_url} alt={s.title} fill className="object-cover" unoptimized />
                  </div>
                )}

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lore-gold/10 text-lore-gold-dark dark:text-lore-gold-light">
                  <Icon className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="font-display text-lg font-bold text-lore-ink dark:text-white">{s.title}</h3>
                  {s.price && <p className="mt-1 text-sm font-semibold text-lore-blue">{s.price}</p>}
                </div>

                {s.description && (
                  <p className="text-sm text-lore-ink/60 dark:text-white/60">{s.description}</p>
                )}

                {s.features.length > 0 && (
                  <ul className="flex flex-col gap-2">
                    {s.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-lore-ink/70 dark:text-white/70">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lore-emerald" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                <Link
                  href={`/paiement?subject=${encodeURIComponent(s.title)}${s.price ? `&amount=${encodeURIComponent(s.price)}` : ""}`}
                  className="focus-ring mt-auto inline-flex items-center justify-center gap-1.5 rounded-full bg-lore-gold px-5 py-2.5 text-sm font-bold text-lore-dark transition-transform hover:scale-[1.02]"
                >
                  Commander
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
