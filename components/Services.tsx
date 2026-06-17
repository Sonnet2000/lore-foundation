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
    <section id="services" className="bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12 dark:bg-lore-night">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Nos services"
            title="Des solutions complètes pour votre transformation digitale"
            description="De la conception à la mise en ligne, en passant par le branding et la promotion, nous couvrons tous les aspects de votre présence numérique. Cliquez sur un service pour voir un projet associé dans notre portfolio."
          />
        </AnimatedSection>

        <div className="mt-12 grid gap-5 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
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
                  className="group h-full transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${
                        i === 4
                          ? "bg-white/15 text-white"
                          : "bg-lore-dark/5 text-lore-dark dark:bg-white/5 dark:text-lore-emerald-light"
                      }`}
                    >
                      <service.icon className="h-6 w-6" strokeWidth={1.75} />
                    </span>
                    <ArrowUpRight
                      className={`h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 ${
                        i === 4 ? "text-white/60" : "text-lore-ink/30 dark:text-white/30"
                      }`}
                    />
                  </div>
                  <h3
                    className={`font-display text-lg font-bold ${
                      i === 4 ? "text-white" : "text-lore-ink dark:text-white"
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p
                    className={`mt-2 text-sm leading-relaxed ${
                      i === 4 ? "text-white/75" : "text-lore-ink/60 dark:text-white/60"
                    }`}
                  >
                    {service.description}
                  </p>
                  <span
                    className={`mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${
                      i === 4 ? "text-white/80" : "text-lore-emerald dark:text-lore-emerald-light"
                    }`}
                  >
                    Voir un projet
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
