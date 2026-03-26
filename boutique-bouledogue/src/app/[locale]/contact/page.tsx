"use client";

import { hasLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useLayoutEffect } from "react";
import { routing } from "@/i18n/routing";

/**
 * Redirection vers la section formulaire de l’accueil (HTTP ne transmet pas # — navigation client).
 * Ex. /fr/contact → /fr#contact
 */
export default function ContactRedirectPage() {
  const params = useParams();
  const raw = params.locale;
  const locale = typeof raw === "string" && hasLocale(routing.locales, raw) ? raw : routing.defaultLocale;

  useLayoutEffect(() => {
    window.location.replace(`/${locale}#contact`);
  }, [locale]);

  return (
    <p className="sr-only" aria-live="polite">
      Redirection vers le formulaire de contact…
    </p>
  );
}
