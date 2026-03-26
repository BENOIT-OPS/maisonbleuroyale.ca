import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactFormSection } from "@/components/contact-form-section";
import { ContactStripSection } from "@/components/home/sections";
import { SiteShell } from "@/components/site-shell";
import type { AppLocale } from "@/i18n/routing";
import { buildLocalizedPageMetadata } from "@/lib/seo-metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "pageContact" });
  return buildLocalizedPageMetadata(loc, "/contact", {
    title: t("title"),
    description: t("metaDescription"),
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <SiteShell>
      <ContactStripSection />
      <ContactFormSection />
    </SiteShell>
  );
}
