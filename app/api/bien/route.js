import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'AGENCE') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await req.json()
    const {
      localisation,
      prix,
      tauxCommission,
      partRetrocedee,
      typeBien,
      etatBien,
      nbrChambres,
      nbrSdb,
      m2Habitable,
      m2Terrain,
      peb,
      revenuCadastral,
      rendementLocatif,
      descriptionCourte,
      lienAnnonce,
      photos
    } = body

    // Validation
    if (!localisation || !prix || !tauxCommission || !typeBien || !etatBien || !nbrChambres || !m2Habitable) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    // Créer le bien
    const bien = await prisma.bien.create({
      data: {
        agence: {
          connect: { id: session.user.agenceId }
        },
        localisation,
        prix: parseFloat(prix),
        tauxCommission: parseFloat(tauxCommission),
        partRetrocedee: partRetrocedee ? parseInt(partRetrocedee) : 30,
        typeBien,
        etatBien,
        nbrChambres: parseInt(nbrChambres),
        nbrSdb: nbrSdb ? parseInt(nbrSdb) : null,
        m2Habitable: parseFloat(m2Habitable),
        m2Terrain: m2Terrain ? parseFloat(m2Terrain) : null,
        peb: peb || null,
        revenuCadastral: revenuCadastral ? parseFloat(revenuCadastral) : null,
        rendementLocatif: rendementLocatif ? parseFloat(rendementLocatif) : null,
        descriptionCourte: descriptionCourte || null,
        lienAnnonce: lienAnnonce || null,
        photos: photos || [],
        statut: 'ACTIF'
      }
    })

    return NextResponse.json({ bien }, { status: 201 })

  } catch (error) {
    console.error('API /bien POST error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'AGENCE') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const statut = searchParams.get('statut') || 'ACTIF'

    const biens = await prisma.bien.findMany({
      where: {
        agenceId: session.user.agenceId,
        statut: statut
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ biens }, { status: 200 })

  } catch (error) {
    console.error('API /bien GET error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}