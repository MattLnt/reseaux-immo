import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendAgenceEnAttente, sendAdminNouvelleInscription } from '@/lib/emails'

export async function POST(req) {
  try {
    const { 
      email, 
      password, 
      role, 
      nomAgence, 
      adresse, 
      telephone, 
      numeroIPI, 
      prenomContact, 
      nomContact 
    } = await req.json()

    // Validation
    if (!email || !password || !role) {
      return NextResponse.json({ message: 'Tous les champs sont requis' }, { status: 400 })
    }
    if (password.length < 9) {
      return NextResponse.json({ message: 'Le mot de passe doit faire au moins 9 caractères' }, { status: 400 })
    }
    if (role !== 'AGENCE') {
      return NextResponse.json({ message: 'Rôle invalide' }, { status: 400 })
    }
    if (!nomAgence?.trim()) {
      return NextResponse.json({ message: 'Le nom de l\'agence est requis' }, { status: 400 })
    }
    if (!numeroIPI?.trim()) {
      return NextResponse.json({ message: 'Le numéro IPI est requis' }, { status: 400 })
    }
    if (!prenomContact?.trim() || !nomContact?.trim()) {
      return NextResponse.json({ message: 'Le prénom et le nom du contact sont requis' }, { status: 400 })
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
            nom: nomAgence.trim(),
            adresse: adresse?.trim() || '',
            telephone: telephone?.trim() || '',
            email: email,
            numeroIPI: numeroIPI.trim(),
            prenomContact: prenomContact.trim(),
            nomContact: nomContact.trim(),
            isActive: false,
          },
        },
      },
    })

    // Envoi des 2 emails — sans bloquer la réponse si Resend plante
    Promise.allSettled([
      sendAgenceEnAttente({ to: email, nomAgence: nomAgence.trim() }),
      sendAdminNouvelleInscription({
        nomAgence: nomAgence.trim(),
        emailAgence: email,
        telephoneAgence: telephone?.trim() || '',
        adresseAgence: adresse?.trim() || '',
      }),
    ]).then((results) => {
      results.forEach((r, i) => {
        if (r.status === 'rejected') {
          console.error(`[REGISTER] Email ${i} failed:`, r.reason)
        }
      })
    })

    return NextResponse.json({
      message: 'Demande d\'inscription envoyée. Vous recevrez un email dès validation par un administrateur.'
    }, { status: 201 })

  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}