import { NextResponse } from "next/server";
import { getSupabase, MEDIA_BUCKET } from "@/lib/supabase";

const ALLOWED_EXTENSIONS: Record<string, string> = {
  jpg:  "image/jpeg",
  jpeg: "image/jpeg",
  png:  "image/png",
  webp: "image/webp",
  gif:  "image/gif",
  avif: "image/avif",
  mp4:  "video/mp4",
  webm: "video/webm",
  mov:  "video/quicktime",
};

const ALLOWED_FOLDERS = new Set([
  "portfolio", "seminars", "team", "services", "testimonials", "misc",
]);

function extensionOf(filename: string) {
  const match = /\.([a-z0-9]+)$/i.exec(filename);
  return match ? match[1].toLowerCase() : "";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const rawFilename = typeof body?.filename === "string" ? body.filename : "";
  const rawFolder   = typeof body?.folder   === "string" ? body.folder   : "misc";

  // Strip path separators and validate folder against an explicit allowlist
  const folder = rawFolder.replace(/[^a-z0-9-]/gi, "").toLowerCase();
  if (!ALLOWED_FOLDERS.has(folder)) {
    return NextResponse.json(
      { error: "Dossier non autorisé." },
      { status: 400 }
    );
  }

  // Validate extension
  const ext         = extensionOf(rawFilename);
  const contentType = ALLOWED_EXTENSIONS[ext];

  if (!contentType) {
    return NextResponse.json(
      { error: "Format non supporté. Utilisez JPG, PNG, WEBP, GIF, AVIF, MP4, WEBM ou MOV." },
      { status: 400 }
    );
  }

  // Sanitize filename: keep only alphanumerics, dashes, underscores, dots
  const safeName = rawFilename
    .replace(/[^a-z0-9._-]/gi, "_")
    .slice(0, 80);

  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
  const supabase = getSupabase();

  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Impossible de générer le lien d'envoi." },
      { status: 500 }
    );
  }

  const { data: publicUrlData } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);

  return NextResponse.json({
    path:        data.path,
    token:       data.token,
    contentType,
    publicUrl:   publicUrlData.publicUrl,
  });
}
