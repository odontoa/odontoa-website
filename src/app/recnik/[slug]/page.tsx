'use client';

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  Share2, 
  Copy,
  ExternalLink,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { notFound } from 'next/navigation'

interface GlossaryEntry {
  id: string
  term: string
  slug: string
  definition: string
  full_article: string
  faq_schema: string
  related_terms: string[]
  created_at: string
}

interface PageProps {
  params: {
    slug: string
  }
}

export default function GlossaryTermPage({ params }: PageProps) {
  const [term, setTerm] = useState<GlossaryEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedTerms, setRelatedTerms] = useState<GlossaryEntry[]>([])

  useEffect(() => {
    fetchTerm()
  }, [params.slug])

  const fetchTerm = async () => {
    try {
      const { data, error } = await supabase
      .from('glossary')
        .select('*')
        .eq('slug', params.slug)
        .single()

      if (error || !data) {
        console.error('Error fetching term:', error)
        notFound()
        return
      }

      setTerm(data)
      fetchRelatedTerms(data.related_terms || [])
    } catch (error) {
      console.error('Error:', error)
      notFound()
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedTerms = async (relatedTermSlugs: string[]) => {
    if (relatedTermSlugs.length === 0) return

    try {
      const { data, error } = await supabase
      .from('glossary')
        .select('id, term, slug, definition, full_article, faq_schema, related_terms, created_at')
        .in('slug', relatedTermSlugs)
        .limit(6)

      if (!error && data) {
        setRelatedTerms(data as GlossaryEntry[])
    }
  } catch (error) {
      console.error('Error fetching related terms:', error)
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link kopiran u clipboard!')
    } catch (error) {
      toast.error('Greška pri kopiranju linka')
    }
  }

  const shareContent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: term?.term || 'Stomatološki termin',
          text: term?.definition || '',
          url: window.location.href,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      copyLink()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(' ').length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min čitanja`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Učitavanje termina...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!term) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-sky-50 pt-8 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/recnik">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Nazad na rečnik
              </Button>
            </Link>
          </div>

          {/* Title and Meta */}
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start justify-between mb-8">
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-gray-900 flex-1 pr-4">
                {term.term}
              </h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyLink}
                className="text-gray-500 hover:text-gray-700"
              >
                <Copy className="h-5 w-5" />
              </Button>
            </div>

            {/* Meta Information */}
            <div className="flex items-center gap-6 mb-8 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(term.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{getReadingTime(term.full_article)}</span>
              </div>
            </div>

            {/* Definition */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg mb-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                {term.definition}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto py-8 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-0 shadow-md rounded-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-gray-900">Detaljna definicija</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(term.created_at)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {getReadingTime(term.full_article)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-lg max-w-none prose-blue"
                  dangerouslySetInnerHTML={{ __html: term.full_article }}
                />
              </CardContent>
            </Card>

            {/* FAQ Section */}
            {term.faq_schema && (
              <Card className="mt-8 bg-white border-0 shadow-md rounded-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Često postavljena pitanja</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose prose-lg max-w-none prose-blue"
                    dangerouslySetInnerHTML={{ __html: term.faq_schema }}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Share Section */}
            <Card className="bg-white border-0 shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Podelite</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    onClick={shareContent}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Podeli termin
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                    >
                      LinkedIn
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${term.term} - ${term.definition}`)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                    >
                      X
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Terms */}
            {relatedTerms.length > 0 && (
              <Card className="bg-white border-0 shadow-md rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Povezani termini</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {relatedTerms.map((relatedTerm) => (
                      <Link key={relatedTerm.id} href={`/recnik/${relatedTerm.slug}`}>
                        <div className="p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer">
                          <h4 className="font-semibold text-gray-900">{relatedTerm.term}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {relatedTerm.definition}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Back to Glossary */}
            <Card className="bg-white border-0 shadow-md rounded-xl">
              <CardContent className="p-6">
                <Link href="/recnik">
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Nazad na rečnik
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 