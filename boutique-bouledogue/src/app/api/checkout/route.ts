import { NextResponse } from "next/server";
import { PuppyStatus } from "@prisma/client";
import { z } from "zod";
import { computeDepositCents } from "@/lib/deposit";
import { prisma } from "@/lib/db";
import { getStripeClient } from "@/lib/stripe";

const schema = z.object({
  puppyId: z.string().min(2),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(8),
  message: z.string().optional(),
  locale: z.enum(["fr", "en", "es"]).optional(),
});

export async function POST(request: Request) {
  try {
    const payload = schema.parse(await request.json());
    const locale = payload.locale ?? "fr";

    const puppy = await prisma.puppy.findUnique({ where: { id: payload.puppyId } });
    if (!puppy) {
      return NextResponse.json({ error: "Chiot introuvable." }, { status: 404 });
    }

    if (puppy.status !== PuppyStatus.AVAILABLE) {
      return NextResponse.json(
        { error: "Ce chiot n'est plus disponible pour une reservation en ligne." },
        { status: 409 },
      );
    }

    const row = puppy as typeof puppy & { priceOnRequest?: boolean };
    if (row.priceOnRequest) {
      return NextResponse.json(
        { error: "Pour les chiots 'sur demande', contactez-nous pour fixer l'acompte avant paiement en ligne." },
        { status: 400 },
      );
    }

    const depositAmountCents = computeDepositCents({
      priceCents: puppy.priceCents,
      depositCents: puppy.depositCents,
    });

    const stripe = getStripeClient();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

    if (!stripe || !baseUrl) {
      return NextResponse.json(
        {
          error:
            "Paiement Stripe indisponible : verifiez STRIPE_SECRET_KEY et NEXT_PUBLIC_APP_URL dans votre configuration.",
        },
        { status: 503 },
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        puppyId: puppy.id,
        customerName: payload.customerName,
        customerEmail: payload.customerEmail,
        customerPhone: payload.customerPhone,
        message: payload.message,
        depositAmountCents,
      },
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: payload.customerEmail,
      client_reference_id: reservation.id,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "cad",
            unit_amount: depositAmountCents,
            product_data: {
              name: `Acompte de reservation — ${puppy.name}`,
              description: `Maison Bleu Royale · ${puppy.gender}, ${puppy.color} · Solde apres confirmation avec l'elevage.`,
            },
          },
        },
      ],
      success_url: `${baseUrl}/${locale}/chiots/${puppy.slug}?reservation=success`,
      cancel_url: `${baseUrl}/${locale}/chiots/${puppy.slug}?reservation=cancel`,
      metadata: {
        reservationId: reservation.id,
        puppyId: puppy.id,
        puppySlug: puppy.slug,
        locale,
      },
      payment_intent_data: {
        metadata: {
          reservationId: reservation.id,
          puppyId: puppy.id,
        },
      },
    });

    await prisma.reservation.update({
      where: { id: reservation.id },
      data: { stripeCheckoutSession: session.id },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Impossible de creer la session Stripe." }, { status: 500 });
    }

    return NextResponse.json({
      checkoutUrl: session.url,
      depositAmountCents,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
