import { NextResponse } from "next/server";
import { getSupabase, MEDIA_BUCKET } from "@/lib/supabase";

const ALLOWED_EXTENSIONS: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
  webp: "image/webp", gif: "image/gif", avif: "image/avif",
  mp4: "video/mp4", webm: "video/webm", mov: "video/quicktime",
  pdf: "application/pdf", doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  zip: "application/zip",
  apk: "application/vnd.android.package-archive",
};

const ALLOWED_FOLDERS = new Set([
  "hero", "portfolio", "seminars", "team", "services", "testimonials",
  "payments", "misc", "blog", "projects", "courses", "assignments", "ads",
  "premium-services", "app",
]);

function extensionOf(filename: string) {
  const match = /\.([a-z0-9]+)$/i.exec(filename);
  return match ? match[1].toLowerCase() : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const rawFilename = typeof body?.filename === "string" ? body.filename : "";
    const rawFolder   = typeof body?.folder   === "string" ? body.folder   : "misc";

    const folder = rawFolder.replace(/[^a-z0-9-]/gi, "").toLowerCase();
    if (!ALLOWED_FOLDERS.has(folder)) {
      return NextResponse.json({ error: "Dossier non autorisé." }, { status: 400 });
    }

    const ext         = extensionOf(rawFilename);
    const contentType = ALLOWED_EXTENSIONS[ext];
    if (!contentType) {
      return NextResponse.json({ error: "Format non supporté (JPG, PNG, WEBP, GIF, MP4, WEBM, MOV)." }, { status: 400 });
    }

    const safeName = rawFilename.replace(/[^a-z0-9._-]/gi, "_").slice(0, 80);
    const path     = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

    const supabase = getSupabase();

    // Créer URL signée pour upload PUT direct
    const { data, error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .createSignedUploadUrl(path);

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || `Impossible de créer l'URL signée. Vérifiez que le bucket "${MEDIA_BUCKET}" existe sur Supabase.` },
        { status: 500 }
      );
    }

    const { data: pub } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);

    return NextResponse.json({
      path,
      token:      data.token,
      signedUrl:  data.signedUrl,   // ← URL pour PUT direct
      contentType,
      publicUrl:  pub.publicUrl,
    });

  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur serveur." },
      { status: 500 }
    );
  }
}
