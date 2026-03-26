import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import type { AppLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";

/** En-tête injecté par `next-intl/middleware` sur les routes passées à l’intl (voir paquet `next-intl`, constante interne équivalente). */
export const NEXT_INTL_LOCALE_HEADER = "x-next-intl-locale";

const OG_LOCALE: Record<AppLocale, string> = {
  fr: "fr_CA",
  en: "en_CA",
  es: "es_MX",
};

function baseUrl(): string {
  return siteConfig.url.replace(/\/$/, "");
}

/** Chemin sans locale, comme `usePathname()` (next-intl) : `/`, `/chiots`, `/blog/foo`. */
function normalizePath(pathnameWithoutLocale: string): string {
  if (!pathnameWithoutLocale || pathnameWithoutLocale === "/") return "";
  return pathnameWithoutLocale.startsWith("/") ? pathnameWithoutLocale : `/${pathnameWithoutLocale}`;
}

/**
 * Canonical absolu pour la variante courante + hreflang fr/en/es + x-default → `/`.
 * @param queryString sans `?` (facultatif)
 */
export function alternatesForLocalizedPath(
  locale: AppLocale,
  pathnameWithoutLocale: string,
  queryString?: string,
): NonNullable<Metadata["alternates"]> {
  const path = normalizePath(pathnameWithoutLocale);
  const q = queryString && queryString.length > 0 ? `?${queryString}` : "";
  const localizedPath = `${path}${q}`;

  const base = baseUrl();
  const canonical = `${base}/${locale}${localizedPath}`;

  const languages: Record<string, string> = {
    "x-default": `${base}/`,
  };
  for (const loc of routing.locales) {
    languages[loc] = `${base}/${loc}${localizedPath}`;
  }

  return { canonical, languages };
}

/** `lang` sur `<html>` : lit la locale résolue par le middleware next-intl, sinon locale par défaut (ex. `/admin`). */
export function htmlLangFromHeaderGetter(getHeader: (name: string) => string | null | undefined): AppLocale {
  const raw = getHeader(NEXT_INTL_LOCALE_HEADER);
  if (raw && hasLocale(routing.locales, raw)) return raw;
  return routing.defaultLocale;
}

const defaultOgImageUrl = () => `${baseUrl()}${siteConfig.socialImage}`;

/**
 * title, description, canonical, hreflang, Open Graph et Twitter pour une route localisée.
 */
export function buildLocalizedPageMetadata(
  locale: AppLocale,
  pathnameWithoutLocale: string,
  options: {
    title: string;
    description?: string | undefined;
    queryString?: string;
  },
): Metadata {
  const { title, queryString } = options;
  const description =
    options.description != null && options.description.trim().length > 0
      ? options.description.trim()
      : siteConfig.description;

  const alternates = alternatesForLocalizedPath(locale, pathnameWithoutLocale, queryString);
  const canonical = alternates.canonical as string;
  const ogImage = defaultOgImageUrl();

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: canonical,
      locale: OG_LOCALE[locale],
      type: "website",
      siteName: siteConfig.name,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
