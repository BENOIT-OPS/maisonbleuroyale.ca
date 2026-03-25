"use client";

import { useEffect } from "react";

type Props = {
  /** Property ID Tawk (injecté depuis le serveur via `NEXT_PUBLIC_TAWK_PROPERTY_ID`). */
  propertyId: string;
  /** Widget ID Tawk (injecté depuis le serveur via `NEXT_PUBLIC_TAWK_WIDGET_ID`). */
  widgetId: string;
};

/**
 * Charge Tawk **dans le navigateur** (snippet officiel), une seule fois.
 * Les IDs viennent du layout serveur : pas de lecture `process.env` ici pour éviter tout souci d’inlining.
 */
export function TawkEmbed({ propertyId, widgetId }: Props) {
  useEffect(() => {
    if (!propertyId || !widgetId) return;

    const src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    if (document.getElementById("tawkto-embed-js")) return;

    const w = window as Window & { Tawk_API?: object; Tawk_LoadStart?: Date };
    w.Tawk_API = w.Tawk_API || {};
    w.Tawk_LoadStart = new Date();

    const s1 = document.createElement("script");
    s1.id = "tawkto-embed-js";
    s1.async = true;
    s1.src = src;
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");

    const s0 = document.getElementsByTagName("script")[0];
    if (s0?.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    } else {
      document.head.appendChild(s1);
    }
  }, [propertyId, widgetId]);

  return null;
}
