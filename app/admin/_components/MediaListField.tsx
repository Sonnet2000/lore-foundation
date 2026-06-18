"use client";

import Image from "next/image";
import { ImagePlus, Loader2, X, ChevronLeft, ChevronRight, Play, Film } from "lucide-react";
import { useFileUpload } from "./useFileUpload";

export type MediaItem = { url: string; type: "image" | "video" };

type MediaListFieldProps = {
  label: string;
  values: MediaItem[];
  onChange: (items: MediaItem[]) => void;
  folder: string;
};

export default function MediaListField({ label, values, onChange, folder }: MediaListFieldProps) {
  const { inputRef, uploading, error, upload } = useFileUpload(folder);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const uploaded: MediaItem[] = [];
    for (const file of Array.from(files)) {
      const url = await upload(file);
      if (url) uploaded.push({ url, type: file.type.startsWith("video/") ? "video" : "image" });
    }
    if (uploaded.length) onChange([...values, ...uploaded]);
  }

  function remove(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  function move(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= values.length) return;
    const copy = [...values];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    onChange(copy);
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-lore-ink/70 dark:text-white/70">{label}</p>
      <p className="mb-2.5 text-xs text-lore-ink/40 dark:text-white/40">
        Photos (JPG, PNG, WEBP) ou courtes vidéos (MP4, WEBM, MOV — 80 Mo max).
      </p>

      <div className="flex flex-wrap gap-3">
        {values.map((item, i) => (
          <div
            key={item.url + i}
            className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-lore-dark/5 dark:bg-white/5"
          >
            {item.type === "video" ? (
              <>
                <video src={item.url} muted playsInline className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play className="h-6 w-6 fill-white text-white" />
                </div>
              </>
            ) : (
              <Image src={item.url} alt="" fill className="object-cover" unoptimized />
            )}

            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Retirer ce média"
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>

            <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-black/50 py-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="Déplacer avant"
                className="text-white disabled:opacity-30"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === values.length - 1}
                aria-label="Déplacer après"
                className="text-white disabled:opacity-30"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="focus-ring flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-lore-emerald/30 text-lore-emerald transition-colors hover:bg-lore-emerald/10 disabled:opacity-50 dark:text-lore-emerald-light"
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <div className="flex items-center gap-0.5">
                <ImagePlus className="h-4 w-4" />
                <Film className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-semibold">Ajouter</span>
            </>
          )}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
