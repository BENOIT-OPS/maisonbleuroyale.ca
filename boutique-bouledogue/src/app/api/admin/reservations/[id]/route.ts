import { NextResponse } from "next/server";
import { ReservationStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/require-admin";

const patchSchema = z.object({
  status: z.nativeEnum(ReservationStatus),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const guard = await requireAdminSession();
  if (!guard.ok) return guard.response;

  const { id } = await context.params;

  try {
    const { status } = patchSchema.parse(await request.json());
    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status },
      include: { puppy: true },
    });
    return NextResponse.json(reservation);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
