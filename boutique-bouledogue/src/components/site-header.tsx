"use client";

import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { mainNavLinks, siteConfig } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-cream-50/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 sm:gap-6 lg:px-8">
        <Link
          href="/"
          className="min-w-0 shrink-0 font-display text-lg font-medium tracking-[0.02em] text-ink-900 sm:text-xl"
          onClick={() => setOpen(false)}
        >
          {siteConfig.name}
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-end gap-5 md:flex lg:gap-7">
          <nav
            className="flex min-w-0 flex-wrap items-center justify-end gap-x-4 gap-y-2.5 sm:gap-x-5 lg:gap-x-6"
            aria-label="Main"
          >
            {mainNavLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-medium uppercase tracking-[0.06em] text-stone-600 transition-colors hover:text-ink-900 lg:text-[0.8125rem] lg:tracking-[0.055em]"
                title={item.navKey === "contact" ? t("contactHint") : undefined}
              >
                {t(item.navKey)}
              </Link>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-3 border-l border-stone-200/90 pl-4 lg:gap-4 lg:pl-6">
            <LocaleSwitcher />
            <Link
              href="/chiots"
              className="whitespace-nowrap rounded-full bg-ink-900 px-4 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-cream-50 transition-opacity hover:opacity-90 lg:px-5"
            >
              {t("reserve")}
            </Link>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3 md:hidden">
          <LocaleSwitcher />
          <Link
            href="/chiots"
            className="rounded-full bg-ink-900 px-3.5 py-2 text-xs font-medium text-cream-50"
            onClick={() => setOpen(false)}
          >
            {t("puppies")}
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-200 text-ink-900"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          className="border-t border-stone-200 bg-cream-50 px-4 py-7 md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <nav className="flex flex-col gap-0.5" aria-label="Mobile">
            {mainNavLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-3.5 text-[0.9375rem] font-medium leading-snug text-ink-900 hover:bg-stone-100/90 active:bg-stone-100"
                title={item.navKey === "contact" ? t("contactHint") : undefined}
                onClick={() => setOpen(false)}
              >
                {t(item.navKey)}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
