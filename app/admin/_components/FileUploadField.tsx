"use client";

import { FileText, Loader2, X, Upload } from "lucide-react";
import { useFileUpload } from "./useFileUpload";

type FileUploadFieldProps = {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
};

export default function FileUploadField({ label, value, onChange, folder }: FileUploadFieldProps) {
  const { inputRef, uploading, error, upload } = useFileUpload(folder);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    const url = await upload(file);
    if (url) onChange(url);
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-lore-ink/70 dark:text-white/70">{label}</p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="focus-ring inline-flex items-center gap-2 rounded-full border border-lore-emerald/30 px-4 py-2 text-xs font-semibold text-lore-emerald transition-colors hover:bg-lore-emerald/10 disabled:opacity-50 dark:text-lore-emerald-light"
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {value ? "Ranplase fichye a" : "Ajoute yon fichye"}
        </button>
        {value && (
          <>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-lore-ink/60 hover:text-lore-blue dark:text-white/60"
            >
              <FileText className="h-3.5 w-3.5" />
              Gade fichye a
            </a>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="focus-ring inline-flex items-center gap-1 text-xs text-lore-ink/40 hover:text-red-500 dark:text-white/40"
            >
              <X className="h-3.5 w-3.5" />
              Retire
            </button>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.apk,.jpg,.jpeg,.png,.webp,.gif"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
