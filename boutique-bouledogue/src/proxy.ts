import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { auth } from "@/auth";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/images/chiots")) {
    return NextResponse.next();
  }

  if (path.startsWith("/api/admin") && !req.auth) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const isAdminLogin = path === "/admin/login";
  const isAdminArea = path.startsWith("/admin");

  if (isAdminArea && !isAdminLogin && !req.auth) {
    const loginUrl = new URL("/admin/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  if (path.startsWith("/admin") || path.startsWith("/api")) {
    return NextResponse.next();
  }

  return intlMiddleware(req as NextRequest);
});

export const config = {
  matcher: [
    "/((?!api|trpc|_next|_next/static|_next/image|_vercel|.*\\..*).*)",
    "/api/admin/:path*",
  ],
};
