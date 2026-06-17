import { NextResponse } from "next/server";
import { getSupabase, MEDIA_BUCKET } from "@/lib/supabase";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB

function extensionFor(type: string) {
  switch (type) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "image/avif":
      return "avif";
    default:
      return "jpg";
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const folder = (formData.get("folder") as string | null)?.replace(/[^a-z0-9-]/gi, "") || "misc";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Format non supporté. Utilisez JPG, PNG, WEBP, GIF ou AVIF." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Le fichier dépasse 8 Mo." }, { status: 400 });
  }

  const supabase = getSupabase();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extensionFor(
    file.type
  )}`;

  const { error: uploadError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: "31536000" });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);

  return NextResponse.json({ url: data.publicUrl, path });
}
