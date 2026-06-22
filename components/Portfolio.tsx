import { getSupabase } from "@/lib/supabase";
import { portfolio as fallbackPortfolio, type PortfolioItem } from "@/lib/data";
import PortfolioClient from "@/components/PortfolioClient";

async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) return fallbackPortfolio;

    return data.map((row) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      description: row.description,
      images: row.images ?? [],
      media: Array.isArray(row.media) && row.media.length > 0
        ? row.media
        : (row.images ?? []).map((url: string) => ({ url, type: "image" as const })),
    }));
  } catch {
    // Supabase not configured yet — show the built-in placeholder content
    // so the site still works before the admin panel is set up.
    return fallbackPortfolio;
  }
}

export default async function Portfolio() {
  const items = await getPortfolioItems();
  return <PortfolioClient items={items} />;
}
