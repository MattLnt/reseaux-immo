import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/messages
//   → liste les conversations de l'agence connectée
//   → ou si ?conversationId=xxx, liste les messages de cette conversation
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.agenceId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const myAgenceId = session.user.agenceId;
  const url = new URL(req.url);
  const conversationId = url.searchParams.get("conversationId");

  try {
    // Cas 1 : liste des messages d'une conversation précise
    if (conversationId) {
      // Vérifier que l'agence fait bien partie de cette conversation
      const conv = await prisma.conversation.findUnique({
        where: { id: conversationId },
        select: { agenceAId: true, agenceBId: true },
      });
      if (!conv) {
        return NextResponse.json({ error: "Conversation introuvable" }, { status: 404 });
      }
      if (conv.agenceAId !== myAgenceId && conv.agenceBId !== myAgenceId) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
      }

      // Récupérer les messages
      const messages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
        include: {
          sender: { select: { id: true, nom: true } },
        },
      });

      // Marquer comme lus les messages dont je suis le destinataire
      await prisma.message.updateMany({
        where: {
          conversationId,
          senderId: { not: myAgenceId },
          readAt: null,
        },
        data: { readAt: new Date() },
      });

      return NextResponse.json(messages);
    }

    // Cas 2 : liste des conversations de l'agence (toutes celles où elle est A ou B)
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { agenceAId: myAgenceId },
          { agenceBId: myAgenceId },
        ],
      },
      include: {
        agenceA: { select: { id: true, nom: true, photo: true } },
        agenceB: { select: { id: true, nom: true, photo: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: {
          select: {
            messages: {
              where: {
                senderId: { not: myAgenceId },
                readAt: null,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(conversations);
  } catch (err) {
    console.error("GET /api/messages error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/messages
//   → envoie un message dans une conversation existante
//   Body: { conversationId, content, attachmentUrl?, attachmentName? }
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.agenceId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const myAgenceId = session.user.agenceId;

  try {
    const body = await req.json();
    const { conversationId, content, attachmentUrl, attachmentName } = body;

    if (!conversationId) {
      return NextResponse.json({ error: "conversationId requis" }, { status: 400 });
    }
    if (!content?.trim() && !attachmentUrl) {
      return NextResponse.json({ error: "Contenu ou pièce jointe requis" }, { status: 400 });
    }

    // Vérifier que l'agence fait partie de la conversation
    const conv = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { agenceAId: true, agenceBId: true },
    });
    if (!conv) {
      return NextResponse.json({ error: "Conversation introuvable" }, { status: 404 });
    }
    if (conv.agenceAId !== myAgenceId && conv.agenceBId !== myAgenceId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    // Créer le message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: myAgenceId,
        content: content?.trim() || null,
        attachmentUrl: attachmentUrl || null,
        attachmentName: attachmentName || null,
      },
      include: {
        sender: { select: { id: true, nom: true } },
      },
    });

    // Bumper le `updatedAt` de la conversation (pour qu'elle remonte dans la liste)
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (err) {
    console.error("POST /api/messages error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}