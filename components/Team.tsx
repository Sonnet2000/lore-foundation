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
    <section
      id="a-propos"
      className="relative px-5 py-20 sm:px-8 sm:py-28 lg:px-12 bg-white dark:bg-lore-night overflow-hidden"
    >
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(10,61,98,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="mx-auto max-w-7xl relative">
        <AnimatedSection>
          <SectionHeading
            eyebrow="À propos de nous"
            title="L'équipe derrière Loré Foundation"
            description="Une équipe haïtienne passionnée par la technologie, déterminée à offrir des outils digitaux accessibles, fiables et adaptés aux réalités locales."
          />
        </AnimatedSection>

        <div className="mx-auto mt-14 grid max-w-2xl gap-7 sm:mt-18 sm:grid-cols-2 sm:gap-8">
          {team.map((member, i) => (
            <AnimatedSection key={member.name} delay={i * 0.1}>
              <div className="group flex flex-col items-center rounded-3xl border border-lore-dark/6 bg-lore-cream p-8 text-center card-lift relative overflow-hidden dark:border-0 dark:bg-lore-night-card dark:ring-1 dark:ring-white/6">
                {/* Gold top line */}
                <div
                  className="absolute top-0 left-8 right-8 h-px"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)" }}
                />

                {/* Avatar */}
                <div className="relative mb-6 h-28 w-28 sm:h-32 sm:w-32">
                  {/* Outer ring with gold gradient */}
                  <div
                    className="absolute inset-0 rounded-full p-0.5"
                    style={{ background: "linear-gradient(135deg, #f2d272, #d4af37, #0f98ff)" }}
                  >
                    <div className="h-full w-full rounded-full bg-lore-cream dark:bg-lore-night-card" />
                  </div>
                  <div className="absolute inset-1 overflow-hidden rounded-full">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  {/* Initials badge */}
                  <span
                    className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full font-display text-xs font-bold text-lore-darker shadow-gold"
                    style={{ background: "linear-gradient(135deg, #f2d272, #d4af37)" }}
                  >
                    {member.initials}
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-lore-ink dark:text-white">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-lore-emerald dark:text-lore-emerald-light">
                  {member.role}
                </p>

                {member.showSocial && (
                  <div className="mt-5 flex items-center gap-2.5">
                    {socialLinks.map(({ name, Icon, href }) => (
                      <a
                        key={name}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${name} — ${member.name}`}
                        className="focus-ring flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-lore-dark/10 text-lore-dark/55 transition-all hover:bg-lore-emerald hover:ring-lore-emerald hover:text-white dark:ring-white/10 dark:text-white/55"
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
