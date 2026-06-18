import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Nettoyage basique
        const email = credentials.email.toLowerCase().trim()
        const password = credentials.password

        // Limite la longueur pour éviter les attaques bcrypt
        if (password.length > 72) return null
        if (email.length > 254) return null

        const user = await prisma.user.findUnique({
          where: { email },
          include: { agence: true },
        })

        // Toujours comparer même si user inexistant pour éviter timing attacks
        const fakeHash = '$2a$12$fakehashfakehashfakehashfakehashfakehashfakehashfakeha'
        const passwordMatch = await bcrypt.compare(
          password,
          user?.password || fakeHash
        )
        if (!user || !passwordMatch) return null

        // Vérification : agence doit être validée par admin (sauf admin)
        if (user.role === 'AGENCE' && user.agence && !user.agence.isActive) {
          return null // Agence non validée = accès refusé
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          agenceId: user.agenceId,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.agenceId = user.agenceId
      }

      // Vérification du rôle en DB à chaque renouvellement de token
      if (token?.id && !user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { role: true, id: true, agenceId: true, agence: { select: { isActive: true } } }
        })
        if (!dbUser) return null // User supprimé → invalide le token

        // Si agence désactivée par admin → invalide la session
        if (dbUser.role === 'AGENCE' && dbUser.agence && !dbUser.agence.isActive) {
          return null
        }

        token.role = dbUser.role // Toujours le rôle à jour depuis la DB
        token.agenceId = dbUser.agenceId
      }
      return token
    },
    async session({ session, token }) {
      if (!token || !session?.user) return session
      session.user.id = token.id
      session.user.role = token.role
      session.user.agenceId = token.agenceId
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 jours
    updateAge: 24 * 60 * 60,   // Renouvellement toutes les 24h
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
}