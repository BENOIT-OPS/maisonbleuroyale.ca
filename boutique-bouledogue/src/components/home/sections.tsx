import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ChevronDown, HeartHandshake, MessageCircle, PawPrint, Shield, Sparkles, Star, Users } from "lucide-react";
import { avisClients100 } from "@/data/testimonials-100";
import { PuppyCardPremium } from "@/components/puppies/puppy-card-premium";
import type { ChiotPublic } from "@/lib/puppies";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import { whatsappPublicHref } from "@/lib/whatsapp-public-href";

const WHY_IMAGE =
  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200&q=85&auto=format&fit=crop";

export async function ReassuranceSection() {
  const t = await getTranslations("reassurance");
  const cards = [
    { icon: Shield, title: t("healthTitle"), text: t("healthText") },
    { icon: Users, title: t("socialTitle"), text: t("socialText") },
    { icon: HeartHandshake, title: t("beforeTitle"), text: t("beforeText") },
    { icon: Sparkles, title: t("trustTitle"), text: t("trustText") },
  ];

  return (
    <section className="border-t border-stone-200/80 bg-cream-50 py-20 sm:py-28" aria-labelledby="reassurance-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">{t("eyebrow")}</p>
          <h2 id="reassurance-title" className="font-display mt-4 text-3xl font-medium text-ink-900 sm:text-4xl">
            {t("title")}
          </h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {cards.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group rounded-2xl border border-stone-100 bg-white p-6 shadow-[0_1px_20px_-6px_rgba(23,21,20,0.08)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_rgba(23,21,20,0.15)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cream-100 text-ink-900 transition-colors group-hover:bg-ink-900 group-hover:text-cream-50">
                <Icon className="h-5 w-5" strokeWidth={1.35} aria-hidden />
              </div>
              <h3 className="font-display mt-5 text-lg font-semibold text-ink-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function FeaturedPuppiesSection({ chiots }: { chiots: ChiotPublic[] }) {
  const t = await getTranslations("featuredPuppies");

  return (
    <section
      className="border-t border-stone-200/80 bg-white py-20 sm:py-28"
      id="chiots-accueil"
      aria-labelledby="home-puppies-title"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">{t("eyebrow")}</p>
            <h2 id="home-puppies-title" className="font-display mt-3 text-3xl font-medium text-ink-900 sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-stone-600 sm:text-base">{t("subtitle")}</p>
          </div>
          <Link
            href="/chiots"
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-full border-2 border-ink-900 px-6 text-xs font-semibold uppercase tracking-[0.14em] text-ink-900 transition-colors hover:bg-ink-900 hover:text-cream-50"
          >
            {t("viewAll")}
          </Link>
        </div>

        {chiots.length === 0 ? (
          <p className="mt-16 text-center text-stone-600">{t("empty")}</p>
        ) : (
          <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {chiots.map((chiot) => (
              <li key={chiot.id}>
                <PuppyCardPremium chiot={chiot} />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            href="/chiots"
            className="inline-flex rounded-full bg-ink-900 px-10 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-cream-50 transition-opacity hover:opacity-90"
          >
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}

const CATALOG_COMING_SOON_HREF = "/chiots?statut=COMING_SOON";

export async function UpcomingLittersSection({ chiots }: { chiots: ChiotPublic[] }) {
  const t = await getTranslations("upcomingLitters");

  return (
    <section
      className="border-t border-amber-200/60 bg-gradient-to-b from-amber-50/40 to-cream-50 py-20 sm:py-28"
      id="portees-a-venir"
      aria-labelledby="upcoming-litters-title"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-amber-900/70">{t("eyebrow")}</p>
            <h2
              id="upcoming-litters-title"
              className="font-display mt-3 text-3xl font-medium text-ink-900 sm:text-4xl"
            >
              {t("title")}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-600 sm:text-base">{t("subtitle")}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/#contact"
              className="inline-flex h-12 shrink-0 items-center justify-center rounded-full border border-amber-800/30 bg-white px-6 text-xs font-semibold uppercase tracking-[0.12em] text-amber-950 transition-colors hover:bg-amber-100/80"
            >
              {t("contactCta")}
            </Link>
            <Link
              href={CATALOG_COMING_SOON_HREF}
              className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-amber-900 px-6 text-xs font-semibold uppercase tracking-[0.14em] text-amber-50 transition-opacity hover:opacity-90"
            >
              {t("viewAll")}
            </Link>
          </div>
        </div>

        {chiots.length === 0 ? (
          <p className="mt-14 max-w-2xl rounded-2xl border border-amber-200/80 bg-white/90 p-6 text-sm leading-relaxed text-stone-600">
            {t("empty")}
          </p>
        ) : (
          <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {chiots.map((chiot) => (
              <li key={chiot.id}>
                <PuppyCardPremium chiot={chiot} primaryAction="reserve" />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={CATALOG_COMING_SOON_HREF}
            className="inline-flex rounded-full border-2 border-amber-900/80 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-amber-950 transition-colors hover:bg-amber-900 hover:text-amber-50"
          >
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}

const CANADIAN_BREED_KEYS = ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b10"] as const;

/** Races souvent recherchées au Canada — contexte SEO / rassurance locale. */
export async function CanadianBreedsSection() {
  const t = await getTranslations("canadianBreeds");
  const tags = CANADIAN_BREED_KEYS.map((k) => t(k));

  return (
    <section
      className="border-t border-stone-200/80 bg-stone-50/80 py-20 sm:py-28"
      aria-labelledby="canadian-breeds-title"
      id="races-populaires-canada"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">{t("eyebrow")}</p>
          <h2 id="canadian-breeds-title" className="font-display mt-4 text-3xl font-medium text-ink-900 sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-stone-600 sm:text-base">{t("intro")}</p>
        </div>

        <div className="mt-12 rounded-3xl border border-ink-900/10 bg-gradient-to-br from-ink-900 via-stone-800 to-stone-900 p-8 text-cream-50 shadow-[0_24px_50px_-24px_rgba(23,21,20,0.45)] sm:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-10">
            <div className="flex gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cream-50/10 ring-1 ring-cream-50/20">
                <PawPrint className="h-7 w-7 text-cream-50" strokeWidth={1.25} aria-hidden />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cream-50/70">{t("highlightKicker")}</p>
                <h3 className="font-display mt-2 text-2xl font-semibold sm:text-3xl">{t("highlightTitle")}</h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-300">{t("highlightText")}</p>
              </div>
            </div>
            <Link
              href="/chiots"
              className="inline-flex h-12 shrink-0 items-center justify-center self-start rounded-full bg-cream-50 px-8 text-xs font-semibold uppercase tracking-[0.12em] text-ink-900 transition-opacity hover:opacity-90 md:self-center"
            >
              {t("cta")}
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">{t("tagsTitle")}</p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3" aria-label={t("tagsTitle")}>
            {tags.map((label) => (
              <li key={label}>
                <span className="inline-flex rounded-full border border-stone-200/90 bg-white px-4 py-2 text-xs font-medium text-stone-700 shadow-sm">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export async function WhyChooseSection() {
  const t = await getTranslations("whyChoose");
  const avantages = [t("adv1"), t("adv2"), t("adv3"), t("adv4")];

  return (
    <section className="border-t border-stone-200/80 bg-cream-100 py-20 sm:py-28" aria-labelledby="why-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-stone-200/60 to-transparent blur-2xl" aria-hidden />
            <div className="relative overflow-hidden rounded-3xl shadow-[0_24px_50px_-20px_rgba(23,21,20,0.25)] ring-1 ring-black/5">
              <Image
                src={WHY_IMAGE}
                alt={t("imageAlt")}
                width={900}
                height={1100}
                className="aspect-[4/5] w-full object-cover sm:aspect-auto sm:h-[min(32rem,70vh)]"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">{t("eyebrow")}</p>
            <h2 id="why-title" className="font-display mt-4 text-3xl font-medium leading-tight text-ink-900 sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-stone-600">{t("body")}</p>
            <ul className="mt-8 space-y-4 border-l-2 border-ink-900/15 pl-5">
              {avantages.map((line, i) => (
                <li key={i} className="text-sm leading-relaxed text-stone-700">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function AdoptionStepsSection() {
  const t = await getTranslations("adoptionSteps");
  const etapes = [
    { n: "01", titre: t("step1Title"), desc: t("step1Desc") },
    { n: "02", titre: t("step2Title"), desc: t("step2Desc") },
    { n: "03", titre: t("step3Title"), desc: t("step3Desc") },
    { n: "04", titre: t("step4Title"), desc: t("step4Desc") },
  ];

  return (
    <section className="border-t border-stone-200/80 bg-white py-20 sm:py-28" aria-labelledby="adoption-steps-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="adoption-steps-title" className="font-display text-3xl font-medium text-ink-900 sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-sm text-stone-600 sm:text-base">{t("subtitle")}</p>
        </div>
        <div className="relative mt-16">
          <div className="absolute left-[1.35rem] top-0 hidden h-full w-px bg-stone-200 md:left-1/2 md:block md:-translate-x-1/2" aria-hidden />
          <ol className="grid gap-10 md:grid-cols-2 md:gap-x-12 md:gap-y-14">
            {etapes.map((e, i) => (
              <li
                key={e.n}
                className={`relative flex gap-5 md:flex-col md:items-center md:text-center ${i % 2 === 1 ? "md:mt-12" : ""}`}
              >
                <span className="relative z-[1] flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-ink-900 bg-cream-50 font-display text-sm font-semibold text-ink-900 shadow-sm md:mx-auto">
                  {e.n}
                </span>
                <div className="rounded-2xl border border-stone-100 bg-cream-50/80 p-5 text-left shadow-sm md:max-w-sm md:p-6 md:text-center">
                  <h3 className="font-display text-lg font-semibold text-ink-900">{e.titre}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">{e.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export async function Testimonials100Section() {
  const t = await getTranslations("testimonials");

  return (
    <section className="border-t border-stone-200/80 bg-cream-50 py-20 sm:py-28" aria-labelledby="avis-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <p className="font-display text-5xl font-light text-ink-900 sm:text-6xl">{t("big")}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">{t("sub")}</p>
          <h2 id="avis-title" className="font-display mt-6 text-3xl font-medium text-ink-900 sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-stone-600 sm:text-[15px]">{t("body")}</p>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">{t("scrollHint")}</p>
          {t("noteLang") ? <p className="mt-3 max-w-xl text-xs text-stone-500">{t("noteLang")}</p> : null}
        </div>

        <div className="relative mt-12 -mx-4 sm:-mx-6">
          <div
            className="pointer-events-none absolute inset-y-1 left-0 z-10 w-10 bg-gradient-to-r from-cream-50 to-transparent sm:w-14"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-1 right-0 z-10 w-10 bg-gradient-to-l from-cream-50 to-transparent sm:w-14"
            aria-hidden
          />
          <div
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-3 pt-1 sm:gap-5 sm:px-6"
            role="region"
            aria-label={t("scrollHint")}
            tabIndex={0}
          >
            {avisClients100.map((avis, idx) => (
              <article
                key={`${avis.name}-${idx}`}
                className="snap-start shrink-0 w-[min(calc(100vw-2.5rem),22rem)] sm:w-96"
              >
                <div className="flex h-full min-h-[14rem] flex-col rounded-2xl border border-stone-200/90 bg-white p-5 shadow-sm sm:min-h-[15rem] sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-0.5 text-amber-400" aria-hidden>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4" strokeWidth={0} />
                      ))}
                    </div>
                    <span className="shrink-0 rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-stone-600">
                      {t("verifiedStyle")}
                    </span>
                  </div>
                  <blockquote className="mt-4 flex flex-1 flex-col">
                    <p className="text-sm leading-relaxed text-stone-700 sm:text-[15px]">&ldquo;{avis.quote}&rdquo;</p>
                  </blockquote>
                  <footer className="mt-5 border-t border-stone-100 pt-4">
                    <cite className="not-italic text-sm font-semibold text-ink-900">{avis.name}</cite>
                    <p className="mt-1 text-xs text-stone-500">{avis.meta}</p>
                  </footer>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export async function FaqAccueilSection() {
  const t = await getTranslations("faq");
  const items = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
    { q: t("q5"), a: t("a5") },
  ];

  return (
    <section className="border-t border-stone-200/80 bg-white py-20 sm:py-28" aria-labelledby="faq-accueil-title">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h2 id="faq-accueil-title" className="font-display text-center text-3xl font-medium text-ink-900 sm:text-4xl">
          {t("title")}
        </h2>
        <div className="mt-10 space-y-2">
          {items.map((item) => (
            <details
              key={item.q}
              className="group overflow-hidden rounded-2xl border border-stone-200/90 bg-cream-50/50 transition-[box-shadow] open:bg-white open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-left font-medium text-ink-900 [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown className="h-5 w-5 shrink-0 text-stone-400 transition-transform duration-200 group-open:rotate-180" aria-hidden />
              </summary>
              <div className="border-t border-stone-100 px-5 pb-4 pt-0">
                <p className="text-sm leading-relaxed text-stone-600">{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function ContactStripSection() {
  const t = await getTranslations("contactStrip");
  const wa = whatsappPublicHref();

  return (
    <section
      className="border-t border-stone-200/80 bg-gradient-to-b from-cream-100 to-cream-50 py-20 sm:py-24"
      aria-labelledby="strip-contact-title"
    >
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 id="strip-contact-title" className="font-display text-3xl font-medium leading-tight text-ink-900 sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-stone-600 sm:text-base">{t("body")}</p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink-900 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-cream-50 shadow-lg transition-opacity hover:opacity-90"
          >
            {t("emailCta")}
          </a>
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-emerald-700/30 bg-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-900 transition-colors hover:bg-emerald-50"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              {t("whatsapp")}
            </a>
          ) : null}
          <Link
            href="#contact"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-stone-300 bg-white/80 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-ink-900 hover:bg-white"
          >
            {t("fullForm")}
          </Link>
        </div>
      </div>
    </section>
  );
}
