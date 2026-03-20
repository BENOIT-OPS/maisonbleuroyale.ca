import { NextResponse } from "next/server";
import { ReservationStatus, PuppyStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getStripeClient } from "@/lib/stripe";
import {
  sendReservationConfirmedEmail,
  type ReservationEmailLocale,
} from "@/lib/reservation-email";

export const runtime = "nodejs";

function emailLocaleFromMetadata(raw: string | undefined): ReservationEmailLocale {
  if (raw === "en" || raw === "es" || raw === "fr") return raw;
  return "fr";
}

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !secret) {
    console.error("[stripe webhook] STRIPE_SECRET_KEY ou STRIPE_WEBHOOK_SECRET manquant.");
    return NextResponse.json({ error: "Configuration Stripe incomplete." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: "Corps invalide." }, { status: 400 });
  }

  let event: import("stripe").Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Signature invalide";
    console.error("[stripe webhook]", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as import("stripe").Stripe.Checkout.Session;
      if (session.mode !== "payment" || session.payment_status !== "paid") {
        return NextResponse.json({ received: true });
      }

      const reservationId = session.metadata?.reservationId;
      const puppyId = session.metadata?.puppyId;
      if (!reservationId || !puppyId) {
        console.warn("[stripe webhook] Metadata reservation/puppy manquante.");
        return NextResponse.json({ received: true });
      }

      const paymentIntent =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id ?? null;

      const mailPayload = await prisma.$transaction(async (tx) => {
        const reservation = await tx.reservation.findUnique({
          where: { id: reservationId },
          include: { puppy: true },
        });

        if (!reservation || reservation.status === ReservationStatus.PAID) {
          return null;
        }

        if (reservation.puppyId !== puppyId || !reservation.puppy) {
          console.warn("[stripe webhook] Reservation / chiot incoherent.");
          return null;
        }

        await tx.reservation.update({
          where: { id: reservationId },
          data: {
            status: ReservationStatus.PAID,
            stripePaymentIntent: paymentIntent,
          },
        });

        await tx.puppy.updateMany({
          where: {
            id: puppyId,
            status: PuppyStatus.AVAILABLE,
          },
          data: { status: PuppyStatus.RESERVED },
        });

        const locale = emailLocaleFromMetadata(session.metadata?.locale);

        return {
          customerName: reservation.customerName,
          customerEmail: reservation.customerEmail,
          puppyName: reservation.puppy.name,
          depositAmountCents: reservation.depositAmountCents,
          locale,
        };
      });

      if (mailPayload) {
        try {
          await sendReservationConfirmedEmail(mailPayload);
        } catch (e) {
          console.error("[stripe webhook] Envoi courriel confirmation:", e);
        }
      }
    }
  } catch (err) {
    console.error("[stripe webhook] Traitement:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
