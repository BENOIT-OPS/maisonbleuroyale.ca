"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";

/** Met à jour l'attribut `lang` du document pour les routes localisées. */
export function LangAttribute() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
