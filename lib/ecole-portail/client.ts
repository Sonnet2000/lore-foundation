import { createBrowserClient } from "@supabase/ssr";

// PIVOTE (Estrateji B) : sa a se LI MENM pwojè Supabase ke app mobil
// lore-school-app la itilize. Pran menm VALÈ ki nan EXPO_PUBLIC_SUPABASE_URL
// / EXPO_PUBLIC_SUPABASE_ANON_KEY nan app mobil la, men mete yo isit la
// anba yon non DIFERAN (NEXT_PUBLIC_ECOLE_...) — sit lorefondation.com
// deja gen SE VARYAB "NEXT_PUBLIC_SUPABASE_URL" pou yon LÒT pwojè
// Supabase (sa ki jere Sponsors, elatriye). Si nou te itilize menm non
// an, platfòm /ecole a ta konekte sou MOVE pwojè a san montre erè.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_ECOLE_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_ECOLE_SUPABASE_ANON_KEY!
  );
}
