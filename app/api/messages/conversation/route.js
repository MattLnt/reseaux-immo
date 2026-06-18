import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/messages/conversation
//   Body: { targetAgenceId }
//   → Renvoie la conversation existante entre les 2 agences, ou la crée si elle n'existe pas
//   → Returns: { id: string }
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.agenceId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const myAgenceId = session.user.agenceId;

  try {
    const body = await req.json();
    const { targetAgenceId } = body;

    if (!targetAgenceId) {
      return NextResponse.json({ error: "targetAgenceId requis" }, { status: 400 });
    }

    if (targetAgenceId === myAgenceId) {
      return NextResponse.json({ error: "Vous ne pouvez pas démarrer une conversation avec vous-même" }, { status: 400 });
    }

    // Vérifier que l'agence cible existe et est active
    const target = await prisma.agence.findUnique({
      where: { id: targetAgenceId },
      select: { id: true, isActive: true },
    });
    if (!target) {
      return NextResponse.json({ error: "Agence introuvable" }, { status: 404 });
    }
    if (!target.isActive) {
      return NextResponse.json({ error: "Cette agence n'est pas active" }, { status: 400 });
    }

    // Chercher une conversation existante entre les 2 agences (dans les 2 sens A→B ou B→A)
    const existing = await prisma.conversation.findFirst({
      where: {
        OR: [
          { agenceAId: myAgenceId, agenceBId: targetAgenceId },
          { agenceAId: targetAgenceId, agenceBId: myAgenceId },
        ],
      },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json({ id: existing.id, created: false });
    }

    // Créer une nouvelle conversation
    const conv = await prisma.conversation.create({
      data: {
        agenceAId: myAgenceId,
        agenceBId: targetAgenceId,
      },
      select: { id: true },
    });

    return NextResponse.json({ id: conv.id, created: true }, { status: 201 });
  } catch (err) {
    console.error("POST /api/messages/conversation error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}