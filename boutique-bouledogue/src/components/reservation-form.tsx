"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formatCadFromCents } from "@/lib/deposit";

const schema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(8),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  puppyId: string;
  puppyName: string;
  priceCents: number;
  priceDisplay: string;
  priceOnRequest: boolean;
  depositAmountCents: number;
  available: boolean;
  stripeReady: boolean;
  isDemo?: boolean;
};

export function ReservationForm({
  puppyId,
  puppyName,
  priceDisplay,
  priceOnRequest,
  depositAmountCents,
  available,
  stripeReady: _stripeReady,
  isDemo: _isDemo = false,
}: Props) {
  const t = useTranslations("reservation");
  const locale = useLocale();
  const [status, setStatus] = useState("");
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { customerName: "", customerEmail: "", customerPhone: "", message: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setStatus(t("redirecting"));
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ puppyId, locale, ...values }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus(typeof data.error === "string" ? data.error : t("payErr"));
      return;
    }
    if (data.checkoutUrl) {
      window.location.assign(data.checkoutUrl as string);
      return;
    }
    setStatus(t("payOpenErr"));
  });

  if (!available) {
    return (
      <div className="rounded-2xl border border-[#d7c9b0] bg-[#f5f0e8] p-5 text-sm text-[#463d33]">{t("notAvailable")}</div>
    );
  }

  if (priceOnRequest) {
    return (
      <div className="space-y-4 rounded-2xl border border-[#d7c9b0] bg-white p-5">
        <h3 className="text-lg font-semibold">{t("onRequestTitle", { name: puppyName })}</h3>
        <p className="text-sm text-[#463d33]">{t("onRequestBody")}</p>
        <a
          href="#contact"
          className="inline-flex w-full justify-center rounded-xl bg-[#8c6a3f] px-4 py-3 text-white hover:bg-[#715330]"
        >
          {t("contactUs")}
        </a>
      </div>
    );
  }

  return (
    <form 
    onSubmit={onSubmit} 
    className="space-y-3 rounded-2xl border border-[#d7c9b0] bg-white p-5"
    >
      <header className="flex flex-col gap-1 border-b border-[#efe4d4] pb-3">
        <h3 className="text-lg font-semibold">
          {t("reserveTitle", { name: puppyName })}
          </h3>
          <p className="text-sm text-[#463d33]">
            {t("askedPrice")} <strong>{priceDisplay}</strong>
          </p>
          <p className="text-sm text-[#463d33]">
            {t("simpleNote")}
          </p>
        </header>
        <div className="space-y-3">
          <input 
          className="w-full rounded-xl border p-3" 
          placeholder={t("namePh")} 
          {...form.register("customerName")}
           />

          <input
           className="w-full rounded-xl border p-3" 
           placeholder={t("emailPh")} 
           {...form.register("customerEmail")} 
           />

          <input 
          className="w-full rounded-xl border p-3" 
          placeholder={t("phonePh")} 
          {...form.register("customerPhone")} 
          />

          <textarea 
          className="w-full rounded-xl border p-3" 
          placeholder={t("messagePh")} 
          rows={4} 
          {...form.register("message")} 
          />

          <button
           className="w-full rounded-xl bg-[#8c6a3f] px-4 py-3 text-white hover:bg-[#715330]" 
           type="submit"
           >
            {t("payStripe")}
          </button>

          {status ? <p className="text-sm text-[#463d33]">{status}</p> : null}
        </div>
      </form>
);
}