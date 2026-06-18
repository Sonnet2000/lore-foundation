import { getSupabase } from "@/lib/supabase";
import { fallbackSeminars, type Seminar } from "@/lib/data";
import SeminarsClient from "@/components/SeminarsClient";

async function getSeminars(): Promise<Seminar[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("seminars")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error || !data) throw error;

    return data.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      startsAt: row.starts_at,
      location: row.location,
      registrationOpen: row.registration_open,
      media: row.media ?? [],
    }));
  } catch {
    return fallbackSeminars;
  }
}

export default async function Seminars() {
  const seminars = await getSeminars();
  if (seminars.length === 0) return null;

  return <SeminarsClient items={seminars} />;
}
