"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CHIOT_COVER_PLACEHOLDER, isRemoteImageUrl } from "@/lib/chiot-media";
import type { ChiotPublic } from "@/lib/puppies";

type Props = {
  chiot: ChiotPublic;
  className?: string;
  /** `reserve` : CTA « Réserver » (ex. portée à venir sur l’accueil). */
  primaryAction?: "profile" | "reserve";
};

export function PuppyCardPremium({ chiot, className = "", primaryAction = "profile" }: Props) {
  const t = useTranslations("puppyCard");
  const href = `/chiots/${chiot.slug}`;
  const ctaLabel = primaryAction === "reserve" ? t("reserveCta") : t("profileCta");
  const [coverSrc, setCoverSrc] = useState(chiot.coverImage);

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-100/90 bg-white shadow-[0_2px_24px_-8px_rgba(23,21,20,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-stone-200 hover:shadow-[0_20px_40px_-16px_rgba(23,21,20,0.18)] ${className}`}
    >
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-stone-100">
        {isRemoteImageUrl(coverSrc) ? (
          <Image
            src={coverSrc}
            alt={chiot.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            onError={() => {
              if (coverSrc !== CHIOT_COVER_PLACEHOLDER) setCoverSrc(CHIOT_COVER_PLACEHOLDER);
            }}
          />
        ) : (
          // Fichiers dans public/ : <img> assure un onError si le .jpg manque (next/image est capricieux).
          <img
            src={coverSrc}
            alt={chiot.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            onError={() => {
              if (coverSrc !== CHIOT_COVER_PLACEHOLDER) setCoverSrc(CHIOT_COVER_PLACEHOLDER);
            }}
          />
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-900 shadow-sm backdrop-blur-sm">
            {chiot.statusLabel}
          </span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-xl font-semibold text-ink-900">{chiot.name}</h3>
        <dl className="mt-3 space-y-1.5 text-sm text-stone-600">
          <div className="flex justify-between gap-2">
            <dt className="text-stone-500">{t("sex")}</dt>
            <dd className="font-medium text-ink-900">{chiot.gender}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-stone-500">{t("age")}</dt>
            <dd className="font-medium text-ink-900">{chiot.ageLabel}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-stone-500">{t("color")}</dt>
            <dd className="font-medium text-ink-900">{chiot.color}</dd>
          </div>
        </dl>
        <p className="mt-4 font-display text-lg font-semibold text-ink-900">{chiot.priceDisplay}</p>
        <Link
          href={href}
          className="mt-auto inline-flex items-center justify-center rounded-full border border-ink-900 bg-transparent py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-900 transition-colors group-hover:bg-ink-900 group-hover:text-cream-50"
        >
          {ctaLabel}
        </Link>
      </div>
    </article>
  );
}
