import { Suspense } from "react";
import { FloatingChatFallback } from "@/components/floating-chat-fallback";
import { TawkEmbed } from "@/components/tawk-embed";

function readEnvTrim(key: string): string | undefined {
  const raw = process.env[key];
  if (raw == null || raw === "") return undefined;
  const t = raw.trim();
  return t === "" ? undefined : t;
}

/**
 * Tawk si les deux `NEXT_PUBLIC_*` sont définies (lues côté serveur au build) ;
 * sinon bulle contact / WhatsApp. Pas de Crisp ici.
 */
export function LiveChat() {
  const tawkPropertyId = readEnvTrim("NEXT_PUBLIC_TAWK_PROPERTY_ID");
  const tawkWidgetId = readEnvTrim("NEXT_PUBLIC_TAWK_WIDGET_ID");

  if (tawkPropertyId && tawkWidgetId) {
    return (
      <Suspense fallback={null}>
        <TawkEmbed propertyId={tawkPropertyId} widgetId={tawkWidgetId} />
      </Suspense>
    );
  }

  return <FloatingChatFallback />;
}
