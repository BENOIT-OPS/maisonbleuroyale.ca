import type { Puppy } from "@prisma/client";
import { PuppyStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { AppLocale } from "@/i18n/routing";
import { mapPuppyToPublic, type ChiotPublic } from "@/lib/chiot-types";
import { chiotCoverPublicPath } from "@/lib/chiot-media";

/**
 * Chiots réservés à l’accueil (vedette Mélanie + bloc « portée à venir »), exclus du catalogue `/chiots`.
 * Ne pas renommer les slugs ici sans aligner BDD / seeds / médias.
 */
export const HOME_ONLY_SLUGS = ["melanie", "porte-a-venir", "portee-ete-2026"] as const;

export const CATALOG_EXCLUDED_SLUGS = HOME_ONLY_SLUGS;

/** Vedette unique sur l’accueil (formulaire réservation : fiche `/chiots/melanie`). */
export const FEATURED_HOME_PUPPY_SLUG = "melanie" as const;

/** Comparaison insensible à la casse (évite les doublons catalogue si le slug BDD diffère légèrement). */
const CATALOG_EXCLUDED_SLUG_LOWER = new Set(
  HOME_ONLY_SLUGS.map((s) => s.toLowerCase()),
);

function slugExcludedFromCatalog(slug: string): boolean {
  return CATALOG_EXCLUDED_SLUG_LOWER.has(slug.trim().toLowerCase());
}

function isHomePorteeSlug(slug: string): boolean {
  const n = slug.trim().toLowerCase();
  if (n === FEATURED_HOME_PUPPY_SLUG) return false;
  return slugExcludedFromCatalog(n);
}

function excludeCatalogOnlyPuppies(list: ChiotPublic[]): ChiotPublic[] {
  return list.filter((c) => !slugExcludedFromCatalog(c.slug));
}

function catalogSlugKey(slug: string): string {
  return slug.trim().toLowerCase();
}

/** Résolution fiche : même clé que le catalogue fusionné (casse / espaces). */
function findFallbackChiotBySlug(fallback: ChiotPublic[], slug: string): ChiotPublic | null {
  const key = catalogSlugKey(slug);
  const found = fallback.find((c) => catalogSlugKey(c.slug) === key);
  return found ?? null;
}

/**
 * Fusion catalogue `/chiots` : BDD puis seeds pour les slugs manquants (mêmes filtres URL).
 * Même slug en BDD et seed → la fiche BDD est conservée. Prisma peut ne renvoyer qu’une ligne :
 * les seeds manquants complètent jusqu’à la liste autorisée (ex. 6 fiches démo hors accueil).
 */
function mergeCatalogDbWithSeedDefaults(dbList: ChiotPublic[], seedFiltered: ChiotPublic[]): ChiotPublic[] {
  const map = new Map<string, ChiotPublic>();
  for (const c of dbList) {
    map.set(catalogSlugKey(c.slug), c);
  }
  for (const c of seedFiltered) {
    const k = catalogSlugKey(c.slug);
    if (!map.has(k)) map.set(k, c);
  }
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.birthDate).getTime() - new Date(a.birthDate).getTime(),
  );
}

/** Accueil : section « Portées à venir » — nombre de cartes portée. */
export const HOME_UPCOMING_LITTER_LIMIT = 1;

export type { ChiotPublic };
export type PuppyCard = ChiotPublic;

/** Acompte indicatif seeds (500 $ CAD) — modifiable par entrée via `depositCents`. */
const SEED_DEFAULT_DEPOSIT_CENTS = 50_000;

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
  /** Acompte affiché (cents CAD). Défaut : 500 $. */
  depositCents?: number | null;
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
      depositCents: seed.depositCents ?? SEED_DEFAULT_DEPOSIT_CENTS,
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

/** Photo locale : `public/images/chiots/{slug}.jpg` (ou autre extension) — voir `src/data/chiot-covers.ts`. */
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
    featured: false,
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
    featured: false,
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

/** Slugs seeds présents sur Réserver sans filtres (exclus : `melanie`, `porte-a-venir`, `portee-ete-2026`). */
export const CATALOG_SEED_SLUGS: readonly string[] = FALLBACK_SEEDS.filter(
  (s) => !slugExcludedFromCatalog(s.slug),
).map((s) => s.slug);

/** Tous les slugs présents dans les seeds (accueil + catalogue). */
export const ALL_FALLBACK_SEED_SLUGS: readonly string[] = FALLBACK_SEEDS.map((s) => s.slug);

/** `true` si l’`id` correspond à une fiche seed (ex. `mock-1`) — pas de ligne Prisma pour le paiement. */
export function isFallbackSeedPuppyId(id: string): boolean {
  return FALLBACK_SEEDS.some((s) => s.id === id);
}

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
  if (statut !== "all") out = out.filter((c) => c.recordStatus === statut);
  if (sexe !== "all") out = out.filter((c) => c.gender.toLowerCase() === sexe.toLowerCase());
  if (couleur !== "all") out = out.filter((c) => c.color.toLowerCase() === couleur.toLowerCase());
  return out;
}

