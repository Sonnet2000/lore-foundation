import { FileText } from "lucide-react";
import { ANTHEM } from "@/lib/anthem";
import { ANTHEM_PDF } from "@/lib/brand";
import SectionIntro from "./SectionIntro";

/**
 * Hymne officiel — texte de lib/anthem.ts (copié mot pour mot du PDF officiel).
 * Pas de lecteur audio : aucun enregistrement authentique n'a été fourni.
 */
export default function Anthem() {
  return (
    <section id="hymne" aria-labelledby="hymne-title" className="bg-sky-50 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-3xl text-center">
        <SectionIntro id="hymne-title" align="center" label="Notre hymne" title="Notre hymne officiel" />

        {ANTHEM ? (
          <div className="mt-12 space-y-10">
            {ANTHEM.sections.map((section, i) => (
              <section key={i} aria-label={section.label ?? "Conclusion"}>
                {section.label && (
                  <h3
                    className={`font-display text-lg font-semibold ${
                      section.kind === "refrain" || section.kind === "pon" ? "text-gold-700" : "text-royal"
                    }`}
                  >
                    {section.label}
                  </h3>
                )}
                <p
                  className={`${section.label ? "mt-3" : ""} whitespace-pre-line font-display text-xl leading-9 text-navy sm:text-2xl sm:leading-10 ${
                    section.kind === "refrain" || section.kind === "conclusion" ? "italic" : ""
                  }`}
                >
                  {section.lines.join("\n")}
                </p>
              </section>
            ))}
          </div>
        ) : (
          <p className="mx-auto mt-10 max-w-md text-base leading-relaxed text-navy/70">
            Le texte officiel de l’hymne sera publié ici, tel qu’il figure dans le document officiel de Loré Fondation.
          </p>
        )}

        {ANTHEM_PDF.available && (
          <a
            href={ANTHEM_PDF.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-navy focus-royal mt-12 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Lire l’hymne dans le PDF officiel
            <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
          </a>
        )}
      </div>
    </section>
  );
}
