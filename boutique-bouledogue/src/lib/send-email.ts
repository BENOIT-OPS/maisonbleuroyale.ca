/**
 * Envoi transactionnel (Resend).
 * Retour explicite : n’utiliser le succès front qu’avec `result.ok === true`.
 */

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  bcc?: string;
  /** Adresse Resend `reply_to` (ex. courriel visiteur). */
  replyTo?: string;
};

export type SendEmailResult =
  | { ok: true; resendId?: string }
  | { ok: false; error: string; status?: number; resendRaw?: string };

const LOG = "[resend]";

export async function sendTransactionalEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim() || "onboarding@resend.dev";

  console.log(LOG, "EMAIL_FROM (exact):", from);
  console.log(LOG, "Destinataire to (exact):", params.to);
  console.log(LOG, "reply_to (exact):", params.replyTo?.trim() || "(aucun)");
  console.log(LOG, "RESEND_API_KEY présent:", Boolean(apiKey));

  if (!apiKey) {
    console.warn(LOG, "Échec : RESEND_API_KEY absent.");
    return { ok: false, error: "Configuration e-mail incomplète (RESEND_API_KEY)." };
  }

  const body: Record<string, unknown> = {
    from,
    to: [params.to],
    subject: params.subject,
    html: params.html,
  };

  if (params.replyTo?.trim()) {
    body.reply_to = params.replyTo.trim();
  }

  const bccTo = params.bcc ?? process.env.EMAIL_BCC_ADMIN?.trim();
  if (bccTo) {
    body.bcc = bccTo.includes(",") ? bccTo.split(",").map((s) => s.trim()) : [bccTo];
  }

  let res: Response;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur réseau";
    console.error(LOG, "Fetch Resend exception:", msg);
    return { ok: false, error: `Resend injoignable : ${msg}` };
  }

  const raw = await res.text().catch(() => "");
  let parsed: Record<string, unknown> | null = null;
  try {
    parsed = raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
  } catch {
    parsed = null;
  }

  console.log(LOG, "Réponse HTTP:", res.status);
  console.log(LOG, "Réponse brute Resend:", raw.slice(0, 2000));

  if (!res.ok) {
    const message =
      (parsed?.message as string) ||
      (Array.isArray(parsed?.errors) ? JSON.stringify(parsed?.errors) : null) ||
      raw ||
      `HTTP ${res.status}`;
    console.error(LOG, "Échec Resend:", message);
    return { ok: false, error: message, status: res.status, resendRaw: raw };
  }

  const id = typeof parsed?.id === "string" ? parsed.id : undefined;
  console.log(LOG, "Succès, id:", id ?? "(non renvoyé)");
  return { ok: true, resendId: id };
}
