import type { Metadata } from "next";
import Script from "next/script";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LangAttribute } from "@/components/lang-attribute";
import { LiveChat } from "@/components/live-chat";
import { routing } from "@/i18n/routing";

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

<Script
src="https://www.googletagmanager.com/gtag/js?id=AW-18153273551"
strategy="afterInteractive"
/>

<Script id="google-ads" strategy="afterInteractive">
{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-18153273551');
`}
</Script>
</NextIntlClientProvider>
);
}
