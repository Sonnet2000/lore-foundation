type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}: SectionHeadingProps) {
  const center = align === "center";
  return (
    <div className={`flex flex-col gap-4 ${center ? "items-center text-center" : "items-start text-left"}`}>
      {/* Etikèt an fòm grenn */}
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] ${
          light
            ? "bg-white/10 text-lore-sun ring-1 ring-white/15"
            : "bg-lore-mint text-lore-emerald-dark dark:bg-lore-emerald/15 dark:text-lore-emerald-light"
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
        {eyebrow}
      </span>

      <h2
        className={`font-display text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-4xl md:text-[2.9rem] ${
          center ? "max-w-3xl" : "max-w-2xl"
        } ${light ? "text-white" : "text-lore-ink dark:text-white"}`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`max-w-2xl text-base leading-relaxed sm:text-lg ${
            light ? "text-white/65" : "text-lore-ink/60 dark:text-white/55"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
