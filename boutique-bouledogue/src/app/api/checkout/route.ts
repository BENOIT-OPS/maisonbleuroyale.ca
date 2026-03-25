import { NextResponse } from "next/server";

/** Ancienne route de paiement : conservée pour éviter une 404 sur d’anciens liens ou scripts. */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Le paiement en ligne n’est plus proposé. Utilisez le formulaire sur la fiche du chiot pour envoyer votre demande par courriel.",
    },
    { status: 410 },
  );
}
