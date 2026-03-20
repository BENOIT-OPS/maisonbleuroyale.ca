import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user?.email) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Non autorise" }, { status: 401 }),
    };
  }
  return { ok: true as const, session };
}
