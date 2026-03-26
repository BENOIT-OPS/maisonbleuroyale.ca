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
 * Active les logs structurés dans la console Edge (local: terminal `next dev` ;
 * prod: flux Vercel / hébergeur). Ajouter dans `.env.local` ou les variables du déploiement :
 * `I18N_DIAGNOSTIC=1`
 */
const I18N_DIAGNOSTIC = process.env.I18N_DIAGNOSTIC === "1";

/**
 * Proxy Edge (Next.js 16+) : auth admin + next-intl.
 *
 * Détection sur `/` :
 * 1. Si `NEXT_LOCALE` + `NEXT_LOCALE_SCOPE=1` (choix manuel via switcher) → redirection vers cette locale.
 * 2. Sinon → next-intl : **Accept-Language** puis `defaultLocale` (`localeCookie: false` → plus de lecture de `NEXT_LOCALE` par next-intl).
 * 3. Sur `/` sans choix manuel : si un ancien `NEXT_LOCALE` est encore présent sans `NEXT_LOCALE_SCOPE`, il est **supprimé** sur la réponse (évite qu’il ne soit renvoyé et perturbe le diagnostic ou un futur code).
 *
 * @see https://next-intl.dev/docs/routing/middleware#locale-detection
 */
const intlMiddleware = createMiddleware(routing);

function isRootPath(pathname: string): boolean {
  return pathname === "/" || pathname === "";
}

function logI18nDiagnostic(
  req: NextRequest,
  extra: {
    phase: string;
    chosenLocale: string | null;
    note?: string;
  },
): void {
  if (!I18N_DIAGNOSTIC) return;
  console.log(
    JSON.stringify({
      tag: "i18n-proxy",
      phase: extra.phase,
      chosenLocale: extra.chosenLocale,
      note: extra.note,
      pathname: req.nextUrl.pathname,
      acceptLanguage: req.headers.get("accept-language"),
      secChAcceptLanguage: req.headers.get("sec-ch-accept-language"),
      cookieNextLocale: req.cookies.get(LOCALE_PREFERENCE_COOKIE)?.value ?? null,
      cookieNextLocaleScope: req.cookies.get(LOCALE_PREFERENCE_MANUAL_COOKIE)?.value ?? null,
      userAgent: req.headers.get("user-agent"),
      ts: new Date().toISOString(),
    }),
  );
}

function localeFromIntlResponse(res: NextResponse, req: NextRequest): string | null {
  const location = res.headers.get("location");
  if (location) {
    try {
      const url = new URL(location, req.url);
      const seg = url.pathname.split("/").filter(Boolean)[0];
      if (seg && routing.locales.includes(seg as AppLocale)) return seg;
    } catch {
      /* ignore */
    }
  }
  const rewrite = res.headers.get("x-middleware-rewrite");
  if (rewrite) {
    try {
      const url = new URL(rewrite, req.url);
      const seg = url.pathname.split("/").filter(Boolean)[0];
      if (seg && routing.locales.includes(seg as AppLocale)) return seg;
    } catch {
      /* ignore */
    }
  }
  return null;
}

/**
 * Ancien `NEXT_LOCALE` (sans choix manuel) ne doit pas rester sur le navigateur après une visite sur `/`.
 * next-intl ne le lit plus pour la négociation, mais Chrome peut encore l’envoyer et brouiller les tests.
 */
function clearStaleNextLocaleCookieOnRootResponse(req: NextRequest, res: NextResponse): NextResponse {
  if (!isRootPath(req.nextUrl.pathname)) return res;
  const manual = req.cookies.get(LOCALE_PREFERENCE_MANUAL_COOKIE)?.value === "1";
  if (manual) return res;
  if (!req.cookies.get(LOCALE_PREFERENCE_COOKIE)) return res;

  res.cookies.set(LOCALE_PREFERENCE_COOKIE, "", {
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });
  return res;
}

function redirectRootToSavedManualLocale(req: NextRequest): NextResponse | null {
  if (!isRootPath(req.nextUrl.pathname)) return null;

  const manual = req.cookies.get(LOCALE_PREFERENCE_MANUAL_COOKIE)?.value === "1";
  const saved = req.cookies.get(LOCALE_PREFERENCE_COOKIE)?.value;
  if (!manual || !saved || !routing.locales.includes(saved as AppLocale)) return null;

  const url = req.nextUrl.clone();
  url.pathname = `/${saved}`;
  const res = NextResponse.redirect(url);
  logI18nDiagnostic(req, { phase: "manual-root-redirect", chosenLocale: saved });
  return clearStaleNextLocaleCookieOnRootResponse(req, res);
}

function runIntlWithDiagnostics(req: NextRequest): NextResponse {
  const res = intlMiddleware(req);
  const chosen = localeFromIntlResponse(res, req);
  logI18nDiagnostic(req, {
    phase: "after-intl-middleware",
    chosenLocale: chosen,
    note: chosen ? undefined : "no locale in Location/rewrite (rewrite 200 ou réponse inchangée)",
  });
  return clearStaleNextLocaleCookieOnRootResponse(req, res);
}

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const nextReq = req as NextRequest;

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

  if (I18N_DIAGNOSTIC && isRootPath(path)) {
    logI18nDiagnostic(nextReq, { phase: "root-before-intl", chosenLocale: null });
  }

  const manualRoot = redirectRootToSavedManualLocale(nextReq);
  if (manualRoot) return manualRoot;

  return runIntlWithDiagnostics(nextReq);
});

export const config = {
  matcher: [
    "/((?!api|trpc|_next|_next/static|_next/image|_vercel|.*\\..*).*)",
    "/api/admin/:path*",
  ],
};
