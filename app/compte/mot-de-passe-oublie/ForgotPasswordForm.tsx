"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });

    setLoading(false);

    if (authError) {
      setError("Une erreur est survenue. Réessayez.");
      return;
    }

    // On affiche toujours le même message de succès, que l'email existe ou
    // non dans la base — c'est une pratique de sécurité standard qui évite
    // de révéler quels emails sont enregistrés.
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <CheckCircle2 className="h-10 w-10 text-lore-emerald-light" />
        <p className="text-white/80">
          Si un compte existe pour <span className="font-semibold text-white">{email}</span>, un email
          de réinitialisation vient d&apos;être envoyé.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white/70">
          Adresse email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            id="email"
            type="email"
            required
            autoFocus
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-white outline-none transition-colors focus:border-lore-emerald"
            placeholder="vous@exemple.com"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading || !email}
        className="focus-ring mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-lore-gold px-6 py-3 text-sm font-bold text-lore-dark transition-transform hover:scale-[1.02] disabled:opacity-50"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Envoyer le lien
      </button>
    </form>
  );
}
