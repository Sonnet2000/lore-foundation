import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function protectEcoleRoutes(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/ecole")) return null;
  if (request.nextUrl.pathname === "/ecole/login") return null;

  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_ECOLE_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_ECOLE_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => response.cookies.set({ name, value, ...options }),
        remove: (name, options) => response.cookies.set({ name, value: "", ...options }),
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/ecole/login", request.url));
  }

  // Menm prensip ak app mobil la (gade schema_is_active_enforcement.sql
  // ak contexts/AuthContext.tsx): yon kont ki DEZAKTIVE pandan sesyon
  // li a toujou valid pa dwe kontinye jwenn aksè, menm si `getUser()`
  // reyisi. Nou verifye `is_active` isit la, nan MIDDLEWARE a — kouch
  // pi ekstèn/pi bonè a — anplis de gid `requireAdmin`/`requireStaff`
  // yo pou defans an pwofondè.
  const { data: profile } = await supabase.from("profiles").select("is_active").eq("id", user.id).single();
  if (profile?.is_active === false) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/ecole/login?dezaktive=1", request.url));
  }

  return response;
}

// middleware.ts rasin ou a:
// import { protectEcoleRoutes } from "@/lib/supabase/ecole-middleware-snippet";
// export async function middleware(request: NextRequest) {
//   const r = await protectEcoleRoutes(request);
//   if (r) return r;
//   // ... rès middleware sit la
// }
// export const config = { matcher: ["/ecole/:path*", /* ... */] };
