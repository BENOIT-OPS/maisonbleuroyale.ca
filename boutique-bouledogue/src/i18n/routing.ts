import { defineRouting } from "next-intl/routing";

/**
 * Valeur de locale choisie manuellement (switcher). Lue seulement par `proxy.ts` si `LOCALE_PREFERENCE_MANUAL_COOKIE` est présent.
 * next-intl n’utilise plus ce cookie (`localeCookie: false`) pour éviter qu’un ancien `NEXT_LOCALE=fr` écrase Accept-Language sur `/`.
 */
export const LOCALE_PREFERENCE_COOKIE = "NEXT_LOCALE";

/** Mis à `1` uniquement après clic sur le switcher ; sans lui, la racine `/` suit Accept-Language. */
export const LOCALE_PREFERENCE_MANUAL_COOKIE = "NEXT_LOCALE_SCOPE";

export const routing = defineRouting({
  locales: ["fr", "en", "es"],
  defaultLocale: "fr",
  localePrefix: "always",
  localeDetection: true,
  /** Désactivé : la persistance manuelle est gérée par le proxy + cookies posés au clic (voir `persistManualLocalePreference`). */
  localeCookie: false,
});

export type AppLocale = (typeof routing.locales)[number];
