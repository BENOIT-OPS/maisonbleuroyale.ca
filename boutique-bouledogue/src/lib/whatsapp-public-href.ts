import { siteConfig } from "@/lib/site";

/** `https://wa.me/...` si `NEXT_PUBLIC_WHATSAPP_PHONE` est utilisable, sinon `null`. */
export function whatsappPublicHref(): string | null {
  const raw = siteConfig.whatsappPhone.replace(/\D/g, "");
  if (!raw || raw.length < 10) return null;
  return `https://wa.me/${raw}`;
}
