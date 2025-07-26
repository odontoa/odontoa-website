import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as SonnerToaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Odontoa - Napredni sistem za upravljanje stomatološkom ordinacijom',
  description: 'Kompletno rešenje za upravljanje stomatološkom ordinacijom. Upravljajte pacijentima, terminima, finansijama i analitikom na jednom mestu.',
  keywords: 'stomatologija, ordinacija, pacijenti, termini, finansije, analitika',
  authors: [{ name: 'Odontoa Team' }],
  creator: 'Odontoa Team',
  publisher: 'Odontoa',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://odontoa.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Odontoa - Napredni sistem za upravljanje stomatološkom ordinacijom',
    description: 'Kompletno rešenje za upravljanje stomatološkom ordinacijom. Upravljajte pacijentima, terminima, finansijama i analitikom na jednom mestu.',
    url: 'https://odontoa.com',
    siteName: 'Odontoa',
    images: [
      {
        url: '/odontoa-logo1.png',
        width: 1200,
        height: 630,
        alt: 'Odontoa - Stomatološka ordinacija',
      },
    ],
    locale: 'sr_RS',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Odontoa - Napredni sistem za upravljanje stomatološkom ordinacijom',
    description: 'Kompletno rešenje za upravljanje stomatološkom ordinacijom.',
    images: ['/odontoa-logo1.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sr">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster />
              <SonnerToaster />
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
} 