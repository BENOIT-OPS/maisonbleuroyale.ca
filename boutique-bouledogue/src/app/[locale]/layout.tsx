import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LangAttribute } from "@/components/lang-attribute";
import { LiveChat } from "@/components/live-chat";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const tLayout = await getTranslations({ locale, namespace: "LocaleLayout" });
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  return {
    title: tLayout("title"),
    description: tMeta("homeDescription"),
    alternates: { canonical: `/${locale}` },
    openGraph: {
      title: `${siteConfig.name} — ${tMeta("homeTitle")}`,
      description: tMeta("homeDescription"),
      locale,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <LangAttribute />
      {children}
      <LiveChat />
    </NextIntlClientProvider>
  );
}
