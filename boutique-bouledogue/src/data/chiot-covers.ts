/**
 * Mapping slug → URL publique (`public/images/chiots/…`).
 * Les clés doivent correspondre exactement à `Puppy.slug` / `FALLBACK_SEEDS` dans `src/lib/puppies.ts`.
 */
export const CHIOT_PLACEHOLDER_PUBLIC = "/images/chiots/placeholder.svg";

export const CHIOT_COVER_FILENAME_OVERRIDES: Record<string, string> = {
  "oscar-bleu": "/images/chiots/oscar-bleu.webp",
  melanie: "/images/chiots/melanie.jpg",
  "ruby-fawn": "/images/chiots/ruby-fawn.jpg",
  "luna-platinum": "/images/chiots/luna-platinum.jpg",
  lolita: "/images/chiots/lolita.jpg",
  "max-reserve": "/images/chiots/max-reserve.jpg",
  "bella-adopte": "/images/chiots/bella-adopte.webp",
  "portee-ete-2026": "/images/chiots/porte%20a%20venir.jpg",
};
