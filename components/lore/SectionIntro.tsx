type Props = {
  label: string;
  title: string;
  description?: string;
  tone?: "light" | "dark";
  id?: string;
  align?: "left" | "center";
};

/** En-tête de section académique : filet bleu + repère or, titre serif, texte d'appui. */
export default function SectionIntro({ label, title, description, tone = "light", id, align = "left" }: Props) {
  const dark = tone === "dark";
  return (
    <header className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <p className={`flex items-center gap-3 text-sm font-semibold ${align === "center" ? "justify-center" : ""} ${dark ? "text-gold-300" : "text-royal"}`}>
        <span aria-hidden="true" className="flex items-center">
          <span className={`block h-0.5 w-10 ${dark ? "bg-gold-300" : "bg-royal"}`} />
          <span className="-ml-px block h-2 w-2 rotate-45 bg-gold" />
        </span>
        {label}
      </p>
      <h2
        id={id}
        className={`mt-4 font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.75rem] ${
          dark ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 max-w-xl ${align === "center" ? "mx-auto" : ""} text-base leading-relaxed sm:text-lg ${dark ? "text-white/75" : "text-navy/70"}`}>
          {description}
        </p>
      )}
    </header>
  );
}
