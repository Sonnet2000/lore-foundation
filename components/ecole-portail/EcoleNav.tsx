"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EcoleNav() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setReady(true);
        return;
      }
      const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      setRole(data?.role ?? null);
      setReady(true);
    })();
  }, [pathname]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/ecole/portail/login");
    router.refresh();
  }

  if (!ready || !role || pathname === "/ecole/portail/login") return null;

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <Link href="/ecole/portail/dashboard" className="text-sm font-medium text-slate-600 hover:text-[#0B1F3B]">
            Tablo bò
          </Link>
          <Link href="/ecole/portail/courses" className="text-sm font-medium text-slate-600 hover:text-[#0B1F3B]">
            Kou
          </Link>
          <Link href="/ecole/portail/attendance" className="text-sm font-medium text-slate-600 hover:text-[#0B1F3B]">
            Prezans
          </Link>
          <Link href="/ecole/portail/certificates" className="text-sm font-medium text-slate-600 hover:text-[#0B1F3B]">
            Sètifika
          </Link>
          <Link href="/ecole/portail/notifications" className="text-sm font-medium text-slate-600 hover:text-[#0B1F3B]">
            Notifikasyon
          </Link>
          {(role === "staff" || role === "admin") && (
            <Link href="/ecole/portail/admin/create-account" className="text-sm font-medium text-slate-600 hover:text-[#0B1F3B]">
              Kreye kont
            </Link>
          )}
          {role === "admin" && (
            <Link href="/ecole/portail/admin/settings" className="text-sm font-medium text-slate-600 hover:text-[#0B1F3B]">
              Paramèt
            </Link>
          )}
        </div>
        <button onClick={handleLogout} className="text-sm font-medium text-slate-500 hover:text-red-600">
          Dekonekte
        </button>
      </div>
    </nav>
  );
}
