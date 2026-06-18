import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/messages/unread
//   → compte les messages non lus envoyés à l'agence connectée
//   (utilisé par la sidebar pour le badge "Messages")
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.agenceId) {
      return NextResponse.json({ count: 0 })
    }

    const myAgenceId = session.user.agenceId

    const count = await prisma.message.count({
      where: {
        // Messages dont l'expéditeur n'est pas moi
        senderId: { not: myAgenceId },
        // Pas encore lus
        readAt: null,
        // Dans une conversation où je participe (en tant que A ou B)
        conversation: {
          OR: [
            { agenceAId: myAgenceId },
            { agenceBId: myAgenceId },
          ],
        },
      },
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error('GET /api/messages/unread error:', error)
    return NextResponse.json({ count: 0 })
  }
}