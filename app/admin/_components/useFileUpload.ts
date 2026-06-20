"use client";

import { useRef, useState } from "react";
import { MEDIA_BUCKET } from "@/lib/supabase-bucket";

const MAX_IMAGE_BYTES = 12 * 1024 * 1024; // 12 MB
const MAX_VIDEO_BYTES = 80 * 1024 * 1024; // 80 MB

export function useFileUpload(folder: string) {
  const inputRef  = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  async function upload(file: File): Promise<string | null> {
    setUploading(true);
    setError(null);

    try {
      const isVideo  = file.type.startsWith("video/");
      const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;

      if (file.size > maxBytes) {
        setError(isVideo
          ? "La vidéo dépasse 80 Mo. Compressez-la avant de réessayer."
          : "L'image dépasse 12 Mo.");
        return null;
      }

      // 1. Demander un token signé au serveur
      const signRes = await fetch("/api/admin/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ filename: file.name, folder }),
      });

      if (!signRes.ok) {
        let msg = "Échec de la préparation de l'envoi.";
        try {
          const d = await signRes.json();
          msg = d.error || msg;
        } catch { /* ignore */ }
        // Cas spécifique: variables env manquantes
        if (signRes.status === 500) {
          msg = "Configuration Supabase incomplète. Vérifiez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sur Vercel.";
        }
        setError(msg);
        return null;
      }

      const signData = await signRes.json();

      // 2. Uploader via fetch direct (sans SDK browser, plus simple)
      const uploadRes = await fetch(signData.signedUrl, {
        method: "PUT",
        headers: { "Content-Type": signData.contentType },
        body: file,
      });

      if (!uploadRes.ok) {
        setError(`Échec de l'envoi (${uploadRes.status}). Vérifiez que le bucket "${MEDIA_BUCKET}" existe et est public sur Supabase.`);
        return null;
      }

      return signData.publicUrl as string;

    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(`Erreur réseau : ${msg}. Vérifiez votre connexion.`);
      return null;
    } finally {
      setUploading(false);
    }
  }

  return { inputRef, uploading, error, upload };
}
