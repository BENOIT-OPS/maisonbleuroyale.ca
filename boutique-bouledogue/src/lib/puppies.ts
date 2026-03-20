import type { Puppy } from "@prisma/client";
import { PuppyStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { AppLocale } from "@/i18n/routing";
import { mapPuppyToPublic, type ChiotPublic } from "@/lib/chiot-types";
import { chiotCoverPublicPath } from "@/lib/chiot-media";

export type { ChiotPublic };
export type PuppyCard = ChiotPublic;

type PuppySeed = {
  id: string;
  slug: string;
  name: string;
  gender: string;
  color: string;
  city: string;
  priceCents: number;
  priceOnRequest: boolean;
  featured: boolean;
  birthDate: Date;
  description: string;
  status: PuppyStatus;
  coverImage: string;
};

function chiotFromSeed(seed: PuppySeed, locale: AppLocale): ChiotPublic {
  return mapPuppyToPublic(
    {
      id: seed.id,
      name: seed.name,
      slug: seed.slug,
      gender: seed.gender,
      color: seed.color,
      birthDate: seed.birthDate,
      priceCents: seed.priceCents,
      priceOnRequest: seed.priceOnRequest,
      featured: seed.featured,
      depositCents: null,
      description: seed.description,
      pedigree: "CKC",
      city: seed.city,
      status: seed.status,
      coverImage: seed.coverImage,
      gallery: [],
      createdAt: seed.birthDate,
      updatedAt: seed.birthDate,
    } as Puppy,
    locale,
  );
}

/** Photo locale : `public/images/chiots/{slug}.jpg` (ou autre extension) — voir public/images/chiots/LISEZMOI.txt */
function seedCover(
  slug: string,
  extension: "jpg" | "jpeg" | "png" | "webp" = "jpg",
): string {
  return chiotCoverPublicPath(slug, extension);
}

const FALLBACK_SEEDS: PuppySeed[] = [
  {
    id: "mock-1",
    slug: "oscar-bleu",
    name: "Oscar Bleu",
    gender: "Male",
    color: "Bleu",
    city: "Montreal",
    priceCents: 290000,
    priceOnRequest: false,
    featured: true,
    birthDate: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000),
    description: "Chiot calme et sociable, excellent pedigree.",
    status: PuppyStatus.AVAILABLE,
    coverImage: seedCover("oscar-bleu", "webp"),
  },
  {
    id: "mock-2",
    slug: "ruby-fawn",
    name: "Ruby Fawn",
    gender: "Femelle",
    color: "Fawn",
    city: "Quebec",
    priceCents: 265000,
    priceOnRequest: false,
    featured: true,
    birthDate: (() => {
      const d = new Date();
      d.setMonth(d.getMonth() - 3);
      d.setDate(d.getDate() - 23);
      return d;
    })(),
    description: "Tres douce, adaptee a la vie de famille.",
    status: PuppyStatus.AVAILABLE,
    coverImage: seedCover("ruby-fawn"),
  },
  {
    id: "mock-3",
    slug: "luna-platinum",
    name: "Luna Platinum",
    gender: "Femelle",
    color: "Platinum",
    city: "Gatineau",
    priceCents: 278000,
    priceOnRequest: false,
    featured: true,
    birthDate: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000),
    description: "Personnalite douce, disponibilite sur entrevue.",
    status: PuppyStatus.AVAILABLE,
    coverImage: seedCover("luna-platinum"),
  },
  {
    id: "mock-lolita",
    slug: "lolita",
    name: "Lolita",
    gender: "Femelle",
    color: "Fawn",
    city: "Montreal",
    priceCents: 250000,
    priceOnRequest: false,
    featured: true,
    birthDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
    description: "Douce et curieuse, sociabilisation familiale en cours.",
    status: PuppyStatus.AVAILABLE,
    coverImage: seedCover("lolita"),
  },
  {
    id: "mock-r1",
    slug: "max-reserve",
    name: "Max",
    gender: "Male",
    color: "Fawn",
    city: "Sherbrooke",
    priceCents: 272000,
    priceOnRequest: false,
    featured: false,
    birthDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    description: "Fauve à masque noir — réservé.",
    status: PuppyStatus.RESERVED,
    coverImage: seedCover("max-reserve"),
  },
  {
    id: "mock-s1",
    slug: "bella-adopte",
    name: "Bella",
    gender: "Femelle",
    color: "Blanche",
    city: "Laval",
    priceCents: 300000,
    priceOnRequest: false,
    featured: false,
    birthDate: (() => {
      const d = new Date();
      d.setMonth(d.getMonth() - 4);
      d.setDate(d.getDate() - 24);
      return d;
    })(),
    description: "Vendue — nouvelle famille.",
    status: PuppyStatus.SOLD,
    coverImage: seedCover("bella-adopte", "webp"),
  },
  {
    id: "mock-melanie",
    slug: "melanie",
    name: "Melanie",
    gender: "Femelle",
    color: "Noir",
    city: "Quebec",
    priceCents: 261000,
    priceOnRequest: false,
    featured: true,
    birthDate: (() => {
      const d = new Date();
      d.setMonth(d.getMonth() - 5);
      return d;
    })(),
    description: "Douce et curieuse, sociabilisation familiale en cours.",
    status: PuppyStatus.AVAILABLE,
    coverImage: seedCover("melanie"),
  },
  {
    id: "mock-upcoming-1",
    slug: "portee-ete-2026",
    name: "Portée été 2026",
    gender: "NC",
    color: "Palette variée",
    city: "Québec",
    priceCents: 0,
    priceOnRequest: true,
    featured: false,
    birthDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    description:
      "Portée annoncée : inscriptions et informations sur demande. Nous revenons vers vous avec le calendrier et les étapes.",
    status: PuppyStatus.COMING_SOON,
    coverImage: seedCover("portee-ete-2026"),
  },
];

