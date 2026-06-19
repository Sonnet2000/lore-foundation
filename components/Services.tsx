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

        <div className="mt-14 grid gap-5 sm:mt-18 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {services.map((service, i) => (
            <AnimatedSection key={service.title} delay={(i % 3) * 0.08}>
              <a
                href={service.relatedPortfolioId ? `#portfolio-${service.relatedPortfolioId}` : "#portfolio"}
                className="focus-ring block h-full"
                aria-label={`Voir un projet ${service.title} dans notre portfolio`}
              >
                <TabCard
                  size="sm"
                  variant={i === 4 ? "emerald" : "light"}
                  className="group h-full card-lift"
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${
                        i === 4
                          ? "bg-white/15 text-white ring-white/20"
                          : "bg-lore-dark/5 text-lore-dark ring-lore-dark/8 dark:bg-white/5 dark:text-lore-emerald-light dark:ring-white/8"
                      }`}
                    >
                      <service.icon className="h-6 w-6" strokeWidth={1.75} />
                    </span>
                    <ArrowUpRight
                      className={`h-5 w-5 shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                        i === 4 ? "text-white/50" : "text-lore-ink/25 dark:text-white/25"
                      }`}
                    />
                  </div>
                  <h3
                    className={`font-display text-lg font-bold tracking-tight ${
                      i === 4 ? "text-white" : "text-lore-ink dark:text-white"
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p
                    className={`mt-2 text-sm leading-relaxed ${
                      i === 4 ? "text-white/70" : "text-lore-ink/55 dark:text-white/55"
                    }`}
                  >
                    {service.description}
                  </p>
                  <span
                    className={`mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${
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
