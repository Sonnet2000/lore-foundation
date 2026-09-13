"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/ecole-portail/client";

export default function CreateAccountPage() {
  const supabase = createClient();
  const [role, setRole] = useState<string | null>(null);
  const [kind, setKind] = useState<"student" | "staff">("student");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    staff_role: "sekretè",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ email: string; password: string; matricule?: string | null } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      setRole(profile?.role ?? null);
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const action = kind === "student" ? "create_student" : "create_staff";
    const payload =
      kind === "student"
        ? { full_name: form.full_name, email: form.email || undefined, phone: form.phone || undefined }
        : { full_name: form.full_name, email: form.email, staff_role: form.staff_role, role: "staff" };

    // Rele DIRÈKTEMAN Edge Function ki DEJA egziste nan app mobil la —
    // pa gen okenn dezyèm lojik kreyasyon kont apa isit la.
    const { data, error: fnError } = await supabase.functions.invoke("admin-actions", {
      body: { action, payload },
    });

    setLoading(false);

    if (fnError || !data?.ok) {
      setError(data?.error ?? fnError?.message ?? "Erè pandan kreyasyon kont lan.");
      return;
    }

    setResult({ email: data.email, password: data.password, matricule: data.matricule });
    setForm({ full_name: "", email: "", phone: "", staff_role: "sekretè" });
  }

  if (role !== "admin" && role !== "staff") {
    return <p className="p-10 text-sm text-slate-400">Chajman...</p>;
  }

  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-[#0B1F3B]">Kreye yon kont</h1>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setKind("student")}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${kind === "student" ? "bg-[#1E4FD8] text-white" : "bg-slate-100 text-slate-600"}`}
        >
          Etidyan
        </button>
        {role === "admin" && (
          <button
            onClick={() => setKind("staff")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${kind === "staff" ? "bg-[#1E4FD8] text-white" : "bg-slate-100 text-slate-600"}`}
          >
            Anplwaye
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 rounded-xl bg-white p-5 shadow-sm">
        <input
          placeholder="Non konplè"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          type="email"
          placeholder={kind === "student" ? "Imèl (opsyonèl si gen telefòn)" : "Imèl"}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required={kind === "staff"}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        {kind === "student" && (
          <input
            placeholder="Telefòn (opsyonèl si gen imèl)"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        )}
        {kind === "staff" && (
          <select
            value={form.staff_role}
            onChange={(e) => setForm({ ...form, staff_role: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="sekretè">Sekretè</option>
            <option value="pwofesè">Pwofesè</option>
            <option value="kontab">Kontab</option>
            <option value="lòt">Lòt</option>
          </select>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button disabled={loading} className="w-full rounded-lg bg-[#1E4FD8] py-2 text-sm font-medium text-white hover:bg-[#173da8] disabled:opacity-60">
          {loading ? "Ap kreye..." : "Kreye kont"}
        </button>
      </form>

      {result && (
        <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
          <p>Kont kreye. Bay moun nan enfòmasyon sa yo (p ap parèt ankò):</p>
          <p className="mt-2 font-mono">{result.email}</p>
          <p className="font-mono">{result.password}</p>
          {result.matricule && <p className="mt-1">Matrikil : {result.matricule}</p>}
        </div>
      )}
    </main>
  );
}
