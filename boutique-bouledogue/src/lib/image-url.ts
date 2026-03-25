import { z } from "zod";
import { CHIOT_PLACEHOLDER_PUBLIC } from "@/data/chiot-covers";

function isValidImageSrc(s: string): boolean {
  const t = s.trim();
  return /^https?:\/\//i.test(t) || t.startsWith("/");
}

/** URL https ou chemin absolu site (`/images/chiots/…`). */
export const imageSrcFieldSchema = z
  .string()
  .min(1)
  .refine(isValidImageSrc, {
    message: "URL https ou chemin /… (ex. /images/chiots/lolita.jpg)",
  });

/** Corrige chemins sans `/` initial ; migre l’ancien dossier `chiots-disponibles`. */
export function normalizeCoverImageSrc(raw: string): string {
  let s = raw.trim().replace(/\\/g, "/");
  if (!s) return CHIOT_PLACEHOLDER_PUBLIC;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  /** Jamais servir `public/...` tel quel (Next sert depuis `public/` à la racine URL). */
  if (/^public\//i.test(s)) {
    s = `/${s.replace(/^public\//i, "")}`;
  }
  if (s.startsWith("/chiots-disponibles/")) {
    s = s.replace("/chiots-disponibles/", "/images/chiots/");
  }
  if (s.startsWith("/")) return s;
  return `/${s.replace(/^\.\//, "")}`;
}
