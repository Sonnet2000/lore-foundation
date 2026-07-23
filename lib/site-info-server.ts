import "server-only";
import { tryGetSupabase } from "@/lib/supabase";
import { DEFAULT_CONTACT, mergeContactInfo, type ContactInfo } from "@/lib/site-info";
import { DEFAULT_PAYMENT, mergePaymentSettings, type PaymentSettings } from "@/lib/site-info";
import { DEFAULT_APP_DOWNLOAD, mergeAppDownloadSettings, type AppDownloadSettings } from "@/lib/site-info";

const SETTING_KEY = "contact";
const PAYMENT_KEY = "payment";
const APP_DOWNLOAD_KEY = "app_download";

export async function getContactInfo(): Promise<ContactInfo> {
  try {
    const supabase = tryGetSupabase();
    if (!supabase) return DEFAULT_CONTACT;

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", SETTING_KEY)
      .maybeSingle();

    if (error || !data) return DEFAULT_CONTACT;
    return mergeContactInfo(data.value);
  } catch {
    return DEFAULT_CONTACT;
  }
}

export async function getPaymentSettings(): Promise<PaymentSettings> {
  try {
    const supabase = tryGetSupabase();
    if (!supabase) return DEFAULT_PAYMENT;

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", PAYMENT_KEY)
      .maybeSingle();

    if (error || !data) return DEFAULT_PAYMENT;
    return mergePaymentSettings(data.value);
  } catch {
    return DEFAULT_PAYMENT;
  }
}

export async function getAppDownloadSettings(): Promise<AppDownloadSettings> {
  try {
    const supabase = tryGetSupabase();
    if (!supabase) return DEFAULT_APP_DOWNLOAD;

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", APP_DOWNLOAD_KEY)
      .maybeSingle();

    if (error || !data) return DEFAULT_APP_DOWNLOAD;
    return mergeAppDownloadSettings(data.value);
  } catch {
    return DEFAULT_APP_DOWNLOAD;
  }
}
