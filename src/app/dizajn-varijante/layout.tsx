import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dizajn Varijante - Odontoa',
  description: 'Istražite različite pristupe dizajnu za TargetAudienceSection komponentu',
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 