import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en", "es"],
  defaultLocale: "fr",
  localePrefix: "always",
  /** `Accept-Language` + cookie `NEXT_LOCALE` ; langues non listées → `defaultLocale` (fr). */
  localeDetection: true,
});

export type AppLocale = (typeof routing.locales)[number];
