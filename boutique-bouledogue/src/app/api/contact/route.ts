import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendTransactionalEmail } from "@/lib/send-email";

const schema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Adresse courriel invalide" }),
  phone: z.string().optional(),
  subject: z.string().min(2, { message: "Le sujet doit contenir au moins 2 caractères" }),
  content: z.string().trim().min(1, { message: "Le message est requis" }),
});

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Temporaire : logs diagnostic Resend / formulaires contact & réservation intérêt. */
const LOG = "[api/contact]";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    if (fieldErrors.content?.length) {
      return NextResponse.json({ error: "Le message est requis" }, { status: 400 });
    }
    const first = parsed.error.issues[0];
    const msg =
      typeof first?.message === "string" && first.message.length > 0 ? first.message : "Données invalides.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const payload = parsed.data;

  try {
    const notifyRaw = process.env.RESERVATION_NOTIFY_EMAIL?.trim();
    const emailFrom = process.env.EMAIL_FROM?.trim();

    console.log(LOG, "payload reçu:", JSON.stringify({ ...payload, content: `${payload.content.slice(0, 200)}…` }));
    console.log(LOG, "RESERVATION_NOTIFY_EMAIL (exact):", notifyRaw ?? "(undefined)");
    console.log(LOG, "EMAIL_FROM (exact):", emailFrom ?? "(undefined)");

    if (!notifyRaw) {
      console.error(LOG, "Refus : RESERVATION_NOTIFY_EMAIL manquant.");
      return NextResponse.json(
        { error: "Le site n’est pas configuré pour recevoir les messages (RESERVATION_NOTIFY_EMAIL)." },
        { status: 503 },
      );
    }

    const html = `
<!DOCTYPE html>
<html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#171514;">
  <h2 style="font-size:1rem;">Message depuis le site</h2>
  <p><strong>Sujet :</strong> ${escapeHtml(payload.subject)}</p>
  <p><strong>Nom :</strong> ${escapeHtml(payload.name)}</p>
  <p><strong>Courriel :</strong> ${escapeHtml(payload.email)}</p>
  ${payload.phone ? `<p><strong>Téléphone :</strong> ${escapeHtml(payload.phone)}</p>` : ""}
  <p><strong>Message :</strong></p>
  <pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(payload.content)}</pre>
</body></html>`;

    const emailResult = await sendTransactionalEmail({
      to: notifyRaw,
      replyTo: payload.email,
      subject: `[Site] ${payload.subject}`,
      html,
    });

    if (!emailResult.ok) {
      console.error(LOG, "Resend refusé, erreur interface:", emailResult.error);
      return NextResponse.json(
        { error: emailResult.error || "L’envoi du courriel a échoué. Réessayez plus tard." },
        { status: 502 },
      );
    }

    try {
      const message = await prisma.contactMessage.create({ data: payload });
      console.log(LOG, "Message persisté en BDD, id:", message.id);
      return NextResponse.json(message, { status: 201 });
    } catch (dbErr) {
      console.error(LOG, "Courriel OK mais échec Prisma — message non archivé:", dbErr);
      return NextResponse.json(
        {
          warning: "Message envoyé mais non enregistré en base.",
          sent: true,
          resendId: emailResult.resendId,
        },
        { status: 201 },
      );
    }
  } catch (error) {
    const err = error instanceof Error ? error.message : "Erreur";
    console.error(LOG, "Erreur traitement:", err);
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessayez plus tard." },
      { status: 500 },
    );
  }
}
