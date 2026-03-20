import { NextResponse } from "next/server";
import { PuppyStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { imageSrcFieldSchema } from "@/lib/image-url";
import { requireAdminSession } from "@/lib/require-admin";

const puppyUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  gender: z.string().min(2).optional(),
  color: z.string().min(2).optional(),
  city: z.string().min(2).optional(),
  pedigree: z.string().min(2).optional(),
  description: z.string().min(8).optional(),
  priceCents: z.number().int().min(0).optional(),
  priceOnRequest: z.boolean().optional(),
  birthDate: z.string().optional(),
  coverImage: imageSrcFieldSchema.optional(),
  gallery: z.array(imageSrcFieldSchema).optional(),
  status: z.nativeEnum(PuppyStatus).optional(),
  featured: z.boolean().optional(),
  depositCents: z.number().int().positive().nullable().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

function omitUndefined<T extends Record<string, unknown>>(input: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  ) as Partial<T>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const guard = await requireAdminSession();
  if (!guard.ok) return guard.response;

  const { id } = await context.params;

  try {
    const body = puppyUpdateSchema.parse(await request.json());
    const { birthDate, ...rest } = body;
    const data = omitUndefined({
      ...rest,
      ...(birthDate !== undefined ? { birthDate: new Date(birthDate) } : {}),
    });

    const puppy = await prisma.puppy.update({
      where: { id },
      data,
    });
    return NextResponse.json(puppy);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur mise a jour";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const guard = await requireAdminSession();
  if (!guard.ok) return guard.response;

  const { id } = await context.params;

  try {
    await prisma.puppy.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur suppression";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
