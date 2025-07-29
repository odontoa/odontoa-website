'use client';

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, BookOpen, Calendar, User, Hash } from 'lucide-react'
import Link from 'next/link'

interface GlossaryEntry {
  id: string
  term: string
  slug: string
  definition: string
  full_article: string
  created_at: string
  related_terms: string[]
}

export default function GlossaryPage() {
  const [terms, setTerms] = useState<GlossaryEntry[]>([])
  const [filteredTerms, setFilteredTerms] = useState<GlossaryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)

  // Serbian Latin alphabet
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  useEffect(() => {
    fetchTerms()
  }, [])

  useEffect(() => {
    filterTerms()
  }, [terms, searchQuery, selectedLetter])

  const fetchTerms = async () => {
    try {
      const { data, error } = await supabase
        .from('glossary')
        .select('*')
        .order('term', { ascending: true })

      if (error) {
        console.error('Error fetching terms:', error)
        return
      }

      setTerms(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterTerms = () => {
    let filtered = terms

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(term =>
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by selected letter
    if (selectedLetter) {
      if (selectedLetter === '#') {
        // Filter terms that start with numbers
        filtered = filtered.filter(term =>
          /^\d/.test(term.term)
        )
      } else {
        filtered = filtered.filter(term =>
          term.term.toUpperCase().startsWith(selectedLetter)
        )
      }
    }

    setFilteredTerms(filtered)
  }

  const getTermsByLetter = (letter: string) => {
    if (letter === '#') {
      return terms.filter(term => /^\d/.test(term.term))
    }
    return terms.filter(term => 
      term.term.toUpperCase().startsWith(letter)
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Učitavanje rečnika...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Stomatološki Rečnik
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Pronađite i naučite sve o stomatološkim terminima i procedurama. 
              Kompletan vodič kroz svet stomatologije.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Pretražite termine..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">{terms.length}</div>
                <div className="text-sm text-gray-600">Ukupno termina</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">{filteredTerms.length}</div>
                <div className="text-sm text-gray-600">Prikazano</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Alphabet Navigation */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alfabetska navigacija</h3>
            <div className="flex flex-wrap gap-2">
              {/* Hashtag for numbers */}
              <Button
                variant={selectedLetter === '#' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLetter(selectedLetter === '#' ? null : '#')}
                disabled={getTermsByLetter('#').length === 0}
                className={`
                  ${selectedLetter === '#' 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }
                  ${getTermsByLetter('#').length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <Hash className="h-4 w-4 mr-1" />
                Brojevi
                {getTermsByLetter('#').length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {getTermsByLetter('#').length}
                  </Badge>
                )}
              </Button>

              {/* Alphabet buttons */}
              {alphabet.map((letter) => {
                const termCount = getTermsByLetter(letter).length
                const isSelected = selectedLetter === letter
                const hasTerms = termCount > 0

                return (
                  <Button
                    key={letter}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLetter(isSelected ? null : letter)}
                    disabled={!hasTerms}
                    className={`
                      ${isSelected 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }
                      ${!hasTerms ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {letter}
                    {hasTerms && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {termCount}
                      </Badge>
                    )}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        {(selectedLetter || searchQuery) && (
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('')
                setSelectedLetter(null)
              }}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Očisti filtere
            </Button>
          </div>
        )}

        {/* Results Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedLetter === '#' ? 'Termini koji počinju brojevima' :
               selectedLetter ? `Termini sa slovom "${selectedLetter}"` : 'Svi termini'}
            </h2>
            <Badge variant="secondary" className="text-sm">
              {filteredTerms.length} termina
            </Badge>
          </div>
        </div>

        {/* Terms Grid */}
        {filteredTerms.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nema pronađenih termina
              </h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? `Nema termina koji odgovaraju pretraživanju "${searchQuery}"`
                  : 'Nema termina za prikaz'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTerms.map((term) => (
              <Card key={term.id} className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden rounded-xl">
                <CardHeader className="p-6 pb-3">
                  <CardTitle className="text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                    <Link 
                      href={`/recnik/${term.slug}`}
                      className="block"
                    >
                      {term.term}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {term.definition}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(term.created_at)}
                    </div>
                  </div>

                  {term.related_terms && term.related_terms.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">Povezani termini:</p>
                      <div className="flex flex-wrap gap-1">
                        {term.related_terms.slice(0, 3).map((relatedTerm, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                            {relatedTerm}
                          </Badge>
                        ))}
                        {term.related_terms.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                            +{term.related_terms.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <Link href={`/recnik/${term.slug}`}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full px-4 py-2"
                    >
                      Pročitaj više
                      <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 