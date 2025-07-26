import React from 'react'
import { supabase, GlossaryEntry } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, BookOpen } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

interface RecnikPageProps {
  params: {
    slug: string
  }
}

interface RelatedEntry {
  term: string
  slug: string
  definition: string
}

export async function generateStaticParams() {
  try {
    const { data } = await supabase
      .from('glossary')
      .select('slug');

    if (data) {
      return data.map((entry) => ({
        slug: entry.slug,
      }));
    }
  } catch (error) {
    console.error('Error generating static params:', error);
  }
  
  return [];
}

export async function generateMetadata({ params }: RecnikPageProps): Promise<Metadata> {
  try {
    const { data } = await supabase
      .from('glossary')
      .select('*')
      .eq('slug', params.slug)
      .single();

    if (data) {
      return {
        title: `${data.term} - Stomatološki rečnik | Odontoa`,
        description: data.definition.substring(0, 160),
        keywords: `stomatologija, ${data.term}, rečnik, definicija, stomatološki termini`,
        openGraph: {
          title: `${data.term} - Stomatološki rečnik`,
          description: data.definition.substring(0, 160),
          type: 'article',
          url: `https://odontoa.com/recnik/${data.slug}`,
        },
        twitter: {
          card: 'summary',
          title: `${data.term} - Stomatološki rečnik`,
          description: data.definition.substring(0, 160),
        },
        alternates: {
          canonical: `/recnik/${data.slug}`,
        },
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return {
    title: 'Termin nije pronađen | Odontoa Rečnik',
    description: 'Traženi stomatološki termin nije pronađen.',
  };
}

async function getEntry(slug: string): Promise<{ entry: GlossaryEntry | null; relatedEntries: RelatedEntry[] }> {
  try {
    const { data: entry, error } = await supabase
      .from('glossary')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !entry) {
      return { entry: null, relatedEntries: [] };
    }

    let relatedEntries: RelatedEntry[] = [];
    if (entry.related_terms && entry.related_terms.length > 0) {
      const { data } = await supabase
        .from('glossary')
        .select('term, slug, definition')
        .in('slug', entry.related_terms)
        .limit(5);

      relatedEntries = data || [];
    }

    return { entry, relatedEntries };
  } catch (error) {
    console.error('Error fetching entry:', error);
    return { entry: null, relatedEntries: [] };
  }
}

export default async function RecnikSinglePage({ params }: RecnikPageProps) {
  const { entry, relatedEntries } = await getEntry(params.slug);

  if (!entry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Termin nije pronađen
          </h1>
          <Link 
            href="/recnik" 
            className="text-blue-600 hover:text-blue-800 flex items-center justify-center"
          >
            ← Nazad na rečnik
          </Link>
        </div>
      </div>
    );
  }

  const generateFAQSchema = (entry: GlossaryEntry) => {
    if (entry.faq_schema) {
      return entry.faq_schema;
    }
    
    // Generate default FAQ schema
    return {
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
    };
  };

  const faqSchema = generateFAQSchema(entry);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": `${entry.term} - Stomatološki rečnik`,
            "description": entry.definition,
            "url": `https://odontoa.com/recnik/${entry.slug}`,
            "publisher": {
              "@type": "Organization",
              "name": "Odontoa",
              "logo": {
                "@type": "ImageObject",
                "url": "https://odontoa.com/images/odontoa-logo1.png"
              }
            }
          })
        }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link 
              href="/recnik" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Nazad na rečnik
            </Link>
          </nav>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  <Badge className="bg-blue-100 text-blue-800">
                    Stomatološki termin
                  </Badge>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {entry.term}
                </h1>
                {entry.category && (
                  <Badge variant="outline" className="text-gray-600">
                    {entry.category}
                  </Badge>
                )}
              </div>

              {/* Definition */}
              <div className="prose prose-lg max-w-none mb-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Definicija
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {entry.definition}
                  </p>
                </div>
              </div>

              {/* Additional Information */}
              {entry.examples && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Primeri
                  </h3>
                  <div className="bg-blue-50 rounded-xl p-6">
                    <p className="text-gray-700">
                      {entry.examples}
                    </p>
                  </div>
                </div>
              )}

              {entry.notes && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Napomene
                  </h3>
                  <div className="bg-yellow-50 rounded-xl p-6">
                    <p className="text-gray-700">
                      {entry.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Related Terms */}
              {relatedEntries.length > 0 && (
                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Povezani termini
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedEntries.map((relatedEntry) => (
                      <Card key={relatedEntry.slug} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">
                            <Link 
                              href={`/recnik/${relatedEntry.slug}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {relatedEntry.term}
                            </Link>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {relatedEntry.definition}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 