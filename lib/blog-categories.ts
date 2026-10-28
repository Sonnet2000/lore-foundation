import type { BlogCategory } from "@/app/admin/_components/types";

/** Catégories du blog (identiques à la contrainte de la table blog_posts). */
export const BLOG_CATEGORIES: { id: BlogCategory; label: string }[] = [
  { id: "actualites", label: "Actualités" },
  { id: "education", label: "Éducation" },
  { id: "technologie", label: "Technologie" },
  { id: "ia", label: "Intelligence artificielle" },
  { id: "entrepreneuriat", label: "Entrepreneuriat" },
  { id: "leadership", label: "Leadership" },
  { id: "activites", label: "Activités de Loré Fondation" },
];

export function categoryLabel(id: string): string {
  return BLOG_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

/** Normalise pour une recherche insensible aux accents et à la casse. */
export function normalize(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
