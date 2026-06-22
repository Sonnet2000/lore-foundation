"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Save, ImageIcon, Play, Info, CheckCircle2 } from "lucide-react";
import { FieldLabel, PrimaryButton } from "./ui";
import MediaListField, { MediaItem } from "./MediaListField";

type HeroSettings = {
  media: MediaItem[]; // photo(s) oswa vidéo pou hero section
};

const DEFAULT: HeroSettings = { media: [] };

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
      setSettings({ media: data.media ?? [] });
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
      body: JSON.stringify({ media: settings.media }),
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

  return (
    <div className="flex flex-col gap-6">

      {/* Tip */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-200/60 bg-blue-50 p-4 dark:border-blue-400/20 dark:bg-blue-500/10">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500 dark:text-blue-400" />
        <p className="text-xs leading-relaxed text-blue-700 dark:text-blue-300">
          <strong>Premye média</strong> nan lis la se sa k ap parèt nan section accueil la (kolòn dwat).
          Ou ka mete yon foto oswa yon vidéo kout. Lòt yo nan lis la sèvi kòm backup.
          Foto a dwe gen yon rapò <strong>4:5</strong> pou pi bèl rezilta (ex: 800×1000px).
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
