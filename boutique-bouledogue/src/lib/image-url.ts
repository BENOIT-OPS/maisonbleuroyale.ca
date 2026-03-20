import { z } from "zod";
import { CHIOT_COVER_PLACEHOLDER } from "@/lib/chiot-media";

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
  let s = raw.trim();
  if (!s) return CHIOT_COVER_PLACEHOLDER;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/chiots-disponibles/")) {
    s = s.replace("/chiots-disponibles/", "/images/chiots/");
  }
  if (s.startsWith("/")) return s;
  return `/${s.replace(/^\.\//, "")}`;
}
