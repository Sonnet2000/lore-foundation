import "server-only";
import { getSupabase } from "@/lib/supabase";

export type HeroImage = { url: string };

/**
 * Photos choisies par l'équipe dans Admin → Accueil (site_settings.hero).
 * Seules les images sont utilisées (pas de vidéo en lecture automatique).
 * Retourne [] si rien n'est configuré : le Hero affiche alors sa composition de marque.
 */
export async function getHeroImages(): Promise<HeroImage[]> {
  try {
    const { data } = await getSupabase()
      .from("site_settings")
      .select("value")
      .eq("key", "hero")
      .maybeSingle();
    const media = Array.isArray(data?.value?.media) ? data!.value.media : [];
    return media
      .filter((m: { url?: string; type?: string }) => m?.url && m.type !== "video")
      .map((m: { url: string }) => ({ url: m.url }));
  } catch {
    return [];
  }
}
