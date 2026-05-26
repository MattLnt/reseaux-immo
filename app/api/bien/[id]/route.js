import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Récupérer un bien
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.agenceId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const bien = await prisma.bien.findUnique({
      where: { id },
      include: {
        agence: {
          select: {
            nom: true,
            adresse: true,
            telephone: true,
            email: true
          }
        }
      }
    });

    if (!bien) {
      return NextResponse.json({ error: "Bien non trouvé" }, { status: 404 });
    }

    return NextResponse.json(bien);
  } catch (error) {
    console.error('Erreur GET bien:', error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT - Modifier un bien
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.agenceId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();

    // Vérifier que le bien appartient à l'agence
    const bienExistant = await prisma.bien.findUnique({
      where: { id }
    });

    if (!bienExistant || bienExistant.agenceId !== session.user.agenceId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    // Mettre à jour le bien
    const bien = await prisma.bien.update({
      where: { id },
      data: {
        localisation: body.localisation,
        prix: body.prix,
        tauxCommission: body.tauxCommission,
        partRetrocedee: body.partRetrocedee != null ? parseInt(body.partRetrocedee) : 30,
        typeBien: body.typeBien,
        etatBien: body.etatBien,
        nbrChambres: body.nbrChambres,
        nbrSdb: body.nbrSdb,
        m2Habitable: body.m2Habitable,
        m2Terrain: body.m2Terrain,
        peb: body.peb || null, // Si vide, envoyer null
        revenuCadastral: body.revenuCadastral,
        rendementLocatif: body.rendementLocatif,
        descriptionCourte: body.descriptionCourte,
        lienAnnonce: body.lienAnnonce,
        photos: body.photos,
        // statut n'est mis à jour que s'il est fourni (toggle archiver/réactiver)
        ...(body.statut ? { statut: body.statut } : {}),
      }
    });

    return NextResponse.json(bien);
  } catch (error) {
    console.error('Erreur PUT bien:', error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE - Supprimer un bien
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.agenceId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Vérifier que le bien appartient à l'agence
    const bienExistant = await prisma.bien.findUnique({
      where: { id }
    });

    if (!bienExistant || bienExistant.agenceId !== session.user.agenceId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    // Supprimer le bien
    await prisma.bien.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE bien:', error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}