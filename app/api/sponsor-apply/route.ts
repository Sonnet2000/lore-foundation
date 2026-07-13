import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

const VALID_TIERS = ["bronze", "silver", "gold"];

export async function POST(request: Request) {
  // Rate limit: 5 aplikasyon pou chak IP pa èdtan
  const ip = getClientIp(request);
  const { allowed } = rateLimit({ key: `sponsor-apply:${ip}`, limit: 5, windowSeconds: 3600 });
  if (!allowed) {
    return NextResponse.json({ error: "Twòp demand. Eseye ankò pita." }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));

  const name = (body.name ?? "").toString().trim().slice(0, 120);
  const organization = (body.organization ?? "").toString().trim().slice(0, 160);
  const email = (body.email ?? "").toString().trim().toLowerCase().slice(0, 254);
  const phone = (body.phone ?? "").toString().trim().slice(0, 40);
  const tierRaw = (body.tier ?? "bronze").toString().trim().toLowerCase();
  const tier = VALID_TIERS.includes(tierRaw) ? tierRaw : "bronze";
  const message = (body.message ?? "").toString().trim().slice(0, 2000);
  const website_url = (body.website_url ?? "").toString().trim().slice(0, 300);

  if (!name) return NextResponse.json({ error: "Non an obligatwa." }, { status: 400 });
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Imèl envalid." }, { status: 400 });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("sponsors")
    .insert({
      name,
      organization,
      email,
      phone,
      tier,
      message,
      website_url: website_url || null,
      status: "pending",
      is_public: false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data }, { status: 201 });
}
