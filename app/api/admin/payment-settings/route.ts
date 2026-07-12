import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { DEFAULT_PAYMENT, mergePaymentSettings, type PaymentSettings } from "@/lib/site-info";

const PAYMENT_KEY = "payment";

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", PAYMENT_KEY)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(mergePaymentSettings(data?.value));
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function sanitize(body: unknown): PaymentSettings | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;

  return {
    binanceEnabled: typeof b.binanceEnabled === "boolean" ? b.binanceEnabled : DEFAULT_PAYMENT.binanceEnabled,
    binancePayId: typeof b.binancePayId === "string" ? b.binancePayId.trim().slice(0, 80) : "",
    binanceWalletAddress: typeof b.binanceWalletAddress === "string" ? b.binanceWalletAddress.trim().slice(0, 120) : "",
    binanceQrUrl: typeof b.binanceQrUrl === "string" ? b.binanceQrUrl.trim().slice(0, 500) : "",
    instructions: typeof b.instructions === "string" ? b.instructions.trim().slice(0, 1000) : DEFAULT_PAYMENT.instructions,
  };
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const value = sanitize(body);
    if (!value) return NextResponse.json({ error: "Done envalid." }, { status: 400 });

    const supabase = getSupabase();
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: PAYMENT_KEY, value }, { onConflict: "key" });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, ...value });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
