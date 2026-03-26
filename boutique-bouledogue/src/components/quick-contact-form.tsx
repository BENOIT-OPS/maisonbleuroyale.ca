"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { readContactApiError } from "@/lib/contact-api-error";

export function QuickContactForm() {
  const t = useTranslations("quickContact");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value || undefined,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      content: (form.elements.namedItem("content") as HTMLTextAreaElement).value,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        setMessage(readContactApiError(errBody, t("errSend")));
        setStatus("err");
        return;
      }
      setStatus("ok");
      setMessage(t("ok"));
      form.reset();
    } catch {
      setStatus("err");
      setMessage(t("errNet"));
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-stone-600">{t("name")}</span>
          <input
            name="name"
            required
            className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-ink-900 outline-none ring-ink-900/0 transition-[box-shadow] focus:ring-2"
            autoComplete="name"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-stone-600">{t("email")}</span>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-ink-900 outline-none focus:ring-2 focus:ring-ink-900/20"
            autoComplete="email"
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1 block text-stone-600">{t("phone")}</span>
        <input
          name="phone"
          type="tel"
          className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-ink-900 outline-none focus:ring-2 focus:ring-ink-900/20"
          autoComplete="tel"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-stone-600">{t("subject")}</span>
        <input
          name="subject"
          required
          placeholder={t("subjectPh")}
          className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-ink-900 outline-none focus:ring-2 focus:ring-ink-900/20"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-stone-600">{t("message")}</span>
        <textarea
          name="content"
          required
          rows={4}
          className="w-full resize-y rounded-lg border border-stone-200 bg-white px-4 py-3 text-ink-900 outline-none focus:ring-2 focus:ring-ink-900/20"
        />
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-ink-900 py-3.5 text-sm font-medium uppercase tracking-[0.12em] text-cream-50 transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto sm:px-10"
      >
        {status === "loading" ? t("sending") : t("submit")}
      </button>
      {message ? (
        <p className={`text-sm ${status === "ok" ? "text-emerald-800" : status === "err" ? "text-red-800" : "text-stone-600"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
