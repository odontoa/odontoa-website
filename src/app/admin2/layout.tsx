import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Beta Strapi CMS - Odontoa',
  description: 'Beta verzija Strapi CMS-a za testiranje',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function Admin2Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <meta name="robots" content="noindex,nofollow" />
      {children}
    </>
  )
}
