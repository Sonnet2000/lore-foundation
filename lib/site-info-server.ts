import "server-only";
import { tryGetSupabase } from "@/lib/supabase";
import { DEFAULT_CONTACT, mergeContactInfo, type ContactInfo } from "@/lib/site-info";

const SETTING_KEY = "contact";

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
