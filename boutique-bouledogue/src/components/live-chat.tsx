"use client";

import { MessageCircle } from "lucide-react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { siteConfig } from "@/lib/site";

function whatsappHref(): string | null {
  const raw = siteConfig.whatsappPhone?.replace(/\D/g, "");
  if (!raw || raw.length < 8) return null;
  return `https://wa.me/${raw}`;
}

function FloatingChatFallback() {
  const t = useTranslations("chatBubble");
  const locale = useLocale();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  const wa = whatsappHref();
  const href = wa ?? `/${locale}#contact`;
  const target = wa ? "_blank" : undefined;
  const rel = wa ? "noopener noreferrer" : undefined;

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <a
        href={href}
        target={target}
        rel={rel}
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink-900 text-cream-50 shadow-[0_8px_30px_-4px_rgba(23,21,20,0.35)] ring-2 ring-cream-50/30 transition-transform hover:scale-[1.05] hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
        aria-label={wa ? t("ariaWhatsApp") : t("ariaContact")}
        title={wa ? t("titleWhatsApp") : t("titleContact")}
      >
        <MessageCircle className="h-6 w-6" strokeWidth={1.75} aria-hidden />
      </a>
    </div>
  );
}

export function LiveChat() {
  const crispWebsiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID?.trim();
  const tawkPropertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID?.trim();
  const tawkWidgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID?.trim();

  if (crispWebsiteId) {
    return (
      <Script id="crisp-chat" strategy="afterInteractive">
        {`window.$crisp=[];window.CRISP_WEBSITE_ID="${crispWebsiteId}";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`}
      </Script>
    );
  }

  if (tawkPropertyId && tawkWidgetId) {
    return (
      <Script id="tawk-chat" strategy="afterInteractive">
        {`var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();(function(){var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];s1.async=true;s1.src="https://embed.tawk.to/${tawkPropertyId}/${tawkWidgetId}";s1.charset="UTF-8";s1.setAttribute("crossorigin","*");s0.parentNode.insertBefore(s1,s0);})();`}
      </Script>
    );
  }

  return <FloatingChatFallback />;
}
