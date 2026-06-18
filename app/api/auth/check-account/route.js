import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/auth/check-account
// Vérifie le statut d'un compte. Renvoie un statut neutre pour ne pas révéler
// si un email existe ou non quand le mot de passe est faux.
//
// Cette route est appelée APRÈS un échec de signIn(), uniquement si
// l'utilisateur a entré un mot de passe — donc il y a un signal d'intention.

export async function POST(req) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ status: 'invalid_credentials' })
    }

    const cleanEmail = email.toLowerCase().trim()
    if (cleanEmail.length > 254) {
      return NextResponse.json({ status: 'invalid_credentials' })
    }

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      select: {
        role: true,
        agence: { select: { isActive: true } },
      },
    })

    // Email inconnu OU compte admin → on dit juste "credentials invalides"
    // (pas de signal pour éviter l'énumération d'admins)
    if (!user) {
      return NextResponse.json({ status: 'invalid_credentials' })
    }

    // Admin → on ne révèle rien
    if (user.role === 'ADMIN') {
      return NextResponse.json({ status: 'invalid_credentials' })
    }

    // Agence sans relation (cas anormal) → générique
    if (!user.agence) {
      return NextResponse.json({ status: 'invalid_credentials' })
    }

    // Agence en attente ou désactivée → on l'indique
    if (!user.agence.isActive) {
      return NextResponse.json({ status: 'pending_or_disabled' })
    }

    // Compte actif → si on arrive ici après un échec signIn,
    // c'est forcément un mauvais mot de passe
    return NextResponse.json({ status: 'invalid_credentials' })
  } catch (err) {
    console.error('check-account error:', err)
    return NextResponse.json({ status: 'invalid_credentials' })
  }
}