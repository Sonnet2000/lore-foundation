/**
 * Source unique de vérité pour l'identité Loré Fondation.
 * Le nom officiel s'écrit toujours « Loré Fondation » (jamais « Foundation »).
 */
import {
  BookOpen,
  ClipboardCheck,
  LayoutDashboard,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

export const BRAND = {
  name: "Loré Fondation",
  descriptor: "Centre de formation en informatique",
  tagline: "L’excellence au cœur de l’impact",
  mottos: ["Lumière du savoir", "Pour Haïti, servons avec dignité."],
  website: "https://lorefondation.com",
} as const;

export type Platform = {
  id: "library" | "examen" | "app" | "inscription";
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: LucideIcon;
};

/** Les quatre plateformes officielles — URLs exactes, ne pas modifier sans validation. */
export const PLATFORMS: Platform[] = [
  {
    id: "library",
    title: "Bibliothèque numérique",
    description: "Consultez les ressources de lecture et d’étude de la communauté Loré Fondation.",
    cta: "Ouvrir la bibliothèque",
    href: "https://library.lorefondation.com",
    icon: BookOpen,
  },
  {
    id: "examen",
    title: "Examens en ligne",
    description: "Passez vos évaluations sur la plateforme d’examens officielle.",
    cta: "Accéder aux examens",
    href: "https://examen.lorefondation.com",
    icon: ClipboardCheck,
  },
  {
    id: "app",
    title: "Espace étudiant",
    description: "Retrouvez votre parcours et vos activités dans l’application étudiante.",
    cta: "Entrer dans l’espace étudiant",
    href: "https://app.lorefondation.com",
    icon: LayoutDashboard,
  },
  {
    id: "inscription",
    title: "Inscription en ligne",
    description: "Faites votre demande d’inscription en quelques étapes, depuis votre téléphone.",
    cta: "Commencer l’inscription",
    href: "https://inscription.lorefondation.com",
    icon: UserPlus,
  },
];

export const REGISTER_URL = "https://inscription.lorefondation.com";

/**
 * ── Actifs officiels ───────────────────────────────────────────────────────
 * Drapeau : public/brand/drapeau-lore-fondation.png (original conservé dans
 * drapeau-lore-fondation-original.png). Hymne : public/brand/hymne-officiel.pdf.
 */
export const FLAG = {
  available: true,
  // Recadrage (sans déformation) de l'original : 896 × 1024 px, mât + drapeau.
  src: "/brand/drapeau-lore-fondation.png",
  width: 896,
  height: 1024,
  alt: "Drapeau officiel de Loré Fondation",
};

export const ANTHEM_PDF = {
  available: true,
  href: "/brand/hymne-officiel.pdf",
};
