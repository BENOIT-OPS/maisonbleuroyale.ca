import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { auth } from "@/auth";
import {
  LOCALE_PREFERENCE_COOKIE,
  LOCALE_PREFERENCE_MANUAL_COOKIE,
  routing,
  type AppLocale,
} from "@/i18n/routing";

/**
 * Proxy Edge (Next.js 16+) : auth admin + next-intl.
 *
 * Détection sur `/` :
 * 1. Si `NEXT_LOCALE` + `NEXT_LOCALE_SCOPE=1` (choix manuel via switcher) → redirection vers cette locale.
 * 2. Sinon → next-intl : **Accept-Language** puis `defaultLocale` (plus de lecture du seul `NEXT_LOCALE` par next-intl).
 *
 * Chemins déjà `/fr`, `/en`, `/es`, … : next-intl s’appuie sur le préfixe ; pas de redirection vers une autre langue.
 *
 * @see https://next-intl.dev/docs/routing/middleware#locale-detection
 */
const intlMiddleware = createMiddleware(routing);

function redirectRootToSavedManualLocale(req: NextRequest): NextResponse | null {
  const path = req.nextUrl.pathname;
  if (path !== "/" && path !== "") return null;

  const manual = req.cookies.get(LOCALE_PREFERENCE_MANUAL_COOKIE)?.value === "1";
  const saved = req.cookies.get(LOCALE_PREFERENCE_COOKIE)?.value;
  if (!manual || !saved || !routing.locales.includes(saved as AppLocale)) return null;

  const url = req.nextUrl.clone();
  url.pathname = `/${saved}`;
  return NextResponse.redirect(url);
}

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

  const manualRoot = redirectRootToSavedManualLocale(req as NextRequest);
  if (manualRoot) return manualRoot;

  return intlMiddleware(req as NextRequest);
});

export const config = {
  matcher: [
    "/((?!api|trpc|_next|_next/static|_next/image|_vercel|.*\\..*).*)",
    "/api/admin/:path*",
  ],
};
