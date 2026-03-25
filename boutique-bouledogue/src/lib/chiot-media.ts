/**
 * Médias chiots : dossier unique `public/images/chiots/` → URLs `/images/chiots/…`.
 */

import {
  CHIOT_COVER_FILENAME_OVERRIDES,
  CHIOT_PLACEHOLDER_PUBLIC,
} from "@/data/chiot-covers";
import { normalizeCoverImageSrc } from "@/lib/image-url";

export const IMAGES_CHIOTS_PUBLIC = "/images/chiots";

/** Image affichée si le fichier local est introuvable ou en erreur de chargement. */
export const CHIOT_COVER_PLACEHOLDER = CHIOT_PLACEHOLDER_PUBLIC;

const DEBUG_IMAGES =
  process.env.NODE_ENV === "development" || process.env.DEBUG_CHIOT_IMAGES === "1";

function debugChiotImage(payload: Record<string, unknown>) {
  if (DEBUG_IMAGES) {
    console.log("[chiot-image]", payload);
  }
}

/** Clé exacte dans les overrides (trim + casse insensible). */
export function findChiotOverrideKey(slug: string): string | undefined {
  const t = slug.trim();
  if (!t) return undefined;
  if (t in CHIOT_COVER_FILENAME_OVERRIDES) return t;
  const lower = t.toLowerCase();
  return Object.keys(CHIOT_COVER_FILENAME_OVERRIDES).find((k) => k.toLowerCase() === lower);
}

/**
 * URL publique de la photo de couverture pour un slug donné.
 * Fichier par défaut : `public/images/chiots/{slug}.jpg`
 * Fichier personnalisé : `src/data/chiot-covers.ts`.
 */
export function chiotCoverPublicPath(
  slug: string,
  extension: "jpg" | "jpeg" | "png" | "webp" = "jpg",
): string {
  const key = findChiotOverrideKey(slug) ?? slug.trim();
  const custom = CHIOT_COVER_FILENAME_OVERRIDES[key];
  if (custom) {
    if (custom.startsWith("http://") || custom.startsWith("https://")) return custom;
    if (custom.startsWith("/")) return custom;
    return `${IMAGES_CHIOTS_PUBLIC}/${encodeURIComponent(custom)}`;
  }
  return `${IMAGES_CHIOTS_PUBLIC}/${key}.${extension}`;
}

/** Chemins autorisés après normalisation (hors placeholder). */
function isUsableCoverPath(path: string): boolean {
  if (!path || path === CHIOT_COVER_PLACEHOLDER) return false;
  return (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("/images/chiots/") ||
    path.startsWith("/images/")
  );
}

/**
 * Résout l’URL finale de couverture : overrides slug → normalisation BDD → placeholder.
 */
export function resolveChiotCoverSrc(slug: string, storedCover: string): string {
  const overrideKey = findChiotOverrideKey(slug);
  if (overrideKey !== undefined) {
    const path = chiotCoverPublicPath(overrideKey);
    debugChiotImage({ slug: slug.trim(), coverPath: path, source: "chiot-covers" });
    return path;
  }

  const normalized = normalizeCoverImageSrc(storedCover);
  if (isUsableCoverPath(normalized)) {
    debugChiotImage({ slug: slug.trim(), coverPath: normalized, source: "database" });
    return normalized;
  }

  const guessed = `${IMAGES_CHIOTS_PUBLIC}/${slug.trim().toLowerCase()}.jpg`;
  debugChiotImage({
    slug: slug.trim(),
    coverPath: CHIOT_COVER_PLACEHOLDER,
    source: "fallback-placeholder",
    storedRaw: storedCover,
    guessedWouldBe: guessed,
  });
  return CHIOT_COVER_PLACEHOLDER;
}

export function isRemoteImageUrl(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://");
}