export async function getFeaturedPuppiesForHome(locale: AppLocale): Promise<ChiotPublic[]> {
  const fallback = getFallbackChiots(locale);
  const melanieSeed = fallback.find((c) => c.slug.trim().toLowerCase() === FEATURED_HOME_PUPPY_SLUG);

  if (shouldUseSeedData()) {
    return melanieSeed ? [melanieSeed] : [];
  }
  try {
    const row = await prisma.puppy.findFirst({
      where: { slug: FEATURED_HOME_PUPPY_SLUG },
    });
    if (row) return [mapPuppyToPublic(row, locale)];
    return melanieSeed ? [melanieSeed] : [];
  } catch {
    return melanieSeed ? [melanieSeed] : [];
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
  const seedCatalogFiltered = excludeCatalogOnlyPuppies(filterCatalog(fallback, filters));
  if (shouldUseSeedData()) {
    return seedCatalogFiltered;
  }
  try {
    const statut = filters.statut ?? "all";
    const sexe = filters.sexe ?? "all";
    const couleur = filters.couleur ?? "all";

    const where: import("@prisma/client").Prisma.PuppyWhereInput = {
      slug: { notIn: [...CATALOG_EXCLUDED_SLUGS] },
    };
    if (statut !== "all") where.status = statut;
    if (sexe !== "all") where.gender = { equals: sexe, mode: "insensitive" };
    if (couleur !== "all") where.color = { equals: couleur, mode: "insensitive" };

    const rows = await prisma.puppy.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    /** BDD vide pour ce filtre → seeds filtrés seuls. */
    if (rows.length === 0) {
      return seedCatalogFiltered;
    }
    const fromDb = excludeCatalogOnlyPuppies(rows.map((row) => mapPuppyToPublic(row, locale)));
    /** Toujours fusionner : une seule ligne Prisma ne doit pas réduire la grille à une carte. */
    return mergeCatalogDbWithSeedDefaults(fromDb, seedCatalogFiltered);
  } catch {
    return seedCatalogFiltered;
  }
}

/** Portées annoncées (`COMING_SOON`) pour l’accueil uniquement (slugs `porte-a-venir` / `portee-ete-2026`). */
export async function getUpcomingLittersForHome(locale: AppLocale): Promise<ChiotPublic[]> {
  const fallback = getFallbackChiots(locale);
  const fromSeed = fallback
    .filter((c) => c.recordStatus === PuppyStatus.COMING_SOON && isHomePorteeSlug(c.slug))
    .slice(0, HOME_UPCOMING_LITTER_LIMIT);

  if (shouldUseSeedData()) {
    return fromSeed;
  }
  try {
    const porteeSlugs = HOME_ONLY_SLUGS.filter((s) => s !== FEATURED_HOME_PUPPY_SLUG);
    const rows = await prisma.puppy.findMany({
      where: {
        status: PuppyStatus.COMING_SOON,
        slug: { in: [...porteeSlugs] },
      },
      orderBy: { createdAt: "desc" },
      take: HOME_UPCOMING_LITTER_LIMIT,
    });
    if (rows.length > 0) return rows.map((row) => mapPuppyToPublic(row, locale));
    return fromSeed;
  } catch {
    return fromSeed;
  }
}

/** Toutes les fiches catalogue (sitemap, etc.) — le site affiche chaque profil comme disponible. */
export async function getAvailablePuppies(locale: AppLocale = "fr"): Promise<ChiotPublic[]> {
  return getPuppiesCatalog(locale, {});
}

export async function getPuppyBySlug(slug: string, locale: AppLocale): Promise<ChiotPublic | null> {
  const normalized = decodeURIComponent(slug).trim();
  if (!normalized) return null;

  const fallback = getFallbackChiots(locale);
  if (shouldUseSeedData()) {
    return findFallbackChiotBySlug(fallback, normalized);
  }

  try {
    let row = await prisma.puppy.findUnique({ where: { slug: normalized } });
    if (!row) {
      try {
        row = await prisma.puppy.findFirst({
          where: { slug: { equals: normalized, mode: "insensitive" } },
        });
      } catch {
        row = null;
      }
    }
    if (row) return mapPuppyToPublic(row, locale);
    return findFallbackChiotBySlug(fallback, normalized);
  } catch {
    return findFallbackChiotBySlug(fallback, normalized);
  }
}

export async function getDistinctPuppyColors(): Promise<string[]> {
  if (shouldUseSeedData()) {
    return [...new Set(FALLBACK_SEEDS.map((c) => c.color))].sort();
  }
  try {
    const rows = await prisma.puppy.findMany({ select: { color: true }, distinct: ["color"] });
    if (rows.length === 0) {
      return [...new Set(FALLBACK_SEEDS.map((c) => c.color))].sort();
    }
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
    if (rows.length === 0) {
      return [...new Set(FALLBACK_SEEDS.map((c) => c.gender))].sort();
    }
    return rows.map((r) => r.gender).sort();
  } catch {
    return [...new Set(FALLBACK_SEEDS.map((c) => c.gender))].sort();
  }
}
