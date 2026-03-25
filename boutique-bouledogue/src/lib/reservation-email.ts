import { formatCadFromCents } from "@/lib/deposit";
import { siteConfig } from "@/lib/site";
import { sendTransactionalEmail } from "@/lib/send-email";

export type ReservationEmailLocale = "fr" | "en" | "es";

type BuildParams = {
  customerName: string;
  customerEmail: string;
  puppyName: string;
  depositAmountCents: number | null;
  locale: ReservationEmailLocale;
};

function paymentInstructionsBlock(locale: ReservationEmailLocale): string {
  const key =
    locale === "en"
      ? "PAYMENT_INSTRUCTIONS_EN"
      : locale === "es"
        ? "PAYMENT_INSTRUCTIONS_ES"
        : "PAYMENT_INSTRUCTIONS_FR";
  const raw = process.env[key]?.trim();
  if (raw) {
    return raw.split("\n").map((line) => `<p>${escapeHtml(line)}</p>`).join("");
  }
  const fallbacks: Record<ReservationEmailLocale, string> = {
    fr: `<p>Nous vous contacterons très bientôt avec les modalités précises pour le solde (virement, Interac, etc.).</p>
<p>En attendant, vous pouvez répondre à ce courriel pour toute question.</p>`,
    en: `<p>We will contact you shortly with exact instructions for the balance (e-transfer, wire, etc.).</p>
<p>Feel free to reply to this email if you have any questions.</p>`,
    es: `<p>Nos pondremos en contacto pronto con las instrucciones exactas para el saldo (transferencia, etc.).</p>
<p>Puede responder a este correo si tiene preguntas.</p>`,
  };
  return fallbacks[locale];
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function buildContent(p: BuildParams): { subject: string; html: string } {
  const deposit =
    p.depositAmountCents != null && p.depositAmountCents > 0
      ? formatCadFromCents(p.depositAmountCents)
      : "—";

  const instructions = paymentInstructionsBlock(p.locale);

  if (p.locale === "en") {
    return {
      subject: `Reservation confirmed — ${p.puppyName} — ${siteConfig.name}`,
      html: `
<!DOCTYPE html>
<html><body style="font-family:Georgia,serif;line-height:1.6;color:#171514;max-width:560px;">
  <p>Hello ${escapeHtml(p.customerName)},</p>
  <p>Your <strong>deposit payment</strong> has been received. Your reservation for <strong>${escapeHtml(p.puppyName)}</strong> is now effective.</p>
  <p><strong>Deposit paid today:</strong> ${escapeHtml(deposit)}</p>
  <h2 style="font-size:1rem;margin-top:1.5rem;">Balance — payment methods</h2>
  ${instructions}
  <p style="margin-top:2rem;font-size:0.9rem;color:#57534e;">— ${escapeHtml(siteConfig.name)}<br/>
  <a href="mailto:${escapeHtml(siteConfig.contactEmail)}">${escapeHtml(siteConfig.contactEmail)}</a></p>
</body></html>`,
    };
  }

  if (p.locale === "es") {
    return {
      subject: `Reserva confirmada — ${p.puppyName} — ${siteConfig.name}`,
      html: `
<!DOCTYPE html>
<html><body style="font-family:Georgia,serif;line-height:1.6;color:#171514;max-width:560px;">
  <p>Hola ${escapeHtml(p.customerName)},</p>
  <p>Hemos recibido su <strong>pago de señal</strong>. Su reserva de <strong>${escapeHtml(p.puppyName)}</strong> queda confirmada.</p>
  <p><strong>Señal pagada hoy:</strong> ${escapeHtml(deposit)}</p>
  <h2 style="font-size:1rem;margin-top:1.5rem;">Saldo — medios de pago</h2>
  ${instructions}
  <p style="margin-top:2rem;font-size:0.9rem;color:#57534e;">— ${escapeHtml(siteConfig.name)}<br/>
  <a href="mailto:${escapeHtml(siteConfig.contactEmail)}">${escapeHtml(siteConfig.contactEmail)}</a></p>
</body></html>`,
    };
  }

  return {
    subject: `Réservation confirmée — ${p.puppyName} — ${siteConfig.name}`,
    html: `
<!DOCTYPE html>
<html><body style="font-family:Georgia,serif;line-height:1.6;color:#171514;max-width:560px;">
  <p>Bonjour ${escapeHtml(p.customerName)},</p>
  <p>Nous confirmons la réception de votre <strong>acompte</strong>. Votre réservation pour <strong>${escapeHtml(p.puppyName)}</strong> est désormais <strong>effective</strong>.</p>
  <p><strong>Acompte réglé aujourd’hui :</strong> ${escapeHtml(deposit)}</p>
  <h2 style="font-size:1rem;margin-top:1.5rem;">Solde — moyens de paiement</h2>
  ${instructions}
  <p style="margin-top:2rem;font-size:0.9rem;color:#57534e;">— ${escapeHtml(siteConfig.name)}<br/>
  <a href="mailto:${escapeHtml(siteConfig.contactEmail)}">${escapeHtml(siteConfig.contactEmail)}</a></p>
</body></html>`,
  };
}

/** Appelé après paiement Stripe confirmé (webhook). Courriel envoyé au **client** (`customerEmail`). */
export async function sendReservationConfirmedEmail(p: BuildParams): Promise<boolean> {
  const { subject, html } = buildContent(p);
  const result = await sendTransactionalEmail({
    to: p.customerEmail,
    subject,
    html,
  });
  return result.ok;
}
