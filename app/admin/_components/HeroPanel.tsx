"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Save, ImageIcon, Play, Info, CheckCircle2 } from "lucide-react";
import { FieldLabel, TextInput, TextArea, PrimaryButton } from "./ui";
import MediaListField, { MediaItem } from "./MediaListField";

type HeroSettings = {
  media: MediaItem[]; // photo(s) oswa vidéo pou hero section
  badgeText: string;
  headlineBefore: string;
  headlineHighlight: string;
  headlineAfter: string;
  description: string;
  mobileBadgeText: string;
  floatingBadge1Title: string;
  floatingBadge1Subtitle: string;
  floatingBadge2Title: string;
  floatingBadge2Subtitle: string;
};

const DEFAULT: HeroSettings = {
  media: [],
  badgeText: "",
  headlineBefore: "",
  headlineHighlight: "",
  headlineAfter: "",
  description: "",
  mobileBadgeText: "",
  floatingBadge1Title: "",
  floatingBadge1Subtitle: "",
  floatingBadge2Title: "",
  floatingBadge2Subtitle: "",
};

export default function HeroPanel() {
  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const res  = await fetch("/api/admin/hero", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setSettings(DEFAULT); return; }
      setSettings({ ...DEFAULT, ...data, media: data.media ?? [] });
    } catch {
      setSettings(DEFAULT);
    }
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    const res = await fetch("/api/admin/hero", {
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

  const firstMedia = settings.media[0];

  function field(key: keyof HeroSettings, value: string) {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Tip */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-200/60 bg-blue-50 p-4 dark:border-blue-400/20 dark:bg-blue-500/10">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500 dark:text-blue-400" />
        <p className="text-xs leading-relaxed text-blue-700 dark:text-blue-300">
          <strong>Premye média</strong> nan lis la se sa k ap parèt nan section accueil la (kolòn dwat).
          Ou ka mete yon foto oswa yon vidéo kout. Lòt yo nan lis la sèvi kòm backup.
          Foto a dwe gen yon rapò <strong>4:5</strong> pou pi bèl rezilta (ex: 800×1000px).
          Kite yon chan vid si ou vle kenbe tèks ki deja la a.
        </p>
      </div>

      {/* Aperçu */}
      {firstMedia && (
        <div className="flex flex-col gap-2">
          <FieldLabel>Aperçu — média aktyèl</FieldLabel>
          <div className="relative h-48 w-36 overflow-hidden rounded-2xl border border-lore-dark/10 dark:border-white/10">
            {firstMedia.type === "video" ? (
              <>
                <video
                  src={firstMedia.url}
                  muted
                  playsInline
                  loop
                  autoPlay
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5">
                  <Play className="h-3 w-3 fill-white text-white" />
                  <span className="text-[10px] text-white">Vidéo</span>
                </div>
              </>
            ) : (
              <Image src={firstMedia.url} alt="Hero actuel" fill className="object-cover object-top" unoptimized />
            )}
          </div>
        </div>
      )}

      {!firstMedia && (
        <div className="flex h-48 w-36 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-lore-dark/15 text-lore-ink/30 dark:border-white/15 dark:text-white/30">
          <ImageIcon className="h-8 w-8" />
          <span className="text-xs">Okenn média</span>
        </div>
      )}

      {/* Champ média */}
      <div>
        <MediaListField
          label="Foto oswa vidéo hero section"
          values={settings.media}
          onChange={(media) => setSettings({ ...settings, media })}
          folder="hero"
        />
        <p className="mt-2 text-xs text-lore-ink/40 dark:text-white/40">
          Pou efase yon foto: pase souri ou anwo li epi klike ti X wouj la, epi klike Sauvegarder anba a.
        </p>
      </div>

      <hr className="border-lore-dark/10 dark:border-white/10" />

      {/* Tèks Hero */}
      <div className="flex flex-col gap-4">
        <FieldLabel>Badge tou anwo (o-dessus du titre)</FieldLabel>
        <TextInput
          value={settings.badgeText}
          onChange={(e) => field("badgeText", e.target.value)}
          placeholder="🇭🇹 Formation professionnelle & services numériques à Cap-Haïtien"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <FieldLabel>Tit — 1ye pati</FieldLabel>
            <TextInput
              value={settings.headlineBefore}
              onChange={(e) => field("headlineBefore", e.target.value)}
              placeholder="Former."
            />
          </div>
          <div>
            <FieldLabel>Tit — pati an lò (highlight)</FieldLabel>
            <TextInput
              value={settings.headlineHighlight}
              onChange={(e) => field("headlineHighlight", e.target.value)}
              placeholder="Créer."
            />
          </div>
          <div>
            <FieldLabel>Tit — dènye pati</FieldLabel>
            <TextInput
              value={settings.headlineAfter}
              onChange={(e) => field("headlineAfter", e.target.value)}
              placeholder="Réussir."
            />
          </div>
        </div>

        <div>
          <FieldLabel>Deskripsyon anba tit la</FieldLabel>
          <TextArea
            rows={3}
            value={settings.description}
            onChange={(e) => field("description", e.target.value)}
            placeholder="Loré Foundation forme les talents de demain..."
          />
        </div>

        <div>
          <FieldLabel>Badge kout (vèsyon mobile, anndan foto a)</FieldLabel>
          <TextInput
            value={settings.mobileBadgeText}
            onChange={(e) => field("mobileBadgeText", e.target.value)}
            placeholder="500+ jeunes formés · 80+ projets livrés"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-2xl border border-lore-dark/5 p-4 dark:border-white/5">
            <FieldLabel>Ti kat flotan #1 (ba agoch)</FieldLabel>
            <TextInput
              value={settings.floatingBadge1Title}
              onChange={(e) => field("floatingBadge1Title", e.target.value)}
              placeholder="500+ jeunes formés"
            />
            <TextInput
              value={settings.floatingBadge1Subtitle}
              onChange={(e) => field("floatingBadge1Subtitle", e.target.value)}
              placeholder="depuis notre création"
            />
          </div>
          <div className="flex flex-col gap-2 rounded-2xl border border-lore-dark/5 p-4 dark:border-white/5">
            <FieldLabel>Ti kat flotan #2 (anwo adwat)</FieldLabel>
            <TextInput
              value={settings.floatingBadge2Title}
              onChange={(e) => field("floatingBadge2Title", e.target.value)}
              placeholder="Formation & services pro"
            />
            <TextInput
              value={settings.floatingBadge2Subtitle}
              onChange={(e) => field("floatingBadge2Subtitle", e.target.value)}
              placeholder="Cap-Haïtien & au-delà"
            />
          </div>
        </div>
      </div>

      {/* Bouton sauvegarder */}
      <div className="flex items-center gap-3">
        <PrimaryButton onClick={handleSave} disabled={saving}>
          {saving
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <Save className="h-4 w-4" />
          }
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
