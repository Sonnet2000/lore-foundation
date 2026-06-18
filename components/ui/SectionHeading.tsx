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
      className={`flex flex-col gap-5 ${
        align === "center" ? "items-center text-center" : "items-start text-left"
      }`}
    >
      {/* Eyebrow with animated gold line */}
      <div className={`flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
        <span
          className="block h-px w-8 origin-left"
          style={{
            background: light
              ? "linear-gradient(90deg, rgba(212,175,55,0.8), rgba(212,175,55,0.2))"
              : "linear-gradient(90deg, #d4af37, rgba(212,175,55,0.2))",
          }}
        />
        <span
          className={`text-xs font-bold uppercase tracking-[0.25em] ${
            light ? "text-lore-gold" : "text-lore-emerald dark:text-lore-emerald-light"
          }`}
        >
          {eyebrow}
        </span>
        <span
          className="block h-px w-8 origin-right"
          style={{
            background: light
              ? "linear-gradient(90deg, rgba(212,175,55,0.2), rgba(212,175,55,0.8))"
              : "linear-gradient(90deg, rgba(212,175,55,0.2), #d4af37)",
          }}
        />
      </div>

      {/* Title */}
      <h2
        className={`font-display font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-4xl md:text-5xl ${
          align === "center" ? "max-w-2xl text-3xl" : "max-w-xl text-3xl"
        } ${light ? "text-white" : "text-lore-ink dark:text-white"}`}
      >
        {title}
      </h2>

      {/* Optional underline accent */}
      {align === "center" && (
        <span
          className="block h-0.5 w-16 rounded-full"
          style={{ background: "linear-gradient(90deg, #d4af37, #f2d272, #d4af37)" }}
        />
      )}

      {description && (
        <p
          className={`max-w-2xl text-base leading-relaxed sm:text-lg ${
            light ? "text-white/65" : "text-lore-ink/55 dark:text-white/55"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
