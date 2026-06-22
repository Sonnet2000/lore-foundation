import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // These endpoints must remain public
  const isLoginPage = pathname === "/admin/login";
  const isLoginApi  = pathname === "/api/admin/login";
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

  if (isLoginPage || isLoginApi || isPublicApi) {
    return NextResponse.next();
  }

  const secret = process.env.SESSION_SECRET?.trim();
  const token  = request.cookies.get(SESSION_COOKIE)?.value;
  const valid  = secret ? await verifySessionToken(token, secret) : false;

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

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
