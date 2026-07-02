import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Route de redirection OAuth/email : jamais de pré-génération au build.
export const dynamic = "force-dynamic";

/**
 * Route de retour après :
 *  - un clic sur "Continuer avec Google" (OAuth),
 *  - un clic sur le lien de confirmation d'inscription envoyé par email,
 *  - un clic sur le lien "mot de passe oublié" (type=recovery).
 *
 * Supabase redirige ici avec un `code` à échanger contre une session.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/compte/tableau-de-bord";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Lien de réinitialisation de mot de passe : on envoie directement
      // vers la page où choisir un nouveau mot de passe.
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/compte/nouveau-mot-de-passe`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  const errorUrl = new URL("/compte/connexion", origin);
  errorUrl.searchParams.set("erreur", "lien-invalide");
  return NextResponse.redirect(errorUrl);
}
