import { NextResponse } from "next/server";
import { PuppyStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { imageSrcFieldSchema } from "@/lib/image-url";
import { requireAdminSession } from "@/lib/require-admin";

const puppySchema = z
  .object({
    name: z.string().min(2),
    slug: z.string().min(2),
    gender: z.string().min(2),
    color: z.string().min(2),
    city: z.string().min(2),
    pedigree: z.string().min(2),
    description: z.string().min(8),
    priceCents: z.number().int().min(0),
    priceOnRequest: z.boolean().optional(),
    birthDate: z.string(),
    coverImage: imageSrcFieldSchema,
    gallery: z.array(imageSrcFieldSchema).default([]),
    featured: z.boolean().optional(),
    status: z.nativeEnum(PuppyStatus).optional(),
    depositCents: z.number().int().positive().nullable().optional(),
  })
  .refine((d) => d.priceOnRequest === true || d.priceCents > 0, {
    message: "Indiquez un prix ou cochez Sur demande.",
  });

export async function GET() {
  const guard = await requireAdminSession();
  if (!guard.ok) return guard.response;

  const puppies = await prisma.puppy.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(puppies);
}

export async function POST(request: Request) {
  const guard = await requireAdminSession();
  if (!guard.ok) return guard.response;

  try {
    const payload = puppySchema.parse(await request.json());
    const { featured, depositCents, priceOnRequest, status: statusIn, ...rest } = payload;
    const puppy = await prisma.puppy.create({
      data: {
        ...rest,
        birthDate: new Date(payload.birthDate),
        status: statusIn ?? PuppyStatus.AVAILABLE,
        featured: featured ?? false,
        priceOnRequest: priceOnRequest ?? false,
        depositCents: depositCents ?? null,
      },
    });
    return NextResponse.json(puppy, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur creation";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
