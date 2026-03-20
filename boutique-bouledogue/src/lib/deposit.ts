import type { Puppy } from "@prisma/client";

/** Pourcentage du prix total (defaut 20). */
function depositPercent(): number {
  const raw = process.env.RESERVATION_DEPOSIT_PERCENT;
  const n = raw === undefined ? 20 : Number(raw);
  if (!Number.isFinite(n) || n <= 0 || n > 100) return 20;
  return n;
}

/** Plancher en cents CAD (defaut 50 000 = 500 $). */
function depositMinCents(): number {
  const raw = process.env.RESERVATION_DEPOSIT_MIN_CENTS;
  const n = raw === undefined ? 50_000 : Number(raw);
  if (!Number.isFinite(n) || n < 100) return 50_000;
  return Math.floor(n);
}

export type PuppyLikeForDeposit = Pick<Puppy, "priceCents" | "depositCents">;

/**
 * Montant d'acompte pour un chiot (cents CAD).
 * Si depositCents est defini en base, il est utilise (minimum 100 cents).
 */
export function computeDepositCents(puppy: PuppyLikeForDeposit): number {
  if (puppy.depositCents != null && puppy.depositCents >= 100) {
    return puppy.depositCents;
  }
  const pct = depositPercent() / 100;
  const floor = depositMinCents();
  return Math.max(floor, Math.round(puppy.priceCents * pct));
}

export function formatCadFromCents(cents: number): string {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
  }).format(cents / 100);
}
