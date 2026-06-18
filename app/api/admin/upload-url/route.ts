import { NextResponse } from "next/server";
import { getSupabase, MEDIA_BUCKET } from "@/lib/supabase";

const ALLOWED_EXTENSIONS: Record<string, string> = {
  // images
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  // video
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
};

function extensionOf(filename: string) {
  const match = /\.([a-z0-9]+)$/i.exec(filename);
  return match ? match[1].toLowerCase() : "";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const filename = typeof body?.filename === "string" ? body.filename : "";
  const folder = (typeof body?.folder === "string" ? body.folder : "misc").replace(
    /[^a-z0-9-]/gi,
    ""
  );

  const ext = extensionOf(filename);
  const contentType = ALLOWED_EXTENSIONS[ext];

  if (!contentType) {
    return NextResponse.json(
      { error: "Format non supporté. Utilisez JPG, PNG, WEBP, GIF, AVIF, MP4, WEBM ou MOV." },
      { status: 400 }
    );
  }

  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
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
    path: data.path,
    token: data.token,
    contentType,
    publicUrl: publicUrlData.publicUrl,
  });
}
