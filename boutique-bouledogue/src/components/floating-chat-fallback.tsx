"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { whatsappPublicHref } from "@/lib/whatsapp-public-href";

/** Bulle WhatsApp flottante uniquement si `NEXT_PUBLIC_WHATSAPP_PHONE` est configuré. */
export function FloatingChatFallback() {
  const t = useTranslations("chatBubble");
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  const href = whatsappPublicHref();
  if (!href) return null;

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink-900 text-cream-50 shadow-[0_8px_30px_-4px_rgba(23,21,20,0.35)] ring-2 ring-cream-50/30 transition-transform hover:scale-[1.05] hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
        aria-label={t("ariaWhatsApp")}
        title={t("titleWhatsApp")}
      >
        <MessageCircle className="h-6 w-6" strokeWidth={1.75} aria-hidden />
      </a>
    </div>
  );
}
