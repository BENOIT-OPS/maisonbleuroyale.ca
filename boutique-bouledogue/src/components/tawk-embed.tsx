"use client";

import { usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

type Props = {
  /** Property ID Tawk (injecté depuis le serveur via `NEXT_PUBLIC_TAWK_PROPERTY_ID`). */
  propertyId: string;
  /** Widget ID Tawk (injecté depuis le serveur via `NEXT_PUBLIC_TAWK_WIDGET_ID`). */
  widgetId: string;
};

type TawkAPI = {
  onLoad?: (...args: unknown[]) => void;
  setAttributes?: (attrs: Record<string, string>, cb?: (err?: string) => void) => void;
  addEvent?: (name: string, meta?: Record<string, string>, cb?: (err?: string) => void) => void;
};

type TawkWindow = Window & { Tawk_API?: TawkAPI; Tawk_LoadStart?: Date };

const ATTR_MAX = 255;
const EVENT_NAME = "spa-pageview";

/** Évite de chaîner `onLoad` plusieurs fois (ex. Strict Mode ou remontages). */
let tawkOnLoadChained = false;

function clip255(s: string): string {
  return s.length <= ATTR_MAX ? s : s.slice(0, ATTR_MAX);
}

/** Notifie Tawk de la page courante (URL, chemin+query, titre), une fois l’API prête. */
function pushTawkPageContext(): void {
  if (typeof window === "undefined") return;

  const w = window as TawkWindow;
  const apply = (): boolean => {
    const tawk = w.Tawk_API;
    if (!tawk?.setAttributes) return false;

    const href = window.location.href;
    const pathWithQuery = `${window.location.pathname}${window.location.search}`;
    const title = document.title || "";

    tawk.setAttributes(
      {
        "page-url": clip255(href),
        "page-path": clip255(pathWithQuery),
        "page-title": clip255(title),
      },
      () => {},
    );

    tawk.addEvent?.(
      EVENT_NAME,
      {
        url: clip255(href),
        path: clip255(pathWithQuery),
        title: clip255(title),
      },
      () => {},
    );

    return true;
  };

  const scheduleRetries = () => {
    let n = 0;
    const max = 30;
    const tick = () => {
      if (apply() || n >= max) return;
      n += 1;
      window.setTimeout(tick, 200);
    };
    tick();
  };

  if (!apply()) scheduleRetries();
  window.setTimeout(apply, 0);
  window.setTimeout(apply, 150);
}

/**
 * Charge Tawk **dans le navigateur** (snippet officiel), une seule fois,
 * puis met à jour URL / titre côté Tawk à chaque navigation client (App Router).
 */
export function TawkEmbed({ propertyId, widgetId }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();

  useEffect(() => {
    if (!propertyId || !widgetId) return;

    const w = window as TawkWindow;
    w.Tawk_API = w.Tawk_API || {};

    if (!tawkOnLoadChained) {
      tawkOnLoadChained = true;
      const prevOnLoad = w.Tawk_API.onLoad;
      w.Tawk_API.onLoad = function (this: unknown, ...args: unknown[]) {
        prevOnLoad?.apply(this, args);
        pushTawkPageContext();
      };
    }

    if (document.getElementById("tawkto-embed-js")) {
      pushTawkPageContext();
      return;
    }

    w.Tawk_LoadStart = new Date();

    const src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
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

  useEffect(() => {
    if (!propertyId || !widgetId) return;
    pushTawkPageContext();
  }, [propertyId, widgetId, pathname, searchKey]);

  return null;
}
