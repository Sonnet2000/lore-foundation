"use client";

import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useFileUpload } from "./useFileUpload";

type ImageUploadFieldProps = {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
};

export default function ImageUploadField({ label, value, onChange, folder }: ImageUploadFieldProps) {
  const { inputRef, uploading, error, upload } = useFileUpload(folder);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    const url = await upload(file);
    if (url) onChange(url);
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-lore-ink/70 dark:text-white/70">{label}</p>

      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-lore-dark/5 dark:bg-white/5">
          {value ? (
            <Image src={value} alt="" fill className="object-cover" unoptimized />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lore-ink/25 dark:text-white/25">
              <ImagePlus className="h-6 w-6" />
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="focus-ring rounded-full border border-lore-emerald/30 px-4 py-2 text-xs font-semibold text-lore-emerald transition-colors hover:bg-lore-emerald/10 disabled:opacity-50 dark:text-lore-emerald-light"
          >
            {value ? "Remplacer" : "Choisir une photo"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="focus-ring inline-flex items-center gap-1 text-xs text-lore-ink/40 hover:text-red-500 dark:text-white/40"
            >
              <X className="h-3.5 w-3.5" />
              Retirer
            </button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
