import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const { email, password, role, nomAgence, adresse, telephone } = await req.json()

    // Validation
    if (!email || !password || !role) {
      return NextResponse.json({ message: 'Tous les champs sont requis' }, { status: 400 })
    }

    if (password.length < 9) {
      return NextResponse.json({ message: 'Le mot de passe doit faire au moins 9 caractères' }, { status: 400 })
    }

    // Validation du rôle
    if (role !== 'AGENCE') {
      return NextResponse.json({ message: 'Rôle invalide' }, { status: 400 })
    }

    // Vérification email unique
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ message: 'Cet email est déjà utilisé' }, { status: 400 })
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    // Création User + Agence (avec isActive: false pour validation admin)
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'AGENCE',
        agence: {
          create: {
            nom: nomAgence || '',
            adresse: adresse || '',
            telephone: telephone || '',
            email: email,
            isActive: false, // En attente de validation admin
          },
        },
      },
    })

    // TODO: Envoyer email de confirmation (optionnel)
    // try { await sendWelcomeAgence(email) } catch (e) { console.error('Email agence:', e) }

    return NextResponse.json({ 
      message: 'Demande d\'inscription envoyée. Vous recevrez un email dès validation par un administrateur.' 
    }, { status: 201 })

  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}