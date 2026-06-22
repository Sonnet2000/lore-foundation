import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lore-foundation.vercel.app";

/** Envoie une notification email à tous les subscribers pour un nouvel article */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const postId = body.post_id as string;

    if (!postId) return NextResponse.json({ error: "post_id requis." }, { status: 400 });

    const supabase = getSupabase();

    // 1. Récupérer l'article
    const { data: post, error: postErr } = await supabase
      .from("blog_posts")
      .select("title, excerpt, slug, cover_url, category, author_name, read_time_minutes")
      .eq("id", postId)
      .eq("is_published", true)
      .single();

    if (postErr || !post) {
      return NextResponse.json({ error: "Article non trouvé ou non publié." }, { status: 404 });
    }

    // 2. Récupérer tous les subscribers
    const { data: subscribers, error: subErr } = await supabase
      .from("subscribers")
      .select("email");

    if (subErr || !subscribers?.length) {
      return NextResponse.json({ ok: true, sent: 0, message: "Aucun abonné." });
    }

    // 3. Envoyer via Resend
    const RESEND_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_KEY) {
      return NextResponse.json({
        ok: false,
        error: "RESEND_API_KEY manquant. Ajoutez-la dans les variables Vercel.",
      }, { status: 500 });
    }

    const articleUrl = `${SITE_URL}/blog/${post.slug}`;
    const emails = subscribers.map(s => s.email);

    // Envoyer en batch (max 50 par appel Resend)
    const batches = [];
    for (let i = 0; i < emails.length; i += 50) {
      batches.push(emails.slice(i, i + 50));
    }

    let totalSent = 0;
    for (const batch of batches) {
      const res = await fetch("https://api.resend.com/emails/batch", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          batch.map(email => ({
            from:    "Loré Foundation <blog@lorefoundation.com>",
            to:      [email],
            subject: `📖 Nouvel article : ${post.title}`,
            html:    buildEmailHtml(post, articleUrl, email),
          }))
        ),
      });

      if (res.ok) totalSent += batch.length;
    }

    return NextResponse.json({ ok: true, sent: totalSent, total: emails.length });

  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}

function buildEmailHtml(
  post: { title: string; excerpt: string; cover_url: string | null; category: string; author_name: string; read_time_minutes: number },
  articleUrl: string,
  email: string
) {
  const unsubUrl = `${SITE_URL}/api/unsubscribe?email=${encodeURIComponent(email)}`;
  const cover = post.cover_url
    ? `<img src="${post.cover_url}" alt="${post.title}" style="width:100%;max-height:300px;object-fit:cover;border-radius:16px;margin-bottom:24px;" />`
    : "";

  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f2f7;font-family:'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f7;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:600px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#031a4a 0%,#043C9E 100%);padding:32px 40px;text-align:center;">
          <p style="margin:0;font-size:13px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.6);">
            Blog Loré Foundation
          </p>
          <p style="margin:8px 0 0;font-size:11px;color:rgba(255,255,255,0.4);">
            L'excellence au cœur de l'impact 🇭🇹
          </p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px;">
          ${cover}
          <span style="display:inline-block;background:#dbeafe;color:#1d4ed8;padding:4px 12px;border-radius:99px;font-size:11px;font-weight:700;text-transform:uppercase;margin-bottom:16px;">
            ${post.category}
          </span>
          <h1 style="margin:0 0 16px;font-size:26px;font-weight:800;color:#0f172a;line-height:1.3;">
            ${post.title}
          </h1>
          <p style="margin:0 0 24px;font-size:15px;color:#64748b;line-height:1.7;">
            ${post.excerpt}
          </p>
          <div style="display:flex;gap:16px;margin-bottom:32px;font-size:12px;color:#94a3b8;">
            <span>✍️ ${post.author_name}</span>
            <span>⏱️ ${post.read_time_minutes} min de lecture</span>
          </div>
          <a href="${articleUrl}"
            style="display:inline-block;background:#043C9E;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:99px;font-weight:700;font-size:15px;">
            Lire l'article complet →
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">
            Vous recevez cet email car vous êtes abonné à Loré Foundation.<br/>
            <a href="${unsubUrl}" style="color:#043C9E;text-decoration:none;">Se désabonner</a>
            &nbsp;·&nbsp;
            <a href="${SITE_URL}" style="color:#043C9E;text-decoration:none;">Visiter le site</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
