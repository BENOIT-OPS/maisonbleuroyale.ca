"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { siteConfig } from "@/lib/site";

function whatsappHref(): string | null {
  const raw = siteConfig.whatsappPhone?.replace(/\D/g, "");
  if (!raw || raw.length < 8) return null;
  return `https://wa.me/${raw}`;
}

/** Bulle contact / WhatsApp si aucune messagerie tierce (Tawk / Crisp) n’est configurée. */
export function FloatingChatFallback() {
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
