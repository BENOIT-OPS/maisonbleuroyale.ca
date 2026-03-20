import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(2),
  content: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const payload = schema.parse(await request.json());
    const message = await prisma.contactMessage.create({ data: payload });
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    const err = error instanceof Error ? error.message : "Erreur";
    return NextResponse.json({ error: err }, { status: 400 });
  }
}
