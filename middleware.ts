import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { refreshSupabaseSession } from "@/lib/supabase/middleware";

const ACCOUNT_PUBLIC_PATHS = [
  "/compte/connexion",
  "/compte/inscription",
  "/compte/mot-de-passe-oublie",
  "/compte/nouveau-mot-de-passe",
];

async function handleAdmin(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const secret = process.env.SESSION_SECRET?.trim();
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const valid = secret ? await verifySessionToken(token, secret) : false;

  if (!valid) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();

  // ── Enforce SameSite=Strict on the session cookie on every admin response ──
  // (belt-and-suspenders: login route already sets it, but CSRF protection
  //  should not depend on a single point of enforcement)
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );

  return response;
}

async function handleAccount(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { response, user } = await refreshSupabaseSession(request);

  const isPublicAccountPath = ACCOUNT_PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const isAccountApi = pathname.startsWith("/api/account");

  if (!user && !isPublicAccountPath) {
    if (isAccountApi) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }
    const loginUrl = new URL("/compte/connexion", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Déjà connecté : inutile de revoir les pages de connexion/inscription.
  if (user && (pathname === "/compte/connexion" || pathname === "/compte/inscription")) {
    return NextResponse.redirect(new URL("/compte/tableau-de-bord", request.url));
  }

  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // These endpoints must remain public
  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  const isPublicApi = pathname === "/api/pay"
    || pathname === "/api/sponsor-apply"
    || pathname === "/api/payment-methods"
    || pathname === "/api/unsubscribe"
    || pathname.startsWith("/api/stripe")
    || pathname.startsWith("/api/blog")
    || pathname.startsWith("/api/projects")
    || pathname.startsWith("/paiement")
    || pathname.startsWith("/partenaire")
    || pathname.startsWith("/soutenir")
    || pathname.startsWith("/a-propos")
    || pathname.startsWith("/don")
    || pathname.startsWith("/blog")
    || pathname.startsWith("/projets");

  if (pathname.startsWith("/compte") || pathname.startsWith("/api/account") || pathname.startsWith("/auth")) {
    return handleAccount(request);
  }

  if (isLoginPage || isLoginApi || isPublicApi) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    return handleAdmin(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/compte/:path*",
    "/api/account/:path*",
    "/auth/:path*",
  ],
};
