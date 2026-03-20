/**
 * Envoi transactionnel minimal (Resend).
 * Sans RESEND_API_KEY : log en dev, n'interrompt pas le webhook Stripe.
 */

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  bcc?: string;
};

export async function sendTransactionalEmail({ to, subject, html, bcc }: SendEmailParams): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim() || "onboarding@resend.dev";

  if (!apiKey) {
    console.warn(
      "[email] RESEND_API_KEY absent — courriel non envoye. Configurez Resend pour envoyer les confirmations.",
    );
    return false;
  }

  const body: Record<string, unknown> = {
    from,
    to: [to],
    subject,
    html,
  };

  const bccTo = bcc ?? process.env.EMAIL_BCC_ADMIN?.trim();
  if (bccTo) {
    body.bcc = bccTo.includes(",") ? bccTo.split(",").map((s) => s.trim()) : [bccTo];
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("[email] Resend erreur:", res.status, errText);
    return false;
  }

  return true;
}
