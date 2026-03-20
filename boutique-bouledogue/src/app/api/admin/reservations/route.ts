import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/require-admin";

export async function GET() {
  const guard = await requireAdminSession();
  if (!guard.ok) return guard.response;

  const reservations = await prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      puppy: {
        select: { id: true, name: true, slug: true, priceCents: true, status: true },
      },
    },
  });

  return NextResponse.json(reservations);
}
