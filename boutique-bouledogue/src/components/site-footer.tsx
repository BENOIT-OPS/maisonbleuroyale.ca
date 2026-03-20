import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { footerInfoLinks, mainNavLinks, siteConfig } from "@/lib/site";

export async function SiteFooter() {
  const year = new Date().getFullYear();
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");

  return (
    <footer className="border-t border-stone-200 bg-ink-900 text-stone-300">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 lg:gap-10">
          <div className="lg:col-span-1">
            <p className="font-display text-xl font-medium text-cream-50">{siteConfig.name}</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-400">{t("tagline")}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">{t("navLabel")}</p>
            <ul className="mt-4 space-y-3 text-sm">
              {mainNavLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-cream-50">
                    {tNav(item.navKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">{t("infoLabel")}</p>
            <ul className="mt-4 space-y-3 text-sm">
              {footerInfoLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-cream-50">
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-stone-500">{t("procedures")}</p>
            <ul className="mt-3 space-y-2 text-sm text-stone-400">
              <li>
                <Link href="/chiots" className="transition-colors hover:text-cream-50">
                  {t("puppiesAvailable")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition-colors hover:text-cream-50">
                  {t("blogAdvice")}
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="transition-colors hover:text-cream-50">
                  {t("contactUs")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">{t("contactLabel")}</p>
            <ul className="mt-4 space-y-3 text-sm text-stone-400">
              <li>{t("region")}</li>
              <li>
                <span className="text-stone-500">{t("emailLabel")} </span>
                <a href={`mailto:${siteConfig.contactEmail}`} className="text-cream-50 hover:underline">
                  {siteConfig.contactEmail}
                </a>
              </li>
              <li className="text-xs text-stone-500">{t("appointment")}</li>
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-stone-800 pt-8 text-center text-xs text-stone-500 sm:flex-row sm:text-left">
          <p>
            &copy; {year} {siteConfig.name}. {t("rights")}
          </p>
          <p>{t("taglineEnd")}</p>
        </div>
      </div>
    </footer>
  );
}
