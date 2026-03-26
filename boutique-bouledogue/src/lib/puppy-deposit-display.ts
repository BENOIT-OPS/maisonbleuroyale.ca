/**
 * Acompte affiché sur le site public pour certaines fiches dont la BDD peut avoir
 * un slug accentué, un acompte null ou un montant erroné (ex. 522 centimes au lieu de 50 000).
 */

const DEPOSIT_DISPLAY_FIX_CENTS = 50_000;

/** Slugs canoniques après normalisation (minuscules, sans accents, espaces → tirets). */
const DEPOSIT_DISPLAY_FIX_KEYS = new Set(["melanie", "oscar-bleu"]);

/**
 * Clé comparable pour slug ou nom (gère mélanie/melanie, Oscar Bleu / oscar_bleu, etc.).
 */
export function publicDepositDisplayKey(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function matchesKnownDepositFix(slug: string, name: string): boolean {
  const keys = [publicDepositDisplayKey(slug), publicDepositDisplayKey(name)];
  return keys.some((k) => k.length > 0 && DEPOSIT_DISPLAY_FIX_KEYS.has(k));
}

/**
 * Résout l’acompte à afficher pour une ligne Puppy / ChiotPublic.
 */
export function resolvePublicDepositCentsForPuppy(
  slug: string,
  name: string,
  depositCents: number | null,
): number | null {
  if (matchesKnownDepositFix(slug, name)) return DEPOSIT_DISPLAY_FIX_CENTS;
  return depositCents;
}

export function applyCanonicalPublicDepositCents<
  T extends { slug: string; name: string; depositCents: number | null },
>(chiot: T): T {
  const depositCents = resolvePublicDepositCentsForPuppy(chiot.slug, chiot.name, chiot.depositCents);
  if (depositCents === chiot.depositCents) return chiot;
  return { ...chiot, depositCents };
}

export function mapWithCanonicalPublicDepositCents<
  T extends { slug: string; name: string; depositCents: number | null },
>(list: T[]): T[] {
  return list.map(applyCanonicalPublicDepositCents);
}
