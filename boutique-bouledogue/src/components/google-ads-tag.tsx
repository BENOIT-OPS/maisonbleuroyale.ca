import Script from "next/script";

/** Google Ads (gtag.js) — remplissez NEXT_PUBLIC_GOOGLE_ADS_ID ou la valeur par défaut ci-dessous. */
const DEFAULT_GOOGLE_ADS_ID = "AW-18153273551";

export function GoogleAdsTag() {
  const id =
    typeof process.env.NEXT_PUBLIC_GOOGLE_ADS_ID === "string" &&
    process.env.NEXT_PUBLIC_GOOGLE_ADS_ID.trim().length > 0
      ? process.env.NEXT_PUBLIC_GOOGLE_ADS_ID.trim()
      : DEFAULT_GOOGLE_ADS_ID;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  );
}
