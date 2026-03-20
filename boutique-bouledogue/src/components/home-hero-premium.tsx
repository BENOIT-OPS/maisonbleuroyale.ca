"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Shield } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1800&q=88&auto=format&fit=crop";

export function HomeHeroPremium() {
  const t = useTranslations("hero");

  return (
    <section
      className="relative isolate min-h-[100svh] overflow-hidden bg-cream-100 lg:min-h-0"
      aria-label={t("aria")}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_0%_0%,rgba(255,252,248,1)_0%,transparent_55%),radial-gradient(ellipse_70%_50%_at_100%_100%,rgba(237,228,214,0.45)_0%,transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgba(23,21,20,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,21,20,0.04)_1px,transparent_1px)] [background-size:4rem_4rem] sm:opacity-[0.25]"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-8 lg:py-24 xl:py-28">
        <div className="flex flex-col justify-center lg:col-span-5 lg:pr-2 xl:col-span-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-stone-200/90 bg-white/80 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-stone-600 shadow-sm backdrop-blur-sm sm:text-xs">
              <Shield className="h-3.5 w-3.5 text-stone-500" strokeWidth={1.75} aria-hidden />
              {t("badge")}
            </span>
            <span className="hidden text-[11px] font-medium uppercase tracking-[0.18em] text-stone-400 sm:inline sm:text-xs">
              {t("badgeSub")}
            </span>
          </div>

          <h1 className="font-display mt-8 text-[2.125rem] font-medium leading-[1.12] tracking-[-0.02em] text-ink-900 sm:text-5xl sm:leading-[1.08] lg:text-[3.125rem] xl:text-[3.35rem]">
            {t("titleLine1")}
            <span className="mt-1 block bg-gradient-to-r from-ink-900 via-stone-700 to-stone-600 bg-clip-text font-semibold text-transparent sm:mt-0 sm:inline sm:pl-2">
              {t("titleLine2")}
            </span>
          </h1>

          <p className="mt-7 max-w-[26rem] text-base leading-[1.7] text-stone-600 sm:max-w-md sm:text-lg sm:leading-relaxed">
            {t("lead", { name: siteConfig.name })}{" "}
            <strong className="font-medium text-ink-900">{t("leadBold")}</strong>
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="/chiots"
              className="group inline-flex h-14 items-center justify-center rounded-full bg-ink-900 px-8 text-sm font-semibold uppercase tracking-[0.14em] text-cream-50 shadow-[0_8px_30px_-8px_rgba(23,21,20,0.45)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-10px_rgba(23,21,20,0.5)]"
            >
              {t("ctaPrimary")}
            </Link>
            <Link
              href="/chiots"
              className="inline-flex h-14 items-center justify-center rounded-full border border-stone-300 bg-white/70 px-8 text-sm font-semibold uppercase tracking-[0.12em] text-ink-900 backdrop-blur-sm transition-colors hover:border-ink-900/25 hover:bg-white"
            >
              {t("ctaSecondary")}
            </Link>
          </div>

          <ul className="mt-12 flex flex-col gap-3 border-l-2 border-stone-200 pl-4 text-sm text-stone-500 sm:mt-14">
            <li className="flex items-start gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-stone-400" aria-hidden />
              <span>
                {t("trustBefore")}{" "}
                <em className="not-italic font-medium text-stone-700">{t("trustEmphasis")}</em>
              </span>
            </li>
          </ul>
        </div>

        <div className="relative lg:col-span-7 lg:flex lg:items-center xl:col-span-7">
          <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">
            <div
              className="absolute -inset-3 rounded-[2.25rem] bg-gradient-to-br from-stone-200/80 via-transparent to-stone-300/40 opacity-60 blur-2xl sm:-inset-4 lg:-inset-6"
              aria-hidden
            />
            <div className="relative">
              <div className="overflow-hidden rounded-[1.75rem] shadow-[0_25px_60px_-15px_rgba(23,21,20,0.35),0_0_0_1px_rgba(255,255,255,0.65)_inset] ring-1 ring-black/5 sm:rounded-[2rem]">
                <div className="relative aspect-[4/5] w-full sm:aspect-[5/6] lg:aspect-[4/5] xl:min-h-[min(36rem,70svh)]">
                  <Image
                    src={HERO_IMAGE}
                    alt={t("imageAlt")}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-[center_20%]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-tr from-ink-900/25 via-transparent to-transparent"
                    aria-hidden
                  />
                </div>
              </div>

              <div className="absolute -bottom-4 left-4 right-4 sm:-bottom-5 sm:left-8 sm:right-auto sm:max-w-xs lg:-bottom-6 lg:left-10">
                <div className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-[0_-8px_40px_-12px_rgba(23,21,20,0.2)] backdrop-blur-md">
                  <p className="font-display text-lg font-semibold text-ink-900">{t("floatTitle")}</p>
                  <p className="mt-1 text-xs leading-relaxed text-stone-600">{t("floatText")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
