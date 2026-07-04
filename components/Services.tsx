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
      {/* Lueur radial dous — pwofondè san lou */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 h-[500px] w-[500px] pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 100% 50%, rgba(212,175,55,0.1) 0%, transparent 60%)",
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

        <div className="mt-10 grid grid-cols-2 gap-4 sm:mt-18 sm:gap-7 lg:grid-cols-3">
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
                  <span
                    className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl ring-1 sm:mb-5 sm:h-14 sm:w-14 ${
                      i === 4
                        ? "bg-white/15 text-white ring-white/20"
                        : "bg-lore-emerald/8 text-lore-emerald ring-lore-emerald/15 dark:bg-white/5 dark:text-lore-emerald-light dark:ring-white/8"
                    }`}
                  >
                    <service.icon className="h-5 w-5 sm:h-7 sm:w-7" strokeWidth={1.75} />
                  </span>

                  <h3
                    className={`font-display text-sm font-bold leading-snug tracking-tight sm:text-lg ${
                      i === 4 ? "text-white" : "text-lore-ink dark:text-white"
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p
                    className={`mt-2 line-clamp-3 text-xs leading-relaxed sm:mt-2.5 sm:line-clamp-none sm:text-sm ${
                      i === 4 ? "text-white/70" : "text-lore-ink/55 dark:text-white/55"
                    }`}
                  >
                    {service.description}
                  </p>

                  <span
                    className={`mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest sm:mt-6 sm:text-xs ${
                      i === 4 ? "text-white/75" : "text-lore-emerald dark:text-lore-emerald-light"
                    }`}
                  >
                    Voir un projet
                    <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-3.5 sm:w-3.5" />
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
