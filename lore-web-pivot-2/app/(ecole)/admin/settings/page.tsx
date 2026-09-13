"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

// Paj sa a li/ekri sou MENM tab "school_settings" ak app mobil la (menm
// pwojè Supabase, "Estrateji B" — gade README-PIVOT.md). Chanjman ki
// fèt isit la parèt otomatikman nan app mobil la, e vis-vèsa — pa gen
// dezyèm kopi done pou kenbe senkwonize alamen.
//
// AVAN, paj sa a pa t egziste ditou nan platfòm Web la — se poutèt sa
// Admin te santi li "pa t ka modifye enfòmasyon lekòl la": pa t gen
// okenn kote pou fè sa sou Web, sèlman sou app mobil la.

type SchoolSettings = {
  id: number;
  school_name: string;
  tagline: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  logo_url: string | null;
  class_reminder_minutes: number;
  late_grace_minutes: number;
  internship_reminder_hours: number;
  message_retention_days: number;
};

const MAX_LOGO_BYTES = 8 * 1024 * 1024; // 8 Mo — menm limit ak app mobil la (gade lib/uploadGuards.ts)

export default function SchoolSettingsPage() {
  const supabase = createClient();
  const [role, setRole] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [form, setForm] = useState<Partial<SchoolSettings>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const load = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setReady(true);
      return;
    }
    const { data: profile } = await supabase.from("profiles").select("role, is_active").eq("id", user.id).single();
    setRole(profile?.is_active === false ? null : profile?.role ?? null);

    const { data } = await supabase.from("school_settings").select("*").eq("id", 1).maybeSingle();
    if (data) {
      setSettings(data as SchoolSettings);
      setForm(data as SchoolSettings);
      setLogoUrl((data as SchoolSettings).logo_url);
    }
    setReady(true);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  function set<K extends keyof SchoolSettings>(key: K, value: SchoolSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const isDirty =
    !!settings &&
    Object.keys(form).some((k) => (form as any)[k] !== (settings as any)[k]);

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // pèmèt chwazi menm fichye a de fwa si nesesè
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Chwazi yon fichye imaj (PNG, JPG...).");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      setError(`Imaj la twò gwo (${mb} Mo). Limit la se 8 Mo — chwazi yon imaj pi piti oswa konprese l anvan.`);
      return;
    }

    setUploadingLogo(true);
    setError(null);
    try {
      const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
      const path = `logo.${ext}`;

      // Menm bucket "school-assets" (piblik an lekti, Admin sèlman ka
      // ekri — gade schema_school_settings.sql) ke app mobil la itilize.
      const { error: uploadError } = await supabase.storage
        .from("school-assets")
        .upload(path, file, { contentType: file.type, upsert: true });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("school-assets").getPublicUrl(path);
      const publicUrl = `${data.publicUrl}?t=${Date.now()}`; // ?t= kase kach navigatè a pou nouvo logo a parèt tousuit

      const { error: updateError } = await supabase.from("school_settings").update({ logo_url: publicUrl }).eq("id", 1);
      if (updateError) throw updateError;

      setLogoUrl(publicUrl);
    } catch (err: any) {
      setError(err?.message || "Pa kapab telechaje logo a.");
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.school_name?.trim()) {
      setError("Non lekòl la obligatwa.");
      return;
    }
    const schoolName = form.school_name.trim();
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // RLS ("school_settings_admin_update") deja garanti sèlman Admin
    // ka modifye — sa a se jis yon soulye segondè pou yon mesaj klè.
    const { error: updateError } = await supabase
      .from("school_settings")
      .update({
        school_name: schoolName,
        tagline: form.tagline?.trim() || null,
        phone: form.phone?.trim() || null,
        email: form.email?.trim() || null,
        website: form.website?.trim() || null,
        address: form.address?.trim() || null,
        class_reminder_minutes: Number(form.class_reminder_minutes ?? 15),
        late_grace_minutes: Number(form.late_grace_minutes ?? 10),
        internship_reminder_hours: Number(form.internship_reminder_hours ?? 24),
        message_retention_days: Number(form.message_retention_days ?? 90),
        updated_by: user?.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    await load();
    setSavedAt(new Date());
  }

  if (!ready) return <p className="p-10 text-sm text-slate-400">Chajman...</p>;
  if (role !== "admin") {
    return (
      <main className="mx-auto max-w-md px-6 py-10">
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          Aksè refize — sèl Admin ka modifye paramèt lekòl la.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-1 text-2xl font-semibold text-[#0B1F3B]">Paramèt Lekòl la</h1>
      <p className="mb-6 text-sm text-slate-500">
        Chanjman yo parèt tou nan app mobil la otomatikman — se menm enfòmasyon an.
      </p>

      <form onSubmit={handleSave} className="space-y-6">
        <section className="space-y-3 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Enfòmasyon Jeneral</h2>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="Logo Loré Fondation" className="h-full w-full object-contain" />
              ) : (
                <span className="text-xs text-slate-400">Pa gen logo</span>
              )}
            </div>
            <label className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
              {uploadingLogo ? "N ap telechaje..." : "Chanje logo"}
              <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploadingLogo} className="hidden" />
            </label>
          </div>
          <input
            placeholder="Non lekòl la"
            value={form.school_name ?? ""}
            onChange={(e) => set("school_name", e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            placeholder="Ti fraz (tagline)"
            value={form.tagline ?? ""}
            onChange={(e) => set("tagline", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              placeholder="Telefòn"
              value={form.phone ?? ""}
              onChange={(e) => set("phone", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              type="email"
              placeholder="Imèl"
              value={form.email ?? ""}
              onChange={(e) => set("email", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              placeholder="Sit entènèt"
              value={form.website ?? ""}
              onChange={(e) => set("website", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              placeholder="Adrès"
              value={form.address ?? ""}
              onChange={(e) => set("address", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </section>

        <section className="space-y-3 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Rapèl Otomatik</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="text-xs text-slate-500">
              Rapèl kou (minit anvan)
              <input
                type="number"
                min={1}
                max={120}
                value={form.class_reminder_minutes ?? 15}
                onChange={(e) => set("class_reminder_minutes", Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-slate-500">
              Tolerans reta (minit)
              <input
                type="number"
                min={0}
                max={120}
                value={form.late_grace_minutes ?? 10}
                onChange={(e) => set("late_grace_minutes", Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="text-xs text-slate-500">
              Rapèl stage (è)
              <input
                type="number"
                min={1}
                max={168}
                value={form.internship_reminder_hours ?? 24}
                onChange={(e) => set("internship_reminder_hours", Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
          </div>
          <label className="block text-xs text-slate-500">
            Konsèvasyon mesaj (jou, 0 = san limit)
            <input
              type="number"
              min={0}
              max={3650}
              value={form.message_retention_days ?? 90}
              onChange={(e) => set("message_retention_days", Number(e.target.value))}
              className="mt-1 w-full max-w-[200px] rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <p className="text-xs text-slate-400">
            Penalite reta/absans yo konfigirab sou app mobil la sèlman pou kounye a (Paramèt → Reta &amp; Absans).
          </p>
        </section>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving || !isDirty}
            className="rounded-lg bg-[#1E4FD8] px-5 py-2 text-sm font-medium text-white hover:bg-[#173da8] disabled:opacity-40"
          >
            {saving ? "N ap anrejistre..." : "Anrejistre"}
          </button>
          <span className="text-xs text-slate-400">
            {isDirty ? "Gen chanjman ki pa anrejistre" : savedAt ? `Anrejistre a ${savedAt.toLocaleTimeString("fr-HT")}` : "Tout bagay ajou"}
          </span>
        </div>
      </form>
    </main>
  );
}
