"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, CheckCircle2, Info, Smartphone } from "lucide-react";
import { FieldLabel, TextInput, PrimaryButton } from "./ui";
import FileUploadField from "./FileUploadField";

type AppDownloadSettings = {
  apkUrl: string | null;
  version: string;
  approxSizeMb: number;
  playStoreUrl: string | null;
};

const DEFAULT: AppDownloadSettings = {
  apkUrl: null,
  version: "1.0.0",
  approxSizeMb: 40,
  playStoreUrl: null,
};

export default function AppUpdatePanel() {
  const [settings, setSettings] = useState<AppDownloadSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const res = await fetch("/api/admin/app-download", { credentials: "include", cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setSettings(DEFAULT); return; }
      setSettings({ ...DEFAULT, ...data });
    } catch {
      setSettings(DEFAULT);
    }
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    const res = await fetch("/api/admin/app-download", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Echèk anrejistreman an.");
      return;
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  if (settings === null) {
    return (
      <div className="flex items-center justify-center py-16 text-lore-ink/40 dark:text-white/40">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Tip */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-200/60 bg-blue-50 p-4 dark:border-blue-400/20 dark:bg-blue-500/10">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500 dark:text-blue-400" />
        <p className="text-xs leading-relaxed text-blue-700 dark:text-blue-300">
          Lè w bilding yon nouvo vèsyon app <strong>Loré School</strong> (fichye <code>.apk</code>), telechaje l isit la.
          Bouton &laquo;&nbsp;Télécharger pour Android&nbsp;&raquo; sou sit la ap otomatikman pwente sou dènye vèsyon
          ou upload la — pa gen bezwen touche kòd la ni refè yon deplwaman.
        </p>
      </div>

      {/* Etat aktyèl */}
      <div className="flex items-center gap-4 rounded-2xl border border-lore-dark/5 bg-white p-5 dark:border-white/5 dark:bg-lore-night-surface">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lore-emerald/10 text-lore-emerald dark:text-lore-emerald-light">
          <Smartphone className="h-6 w-6" />
        </div>
        <div>
          <p className="font-display text-sm font-bold text-lore-ink dark:text-white">
            {settings.apkUrl ? "Yon APK deja an liy" : "Okenn APK telechaje toujou"}
          </p>
          <p className="text-xs text-lore-ink/50 dark:text-white/50">
            Vèsyon {settings.version} · ~{settings.approxSizeMb} Mo
          </p>
        </div>
      </div>

      {/* Upload APK */}
      <FileUploadField
        label="Fichye APK (.apk)"
        value={settings.apkUrl}
        onChange={(url) => setSettings({ ...settings, apkUrl: url })}
        folder="app"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>Nimewo vèsyon (ex: 1.2.0)</FieldLabel>
          <TextInput
            value={settings.version}
            onChange={(e) => setSettings({ ...settings, version: e.target.value })}
            placeholder="1.0.0"
          />
        </div>
        <div>
          <FieldLabel>Gwosè apwoksimatif (Mo)</FieldLabel>
          <TextInput
            type="number"
            min={1}
            value={settings.approxSizeMb}
            onChange={(e) => setSettings({ ...settings, approxSizeMb: Number(e.target.value) || 0 })}
            placeholder="40"
          />
        </div>
      </div>

      <div>
        <FieldLabel>Lyen Google Play Store (kite vid si app la poko sou Play Store)</FieldLabel>
        <TextInput
          value={settings.playStoreUrl ?? ""}
          onChange={(e) => setSettings({ ...settings, playStoreUrl: e.target.value })}
          placeholder="https://play.google.com/store/apps/details?id=..."
        />
      </div>

      {/* Bouton sauvegarder */}
      <div className="flex items-center gap-3">
        <PrimaryButton onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Sauvegarder
        </PrimaryButton>

        {success && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            Sauvegardes yo reyisi !
          </span>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
