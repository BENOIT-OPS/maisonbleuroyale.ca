import Script from "next/script";
import { FloatingChatFallback } from "@/components/floating-chat-fallback";

function readEnvTrim(key: string): string | undefined {
  const raw = process.env[key];
  if (raw == null || raw === "") return undefined;
  const t = raw.trim();
  return t === "" ? undefined : t;
}

/**
 * Widget chat global : Tawk (prioritaire), sinon Crisp, sinon bulle contact.
 * Les `NEXT_PUBLIC_*` sont lues côté serveur au build — les définir dans Vercel avant le build, puis redéployer.
 */
export function LiveChat() {
  const tawkPropertyId = readEnvTrim("NEXT_PUBLIC_TAWK_PROPERTY_ID");
  const tawkWidgetId = readEnvTrim("NEXT_PUBLIC_TAWK_WIDGET_ID");
  const crispWebsiteId = readEnvTrim("NEXT_PUBLIC_CRISP_WEBSITE_ID");

  if (tawkPropertyId && tawkWidgetId) {
    const src = `https://embed.tawk.to/${encodeURIComponent(tawkPropertyId)}/${encodeURIComponent(tawkWidgetId)}`;
    return (
      <>
        <Script id="tawk-api-globals" strategy="afterInteractive">{`var Tawk_API=Tawk_API||{},Tawk_LoadStart=new Date();`}</Script>
        <Script id="tawk-chat" strategy="afterInteractive" src={src} />
      </>
    );
  }

  if (crispWebsiteId) {
    return (
      <Script id="crisp-chat" strategy="afterInteractive">
        {`window.$crisp=[];window.CRISP_WEBSITE_ID="${crispWebsiteId.replace(/"/g, '\\"')}";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`}
      </Script>
    );
  }

  return <FloatingChatFallback />;
}
