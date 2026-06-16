import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/acheteur — liste les acheteurs de l'agence connectée
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.agenceId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const acheteurs = await prisma.acheteur.findMany({
      where: { agenceId: session.user.agenceId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(acheteurs);
  } catch (err) {
    console.error("GET /api/acheteur error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/acheteur — crée un nouvel acheteur
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.agenceId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Validation des champs obligatoires
    const required = ["prenom", "nom", "email", "telephone", "budgetMin", "budgetMax", "profilMenage"];
    for (const field of required) {
      if (body[field] === undefined || body[field] === null || body[field] === "") {
        return NextResponse.json({ error: `Champ requis manquant : ${field}` }, { status: 400 });
      }
    }

    // Validation cohérence budget
    if (parseInt(body.budgetMin) > parseInt(body.budgetMax)) {
      return NextResponse.json({ error: "Le budget min ne peut pas dépasser le budget max" }, { status: 400 });
    }

    // Validation RGPD
    if (!body.consentementRGPD) {
      return NextResponse.json({ error: "Le consentement RGPD est obligatoire" }, { status: 400 });
    }

    // Validation zones
    if (!Array.isArray(body.zones) || body.zones.length === 0) {
      return NextResponse.json({ error: "Au moins une zone est requise" }, { status: 400 });
    }

    // Validation types de bien
    if (!Array.isArray(body.typesBien) || body.typesBien.length === 0) {
      return NextResponse.json({ error: "Au moins un type de bien est requis" }, { status: 400 });
    }

    const acheteur = await prisma.acheteur.create({
      data: {
        agenceId: session.user.agenceId,
        prenom: body.prenom.trim(),
        nom: body.nom.trim(),
        email: body.email.trim().toLowerCase(),
        telephone: body.telephone.trim(),
        budgetMin: parseInt(body.budgetMin),
        budgetMax: parseInt(body.budgetMax),
        zones: body.zones,
        typesBien: body.typesBien,
        nbrChambresMin: body.nbrChambresMin ? parseInt(body.nbrChambresMin) : null,
        nbrSdbMin: body.nbrSdbMin ? parseInt(body.nbrSdbMin) : null,
        m2HabitableMin: body.m2HabitableMin ? parseInt(body.m2HabitableMin) : null,
        profilMenage: body.profilMenage,
        remarques: body.remarques?.trim() || null,
        consentementRGPD: true,
        statut: "ACTIF",
      },
    });

    return NextResponse.json(acheteur, { status: 201 });
  } catch (err) {
    console.error("POST /api/acheteur error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}