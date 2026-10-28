/**
 * Paroles de l'hymne officiel — copiées mot pour mot depuis « HYMNE OFFICIEL-1.pdf »
 * (public/brand/hymne-officiel.pdf). Ne pas modifier sans validation de l'institution.
 * L'ordre et les intitulés suivent le PDF, y compris les deux diapositives « Refrain final ».
 */
export type AnthemSection = {
  kind: "couplet" | "refrain" | "pon" | "conclusion";
  /** Intitulé tel qu'indiqué dans le PDF ; absent pour le vers de conclusion. */
  label?: string;
  lines: string[];
};

export const ANTHEM: { sections: AnthemSection[] } | null = {
  sections: [
    {
      kind: "couplet",
      label: "Couplet 1",
      lines: [
        "Loré Fondation, lumière du savoir,",
        "Tu nous conduis vers un avenir d’espoir.",
        "Par la science et le numérique,",
        "Nous bâtissons un monde magnifique.",
      ],
    },
    {
      kind: "couplet",
      label: "Couplet 2",
      lines: [
        "Discipline et travail, nos valeurs,",
        "L’excellence et le respect, notre honneur.",
        "Par l’informatique, formons les esprits,",
        "Pour innover, créer et servir notre pays.",
      ],
    },
    {
      kind: "refrain",
      label: "Refrain",
      lines: [
        "Main dans la main, avançons avec fierté,",
        "Le savoir éclaire notre destinée.",
        "Pour Haïti, servons avec dignité,",
        "Unis pour bâtir, apprendre et créer.",
      ],
    },
    {
      kind: "pon",
      label: "Pon",
      lines: [
        "Loré Fondation, nous élevons ton nom,",
        "Fidèles à tes valeurs, à ta mission.",
      ],
    },
    {
      kind: "refrain",
      label: "Refrain final",
      lines: [
        "Savoir et excellence, notre passion,",
        "Pour Haïti, avançons à l’unisson.",
        "Main dans la main, avançons avec fierté,",
        "Le savoir éclaire notre destinée.",
      ],
    },
    {
      kind: "refrain",
      label: "Refrain final",
      lines: [
        "Pour Haïti, servons avec dignité.",
        "Le savoir éclaire notre destinée.",
      ],
    },
    {
      kind: "conclusion",
      lines: ["Pour Haïti, avançons à l’unisson."],
    },
  ],
};
