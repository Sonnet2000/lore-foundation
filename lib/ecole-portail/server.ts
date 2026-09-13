import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_ECOLE_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_ECOLE_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Rele soti nan yon Server Component pi — pa gen dwa ekri
            // cookie la a, men middleware la deja rafrechi sesyon an.
          }
        },
      },
    }
  );
}

export type Role = "student" | "staff" | "admin";
export type StaffRole = "sekretè" | "pwofesè" | "kontab" | "lòt";

export interface EcoleProfile {
  id: string;
  full_name: string | null;
  role: Role;
  staff_role: StaffRole | null;
  is_active: boolean;
  matricule: string | null;
}

// Li wòl REYÈL la nan tab "profiles" app mobil la — PA yon tab "ecole_*"
// apa. Yon sèl idantite pou mobil AK web.
export async function getEcoleProfile(): Promise<{ user: { id: string; email: string | null } | null; profile: EcoleProfile | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, role, staff_role, is_active, matricule")
    .eq("id", user.id)
    .single();

  return {
    user: { id: user.id, email: user.email ?? null },
    profile: (data as EcoleProfile) ?? null,
  };
}

// Yon "pwofesè" nan sans metye a se yon staff ak staff_role = 'pwofesè'.
// Yon sekretè/kontab se staff tou, men pa ta dwe jere kou/nòt.
export function isTeacher(profile: EcoleProfile | null): boolean {
  return !!profile && (profile.role === "admin" || (profile.role === "staff" && profile.staff_role === "pwofesè"));
}
