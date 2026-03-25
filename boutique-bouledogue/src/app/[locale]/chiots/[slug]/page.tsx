import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PuppyDetailCover } from "@/components/puppies/puppy-detail-cover";
import { ReservationForm } from "@/components/reservation-form";
import { ReservationStatusBanner } from "@/components/reservation-status-banner";
import { SiteShell } from "@/components/site-shell";
import type { AppLocale } from "@/i18n/routing";
import { computeDepositCents, formatCadFromCents } from "@/lib/deposit";
import { getPuppyBySlug } from "@/lib/puppies";
import { PuppyStatus } from "@prisma/client";

type Props = { params: Promise<{ locale: string; slug: string }> };

export default async function PuppyDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "puppyDetail" });

  const puppy = await getPuppyBySlug(slug, loc);
  if (!puppy) return notFound();

  const isDemo = false
  const depositAmountCents = computeDepositCents({
    priceCents: puppy.priceCents,
    depositCents: puppy.depositCents,
  });

  const stripeReady = true;
  /** DISPONIBLE → Stripe ou formulaire « sur demande » ; RÉSERVÉ / VENDU → message seul (voir ReservationForm). */
  const available = puppy.status === PuppyStatus.AVAILABLE;

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <ReservationStatusBanner />
        <div className="grid gap-10 lg:grid-cols-[1.2fr,1fr] lg:gap-14">
          <div className="relative overflow-hidden rounded-3xl bg-stone-100 shadow-lg ring-1 ring-black/5">
            <PuppyDetailCover src={puppy.coverImage} alt={puppy.name} />
          </div>
          <div className="flex flex-col justify-center space-y-5">
            <span className="inline-flex w-fit rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-stone-600">
              {puppy.statusLabel}
            </span>
            <h1 className="font-display text-4xl font-semibold text-ink-900">{puppy.name}</h1>
            <p className="leading-relaxed text-stone-600">{puppy.description}</p>
            <ul className="space-y-2 text-sm text-ink-900">
              <li>
                <span className="text-stone-500">{t("sex")} : </span>
                {puppy.gender}
              </li>
              <li>
                <span className="text-stone-500">{t("age")} : </span>
                {puppy.ageLabel}
              </li>
              <li>
                <span className="text-stone-500">{t("color")} : </span>
                {puppy.color}
              </li>
              <li>
                <span className="text-stone-500">{t("city")} : </span>
                {puppy.city}
              </li>
              <li>
                <span className="text-stone-500">{t("price")} : </span>
                <strong>{puppy.priceDisplay}</strong>
              </li>
              {available && !puppy.priceOnRequest ? (
                <li>
                  <span className="text-stone-500">{t("depositOnline")} : </span>
                  <strong>{formatCadFromCents(depositAmountCents)}</strong>
                  {puppy.depositCents != null ? (
                    <span className="text-stone-500"> {t("depositCustom")}</span>
                  ) : null}
                </li>
              ) : null}
            </ul>
            {puppy.status === PuppyStatus.COMING_SOON ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                {t("comingSoonNote")}
              </p>
            ) : null}
            <ReservationForm
              puppyId={puppy.id}
              puppyName={puppy.name}
              priceCents={puppy.priceCents}
              priceDisplay={puppy.priceDisplay}
              priceOnRequest={puppy.priceOnRequest}
              depositAmountCents={depositAmountCents}
              available={available}
              puppyStatus={puppy.status}
              stripeReady={stripeReady}
              isDemo={false}
            />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
