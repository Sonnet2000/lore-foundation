"use client";

import { useRef, useState } from "react";

export function useImageUpload(folder: string) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File): Promise<string | null> {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Échec de l'envoi de l'image.");
        return null;
      }

      return data.url as string;
    } catch {
      setError("Erreur réseau pendant l'envoi.");
      return null;
    } finally {
      setUploading(false);
    }
  }

  return { inputRef, uploading, error, upload };
}
