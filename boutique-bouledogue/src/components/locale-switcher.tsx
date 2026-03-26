"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const labels: Record<string, string> = {
  fr: "FR",
  en: "EN",
  es: "ES",
};

export function LocaleSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={t("language")} className="flex items-center gap-0.5 rounded-full border border-stone-200 bg-white/90 p-0.5">
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          className={`rounded-full px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ink-900/15 ${
            locale === loc
              ? "bg-ink-900 text-cream-50"
              : "text-stone-600 hover:bg-stone-100/90 hover:text-ink-900"
          }`}
          {...(locale === loc ? { "aria-current": "true" as const } : {})}
        >
          {labels[loc] ?? loc.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
