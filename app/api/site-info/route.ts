import { NextResponse } from "next/server";
import { getContactInfo } from "@/lib/site-info-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const contact = await getContactInfo();
  return NextResponse.json(contact);
}
