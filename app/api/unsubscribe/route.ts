import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return new NextResponse("Email manquant.", { status: 400 });
  }

  try {
    const supabase = getSupabase();
    await supabase.from("subscribers").delete().eq("email", email);

    // Retourner une page HTML de confirmation
    return new NextResponse(`
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Désinscription — Loré Foundation</title>
  <style>
    body { margin:0; font-family:'Segoe UI',sans-serif; background:#f0f2f7; display:flex; align-items:center; justify-content:center; min-height:100vh; }
    .card { background:#fff; border-radius:24px; padding:48px 40px; text-align:center; max-width:400px; box-shadow:0 4px 24px rgba(0,0,0,0.08); }
    .icon { font-size:48px; margin-bottom:16px; }
    h1 { color:#0f172a; font-size:22px; margin:0 0 12px; }
    p { color:#64748b; line-height:1.6; margin:0 0 24px; }
    a { display:inline-block; background:#043C9E; color:#fff; text-decoration:none; padding:12px 28px; border-radius:99px; font-weight:600; font-size:14px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✅</div>
    <h1>Désinscription confirmée</h1>
    <p>Vous ne recevrez plus d'emails de Loré Foundation.<br/>Merci pour votre soutien.</p>
    <a href="https://lore-foundation.vercel.app">Retour au site</a>
  </div>
</body>
</html>`, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch {
    return new NextResponse("Erreur lors de la désinscription.", { status: 500 });
  }
}
