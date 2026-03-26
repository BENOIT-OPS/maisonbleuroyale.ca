import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { StaticArticle } from "@/components/static-article";
import type { AppLocale } from "@/i18n/routing";
import { buildLocalizedPageMetadata } from "@/lib/seo-metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "pageDelivery" });
  return buildLocalizedPageMetadata(loc, "/livraison", {
    title: t("title"),
    description: t("metaDescription"),
  });
}

export default async function LivraisonPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pageDelivery" });
  return <StaticArticle title={t("title")} body={t("body")} />;
}
