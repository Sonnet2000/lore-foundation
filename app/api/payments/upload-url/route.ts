import { NextResponse } from "next/server";
import { getSupabase, MEDIA_BUCKET } from "@/lib/supabase";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const ALLOWED_EXTENSIONS: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", pdf: "application/pdf",
};

const MAX_BYTES = 8 * 1024 * 1024;

function extensionOf(filename: string) {
  const match = /\.([a-z0-9]+)$/i.exec(filename);
  return match ? match[1].toLowerCase() : "";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed } = rateLimit({ key: `payment-upload:${ip}`, limit: 8, windowSeconds: 3600 });
  if (!allowed) {
    return NextResponse.json({ error: "Twòp demand. Eseye ankò pita." }, { status: 429 });
  }

  try {
    const body = await request.json().catch(() => null);
    const rawFilename = typeof body?.filename === "string" ? body.filename : "";
    const size = typeof body?.size === "number" ? body.size : 0;

    if (size > MAX_BYTES) {
      return NextResponse.json({ error: "Fichye a depase 8 Mo." }, { status: 400 });
    }

    const ext = extensionOf(rawFilename);
    const contentType = ALLOWED_EXTENSIONS[ext];
    if (!contentType) {
      return NextResponse.json({ error: "Fòma pa sipòte (imaj oswa PDF sèlman)." }, { status: 400 });
    }

    const safeName = rawFilename.replace(/[^a-z0-9._-]/gi, "_").slice(0, 80);
    const path = `payments/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

    const supabase = getSupabase();
    const { data, error } = await supabase.storage.from(MEDIA_BUCKET).createSignedUploadUrl(path);

    if (error || !data) {
      return NextResponse.json({ error: error?.message || "Enposib kreye lyen upload la." }, { status: 500 });
    }

    const { data: pub } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);

    return NextResponse.json({ path, signedUrl: data.signedUrl, contentType, publicUrl: pub.publicUrl });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erè sèvè." }, { status: 500 });
  }
}
