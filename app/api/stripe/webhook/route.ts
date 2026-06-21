import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabase } from "@/lib/supabase";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY manquant.");
  return new Stripe(key, { apiVersion: "2026-05-27.dahlia" });
}

export async function POST(request: Request) {
  const body      = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET manquant." }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (e) {
    return NextResponse.json({ error: `Webhook invalide: ${e}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid") {
      try {
        const supabase = getSupabase();
        await supabase.from("payments").insert({
          purpose:      "sponsor",
          amount:       (session.amount_total ?? 0) / 100,
          currency:     (session.currency ?? "usd").toUpperCase(),
          method:       "autre",
          sender_name:  session.metadata?.donor_name ?? "Anonyme",
          sender_phone: "",
          reference:    session.id,
          note:         `Stripe · ${session.metadata?.project ?? ""} · session: ${session.id}`,
          status:       "confirmed",
        });
      } catch (e) {
        console.error("Supabase insert error:", e);
      }
    }
  }

  return NextResponse.json({ received: true });
}
