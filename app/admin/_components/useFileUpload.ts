"use client";

import { useRef, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { MEDIA_BUCKET } from "@/lib/supabase-bucket";

const MAX_IMAGE_BYTES = 12 * 1024 * 1024; // 12 MB
const MAX_VIDEO_BYTES = 80 * 1024 * 1024; // 80 MB

export function useFileUpload(folder: string) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File): Promise<string | null> {
    setUploading(true);
    setError(null);

    try {
      const isVideo = file.type.startsWith("video/");
      const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;

      if (file.size > maxBytes) {
        setError(
          isVideo
            ? "La vidéo dépasse 80 Mo. Compressez-la ou raccourcissez-la avant de réessayer."
            : "L'image dépasse 12 Mo."
        );
        return null;
      }

      // 1. Ask our server (small JSON request, well under Vercel's 4.5 MB
      //    function body limit) for a short-lived signed upload token.
      const signRes = await fetch("/api/admin/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ filename: file.name, folder }),
      });
      const signData = await signRes.json();

      if (!signRes.ok) {
        setError(signData.error || "Échec de la préparation de l'envoi.");
        return null;
      }

      // 2. Upload the actual bytes straight from the browser to Supabase
      //    Storage — this never touches our Vercel function, so large
      //    videos are not subject to its body size limit.
      const supabase = getSupabaseBrowser();
      const { error: uploadError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .uploadToSignedUrl(signData.path, signData.token, file, {
          contentType: signData.contentType,
        });

      if (uploadError) {
        setError(uploadError.message || "Échec de l'envoi du fichier.");
        return null;
      }

      return signData.publicUrl as string;
    } catch {
      setError("Erreur réseau pendant l'envoi.");
      return null;
    } finally {
      setUploading(false);
    }
  }

  return { inputRef, uploading, error, upload };
}
