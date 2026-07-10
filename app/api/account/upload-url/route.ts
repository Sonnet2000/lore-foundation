import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabase, MEDIA_BUCKET } from "@/lib/supabase";

const ALLOWED_EXTENSIONS: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp",
  gif: "image/gif", pdf: "application/pdf", doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  zip: "application/zip", txt: "text/plain",
};

const MAX_BYTES = 20 * 1024 * 1024;

function extensionOf(filename: string) {
  const match = /\.([a-z0-9]+)$/i.exec(filename);
  return match ? match[1].toLowerCase() : "";
}

export async function POST(request: Request) {
  const supabaseAuth = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => null);
    const rawFilename = typeof body?.filename === "string" ? body.filename : "";
    const size = typeof body?.size === "number" ? body.size : 0;

    if (size > MAX_BYTES) {
      return NextResponse.json({ error: "Fichye a depase 20 Mo." }, { status: 400 });
    }

    const ext = extensionOf(rawFilename);
    const contentType = ALLOWED_EXTENSIONS[ext];
    if (!contentType) {
      return NextResponse.json(
        { error: "Fòma pa sipòte (PDF, Word, Excel, PowerPoint, imaj, ZIP, TXT)." },
        { status: 400 }
      );
    }

    const safeName = rawFilename.replace(/[^a-z0-9._-]/gi, "_").slice(0, 80);
    const path = `homework/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

    const supabase = getSupabase();
    const { data, error } = await supabase.storage.from(MEDIA_BUCKET).createSignedUploadUrl(path);

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Enposib kreye lyen upload la." },
        { status: 500 }
      );
    }

    const { data: pub } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);

    return NextResponse.json({
      path,
      signedUrl: data.signedUrl,
      contentType,
      publicUrl: pub.publicUrl,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erè sèvè." }, { status: 500 });
  }
}
