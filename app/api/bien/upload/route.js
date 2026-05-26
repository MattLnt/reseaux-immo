import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'AGENCE') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 })
    }

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload vers Cloudinary
    const cloudinaryFormData = new FormData()
    cloudinaryFormData.append('file', new Blob([buffer]))
    cloudinaryFormData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET)
    cloudinaryFormData.append('folder', 'reseaux-immo/biens')

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData
      }
    )

    if (!cloudinaryRes.ok) {
      const error = await cloudinaryRes.json()
      console.error('Cloudinary error:', error)
      return NextResponse.json({ error: 'Erreur upload Cloudinary' }, { status: 500 })
    }

    const data = await cloudinaryRes.json()

    return NextResponse.json({ 
      url: data.secure_url,
      publicId: data.public_id
    }, { status: 200 })

  } catch (error) {
    console.error('API /bien/upload error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}