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
  return (
    <div
      className={`flex flex-col gap-4 ${
        align === "center" ? "items-center text-center" : "items-start text-left"
      }`}
    >
      <span
        className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] ${
          light
            ? "bg-white/10 text-lore-gold backdrop-blur-sm"
            : "bg-lore-emerald/10 text-lore-emerald dark:bg-lore-emerald/15 dark:text-lore-emerald-light"
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-lore-gold" />
        {eyebrow}
      </span>
      <h2
        className={`font-display text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl md:text-5xl ${
          light ? "text-white" : "text-lore-ink dark:text-white"
        } ${align === "center" ? "max-w-2xl" : "max-w-xl"}`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`max-w-2xl text-base leading-relaxed sm:text-lg ${
            light ? "text-white/70" : "text-lore-ink/60 dark:text-white/60"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
