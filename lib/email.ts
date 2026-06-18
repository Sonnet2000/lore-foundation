import "server-only";

const RESEND_API_URL = "https://api.resend.com/emails";
const BATCH_SIZE = 49; // Resend allows up to 50 recipients (to + cc + bcc) per request.

type SendResult = { sent: number; error: string | null };

/**
 * Sends one email per batch of up to 49 subscribers, all hidden from each
 * other via `bcc` (the visible `to` is the sender itself). Requires
 * RESEND_API_KEY and RESEND_FROM_EMAIL to be configured — if they aren't,
 * this returns a clear error instead of throwing, so callers can surface
 * it to the admin.
 */
export async function sendBulkNotification({
  recipients,
  subject,
  html,
}: {
  recipients: string[];
  subject: string;
  html: string;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    return {
      sent: 0,
      error:
        "RESEND_API_KEY ou RESEND_FROM_EMAIL non configuré sur le serveur (voir .env.local.example).",
    };
  }

  if (recipients.length === 0) {
    return { sent: 0, error: null };
  }

  const batches: string[][] = [];
  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    batches.push(recipients.slice(i, i + BATCH_SIZE));
  }

  let sent = 0;
  for (const batch of batches) {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: from,
        bcc: batch,
        subject,
        html,
      }),
    });

    if (res.ok) {
      sent += batch.length;
    } else {
      const body = await res.json().catch(() => null);
      return {
        sent,
        error: body?.message || `Échec de l'envoi (HTTP ${res.status}).`,
      };
    }
  }

  return { sent, error: null };
}

export function emailLayout({ heading, body, ctaLabel, ctaUrl }: {
  heading: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
}) {
  return `
    <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #f5f8fc;">
      <p style="color:#9C7A1F; font-weight:700; font-size:12px; letter-spacing:0.15em; text-transform:uppercase; margin:0 0 8px;">Loré Foundation</p>
      <h1 style="color:#0B1F33; font-size:22px; margin:0 0 16px;">${heading}</h1>
      <p style="color:#3a4a5c; font-size:15px; line-height:1.6; margin:0 0 24px;">${body}</p>
      ${
        ctaLabel && ctaUrl
          ? `<a href="${ctaUrl}" style="display:inline-block; background:#D4AF37; color:#1a1206; font-weight:700; font-size:14px; padding:12px 24px; border-radius:999px; text-decoration:none;">${ctaLabel}</a>`
          : ""
      }
    </div>
  `;
}
