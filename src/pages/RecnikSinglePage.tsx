import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { supabase, GlossaryEntry } from '@/lib/supabase'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ArrowLeft, BookOpen } from 'lucide-react'

interface RelatedEntry {
  term: string
  slug: string
  definition: string
}

export default function RecnikSinglePage() {
  const { slug } = useParams<{ slug: string }>()
  const [entry, setEntry] = useState<GlossaryEntry | null>(null)
  const [relatedEntries, setRelatedEntries] = useState<RelatedEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (slug) {
      fetchEntry(slug)
    }
  }, [slug])

  const fetchEntry = async (entrySlug: string) => {
    try {
      const { data, error } = await supabase
        .from('glossary')
        .select('*')
        .eq('slug', entrySlug)
        .single()

      if (error) {
        setError('Glossary entry not found')
      } else {
        setEntry(data)
        await fetchRelatedEntries(data.related_terms || [])
      }
    } catch (err) {
      setError('An error occurred while loading the glossary entry')
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedEntries = async (relatedTerms: string[]) => {
    if (relatedTerms.length === 0) return

    try {
      const { data } = await supabase
        .from('glossary')
        .select('term, slug, definition')
        .in('slug', relatedTerms)
        .limit(5)

      setRelatedEntries(data || [])
    } catch (err) {
      console.error('Error fetching related entries:', err)
    }
  }

  const generateFAQSchema = (entry: GlossaryEntry) => {
    if (entry.faq_schema) {
      return JSON.stringify(entry.faq_schema)
    }
    
    // Generate default FAQ schema
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `Šta je ${entry.term}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": entry.definition
          }
        }
      ]
    })
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </>
    )
  }

  if (error || !entry) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {error || 'Glossary entry not found'}
            </h1>
            <Link 
              to="/recnik" 
              className="text-blue-600 hover:text-blue-800 flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to glossary
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const faqSchema = generateFAQSchema(entry)

  return (
    <>
      <Helmet>
        <title>{entry.term} - Stomatološki rečnik | Odontoa</title>
        <meta name="description" content={entry.definition} />
        <meta property="og:title" content={`${entry.term} - Stomatološki rečnik`} />
        <meta property="og:description" content={entry.definition} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${window.location.origin}/recnik/${entry.slug}`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${entry.term} - Stomatološki rečnik`} />
        <meta name="twitter:description" content={entry.definition} />
        <link rel="canonical" href={`${window.location.origin}/recnik/${entry.slug}`} />
        
        <script type="application/ld+json">
          {faqSchema}
        </script>
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            "name": entry.term,
            "description": entry.definition,
            "url": `${window.location.origin}/recnik/${entry.slug}`
          })}
        </script>
      </Helmet>

      <Navigation />
      
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link 
              to="/recnik" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to glossary
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-gray-900 flex items-center">
                    <BookOpen className="h-8 w-8 mr-3 text-blue-600" />
                    {entry.term}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">Definicija</h2>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {entry.definition}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">Detaljno objašnjenje</h2>
                    <article 
                      className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
                      dangerouslySetInnerHTML={{ __html: entry.full_article }}
                    />
                  </div>

                  {entry.related_terms && entry.related_terms.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-3">Povezani pojmovi</h2>
                      <div className="flex flex-wrap gap-2">
                        {entry.related_terms.map((term, index) => (
                          <Badge key={index} variant="outline" className="cursor-pointer hover:bg-blue-50">
                            {term}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {relatedEntries.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Povezani pojmovi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {relatedEntries.map((relatedEntry) => (
                      <Link
                        key={relatedEntry.slug}
                        to={`/recnik/${relatedEntry.slug}`}
                        className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {relatedEntry.term}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedEntry.definition}
                        </p>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              )}

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Potrebna je stomatološka usluga?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Pronađite kvalifikovanog stomatologa u vašoj blizini i zakažite pregled.
                  </p>
                  <Link
                    to="/kontakt"
                    className="inline-block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Kontaktirajte nas
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
} 