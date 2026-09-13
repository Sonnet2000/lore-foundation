import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_ECOLE_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_ECOLE_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Server Component san Route Handler — middleware jere refresh la
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // menm rezon ak anwo a
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
  const supabase = createClient();
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
