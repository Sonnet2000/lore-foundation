"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Supabase utilisé côté navigateur, uniquement pour l'authentification
 * (inscription, connexion, OAuth Google, déconnexion, réinitialisation de
 * mot de passe). Il utilise la clé publique "anon", ce qui est sûr : cette
 * clé ne donne accès à aucune table applicative (RLS bloque tout), elle sert
 * seulement à parler à l'API d'authentification de Supabase.
 *
 * Pour lire/écrire les données du compte (profil, dons, inscriptions…),
 * on passe toujours par nos routes /api/account/* côté serveur, qui elles
 * utilisent la clé service_role — voir lib/supabase.ts.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY manquant(e)."
    );
  }

  return createBrowserClient(url, anonKey);
}
