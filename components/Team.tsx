import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { getSupabase } from "@/lib/supabase";
import { team as fallbackTeam, socialLinks, type TeamMember } from "@/lib/data";

async function getTeam(): Promise<TeamMember[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) throw error;

    return data.map((row) => ({
      name: row.name,
      role: row.role,
      initials: row.initials,
      photo: row.photo_url || "/logo.png",
      showSocial: row.show_social,
    }));
  } catch {
    return fallbackTeam;
  }
}

export default async function Team() {
  const team = await getTeam();

  return (
    <section id="a-propos" className="bg-lore-cream px-5 py-20 sm:px-8 sm:py-24 lg:px-12 dark:bg-lore-night">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="À propos de nous"
            title="L'équipe derrière Loré Foundation"
            description="Une équipe haïtienne passionnée par la technologie, déterminée à offrir des outils digitaux accessibles, fiables et adaptés aux réalités locales."
          />
        </AnimatedSection>

        <div className="mx-auto mt-12 grid max-w-2xl gap-6 sm:mt-16 sm:grid-cols-2 sm:gap-8">
          {team.map((member, i) => (
            <AnimatedSection key={member.name} delay={i * 0.08}>
              <div className="group flex flex-col items-center rounded-3xl border border-lore-dark/5 bg-white p-6 text-center shadow-card transition-transform duration-300 hover:-translate-y-1.5 sm:p-8 dark:border-0 dark:bg-lore-night-surface dark:shadow-none dark:ring-1 dark:ring-white/5">
                <div className="relative mb-5 h-24 w-24 sm:h-28 sm:w-28">
                  <div className="relative h-full w-full overflow-hidden rounded-full ring-2 ring-lore-emerald/20">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-lore-gold text-xs font-bold text-lore-dark shadow-gold">
                    {member.initials}
                  </span>
                </div>
                <h3 className="font-display text-base font-bold text-lore-ink sm:text-lg dark:text-white">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm text-lore-emerald">{member.role}</p>

                {member.showSocial && (
                  <div className="mt-4 flex items-center gap-3">
                    {socialLinks.map(({ name, Icon, href }) => (
                      <a
                        key={name}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${name} — ${member.name}`}
                        className="focus-ring flex h-9 w-9 items-center justify-center rounded-full bg-lore-dark/5 text-lore-dark/60 transition-colors hover:bg-lore-emerald hover:text-white dark:bg-white/5 dark:text-white/60"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
