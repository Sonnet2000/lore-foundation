"use client";

import { useRef, useState } from "react";
import { MEDIA_BUCKET } from "@/lib/supabase-bucket";

const MAX_IMAGE_BYTES    = 12 * 1024 * 1024;
const MAX_VIDEO_BYTES    = 80 * 1024 * 1024;
const MAX_DOCUMENT_BYTES = 150 * 1024 * 1024; // pdf, doc, zip, apk...

/** Petite pause entre chaque upload pour éviter le rate-limiting Supabase */
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function useFileUpload(folder: string) {
  const inputRef               = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [progress, setProgress]   = useState<string | null>(null); // "2/5"

  async function uploadSingle(file: File): Promise<string | null> {
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    // APK envoyés depuis certains navigateurs mobiles arrivent parfois avec
    // un type MIME vide — on se fie aussi à l'extension du fichier.
    const isApk = file.type === "application/vnd.android.package-archive" || file.name.toLowerCase().endsWith(".apk");

    const maxBytes = isVideo
      ? MAX_VIDEO_BYTES
      : isImage
        ? MAX_IMAGE_BYTES
        : MAX_DOCUMENT_BYTES;

    if (file.size > maxBytes) {
      const limitMb = Math.round(maxBytes / (1024 * 1024));
      setError(isVideo
        ? `La vidéo dépasse ${limitMb} Mo.`
        : isImage
          ? `"${file.name}" dépasse ${limitMb} Mo.`
          : `"${file.name}" dépasse ${limitMb} Mo (limite fichiers${isApk ? " APK" : ""}).`);
      return null;
    }

    // 1. Obtenir URL signée
    const signRes = await fetch("/api/admin/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ filename: file.name, folder }),
    });

    if (!signRes.ok) {
      let msg = "Échec de la préparation de l'envoi.";
      try { const d = await signRes.json(); msg = d.error || msg; } catch { /* ignore */ }
      if (signRes.status === 500) msg = `Erreur serveur pour "${file.name}". Réessayez.`;
      setError(msg);
      return null;
    }

    const signData = await signRes.json();

    // 2. Upload direct vers Supabase Storage
    const uploadRes = await fetch(signData.signedUrl, {
      method: "PUT",
      headers: { "Content-Type": signData.contentType },
      body: file,
    });

    if (!uploadRes.ok) {
      setError(`Échec de l'envoi de "${file.name}" (${uploadRes.status}). Vérifiez que le bucket "${MEDIA_BUCKET}" existe et est public.`);
      return null;
    }

    return signData.publicUrl as string;
  }

  /** Upload une liste de fichiers séquentiellement avec pause entre chaque */
  async function upload(file: File): Promise<string | null> {
    setUploading(true);
    setError(null);
    setProgress(null);
    try {
      return await uploadSingle(file);
    } catch (e) {
      setError(`Erreur réseau : ${e instanceof Error ? e.message : String(e)}`);
      return null;
    } finally {
      setUploading(false);
    }
  }

  /** Upload multiple fichiers séquentiellement */
  async function uploadMany(files: File[]): Promise<string[]> {
    if (files.length === 0) return [];
    setUploading(true);
    setError(null);
    const results: string[] = [];

    for (let i = 0; i < files.length; i++) {
      setProgress(`${i + 1}/${files.length}`);
      try {
        const url = await uploadSingle(files[i]);
        if (url) results.push(url);
        // Pause 400ms entre chaque upload pour éviter rate-limit Supabase
        if (i < files.length - 1) await sleep(400);
      } catch (e) {
        setError(`Erreur pour "${files[i].name}" : ${e instanceof Error ? e.message : String(e)}`);
        // Continuer avec les autres fichiers
      }
    }

    setUploading(false);
    setProgress(null);
    return results;
  }

  return { inputRef, uploading, error, progress, upload, uploadMany };
}
