"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail, Lock, User, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import GoogleButton from "@/components/account/GoogleButton";

function passwordStrength(pw: string) {
  if (pw.length === 0) return { label: "", pct: 0, color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { label: "Trop faible", color: "bg-red-500" },
    { label: "Faible", color: "bg-red-400" },
    { label: "Correct", color: "bg-yellow-400" },
    { label: "Bon", color: "bg-lore-emerald-light" },
    { label: "Excellent", color: "bg-green-400" },
  ];
  const level = levels[score];
  return { label: level.label, pct: (score / 4) * 100, color: level.color };
}

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const strength = passwordStrength(password);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setLoading(true);
    const nextParam = searchParams.get("next") || "/compte/tableau-de-bord";
    const supabase = createSupabaseBrowserClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextParam)}`,
      },
    });

    if (authError) {
      setError(
        authError.message.includes("already registered") || authError.message.includes("User already")
          ? "Un compte existe déjà avec cet email."
          : "Inscription impossible. Réessayez."
      );
      setLoading(false);
      return;
    }

    // Si la confirmation par email est désactivée dans Supabase, une session
    // est retournée immédiatement : on peut aller droit au tableau de bord.
    if (data.session) {
      router.push(searchParams.get("next") || "/compte/tableau-de-bord");
      router.refresh();
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <CheckCircle2 className="h-10 w-10 text-lore-emerald-light" />
        <p className="text-white/80">
          Un email de confirmation a été envoyé à <span className="font-semibold text-white">{email}</span>.
        </p>
        <p className="text-sm text-white/50">Cliquez sur le lien reçu pour activer votre compte.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <GoogleButton label="S'inscrire avec Google" next={searchParams.get("next") || undefined} />

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs font-medium uppercase tracking-wide text-white/35">ou</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-white/70">
            Nom complet
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              id="fullName"
              type="text"
              required
              autoComplete="name"
              autoFocus
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-white outline-none transition-colors focus:border-lore-emerald"
              placeholder="Jean Baptiste"
            />
          </div>
        </div>

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
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-white outline-none transition-colors focus:border-lore-emerald"
              placeholder="vous@exemple.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-white/70">
            Mot de passe
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-white outline-none transition-colors focus:border-lore-emerald"
              placeholder="8 caractères minimum"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {password.length > 0 && (
            <div className="mt-2">
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-all ${strength.color}`}
                  style={{ width: `${strength.pct}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-white/40">{strength.label}</p>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading || !fullName || !email || !password}
          className="focus-ring mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-lore-gold px-6 py-3 text-sm font-bold text-lore-dark transition-transform hover:scale-[1.02] disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Créer mon compte
        </button>

        <p className="text-center text-xs text-white/35">
          En créant un compte, vous acceptez d&apos;être contacté par Loré Foundation au sujet de votre activité (cours, séminaires).
        </p>
      </form>
    </div>
  );
}
