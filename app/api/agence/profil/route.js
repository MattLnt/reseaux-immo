import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.agenceId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const agence = await prisma.agence.findUnique({
      where: { id: session.user.agenceId },
      select: {
        nom: true,
        adresse: true,
        telephone: true,
        email: true,
        numeroIPI: true,
        prenomContact: true,
        nomContact: true,
        horaire: true,
        description: true,
      },
    });
    return NextResponse.json(agence);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.agenceId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const body = await req.json();

    if (!body.nom || !body.adresse || !body.telephone || !body.email) {
      return NextResponse.json({ error: "Tous les champs obligatoires doivent être remplis" }, { status: 400 });
    }

    const updated = await prisma.agence.update({
      where: { id: session.user.agenceId },
      data: {
        nom: body.nom,
        adresse: body.adresse,
        telephone: body.telephone,
        email: body.email,
        numeroIPI: body.numeroIPI?.trim() || null,
        prenomContact: body.prenomContact?.trim() || null,
        nomContact: body.nomContact?.trim() || null,
        horaire: body.horaire || null,
        description: body.description || null,
      },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}