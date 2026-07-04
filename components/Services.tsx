import { ArrowUpRight, type LucideIcon } from "lucide-react";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { getSupabase } from "@/lib/supabase";
import { resolveIcon } from "@/lib/icon-map";
import { services as fallbackServices, portfolio as fallbackPortfolio } from "@/lib/data";

type ServiceView = {
  icon: LucideIcon;
  title: string;
  description: string;
  relatedPortfolioId: string | null;
};

async function getServices(): Promise<ServiceView[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) throw error;

    return data.map((row) => ({
      icon: resolveIcon(row.icon),
      title: row.title,
      description: row.description,
      relatedPortfolioId: row.related_portfolio_id,
    }));
  } catch {
    return fallbackServices.map((s) => ({
      icon: s.icon,
      title: s.title,
      description: s.description,
      relatedPortfolioId: s.relatedPortfolioId,
    }));
  }
}

/** Kouvèti pòtfolyo yo — sèvi kòm "vizyèl" nan chak kat sèvis, olye de fo mockup. */
async function getPortfolioCovers(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("portfolio_items").select("id, images, media");
    if (error || !data) throw error;
    for (const row of data) {
      const media = Array.isArray(row.media) && row.media.length > 0 ? row.media : (row.images ?? []).map((u: string) => ({ url: u }));
      if (media[0]?.url) map.set(row.id, media[0].url);
    }
  } catch {
    for (const item of fallbackPortfolio) {
      if (item.images?.[0]) map.set(item.id, item.images[0]);
    }
  }
  return map;
}

export default async function Services() {
  const [services, covers] = await Promise.all([getServices(), getPortfolioCovers()]);

  return (
    <section
      id="services"
      className="relative px-5 py-20 sm:px-8 sm:py-28 lg:px-12 bg-white dark:bg-lore-night overflow-hidden"
    >
      <div className="mx-auto max-w-7xl relative">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Nos Programmes"
            title="Des actions concrètes pour changer des vies"
            description="Chaque programme de Loré Foundation est pensé pour répondre à un besoin réel, former des compétences durables et créer un impact mesurable dans les communautés haïtiennes."
          />
        </AnimatedSection>

        {/* Panno fonse — kontenè "ledger" pou tout kat sèvis yo */}
        <AnimatedSection delay={0.1}>
          <div
            className="relative mt-10 overflow-hidden rounded-[28px] px-4 py-8 sm:mt-16 sm:rounded-[36px] sm:px-8 sm:py-14"
            style={{ background: "linear-gradient(160deg, #031a4a 0%, #052a6e 55%, #043C9E 100%)" }}
          >
            <div
              className="hero-grid absolute inset-0 pointer-events-none opacity-40"
              aria-hidden="true"
            />

            <div className="relative grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {services.map((service, i) => {
                const cover = service.relatedPortfolioId ? covers.get(service.relatedPortfolioId) : null;
                const highlighted = i === 1;

                return (
                  <AnimatedSection key={service.title} delay={(i % 3) * 0.08}>
                    <a
                      href={service.relatedPortfolioId ? `#portfolio-${service.relatedPortfolioId}` : "#portfolio"}
                      className="focus-ring group relative block h-full"
                      aria-label={`Voir un projet ${service.title} dans notre portfolio`}
                    >
                      <div
                        className={`relative flex h-full flex-col overflow-visible rounded-2xl p-3.5 pb-8 transition-transform duration-300 group-hover:-translate-y-1.5 sm:rounded-3xl sm:p-5 sm:pb-11 ${
                          highlighted ? "bg-lore-gold" : "bg-white/8 backdrop-blur-sm ring-1 ring-white/10"
                        }`}
                      >
                        <h3
                          className={`font-display text-xs font-bold tracking-tight sm:text-lg ${
                            highlighted ? "text-lore-darker" : "text-white"
                          }`}
                        >
                          {service.title}
                        </h3>
                        <p
                          className={`mt-1 line-clamp-2 text-[10px] leading-snug sm:mt-1.5 sm:line-clamp-2 sm:text-sm ${
                            highlighted ? "text-lore-darker/70" : "text-white/55"
                          }`}
                        >
                          {service.description}
                        </p>

                        {/* Vizyèl la — foto vrè pwojè a, yon ti jan panche pou dinamis */}
                        <div className="relative mt-3 aspect-[4/3] w-full sm:mt-4">
                          <div
                            className={`absolute inset-0 -rotate-3 rounded-xl sm:rounded-2xl ${
                              highlighted ? "bg-lore-darker/15" : "bg-white/10"
                            }`}
                          />
                          <div className="absolute inset-0 overflow-hidden rounded-xl shadow-lg sm:rounded-2xl">
                            {cover ? (
                              <Image
                                src={cover}
                                alt={service.title}
                                fill
                                sizes="(min-width: 1024px) 33vw, 50vw"
                                className="object-cover"
                              />
                            ) : (
                              <div
                                className={`flex h-full w-full items-center justify-center ${
                                  highlighted ? "bg-lore-darker/10" : "bg-white/5"
                                }`}
                              >
                                <service.icon
                                  className={`h-8 w-8 sm:h-10 sm:w-10 ${highlighted ? "text-lore-darker/40" : "text-white/25"}`}
                                  strokeWidth={1.25}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Bouton flèch won — chevauche kwen ba-dwat kat la */}
                      <span
                        className={`absolute -bottom-3.5 -right-2.5 flex h-9 w-9 items-center justify-center rounded-full shadow-lg ring-4 transition-transform duration-300 group-hover:scale-110 sm:-bottom-5 sm:-right-3 sm:h-12 sm:w-12 sm:ring-[6px] ${
                          highlighted
                            ? "bg-lore-darker text-lore-gold ring-lore-gold"
                            : "bg-lore-gold text-lore-darker ring-[#031a4a]"
                        }`}
                      >
                        <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
                      </span>
                    </a>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
