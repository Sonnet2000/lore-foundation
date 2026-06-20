"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Connexion impossible.");
        setLoading(false);
        return;
      }

      const next = searchParams.get("next") || "/admin";
      router.push(next);
      router.refresh();
    } catch {
      setError("Erreur réseau. Réessayez.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-lore-night px-5">
      <div className="w-full max-w-sm rounded-3xl bg-lore-night-surface p-8 shadow-soft ring-1 ring-white/10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-lore-emerald/15 text-lore-emerald-light">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-center font-display text-xl font-bold text-white">
          Panneau d&apos;administration
        </h1>
        <p className="mt-1 text-center text-sm text-white/50">Loré Foundation</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-white/70">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none transition-colors focus:border-lore-emerald"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading || !password}
            className="focus-ring mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-lore-gold px-6 py-3 text-sm font-bold text-lore-dark transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Se connecter
          </button>
        </form>
      </div>
    </main>
  );
}
