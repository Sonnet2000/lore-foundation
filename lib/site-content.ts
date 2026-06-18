import "server-only";
import { getSupabase } from "@/lib/supabase";
import { fallbackAnnouncement, type Announcement } from "@/lib/data";

export async function getActiveAnnouncement(): Promise<Announcement | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return fallbackAnnouncement;

    return {
      id: data.id,
      message: data.message,
      linkUrl: data.link_url,
      linkLabel: data.link_label,
    };
  } catch {
    return fallbackAnnouncement;
  }
}

export async function hasPublishedSeminars(): Promise<boolean> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("seminars")
      .select("id")
      .eq("is_published", true)
      .limit(1);

    if (error) return false;
    return (data?.length ?? 0) > 0;
  } catch {
    return false;
  }
}
