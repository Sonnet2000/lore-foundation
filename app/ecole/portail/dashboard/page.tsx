"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/ecole-portail/client";

const roleLabels: Record<string, string> = {
  admin: "Administratè",
  staff: "Anplwaye",
  student: "Etidyan",
};

export default function DashboardPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/ecole/portail/login";
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("full_name, role, staff_role, matricule")
        .eq("id", user.id)
        .single();
      setProfile(data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p className="p-10 text-sm text-slate-400">Chajman...</p>;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-sm text-slate-500">
        {roleLabels[profile?.role] ?? "Kont"}
        {profile?.staff_role ? ` · ${profile.staff_role}` : ""}
      </p>
      <h1 className="text-2xl font-semibold text-[#0B1F3B]">Byenveni, {profile?.full_name ?? ""}</h1>
      {profile?.matricule && <p className="mt-1 text-sm text-slate-400">Matrikil : {profile.matricule}</p>}

      <div className="mt-6">
        <a href="/ecole/portail/courses" className="text-sm text-[#1E4FD8] underline">
          Wè kou yo →
        </a>
      </div>
    </main>
  );
}
