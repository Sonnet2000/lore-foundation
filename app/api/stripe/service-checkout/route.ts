import { NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Peman pa kat pa konfigire kounye a. Kontakte nou pou nou konfime lòt fason peman.");
  return new Stripe(key, { apiVersion: "2026-05-27.dahlia" });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const amountUsd = Math.max(1, Math.min(10000, Number(body.amount) || 0));
    if (!amountUsd) {
      return NextResponse.json({ error: "Antre yon montan valab." }, { status: 400 });
    }

    const subject = (body.subject ?? "Service Loré Foundation").toString().trim().slice(0, 200) || "Service Loré Foundation";
    const fullName = (body.full_name ?? "").toString().trim().slice(0, 120) || "Client";
    const email = (body.email ?? "").toString().trim().slice(0, 254);

    const origin = process.env.NEXT_PUBLIC_SITE_URL
      ?? process.env.VERCEL_URL
      ?? "https://lorefoundation.vercel.app";

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "usd",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(amountUsd * 100),
            product_data: {
              name: subject,
              description: `Loré Foundation · De : ${fullName}`,
              images: [`${origin}/logo.png`],
            },
          },
        },
      ],
      metadata: {
        source: "lore-foundation-service-payment",
        subject,
        full_name: fullName,
      },
      customer_email: email || undefined,
      success_url: `${origin}/paiement/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/paiement?cancelled=1`,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
