"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/ecole-portail/client";
import { getLoginCooldownSeconds, recordFailedLogin, clearLoginAttempts } from "@/lib/ecole-portail/loginThrottle";

// ─────────────────────────────────────────────────────────────────
// Pou chanje foto/videyo panno gòch la:
//  • FOTO : ranplase HERO_IMAGE_SRC anba a ak chemen yon nouvo imaj
//    nan /public (ex: "/ecole/portail-hero.jpg").
//  • VIDEYO : mete BACKGROUND_VIDEO_SRC ak chemen yon fichye .mp4 nan
//    /public (ex: "/ecole/portail-hero.mp4"). Videyo a pran priyorite
//    sou foto a si l konfigire.
// ─────────────────────────────────────────────────────────────────
const HERO_IMAGE_SRC = "/hero-portrait.jpg";
const BACKGROUND_VIDEO_SRC: string | null = null; // ex: "/ecole/portail-hero.mp4"

export default function EcoleLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [debugDetail, setDebugDetail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("dezaktive") === "1") {
      setError("Kont sa a dezaktive. Kontakte yon administratè.");
    }
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDebugDetail(null);

    const remaining = getLoginCooldownSeconds(email);
    if (remaining > 0) {
      setCooldown(remaining);
      setError(`Twòp tantativ. Tanpri tann ${remaining} segond anvan w eseye ankò.`);
      return;
    }

    setLoading(true);
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError || !data.user) {
      recordFailedLogin(email);
      setLoading(false);
      // Mesaj klè pou moun nan + detay teknik la an ba (itil pou
      // diyagnostike pwoblèm konfigirasyon Supabase san gade konsòl).
      setError("Nou pa t kapab konekte w.");
      setDebugDetail(authError?.message ?? "Erè enkoni.");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_active")
      .eq("id", data.user.id)
      .single();
    setLoading(false);

    if (profileError) {
      setError("Konekte reyisi, men nou pa t kapab li pwofil ou.");
      setDebugDetail(profileError.message);
      return;
    }

    if (profile && profile.is_active === false) {
      await supabase.auth.signOut();
      setError("Kont sa a dezaktive. Kontakte yon administratè.");
      return;
    }

    clearLoginAttempts(email);
    router.push("/ecole/portail/dashboard");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* ── Panno gòch : imaj/videyo + mesaj byenveni ─────────────── */}
      <div className="relative hidden overflow-hidden bg-lore-night lg:block">
        {BACKGROUND_VIDEO_SRC ? (
          <video
            src={BACKGROUND_VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Image src={HERO_IMAGE_SRC} alt="" fill priority className="object-cover" />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(3,13,24,0.35) 0%, rgba(3,13,24,0.55) 55%, rgba(3,13,24,0.92) 100%)",
          }}
        />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Image src="/logo.png" alt="Loré Foundation" width={48} height={48} className="rounded-lg" />
          <div>
            <p className="font-display text-3xl font-bold leading-tight text-white">
              Bienvenue sur le portail de l&apos;École
            </p>
            <p className="mt-3 max-w-sm text-sm text-white/70">
              Cours, notes, présences, quiz et certificats — le même compte
              que sur l&apos;application mobile École Loré.
            </p>
          </div>
        </div>
      </div>

      {/* ── Panno dwat : fòm koneksyon an ─────────────────────────── */}
      <div className="flex items-center justify-center bg-lore-cream px-6 py-16 dark:bg-lore-night">
        <div className="w-full max-w-sm">
          <Image src="/app/lore-school-icon.png" alt="" width={56} height={56} className="mb-6 rounded-2xl lg:hidden" />

          <h1 className="font-display text-2xl font-bold text-lore-ink dark:text-white">Connexion</h1>
          <p className="mt-1 text-sm text-lore-ink/50 dark:text-white/50">
            Utilisez le même email et mot de passe que l&apos;application mobile.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-lore-ink dark:text-white/80">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-lore-ink/10 bg-white px-4 py-3 text-sm text-lore-ink shadow-sm transition focus:border-lore-gold focus:outline-none focus:ring-2 focus:ring-lore-gold/30 dark:border-white/10 dark:bg-lore-night-surface dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-lore-ink dark:text-white/80">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-lore-ink/10 bg-white px-4 py-3 text-sm text-lore-ink shadow-sm transition focus:border-lore-gold focus:outline-none focus:ring-2 focus:ring-lore-gold/30 dark:border-white/10 dark:bg-lore-night-surface dark:text-white"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
                <p className="font-medium">{error}</p>
                {debugDetail && <p className="mt-0.5 text-xs opacity-70">{debugDetail}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className="btn-gold focus-ring w-full rounded-full py-3 text-sm font-bold transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? "Connexion..." : cooldown > 0 ? `Patienter ${cooldown}s...` : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
