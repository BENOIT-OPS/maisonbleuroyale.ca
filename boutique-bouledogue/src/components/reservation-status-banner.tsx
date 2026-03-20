"use client";

import { useTranslations } from "next-intl";
import { Suspense } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

function ReservationBannerInner() {
  const t = useTranslations("reservationBanner");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reservation = searchParams.get("reservation");

  function close() {
    router.replace(pathname);
  }

  if (!reservation) return null;

  if (reservation === "success") {
    return (
      <div className="mb-6 flex items-start justify-between gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-950">
        <p>{t("success")}</p>
        <button type="button" className="shrink-0 text-green-800 underline" onClick={close}>
          {t("close")}
        </button>
      </div>
    );
  }

  if (reservation === "cancel") {
    return (
      <div className="mb-6 flex items-start justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        <p>{t("cancel")}</p>
        <button type="button" className="shrink-0 text-amber-900 underline" onClick={close}>
          {t("close")}
        </button>
      </div>
    );
  }

  return null;
}

export function ReservationStatusBanner() {
  return (
    <Suspense fallback={null}>
      <ReservationBannerInner />
    </Suspense>
  );
}
