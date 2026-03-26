"use client";

import { LOCALE_PREFERENCE_COOKIE, LOCALE_PREFERENCE_MANUAL_COOKIE } from "@/i18n/routing";

const MAX_AGE = 60 * 60 * 24 * 365;

/** À appeler au clic sur le switcher : mémorise la locale pour les prochaines visites sur `/`. */
export function persistManualLocalePreference(locale: string): void {
  const secure = typeof window !== "undefined" && window.location.protocol === "https:";
  const attrs = `path=/;max-age=${MAX_AGE};SameSite=Lax${secure ? ";Secure" : ""}`;
  document.cookie = `${LOCALE_PREFERENCE_COOKIE}=${locale};${attrs}`;
  document.cookie = `${LOCALE_PREFERENCE_MANUAL_COOKIE}=1;${attrs}`;
}
