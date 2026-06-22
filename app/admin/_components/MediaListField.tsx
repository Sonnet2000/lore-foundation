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
  const { inputRef, uploading, error, progress, uploadMany } = useFileUpload(folder);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const fileArr = Array.from(files);

    // On garde le type de chaque fichier avant l'upload, indexé par position originale.
    // uploadMany peut sauter des fichiers si un upload échoue, ce qui décalerait
    // le mapping url[i] <-> fileArr[i]. On résout ça en uploadant un par un
    // et en construisant MediaItem[] au fur et à mesure.
    const uploaded: MediaItem[] = [];

    for (let i = 0; i < fileArr.length; i++) {
      const file = fileArr[i];
      const type: "image" | "video" = file.type.startsWith("video/") ? "video" : "image";
      // uploadMany accepte un tableau — on lui passe un fichier à la fois
      // pour garder le contrôle exact sur le type
      const urls = await uploadMany([file]);
      if (urls.length > 0 && urls[0]) {
        uploaded.push({ url: urls[0], type });
      }
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
        Ou ka seleksyone <strong>plizyè foto</strong> alafwa.
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

            {/* Badge type */}
            <span className="absolute left-1 top-1 rounded-full bg-black/50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white opacity-0 transition-opacity group-hover:opacity-100">
              {item.type === "video" ? "VID" : "IMG"}
            </span>

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

        {/* Bouton ajouter */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="focus-ring flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-lore-emerald/30 text-lore-emerald transition-colors hover:bg-lore-emerald/10 disabled:opacity-50 dark:text-lore-emerald-light"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-1">
              <Loader2 className="h-5 w-5 animate-spin" />
              {progress && (
                <span className="text-[10px] font-semibold">{progress}</span>
              )}
            </div>
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

        {/* Input caché — multiple activé */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Compteur */}
      {values.length > 0 && (
        <p className="mt-2 text-xs text-lore-ink/40 dark:text-white/40">
          {values.filter((m) => m.type !== "video").length} foto
          {values.filter((m) => m.type === "video").length > 0
            ? ` · ${values.filter((m) => m.type === "video").length} vidéo`
            : ""}
          {" "}· Premye a ap parèt kòm thumbnail
        </p>
      )}

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
