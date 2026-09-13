"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/ecole-portail/client";
import { getLoginCooldownSeconds, recordFailedLogin, clearLoginAttempts } from "@/lib/ecole-portail/loginThrottle";

export default function EcoleLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Li paramèt URL la SAN `useSearchParams()` (evite mande yon
  // "Suspense boundary" nan Next.js App Router pou yon senp mesaj).
  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("dezaktive") === "1") {
      setError("Kont sa a dezaktive. Kontakte yon administratè.");
    }
  }, []);

  // Konte a rebou an tan reyèl pou moun nan wè egzakteman konbyen tan
  // ki rete, olye pou l eseye ankò e ankò san l pa konprann poukisa.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

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
      setError("Imèl oswa modpas la pa kòrèk.");
      return;
    }

    // Menm kont ak app mobil la — verifye kont lan aktif (is_active)
    const { data: profile } = await supabase.from("profiles").select("is_active").eq("id", data.user.id).single();
    setLoading(false);

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
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-[#0B1F3B]">Konekte</h1>
        <p className="mt-1 text-sm text-slate-500">
          Menm kont ke app mobil Loré School la — imèl ak modpas.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Imèl</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#1E4FD8] focus:outline-none focus:ring-1 focus:ring-[#1E4FD8]"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Modpas</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#1E4FD8] focus:outline-none focus:ring-1 focus:ring-[#1E4FD8]"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading || cooldown > 0}
            className="w-full rounded-lg bg-[#1E4FD8] py-2 text-sm font-medium text-white hover:bg-[#173da8] disabled:opacity-60"
          >
            {loading ? "Ap konekte..." : cooldown > 0 ? `Tann ${cooldown}s...` : "Konekte"}
          </button>
        </form>
      </div>
    </main>
  );
}
