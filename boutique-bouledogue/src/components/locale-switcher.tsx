"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const labels: Record<string, string> = {
  fr: "FR",
  en: "EN",
};

export function LocaleSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <label className="flex items-center gap-2">
      <span className="sr-only">{t("language")}</span>
      <select
        aria-label={t("language")}
        value={locale}
        onChange={(e) => router.replace(pathname, { locale: e.target.value })}
        className="rounded-full border border-stone-200 bg-white/90 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-600 outline-none transition-colors hover:border-stone-300 focus:ring-2 focus:ring-ink-900/15"
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {labels[loc] ?? loc.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
