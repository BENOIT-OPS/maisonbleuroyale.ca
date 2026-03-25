"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PuppyStatus } from "@prisma/client";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(8),
  message: z.string().optional(),
});

const comingSoonSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
type ComingSoonFormValues = z.infer<typeof comingSoonSchema>;

type Props = {
  puppyId: string;
  puppySlug: string;
  puppyName: string;
  priceDisplay: string;
  priceOnRequest: boolean;
  available: boolean;
  puppyStatus: PuppyStatus;
};

export function ReservationForm({
  puppyId,
  puppySlug,
  puppyName,
  priceDisplay,
  priceOnRequest,
  available,
  puppyStatus,
}: Props) {
  const t = useTranslations("reservation");
  const locale = useLocale();
  const [status, setStatus] = useState("");

  const isComingSoon = puppyStatus === PuppyStatus.COMING_SOON;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { customerName: "", customerEmail: "", customerPhone: "", message: "" },
  });

  const comingSoonForm = useForm<ComingSoonFormValues>({
    resolver: zodResolver(comingSoonSchema),
    defaultValues: { customerName: "", customerEmail: "", customerPhone: "", message: "" },
  });

  const onRequestForm = useForm<ComingSoonFormValues>({
    resolver: zodResolver(comingSoonSchema),
    defaultValues: { customerName: "", customerEmail: "", customerPhone: "", message: "" },
  });

  async function postReservationEmail(
    values: { customerName: string; customerEmail: string; customerPhone?: string; message?: string },
    subject: string,
    defaultLetter: string,
    opts?: { includeListedPrice?: boolean },
  ): Promise<boolean> {
    setStatus(t("sendingInterest"));
    let meta = `Chiot : ${puppyName}\nIdentifiant : ${puppyId}\nFiche (slug) : ${puppySlug}\nLangue du site : ${locale}\n`;
    if (opts?.includeListedPrice) {
      meta += `Prix affiché : ${priceDisplay}\n`;
    }
    meta += "\n";
    const extra = values.message?.trim() ?? "";
    const content =
      extra.length >= 8 ? `${meta}${extra}` : `${meta}${defaultLetter}${extra ? `\n\n${extra}` : ""}`;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.customerName,
          email: values.customerEmail,
          phone: values.customerPhone?.trim() || undefined,
          subject,
          content,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus(typeof data.error === "string" ? data.error : t("interestErr"));
        return false;
      }
      setStatus(t("interestSent"));
      return true;
    } catch {
      setStatus(t("interestErr"));
      return false;
    }
  }

  const onSubmitFixedPrice = form.handleSubmit(async (values) => {
    const ok = await postReservationEmail(
      values,
      t("reserveFixedSubject", { name: puppyName }),
      t("reserveFixedLetter", { name: puppyName }),
      { includeListedPrice: true },
    );
    if (ok) form.reset();
  });

  const onSubmitInterest = comingSoonForm.handleSubmit(async (values) => {
    const ok = await postReservationEmail(
      values,
      t("comingSoonSubject", { name: puppyName }),
      t("comingSoonInterestLetter", { name: puppyName }),
    );
    if (ok) comingSoonForm.reset();
  });

  const onSubmitPriceOnRequest = onRequestForm.handleSubmit(async (values) => {
    const ok = await postReservationEmail(
      values,
      t("onRequestContactSubject", { name: puppyName }),
      t("onRequestLetter", { name: puppyName }),
    );
    if (ok) onRequestForm.reset();
  });

  if (isComingSoon) {
    return (
      <form
        onSubmit={onSubmitInterest}
        className="space-y-3 rounded-2xl border border-[#d7c9b0] bg-white p-5"
      >
        <header className="flex flex-col gap-1 border-b border-[#efe4d4] pb-3">
          <h3 className="text-lg font-semibold">{t("reserveTitle", { name: puppyName })}</h3>
          <p className="text-sm text-[#463d33]">{t("comingSoonInterestIntro")}</p>
        </header>
        <div className="space-y-3">
          <input
            className="w-full rounded-xl border p-3"
            placeholder={t("namePh")}
            {...comingSoonForm.register("customerName")}
          />
          <input
            className="w-full rounded-xl border p-3"
            placeholder={t("emailPh")}
            {...comingSoonForm.register("customerEmail")}
          />
          <input
            className="w-full rounded-xl border p-3"
            placeholder={t("phonePh")}
            {...comingSoonForm.register("customerPhone")}
          />
          <textarea
            className="w-full rounded-xl border p-3"
            placeholder={t("messagePh")}
            rows={4}
            {...comingSoonForm.register("message")}
          />
          <button
            className="w-full rounded-xl bg-[#8c6a3f] px-4 py-3 text-white hover:bg-[#715330]"
            type="submit"
          >
            {t("sendInterest")}
          </button>
          {status ? <p className="text-sm text-[#463d33]">{status}</p> : null}
        </div>
      </form>
    );
  }

  if (!available) {
    return (
      <div className="rounded-2xl border border-[#d7c9b0] bg-[#f5f0e8] p-5 text-sm text-[#463d33]">
        {t("notAvailable")}
      </div>
    );
  }

  if (priceOnRequest) {
    return (
      <form
        onSubmit={onSubmitPriceOnRequest}
        className="space-y-3 rounded-2xl border border-[#d7c9b0] bg-white p-5"
      >
        <header className="flex flex-col gap-1 border-b border-[#efe4d4] pb-3">
          <h3 className="text-lg font-semibold">{t("onRequestTitle", { name: puppyName })}</h3>
          <p className="text-sm text-[#463d33]">{t("onRequestBody")}</p>
        </header>
        <div className="space-y-3">
          <input
            className="w-full rounded-xl border p-3"
            placeholder={t("namePh")}
            {...onRequestForm.register("customerName")}
          />
          <input
            className="w-full rounded-xl border p-3"
            placeholder={t("emailPh")}
            {...onRequestForm.register("customerEmail")}
          />
          <input
            className="w-full rounded-xl border p-3"
            placeholder={t("phonePh")}
            {...onRequestForm.register("customerPhone")}
          />
          <textarea
            className="w-full rounded-xl border p-3"
            placeholder={t("messagePh")}
            rows={4}
            {...onRequestForm.register("message")}
          />
          <button
            className="w-full rounded-xl bg-[#8c6a3f] px-4 py-3 text-white hover:bg-[#715330]"
            type="submit"
          >
            {t("sendInterest")}
          </button>
          {status ? <p className="text-sm text-[#463d33]">{status}</p> : null}
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmitFixedPrice} className="space-y-3 rounded-2xl border border-[#d7c9b0] bg-white p-5">
      <header className="flex flex-col gap-1 border-b border-[#efe4d4] pb-3">
        <h3 className="text-lg font-semibold">{t("reserveTitle", { name: puppyName })}</h3>
        <p className="text-sm text-[#463d33]">
          {t("askedPrice")} <strong>{priceDisplay}</strong>
        </p>
        <p className="text-sm text-[#463d33]">{t("simpleNote")}</p>
      </header>
      <div className="space-y-3">
        <input className="w-full rounded-xl border p-3" placeholder={t("namePh")} {...form.register("customerName")} />
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
        <textarea className="w-full rounded-xl border p-3" placeholder={t("messagePh")} rows={4} {...form.register("message")} />
        <button className="w-full rounded-xl bg-[#8c6a3f] px-4 py-3 text-white hover:bg-[#715330]" type="submit">
          {t("reserveNow")}
        </button>
        {status ? <p className="text-sm text-[#463d33]">{status}</p> : null}
      </div>
    </form>
  );
}
