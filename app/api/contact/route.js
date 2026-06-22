import { NextResponse } from "next/server";
import { sendContactMessage } from "@/lib/emails";

export async function POST(req) {
  try {
    const body = await req.json();
    const { nom, nomAgence, email, telephone, message } = body;

    // Validation minimale
    if (!nom || !email || !message) {
      return NextResponse.json(
        { error: "Le nom, l'email et le message sont obligatoires" },
        { status: 400 }
      );
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Email invalide" },
        { status: 400 }
      );
    }

    // Envoi
    await sendContactMessage({
      nom: nom.trim(),
      nomAgence: nomAgence?.trim() || null,
      email: email.trim().toLowerCase(),
      telephone: telephone?.trim() || null,
      message: message.trim(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[CONTACT API] Erreur:", err);
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessayez plus tard." },
      { status: 500 }
    );
  }
}