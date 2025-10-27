import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Strapi CMS Preview - Odontoa',
  description: 'Interni pregled Strapi Cloud sadržaja (beta)',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function StrapiPreviewLayout({
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
