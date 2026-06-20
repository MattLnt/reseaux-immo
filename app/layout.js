import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'OnShare — Le réseau qui connecte les agences immobilières',
  description: "Le réseau privé qui connecte les agences immobilières. Partagez vos mandats, trouvez des acheteurs, concluez plus de ventes.",
  icons: {
    icon: '/logo.svg',
  },
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