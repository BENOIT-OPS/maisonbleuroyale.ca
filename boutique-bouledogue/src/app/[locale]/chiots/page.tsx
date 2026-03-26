import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteShell } from "@/components/site-shell";
import { Link } from "@/i18n/navigation";
import { PuppyCardPremium } from "@/components/puppies/puppy-card-premium";
import type { AppLocale } from "@/i18n/routing";
import {
  getDistinctPuppyColors,
  getDistinctPuppyGenders,
  getPuppiesCatalog,
  type CatalogueFilters,
} from "@/lib/puppies";
import { buildLocalizedPageMetadata } from "@/lib/seo-metadata";
import { PuppyStatus } from "@prisma/client";

const STATUS_VALUES: (PuppyStatus | "all")[] = [
  "all",
  PuppyStatus.AVAILABLE,
  PuppyStatus.RESERVED,
  PuppyStatus.SOLD,
  PuppyStatus.COMING_SOON,
];

function parseStatut(raw: string | undefined): PuppyStatus | "all" {
  if (!raw) return "all";
  return Object.values(PuppyStatus).includes(raw as PuppyStatus) ? (raw as PuppyStatus) : "all";
}

function buildHref(
  current: { statut?: string; sexe?: string; couleur?: string },
  updates: Partial<{ statut: string | undefined; sexe: string | undefined; couleur: string | undefined }>,
) {
  const statut = "statut" in updates ? updates.statut : current.statut;
  const sexe = "sexe" in updates ? updates.sexe : current.sexe;
  const couleur = "couleur" in updates ? updates.couleur : current.couleur;
  const p = new URLSearchParams();
  if (statut && statut !== "all") p.set("statut", statut);
  if (sexe && sexe !== "all") p.set("sexe", sexe);
  if (couleur && couleur !== "all") p.set("couleur", couleur);
  const q = p.toString();
  return q ? `/chiots?${q}` : "/chiots";
}

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ statut?: string; sexe?: string; couleur?: string }>;
};

function catalogSearchString(sp: { statut?: string; sexe?: string; couleur?: string }): string | undefined {
  const q = new URLSearchParams();
  if (sp.statut && sp.statut !== "all") q.set("statut", sp.statut);
  if (sp.sexe && sp.sexe !== "all") q.set("sexe", sp.sexe);
  if (sp.couleur && sp.couleur !== "all") q.set("couleur", sp.couleur);
  const s = q.toString();
  return s.length > 0 ? s : undefined;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as AppLocale;
  const sp = await searchParams;
  const t = await getTranslations({ locale, namespace: "catalog" });
  return buildLocalizedPageMetadata(loc, "/chiots", {
    title: t("title"),
    description: t("intro"),
    queryString: catalogSearchString(sp),
  });
}

export default async function ChiotsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "catalog" });
  const loc = locale as AppLocale;

  const sp = await searchParams;
  const filters: CatalogueFilters = {
    statut: parseStatut(sp.statut),
    sexe: sp.sexe && sp.sexe !== "all" ? sp.sexe : "all",
    couleur: sp.couleur && sp.couleur !== "all" ? sp.couleur : "all",
  };

  const baseQ = { statut: sp.statut, sexe: sp.sexe, couleur: sp.couleur };

  const [chiots, couleurs, sexes] = await Promise.all([
    getPuppiesCatalog(loc, filters),
    getDistinctPuppyColors(),
    getDistinctPuppyGenders(),
  ]);

  const statusLabel = (v: PuppyStatus | "all") => {
    if (v === "all") return t("allStatus");
    if (v === PuppyStatus.AVAILABLE) return t("statusAvailable");
    if (v === PuppyStatus.RESERVED) return t("statusReserved");
    if (v === PuppyStatus.SOLD) return t("statusSold");
    return t("statusComing");
  };

  return (
    <SiteShell>
      <section className="border-b border-stone-200/80 bg-cream-50 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">{t("eyebrow")}</p>
          <h1 className="font-display mt-3 text-4xl font-medium text-ink-900">{t("title")}</h1>
          <p className="mt-3 max-w-2xl text-stone-600">{t("intro")}</p>

          <div className="mt-10 space-y-8">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                {t("filterStatus")}
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {STATUS_VALUES.map((opt) => (
                  <Link
                    key={String(opt)}
                    href={
                      opt === "all"
                        ? buildHref(baseQ, { statut: undefined })
                        : buildHref(baseQ, { statut: String(opt) })
                    }
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      filters.statut === opt
                        ? "bg-ink-900 text-cream-50"
                        : "border border-stone-200 bg-white text-stone-700 hover:border-stone-300"
                    }`}
                  >
                    {statusLabel(opt)}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                {t("filterSex")}
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                <Link
                  href={buildHref(baseQ, { sexe: undefined })}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    filters.sexe === "all"
                      ? "bg-ink-900 text-cream-50"
                      : "border border-stone-200 bg-white text-stone-700"
                  }`}
                >
                  {t("allSexes")}
                </Link>
                {sexes.map((s) => (
                  <Link
                    key={s}
                    href={buildHref(baseQ, { sexe: s })}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                      filters.sexe !== "all" && filters.sexe === s
                        ? "bg-ink-900 text-cream-50"
                        : "border border-stone-200 bg-white text-stone-700"
                    }`}
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                {t("filterColor")}
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                <Link
                  href={buildHref(baseQ, { couleur: undefined })}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    filters.couleur === "all"
                      ? "bg-ink-900 text-cream-50"
                      : "border border-stone-200 bg-white text-stone-700"
                  }`}
                >
                  {t("allColors")}
                </Link>
                {couleurs.map((c) => (
                  <Link
                    key={c}
                    href={buildHref(baseQ, { couleur: c })}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                      filters.couleur !== "all" && filters.couleur === c
                        ? "bg-ink-900 text-cream-50"
                        : "border border-stone-200 bg-white text-stone-700"
                    }`}
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href="/chiots"
              className="inline-block text-xs font-semibold uppercase tracking-[0.12em] text-stone-500 underline-offset-2 hover:underline"
            >
              {t("reset")}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {chiots.length === 0 ? (
            <p className="text-center text-stone-600">{t("empty")}</p>
          ) : (
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {chiots.map((chiot) => (
                <li key={chiot.id}>
                  <PuppyCardPremium chiot={chiot} />
                </li>
              ))}
            </ul>
          )}
          {/* Liste = intégralité de getPuppiesCatalog (fusion BDD + seeds), sans limite ni slice. */}
        </div>
      </section>
    </SiteShell>
  );
}
