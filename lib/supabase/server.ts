import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Client Supabase côté serveur, lié aux cookies de la requête Next.js.
 * Sert uniquement à savoir QUI est connecté (auth.getUser/getSession) dans
 * les Server Components et Route Handlers de l'espace "/compte".
 *
 * Ce client utilise la clé "anon" (comme le client navigateur) — il ne lit
 * jamais directement les tables applicatives. Pour ça, les routes
 * /api/account/* utilisent ensuite getSupabase() (service_role) une fois
 * l'utilisateur authentifié.
 */
export async function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY manquant(e)."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Appelé depuis un Server Component pur (pas une Route Handler ni
          // une Server Action) : on ne peut pas écrire de cookie ici, mais
          // le middleware s'occupe déjà de rafraîchir la session, donc on
          // peut ignorer l'erreur sans danger.
        }
      },
    },
  });
}
