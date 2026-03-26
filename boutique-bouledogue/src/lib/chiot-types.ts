import { PuppyStatus, type Puppy } from "@prisma/client";
import type { AppLocale } from "@/i18n/routing";
import { normalizeCoverImageSrc } from "@/lib/image-url";
import { resolveChiotCoverSrc } from "@/lib/chiot-media";
import { resolvePublicDepositCentsForPuppy } from "@/lib/puppy-deposit-display";

/** Vue publique normalisee pour cartes et fiches (evolutif). */
export type ChiotPublic = {
  id: string;
  slug: string;
  name: string;
  gender: string;
  ageLabel: string;
  color: string;
  city: string;
  /** Statut tel qu’en base (filtres catalogue, e-mail, logique métier). */
  recordStatus: PuppyStatus;
  /** Libellé localisé du statut en base (pour e-mails internes). */
  recordStatusLabel: string;
  /** Toujours `AVAILABLE` côté site public (badge, UX). */
  status: PuppyStatus;
  /** Libellé affiché sur le site (= disponible), localisé. */
  statusLabel: string;
  priceCents: number;
  priceOnRequest: boolean;
  priceDisplay: string;
  featured: boolean;
  disponible: boolean;
  coverImage: string;
  gallery: string[];
  description: string;
  birthDate: Date;
  pedigree: string;
  depositCents: number | null;
};

const STATUS_LABELS: Record<AppLocale, Record<PuppyStatus, string>> = {
  fr: {
    AVAILABLE: "Disponible",
    RESERVED: "Réservé",
    SOLD: "Vendu",
    COMING_SOON: "Portée à venir",
  },
  en: {
    AVAILABLE: "Available",
    RESERVED: "Reserved",
    SOLD: "Sold",
    COMING_SOON: "Upcoming litter",
  },
};

const PRICE_ON_REQUEST: Record<AppLocale, string> = {
  fr: "Sur demande",
  en: "On request",
};

/** Âge affiché pour les fiches « portée à venir » (pas d’âge réel du chiot). */
const COMING_SOON_AGE_LABELS: Record<AppLocale, string> = {
  fr: "Chiots à naître",
  en: "Puppies not yet born",
};

const NUMBER_LOCALE: Record<AppLocale, string> = {
  fr: "fr-CA",
  en: "en-CA",
};

export function statusLabelForLocale(status: PuppyStatus, locale: AppLocale): string {
  return STATUS_LABELS[locale]?.[status] ?? STATUS_LABELS.fr[status];
}

/** @deprecated Utilisez statusLabelForLocale */
export function statusLabelFr(status: PuppyStatus): string {
  return statusLabelForLocale(status, "fr");
}

const MS_PER_DAY = 86400000;

export function formatAgeForLocale(birthDate: Date, locale: AppLocale, reference: Date = new Date()): string {
  const birth = new Date(birthDate);
  let months =
    (reference.getFullYear() - birth.getFullYear()) * 12 + (reference.getMonth() - birth.getMonth());
  if (reference.getDate() < birth.getDate()) months -= 1;
  months = Math.max(0, months);

  if (locale === "fr") {
    if (months < 12) {
      const milestone = new Date(birth);
      milestone.setMonth(milestone.getMonth() + months);
      const extraDays = Math.max(0, Math.floor((reference.getTime() - milestone.getTime()) / MS_PER_DAY));
      const w = Math.floor(extraDays / 7);
      if (months <= 1) {
        if (months === 0 && w > 0) return w === 1 ? "1 semaine" : `${w} semaines`;
        if (months === 1 && w > 0) return `1 mois et ${w} semaine${w > 1 ? "s" : ""}`;
        return "1 mois";
      }
      if (w > 0) return `${months} mois et ${w} semaine${w > 1 ? "s" : ""}`;
      return `${months} mois`;
    }
    const years = Math.floor(months / 12);
    const m = months % 12;
    if (m === 0) return years <= 1 ? "1 an" : `${years} ans`;
    return `${years} an${years > 1 ? "s" : ""} et ${m} mois`;
  }

  // en
  if (months < 12) {
    const milestone = new Date(birth);
    milestone.setMonth(milestone.getMonth() + months);
    const extraDays = Math.max(0, Math.floor((reference.getTime() - milestone.getTime()) / MS_PER_DAY));
    const w = Math.floor(extraDays / 7);
    if (months <= 1) {
      if (months === 0 && w > 0) return w === 1 ? "1 week" : `${w} weeks`;
      if (months === 1 && w > 0) return `1 month and ${w} week${w > 1 ? "s" : ""}`;
      return months <= 1 ? "1 month" : `${months} months`;
    }
    if (w > 0) return `${months} months and ${w} week${w > 1 ? "s" : ""}`;
    return months === 1 ? "1 month" : `${months} months`;
  }
  const years = Math.floor(months / 12);
  const m = months % 12;
  if (m === 0) return years === 1 ? "1 year" : `${years} years`;
  return `${years} year${years > 1 ? "s" : ""} and ${m} month${m > 1 ? "s" : ""}`;
}

/** Age en français à partir de la date de naissance. */
export function formatAgeFr(birthDate: Date, reference: Date = new Date()): string {
  return formatAgeForLocale(birthDate, "fr", reference);
}

export function formatPriceDisplayForLocale(
  priceCents: number,
  priceOnRequest: boolean,
  locale: AppLocale,
): string {
  if (priceOnRequest) return PRICE_ON_REQUEST[locale];
  return (priceCents / 100).toLocaleString(NUMBER_LOCALE[locale], {
    style: "currency",
    currency: "CAD",
  });
}

export function formatPriceDisplay(priceCents: number, priceOnRequest: boolean): string {
  return formatPriceDisplayForLocale(priceCents, priceOnRequest, "fr");
}

export function mapPuppyToPublic(p: Puppy, locale: AppLocale = "fr"): ChiotPublic {
  const row = p as Puppy & { priceOnRequest?: boolean; featured?: boolean };
  const priceOnRequest = row.priceOnRequest ?? false;
  const featured = row.featured ?? false;
  const recordStatus = p.status;
  const displayStatus = PuppyStatus.AVAILABLE;
  const depositCents = resolvePublicDepositCentsForPuppy(p.slug, p.name, p.depositCents);
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    gender: p.gender,
    ageLabel:
      recordStatus === PuppyStatus.COMING_SOON
        ? (COMING_SOON_AGE_LABELS[locale] ?? COMING_SOON_AGE_LABELS.fr)
        : formatAgeForLocale(p.birthDate, locale),
    color: p.color,
    city: p.city,
    recordStatus,
    recordStatusLabel: statusLabelForLocale(recordStatus, locale),
    status: displayStatus,
    statusLabel: statusLabelForLocale(displayStatus, locale),
    priceCents: p.priceCents,
    priceOnRequest,
    priceDisplay: formatPriceDisplayForLocale(p.priceCents, priceOnRequest, locale),
    featured,
    disponible: true,
    coverImage: normalizeCoverImageSrc(resolveChiotCoverSrc(p.slug, p.coverImage)),
    gallery: p.gallery.map((g) => normalizeCoverImageSrc(g)),
    description: p.description,
    birthDate: p.birthDate,
    pedigree: p.pedigree,
    depositCents,
  };
}
