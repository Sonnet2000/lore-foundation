import { NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY manquant sur Vercel.");
  return new Stripe(key, { apiVersion: "2026-05-27.dahlia" });
}

const PRESET_AMOUNTS = [10, 25, 50, 100]; // USD

const PROJECTS: Record<string, string> = {
  general:    "Fonds général Loré Foundation",
  formation:  "Formation numérique pour enseignants",
  seminaire:  "Séminaire de leadership jeunesse",
  bourses:    "Bourses scolaires pour jeunes",
  materiel:   "Matériel informatique communautaire",
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const amountUsd  = Math.max(1, Math.min(10000, Number(body.amount) || 10));
    const currency   = "usd";
    const project    = PROJECTS[body.project] ?? PROJECTS.general;
    const donorName  = (body.donor_name ?? "").trim() || "Donateur anonyme";
    const anonymous  = body.anonymous === true;

    const origin = process.env.NEXT_PUBLIC_SITE_URL
      ?? process.env.VERCEL_URL
      ?? "https://lorefoundation.vercel.app";

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: Math.round(amountUsd * 100),
            product_data: {
              name: `Don — ${project}`,
              description: `Loré Foundation · ${anonymous ? "Contribution anonyme" : `De : ${donorName}`}`,
              images: [`${origin}/logo.png`],
            },
          },
        },
      ],
      metadata: {
        project:    body.project ?? "general",
        donor_name: anonymous ? "Anonyme" : donorName,
        anonymous:  String(anonymous),
        source:     "lore-foundation-website",
      },
      customer_email: (!anonymous && body.email) ? body.email : undefined,
      success_url: `${origin}/don/succes?session_id={CHECKOUT_SESSION_ID}&project=${encodeURIComponent(project)}`,
      cancel_url:  `${origin}/don?cancelled=1`,
      submit_type: "donate",
      allow_promotion_codes: false,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
