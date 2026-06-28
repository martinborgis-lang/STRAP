import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, DM_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

const siteUrl = 'https://strap.example'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'STRAP — Bracelets pour Royal Pop',
    template: '%s · STRAP',
  },
  description:
    'STRAP conçoit des bracelets adaptables premium pour la montre de la collaboration Swatch × Audemars Piguet. Cuir, acier, NATO, caoutchouc — taillés pour la plus rare des montres.',
  keywords: [
    'bracelet Royal Pop',
    'bracelet Bioceramic',
    'Swatch Audemars Piguet',
    'bracelet montre premium',
    'STRAP',
  ],
  openGraph: {
    title: 'STRAP — Wear. Every. Second.',
    description:
      'Bracelets adaptables premium pour Royal Pop & Bioceramic. Cuir, acier, NATO, caoutchouc.',
    url: siteUrl,
    siteName: 'STRAP',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'STRAP — Wear. Every. Second.',
    description: 'Bracelets adaptables premium pour Royal Pop & Bioceramic.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#050510',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="fr"
      className={`${spaceGrotesk.variable} ${dmMono.variable}`}
    >
      <body className="bg-bg text-fg font-sans antialiased">
        <Navbar />
        <CartDrawer />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
