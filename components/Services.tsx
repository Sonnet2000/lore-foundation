import { ArrowUpRight, type LucideIcon } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import TabCard from "@/components/ui/TabCard";
import { getSupabase } from "@/lib/supabase";
import { resolveIcon } from "@/lib/icon-map";
import { services as fallbackServices } from "@/lib/data";

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

export default async function Services() {
  const services = await getServices();

  return (
    <section
      id="services"
      className="relative px-5 py-20 sm:px-8 sm:py-28 lg:px-12 bg-white dark:bg-lore-night overflow-hidden"
    >
      {/* Decorative background radial */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 h-[500px] w-[500px] pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 100% 50%, rgba(212,175,55,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-7xl relative">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Nos Programmes"
            title="Des actions concrètes pour changer des vies"
            description="Chaque programme de Loré Foundation est pensé pour répondre à un besoin réel, former des compétences durables et créer un impact mesurable dans les communautés haïtiennes."
          />
        </AnimatedSection>

        <div className="mt-10 grid grid-cols-2 gap-3.5 sm:mt-18 sm:gap-6 lg:grid-cols-3">
          {services.map((service, i) => (
            <AnimatedSection key={service.title} delay={(i % 3) * 0.08}>
              <a
                href={service.relatedPortfolioId ? `#portfolio-${service.relatedPortfolioId}` : "#portfolio"}
                className="focus-ring block h-full"
                aria-label={`Voir un projet ${service.title} dans notre portfolio`}
              >
                <TabCard
                  size="sm"
                  compact
                  variant={i === 4 ? "emerald" : "light"}
                  className="group h-full card-lift"
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`mb-2.5 inline-flex h-9 w-9 items-center justify-center rounded-xl ring-1 sm:mb-4 sm:h-12 sm:w-12 ${
                        i === 4
                          ? "bg-white/15 text-white ring-white/20"
                          : "bg-lore-dark/5 text-lore-dark ring-lore-dark/8 dark:bg-white/5 dark:text-lore-emerald-light dark:ring-white/8"
                      }`}
                    >
                      <service.icon className="h-4.5 w-4.5 sm:h-6 sm:w-6" strokeWidth={1.75} />
                    </span>
                    <ArrowUpRight
                      className={`h-3.5 w-3.5 shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-5 sm:w-5 ${
                        i === 4 ? "text-white/50" : "text-lore-ink/25 dark:text-white/25"
                      }`}
                    />
                  </div>
                  <h3
                    className={`font-display text-sm font-bold tracking-tight sm:text-lg ${
                      i === 4 ? "text-white" : "text-lore-ink dark:text-white"
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p
                    className={`mt-1.5 line-clamp-3 text-xs leading-relaxed sm:mt-2 sm:line-clamp-none sm:text-sm ${
                      i === 4 ? "text-white/70" : "text-lore-ink/55 dark:text-white/55"
                    }`}
                  >
                    {service.description}
                  </p>
                  <span
                    className={`mt-3 inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest sm:mt-5 sm:text-xs ${
                      i === 4 ? "text-white/75" : "text-lore-emerald dark:text-lore-emerald-light"
                    }`}
                  >
                    Voir un projet →
                  </span>
                </TabCard>
              </a>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
