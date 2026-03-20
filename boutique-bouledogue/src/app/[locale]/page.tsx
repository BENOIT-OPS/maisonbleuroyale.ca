import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PremiumHome } from "@/components/premium-home";
import { SiteShell } from "@/components/site-shell";
import type { AppLocale } from "@/i18n/routing";
import { getFeaturedPuppiesForHome, getUpcomingLittersForHome } from "@/lib/puppies";
import { siteConfig } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
    openGraph: {
      title: `${siteConfig.name} | ${t("homeTitle")}`,
      description: t("homeDescription"),
    },
  };
}

function jsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "PetStore",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    areaServed: { "@type": "Country", name: "Canada" },
    email: siteConfig.contactEmail,
  };
  return JSON.stringify(data);
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [featuredPuppies, upcomingLitters] = await Promise.all([
    getFeaturedPuppiesForHome(locale as AppLocale),
    getUpcomingLittersForHome(locale as AppLocale),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd() }} />
      <SiteShell>
        <PremiumHome featuredPuppies={featuredPuppies} upcomingLitters={upcomingLitters} />
      </SiteShell>
    </>
  );
}
