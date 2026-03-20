import { getTranslations, setRequestLocale } from "next-intl/server";
import { StaticArticle } from "@/components/static-article";
type Props = { params: Promise<{ locale: string }> };

export default async function AProposPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pageAbout" });
  return <StaticArticle title={t("title")} body={t("body")} />;
}
