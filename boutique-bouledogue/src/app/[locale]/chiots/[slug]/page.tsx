import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PuppyDetailCover } from "@/components/puppies/puppy-detail-cover";
import { ReservationForm } from "@/components/reservation-form";
import { ReservationStatusBanner } from "@/components/reservation-status-banner";
import { SiteShell } from "@/components/site-shell";
import type { AppLocale } from "@/i18n/routing";
import { statusLabelForLocale } from "@/lib/chiot-types";
import { formatCadFromCents } from "@/lib/deposit";
import { getPuppyBySlug, type ChiotPublic } from "@/lib/puppies";
import { buildLocalizedPageMetadata } from "@/lib/seo-metadata";
import { siteConfig } from "@/lib/site";
import { PuppyStatus } from "@prisma/client";

/** Compat. : `mapPuppyToPublic` renvoie ces champs à l’exécution ; certains builds peuvent avoir un `ChiotPublic` TS plus ancien. */
type ChiotForReservation = ChiotPublic & {
  recordStatus?: PuppyStatus;
  recordStatusLabel?: string;
};

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = locale as AppLocale;
  const puppy = await getPuppyBySlug(slug, loc);
  if (!puppy) return {};
  const clip = puppy.description.replace(/\s+/g, " ").trim().slice(0, 155);
  const description =
    clip.length > 0 ? `${clip}${puppy.description.length > 155 ? "…" : ""}` : undefined;
  return buildLocalizedPageMetadata(loc, `/chiots/${slug}`, {
    title: `${puppy.name} | ${siteConfig.name}`,
    description,
  });
}

export default async function PuppyDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "puppyDetail" });

  const puppy = await getPuppyBySlug(slug, loc);
  if (!puppy) return notFound();

  const pr = puppy as ChiotForReservation;

  const rawDeposit = puppy.depositCents;
  const depositCentsDisplay =
    rawDeposit != null && rawDeposit >= 100 ? rawDeposit : null;
  const depositLine =
    depositCentsDisplay != null ? formatCadFromCents(depositCentsDisplay) : t("depositOnRequest");
  const publicStatusLabel = statusLabelForLocale(PuppyStatus.AVAILABLE, loc);

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
              {publicStatusLabel}
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
              <li>
                <span className="text-stone-500">{t("depositLabel")} : </span>
                <strong>{depositLine}</strong>
              </li>
            </ul>
            <ReservationForm
              puppyId={puppy.id}
              puppySlug={puppy.slug}
              puppyName={puppy.name}
              priceDisplay={puppy.priceDisplay}
              priceOnRequest={puppy.priceOnRequest}
              recordStatus={pr.recordStatus ?? pr.status}
              recordStatusLabel={pr.recordStatusLabel ?? pr.statusLabel}
              displayStatusLabel={publicStatusLabel}
            />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
