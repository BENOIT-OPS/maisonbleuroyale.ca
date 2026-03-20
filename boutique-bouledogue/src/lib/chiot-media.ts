/**
 * Médias chiots : dossier unique `public/images/chiots/`.
 * Guide : public/images/chiots/LISEZMOI.txt
 */

import { CHIOT_COVER_FILENAME_OVERRIDES } from "@/data/chiot-covers";

export const IMAGES_CHIOTS_PUBLIC = "/images/chiots";

/** Image affichée si le fichier local est introuvable ou en erreur de chargement. */
export const CHIOT_COVER_PLACEHOLDER = `${IMAGES_CHIOTS_PUBLIC}/placeholder.svg`;

/**
 * URL publique de la photo de couverture pour un slug donné.
 * Fichier par défaut : `public/images/chiots/{slug}.jpg`
 * Fichier personnalisé : éditez `src/data/chiot-covers.ts` (CHIOT_COVER_FILENAME_OVERRIDES).
 */
export function chiotCoverPublicPath(
  slug: string,
  extension: "jpg" | "jpeg" | "png" | "webp" = "jpg",
): string {
  const custom = CHIOT_COVER_FILENAME_OVERRIDES[slug];
  if (custom) {
    if (custom.startsWith("http://") || custom.startsWith("https://")) return custom;
    return `${IMAGES_CHIOTS_PUBLIC}/${encodeURIComponent(custom)}`;
  }
  return `${IMAGES_CHIOTS_PUBLIC}/${slug}.${extension}`;
}

/** Si une entrée existe dans `chiot-covers.ts` pour ce slug, elle remplace la valeur BDD / démo. */
export function resolveChiotCoverSrc(slug: string, storedCover: string): string {
  if (slug in CHIOT_COVER_FILENAME_OVERRIDES) return chiotCoverPublicPath(slug);
  return storedCover;
}

/** URLs locales (public/) : mieux vaut <img> pour un onError fiable ; distants = next/image. */
export function isRemoteImageUrl(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://");
}
