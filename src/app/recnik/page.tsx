'use client';

import React, { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { DemoForm } from '@/components/DemoForm'
import { Search, BookOpen, Hash, ArrowRight, Filter, Plus, MessageCircle, Zap, Shield, Clock } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface GlossaryEntry {
  id: string
  term: string
  slug: string
  definition: string
  full_article: string
  published: boolean
  created_at: string
  related_terms: string[]
  category?: string
  examples?: string[]
}

// Stomatološke kategorije
const categories = [
  'Sve',
  'Dijagnostika',
  'Hirurgija',
  'Ortodoncija',
  'Endodoncija',
  'Parodontologija',
  'Prostetika',
  'Preventiva',
  'Radiologija',
  'Anestezija'
]

export default function GlossaryPage() {
  const [terms, setTerms] = useState<GlossaryEntry[]>([])
  const [filteredTerms, setFilteredTerms] = useState<GlossaryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('Sve')

  // Serbian Latin alphabet + special characters
  const alphabet = ['#', 'A', 'B', 'C', 'Č', 'Ć', 'D', 'Dž', 'Đ', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'Lj', 'M', 'N', 'Nj', 'O', 'P', 'R', 'S', 'Š', 'T', 'U', 'V', 'Z', 'Ž']

  useEffect(() => {
    fetchTerms()
  }, [])

  useEffect(() => {
    filterTerms()
  }, [terms, searchQuery, selectedLetter, selectedCategory])

  const fetchTerms = async () => {
    console.log('=== FETCHING GLOSSARY TERMS ===')
    try {
      console.log('Making Supabase query for published glossary terms...')
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      })
      
      const queryPromise = supabase
        .from('glossary')
        .select('*')
        .eq('published', true)
        .order('term', { ascending: true })
      
      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any

      console.log('Supabase response - Data:', data)
      console.log('Supabase response - Error:', error)

      if (error) {
        console.error('Error fetching terms:', error)
        toast.error('Greška pri učitavanju termina')
        return
      }

      console.log('Setting terms:', data?.length || 0, 'terms')
      setTerms(data || [])
    } catch (error) {
      console.error('Exception in fetchTerms:', error)
      if (error instanceof Error && error.message === 'Request timeout') {
        console.error('Request timed out after 10 seconds')
        toast.error('Greška pri učitavanju - timeout')
      }
    } finally {
      console.log('Setting loading to false')
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
        filtered = filtered.filter(term => /^\d/.test(term.term))
      } else {
        filtered = filtered.filter(term =>
          term.term.toUpperCase().startsWith(selectedLetter)
        )
      }
    }

    // Filter by category
    if (selectedCategory !== 'Sve') {
      filtered = filtered.filter(term => 
        term.category === selectedCategory
      )
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

  const termsByLetter = useMemo(() => {
    const grouped: { [key: string]: GlossaryEntry[] } = {}
    filteredTerms.forEach(term => {
      const firstLetter = term.term.charAt(0).toUpperCase()
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = []
      }
      grouped[firstLetter].push(term)
    })
    
    Object.keys(grouped).forEach(letter => {
      grouped[letter].sort((a, b) => a.term.localeCompare(b.term))
    })
    
    return grouped
  }, [filteredTerms])

  const availableLetters = Object.keys(termsByLetter).sort()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
            />
            <p className="mt-4 text-gray-600">Učitavanje rečnika...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section - Full Width */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-100 relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-20"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-indigo-100 rounded-full opacity-30"></div>
        </div>
        
        {/* Content container with max-width for readability */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Welcome Banner */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 rounded-full mb-8"
            >
              <span className="text-sm font-medium text-white">HEJ TI! DOBRODOŠAO U NAŠ RECNIK</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-normal text-gray-900 mb-8 leading-tight"
            >
              Otključavanje Jasnoće:<br />
              Vaš Kompletan Stomatološki Rečnik
            </motion.h1>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center gap-8 text-lg text-gray-600 mb-10"
            >
              <span className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                <Hash className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{terms.length} termina</span>
              </span>
              <span className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                <span className="font-medium">{categories.length - 1} kategorija</span>
              </span>
            </motion.div>

            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="max-w-2xl mx-auto mb-10"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Šta tražite?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-16 text-lg bg-white text-gray-900 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm"
                />
              </div>
            </motion.div>
            
            {/* Visual elements */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex justify-center items-center space-x-6"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <MessageCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg">
                <Plus className="h-6 w-6 text-green-600" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-gray-500" />
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    ${selectedCategory === category 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600' 
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }
                    h-8 rounded-full
                  `}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Alphabet Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedLetter === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLetter(null)}
              className={`
                ${selectedLetter === null 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600' 
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }
                rounded-full px-4 py-2
              `}
            >
              Sve
            </Button>
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
                      ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600' 
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }
                    ${!hasTerms ? 'opacity-50 cursor-not-allowed' : ''}
                    rounded-full px-4 py-2
                  `}
                >
                  {letter === '#' ? <Hash className="h-4 w-4" /> : letter}
                </Button>
              )
            })}
          </div>
        </motion.div>

        {/* Clear Filters */}
        {(selectedLetter || searchQuery || selectedCategory !== 'Sve') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 text-center"
          >
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('')
                setSelectedLetter(null)
                setSelectedCategory('Sve')
              }}
              className="border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Očisti filtere
            </Button>
          </motion.div>
        )}

        {/* Terms List */}
        <AnimatePresence mode="wait">
          {filteredTerms.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nema pronađenih termina
              </h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? `Nema termina koji odgovaraju pretraživanju "${searchQuery}"`
                  : 'Pokušajte da prilagodite filtere'
                }
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {availableLetters.map((letter, letterIndex) => (
                <motion.div
                  key={letter}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: letterIndex * 0.1 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg">
                      <span className="text-xl font-normal text-white">
                        {letter}
                      </span>
                    </div>
                    <Separator className="flex-1 bg-gray-200" />
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {termsByLetter[letter].length}
                    </Badge>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {termsByLetter[letter].map((term, termIndex) => (
                      <motion.div
                        key={term.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: (letterIndex * 0.1) + (termIndex * 0.05) }}
                      >
                        <Card className="bg-white border-gray-200 hover:border-blue-500 transition-all duration-300 group h-full shadow-sm hover:shadow-lg">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                                <Link href={`/recnik/${term.slug}`}>
                                  {term.term}
                                </Link>
                              </CardTitle>
                              {term.category && (
                                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                                  {term.category}
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                              {term.definition}
                            </p>

                            {term.examples && term.examples.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Primeri:</h4>
                                <div className="flex flex-wrap gap-1">
                                  {term.examples.map((example, index) => (
                                    <Badge key={index} variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-700">
                                      {example}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {term.related_terms && term.related_terms.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Povezani:</h4>
                                <div className="flex flex-wrap gap-1">
                                  {term.related_terms.slice(0, 3).map((relatedTerm, index) => (
                                    <Button
                                      key={index}
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 px-2 text-xs hover:bg-blue-50 text-gray-700"
                                      onClick={() => setSearchQuery(relatedTerm)}
                                    >
                                      {relatedTerm}
                                      <ArrowRight className="ml-1 h-3 w-3" />
                                    </Button>
                                  ))}
                                  {term.related_terms.length > 3 && (
                                    <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-700">
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
                                className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg px-4 py-2"
                              >
                                Pročitaj više
                                <ArrowRight className="ml-1 h-4 w-4" />
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-blue-800 border-blue-600">
            <CardContent className="py-8 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">
                Ne možete da pronađete ono što tražite?
              </h3>
              <p className="text-blue-100 mb-4">
                Stalno proširujemo naš rečnik. Predložite termin ili kontaktirajte nas za više informacija.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="default" className="bg-white text-blue-600 hover:bg-blue-50">
                  <Plus className="mr-2 h-4 w-4" />
                  Predložite termin
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Kontaktirajte podršku
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Blog Posts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="py-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-normal text-foreground mb-3">
                  Istražite popularne teme o kojima se priča
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Proširite svoje znanje sa našim blog postovima koji pokrivaju najvažnije teme iz stomatologije i digitalne transformacije ordinacija.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Featured Blog Post 1 */}
                <Card className="bg-white border-gray-200 hover:border-green-500 transition-all duration-300 group shadow-sm hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        Digitalna transformacija
                      </Badge>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                      Kako da modernizujete vašu stomatološku ordinaciju
                    </h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      Saveti i strategije za implementaciju digitalnih rešenja koja će poboljšati efikasnost i pacijentsko iskustvo.
                    </p>
                    <Link href="/blog">
                      <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50 w-full">
                        Pročitajte članak
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Featured Blog Post 2 */}
                <Card className="bg-white border-gray-200 hover:border-green-500 transition-all duration-300 group shadow-sm hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-blue-100 text-blue-800 text-xs">
                        Pacijentsko iskustvo
                      </Badge>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                      Poboljšanje komunikacije sa pacijentima
                    </h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      Tehnike i alati za bolju komunikaciju koja će povećati zadovoljstvo pacijenata i lojalnost.
                    </p>
                    <Link href="/blog">
                      <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50 w-full">
                        Pročitajte članak
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Featured Blog Post 3 */}
                <Card className="bg-white border-gray-200 hover:border-green-500 transition-all duration-300 group shadow-sm hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-purple-100 text-purple-800 text-xs">
                        Tehnologija
                      </Badge>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                      Najnoviji trendovi u stomatološkoj tehnologiji
                    </h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      Pregled inovativnih tehnologija koje menjaju način rada stomatoloških ordinacija.
                    </p>
                    <Link href="/blog">
                      <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50 w-full">
                        Pročitajte članak
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Link href="/blog">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Istražite sve blogove
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-card/40 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-gray-200 bg-gradient-to-r from-primary/30 via-secondary/20 to-primary/30 bg-clip-border relative overflow-hidden">
            <div className="text-center relative z-10">
              <motion.h2 
                className="text-4xl md:text-5xl font-normal text-foreground mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                Spremni da digitalizujete ordinaciju?<br />
                <span className="text-primary">Start za 5 minuta.</span>
              </motion.h2>

              <motion.p 
                className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Zakažite demo i saznajte kako da automatizujete zakazivanja, smanjite broj propuštenih termina i uštedite 10+ sati nedeljno. Sve to bez komplikovane obuke.
              </motion.p>

              {/* Contact Form */}
              <motion.div 
                className="max-w-md mx-auto mb-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <DemoForm 
                  title="Zakažite demo"
                  description="Kontaktirajte nas za besplatan demo Odontoa sistema"
                  buttonText="Zakaži demo"
                />
              </motion.div>

              {/* Additional Info */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-8 justify-center items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Demo traje 15 minuta</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Bez obaveze</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Odmah dostupan</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 