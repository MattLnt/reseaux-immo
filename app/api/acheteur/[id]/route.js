import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Helper : vérifie que l'acheteur appartient bien à l'agence connectée
async function checkOwnership(id, agenceId) {
  const acheteur = await prisma.acheteur.findUnique({ where: { id } });
  if (!acheteur) return { error: "Acheteur introuvable", status: 404 };
  if (acheteur.agenceId !== agenceId) return { error: "Non autorisé", status: 403 };
  return { acheteur };
}

// GET /api/acheteur/[id] — récupère un acheteur
export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.agenceId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const result = await checkOwnership(id, session.user.agenceId);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result.acheteur);
  } catch (err) {
    console.error("GET /api/acheteur/[id] error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT /api/acheteur/[id] — modifie un acheteur
export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.agenceId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const ownership = await checkOwnership(id, session.user.agenceId);
    if (ownership.error) {
      return NextResponse.json({ error: ownership.error }, { status: ownership.status });
    }

    const body = await req.json();

    // Validation des champs obligatoires
    const required = ["prenom", "nom", "email", "telephone", "budgetMin", "budgetMax", "profilMenage"];
    for (const field of required) {
      if (body[field] === undefined || body[field] === null || body[field] === "") {
        return NextResponse.json({ error: `Champ requis manquant : ${field}` }, { status: 400 });
      }
    }

    if (parseInt(body.budgetMin) > parseInt(body.budgetMax)) {
      return NextResponse.json({ error: "Le budget min ne peut pas dépasser le budget max" }, { status: 400 });
    }

    if (!Array.isArray(body.zones) || body.zones.length === 0) {
      return NextResponse.json({ error: "Au moins une zone est requise" }, { status: 400 });
    }

    if (!Array.isArray(body.typesBien) || body.typesBien.length === 0) {
      return NextResponse.json({ error: "Au moins un type de bien est requis" }, { status: 400 });
    }

    const acheteur = await prisma.acheteur.update({
      where: { id },
      data: {
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
        ...(body.statut ? { statut: body.statut } : {}),
      },
    });

    return NextResponse.json(acheteur);
  } catch (err) {
    console.error("PUT /api/acheteur/[id] error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/acheteur/[id] — supprime un acheteur
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.agenceId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const ownership = await checkOwnership(id, session.user.agenceId);
    if (ownership.error) {
      return NextResponse.json({ error: ownership.error }, { status: ownership.status });
    }

    await prisma.acheteur.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/acheteur/[id] error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}