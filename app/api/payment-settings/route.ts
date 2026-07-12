import { NextResponse } from "next/server";
import { getPaymentSettings } from "@/lib/site-info-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getPaymentSettings();
  return NextResponse.json(settings);
}
