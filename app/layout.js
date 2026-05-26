import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Réseaux Immo — Le réseau de co-courtage immobilier',
  description: 'Le réseau privé qui connecte les agences immobilières belges.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}