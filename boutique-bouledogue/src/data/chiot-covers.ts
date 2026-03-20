/**
 * Photos des chiots : fichiers dans `public/images/chiots/`.
 *
 * Par défaut, le site charge : `/images/chiots/{slug}.jpg`
 * (slug = partie URL de la fiche, ex. lolita → lolita.jpg).
 *
 * Si votre fichier porte un autre nom, ajoutez une ligne ci‑dessous :
 *   lolita: "ma-photo-lolita.webp",
 * Vous pouvez aussi mettre une URL https (ex. hébergement externe).
 */
export const CHIOT_COVER_FILENAME_OVERRIDES: Record<string, string> = {
  "portee-ete-2026": "porte a venir.jpg",
  // Exemple quand le nom du fichier ≠ slug.jpg :
  // lolita: "lolita-portrait.jpg",
};
