import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Sesyon platfòm /ecole/portail a ap sèvi ak MENM pwojè Supabase ke
// app mobil lore-school-app la — yon pwojè KONPLÈTMAN separe de sa sit
// la itilize pou /compte ak /admin. Se pou sa varyab yo gen non
// diferan (NEXT_PUBLIC_ECOLE_SUPABASE_*) ak yon fichye middleware apa.
export async function protectEcolePortail(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/ecole/portail/login") {
    return NextResponse.next();
  }

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
    const loginUrl = new URL("/ecole/portail/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
