import { getSupabase } from "@/lib/supabase";
import SponsorsClient from "./SponsorsClient";

export default async function Sponsors() {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("sponsors")
    .select("id, name, organization, tier, logo_url, website_url")
    .eq("status", "approved")
    .eq("is_public", true)
    .order("tier", { ascending: false });

  return <SponsorsClient sponsors={data ?? []} />;
}
