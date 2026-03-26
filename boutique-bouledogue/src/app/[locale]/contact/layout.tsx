import type { Metadata } from "next";
import type { ReactNode } from "react";

/** Entrée technique vers l’ancre #contact de l’accueil — non destinée à l’indexation. */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function ContactRedirectLayout({ children }: { children: ReactNode }) {
  return children;
}