function getFallbackChiots(locale: AppLocale): ChiotPublic[] {
  return FALLBACK_SEEDS.map((s) => chiotFromSeed(s, locale));
}

function shouldUseSeedData(): boolean {
  return !process.env.DATABASE_URL;
}

function filterCatalog(list: ChiotPublic[], filters: CatalogueFilters): ChiotPublic[] {
  const statut = filters.statut ?? "all";
  const sexe = filters.sexe ?? "all";
  const couleur = filters.couleur ?? "all";
  let out = list;
  if (statut !== "all") out = out.filter((c) => c.status === statut);
  if (sexe !== "all") out = out.filter((c) => c.gender.toLowerCase() === sexe.toLowerCase());
  if (couleur !== "all") out = out.filter((c) => c.color.toLowerCase() === couleur.toLowerCase());
  return out;
}

export async function getFeaturedPuppiesForHome(locale: AppLocale): Promise<ChiotPublic[]> {
  const fallback = getFallbackChiots(locale);
  if (shouldUseSeedData()) {
    return fallback.filter((c) => c.featured && c.status === PuppyStatus.AVAILABLE).slice(0, 6);
  }
  try {
    const rows = await prisma.puppy.findMany({
      where: { featured: true, status: PuppyStatus.AVAILABLE },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
    if (rows.length === 0) {
      return fallback.filter((c) => c.featured && c.status === PuppyStatus.AVAILABLE);
    }
    return rows.map((row) => mapPuppyToPublic(row, locale));
  } catch {
    return fallback.filter((c) => c.featured && c.status === PuppyStatus.AVAILABLE);
  }
}

export type CatalogueFilters = {
  statut?: PuppyStatus | "all";
  sexe?: string | "all";
  couleur?: string | "all";
};

export async function getPuppiesCatalog(
  locale: AppLocale,
  filters: CatalogueFilters = {},
): Promise<ChiotPublic[]> {
  const fallback = getFallbackChiots(locale);
  if (shouldUseSeedData()) {
    return filterCatalog(fallback, filters);
  }
  try {
    const statut = filters.statut ?? "all";
    const sexe = filters.sexe ?? "all";
    const couleur = filters.couleur ?? "all";

    const where: import("@prisma/client").Prisma.PuppyWhereInput = {};
    if (statut !== "all") where.status = statut;
    if (sexe !== "all") where.gender = { equals: sexe, mode: "insensitive" };
    if (couleur !== "all") where.color = { equals: couleur, mode: "insensitive" };

    const rows = await prisma.puppy.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return rows.map((row) => mapPuppyToPublic(row, locale));
  } catch {
    return filterCatalog(fallback, filters);
  }
}

/** Portées annoncées (`COMING_SOON`) pour l'accueil — max 6. */
export async function getUpcomingLittersForHome(locale: AppLocale): Promise<ChiotPublic[]> {
  const rows = await getPuppiesCatalog(locale, { statut: PuppyStatus.COMING_SOON });
  return rows.slice(0, 6);
}

export async function getAvailablePuppies(locale: AppLocale = "fr"): Promise<ChiotPublic[]> {
  return getPuppiesCatalog(locale, { statut: PuppyStatus.AVAILABLE });
}

export async function getPuppyBySlug(slug: string, locale: AppLocale): Promise<ChiotPublic | null> {
  const fallback = getFallbackChiots(locale);
  if (shouldUseSeedData()) {
    return fallback.find((c) => c.slug === slug) ?? null;
  }
  try {
    const puppy = await prisma.puppy.findUnique({ where: { slug } });
    if (!puppy) return fallback.find((c) => c.slug === slug) ?? null;
    return mapPuppyToPublic(puppy, locale);
  } catch {
    return fallback.find((c) => c.slug === slug) ?? null;
  }
}

export async function getDistinctPuppyColors(): Promise<string[]> {
  if (shouldUseSeedData()) {
    return [...new Set(FALLBACK_SEEDS.map((c) => c.color))].sort();
  }
  try {
    const rows = await prisma.puppy.findMany({ select: { color: true }, distinct: ["color"] });
    return rows.map((r) => r.color).sort();
  } catch {
    return [...new Set(FALLBACK_SEEDS.map((c) => c.color))].sort();
  }
}

export async function getDistinctPuppyGenders(): Promise<string[]> {
  if (shouldUseSeedData()) {
    return [...new Set(FALLBACK_SEEDS.map((c) => c.gender))].sort();
  }
  try {
    const rows = await prisma.puppy.findMany({ select: { gender: true }, distinct: ["gender"] });
    return rows.map((r) => r.gender).sort();
  } catch {
    return [...new Set(FALLBACK_SEEDS.map((c) => c.gender))].sort();
  }
}
