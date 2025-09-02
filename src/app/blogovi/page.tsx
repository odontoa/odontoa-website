'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { SUGGESTED_BLOG_TAGS } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DemoForm } from '@/components/DemoForm'
import { 
  Search, 
  FileText, 
  Sparkles,
  Zap,
  Shield,
  Clock
} from 'lucide-react'
import Link from 'next/link'

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  created_at: string
  tags: string[]
  featured_image?: string
  image_url?: string
  published: boolean
  featured: boolean
  meta_description?: string
}

// Memoized Blog Card Component
const BlogCard = React.memo(({ blog, formatDate, getReadingTime }: { 
  blog: Blog, 
  formatDate: (date: string) => string, 
  getReadingTime: (content: string) => string 
}) => (
  <Link href={`/blogovi/${blog.slug}`}>
    <Card 
      className="group cursor-pointer border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden rounded-xl h-full flex flex-col"
    >
      <CardHeader className="p-0 flex-shrink-0">
        <div className="relative overflow-hidden">
          <img 
            src={blog.image_url || blog.featured_image || '/images/blog-placeholder.jpg'} 
            alt={blog.title} 
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" 
            loading="lazy"
          />
          <div className="absolute top-4 left-4">
            <div className="flex flex-wrap gap-2">
              {blog.tags && blog.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} className="bg-white/90 text-gray-800 text-xs font-medium">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            {formatDate(blog.created_at)}
          </div>
          <div className="flex items-center">
            {getReadingTime(blog.content)}
          </div>
        </div>
        
        <CardTitle className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
          {blog.title}
        </CardTitle>
        
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-1">
          {blog.excerpt}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center text-sm text-gray-500">
            {blog.author}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full px-4 py-2"
          >
            Pročitaj više
          </Button>
        </div>
      </CardContent>
    </Card>
  </Link>
))

BlogCard.displayName = 'BlogCard'

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-white pt-20">
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-lg text-gray-600 font-medium">Učitavanje blogova...</p>
      </div>
    </div>
  </div>
)

// Error Component
const ErrorDisplay = ({ error, onRetry }: { error: string, onRetry: () => void }) => (
  <div className="min-h-screen bg-white pt-20">
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="bg-red-50 rounded-2xl p-12 max-w-md mx-auto">
          <FileText className="h-16 w-16 text-red-400 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Greška pri učitavanju
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full"
          >
            Pokušajte ponovo
          </Button>
        </div>
      </div>
    </div>
  </div>
)

export default function BlogoviPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Optimized fetch function with error handling
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('featured', { ascending: false }) // Featured blogs first
        .order('created_at', { ascending: false }) // Then by date

      if (error) {
        console.error('Error fetching blogs:', error)
        setError('Greška pri učitavanju blogova')
        return
      }

      setBlogs(data || [])
    } catch (err) {
      console.error('Error:', err)
      setError('Greška pri učitavanju blogova')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs()
    
    // Listen for content updates
    const handleContentUpdate = () => {
      console.log('=== BLOGOVI PAGE: Content update received ===')
      fetchBlogs()
    }
    
    window.addEventListener('content-updated', handleContentUpdate)
    
    return () => {
      window.removeEventListener('content-updated', handleContentUpdate)
    }
  }, [fetchBlogs])

  // Memoized filtered blogs for better performance
  const filteredBlogs = useMemo(() => {
    let filtered = blogs

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(query) ||
        blog.excerpt.toLowerCase().includes(query) ||
        blog.content.toLowerCase().includes(query)
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(blog =>
        blog.tags && blog.tags.includes(selectedCategory)
      )
    }

    return filtered
  }, [blogs, searchQuery, selectedCategory])

  // Memoized categories - koristi predložene kategorije
  const categories = useMemo(() => {
    // Koristi samo predložene kategorije koje se stvarno koriste u blogovima
    const usedCategories = SUGGESTED_BLOG_TAGS.filter(suggestedTag => 
      blogs.some(blog => blog.tags && blog.tags.includes(suggestedTag.name))
    )
    
    return usedCategories.map(cat => cat.name)
  }, [blogs])

  // Memoized latest and recommended blogs
  const { latestBlogs, recommendedBlogs } = useMemo(() => {
    if (filteredBlogs.length === 0) return { latestBlogs: [], recommendedBlogs: [] }
    
    // Latest blogs - show all blogs (or filtered by search/category)
    const latest = selectedCategory || searchQuery ? filteredBlogs : filteredBlogs
    
    // Recommended blogs - take different blogs (not the same as latest)
    // If we have enough blogs, take from the middle/end, otherwise take first 3
    const recommended = filteredBlogs.length > 3 
      ? filteredBlogs.slice(3, 6) 
      : filteredBlogs.slice(0, 3)
    
    return { latestBlogs: latest, recommendedBlogs: recommended }
  }, [filteredBlogs, selectedCategory, searchQuery])

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }, [])

  const getReadingTime = useCallback((content: string) => {
    const wordsPerMinute = 200
    const words = content.split(' ').length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min čitanja`
  }, [])

  // Loading state
  if (loading) {
    return <LoadingSpinner />
  }

  // Error state
  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchBlogs} />
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section - Full Width */}
      <div className="w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-100 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-20"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-indigo-100 rounded-full opacity-30"></div>
        </div>
        
        {/* Content container with max-width for readability */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Text content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-foreground mb-8 leading-tight">
                Vodič za modernu dentalnu praksu
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed">
                Praktični saveti i aktuelne teme koje pomažu da vaša ordinacija radi bolje.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto lg:mx-0 mb-10">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Pretražite blogove..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-16 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm"
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-center lg:justify-start items-center space-x-8 text-gray-500">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{blogs.length} članaka</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Aktuelno</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Popularno</span>
                </div>
              </div>
            </div>

            {/* Right side - Visual elements */}
            <div className="relative">
              {/* Main illustration container */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-white/20">
                {/* Dental mockup image */}
                <div className="relative mb-8">
                  <img 
                    src="/images/digitalni-karton-pacijenta.png" 
                    alt="Digitalni karton pacijenta" 
                    className="w-full h-56 object-cover rounded-2xl shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                </div>
                

                
                {/* Decorative elements */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-100 rounded-full opacity-20 -z-10"></div>
                <div className="absolute top-6 right-6 w-10 h-10 bg-purple-100 rounded-full opacity-60"></div>
                <div className="absolute bottom-6 left-6 w-8 h-8 bg-indigo-100 rounded-full opacity-60"></div>
              </div>
              
              {/* Additional floating elements */}
              <div className="absolute -top-10 right-10 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full p-4 shadow-lg">
                <Sparkles className="h-7 w-7" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories Filter */}
        {categories.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedCategory(null)}
                className={`rounded-full px-6 py-3 font-medium ${
                  selectedCategory === null 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Svi članci
              </Button>
              {categories.map((category) => {
                const isSelected = selectedCategory === category
                const categoryCount = blogs.filter(blog => 
                  blog.tags && blog.tags.includes(category)
                ).length
                
                // Pronađi opis kategorije
                const categoryInfo = SUGGESTED_BLOG_TAGS.find(cat => cat.name === category)

                return (
                  <div key={category} className="relative group">
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      size="lg"
                      onClick={() => setSelectedCategory(isSelected ? null : category)}
                      className={`rounded-full px-6 py-3 font-medium ${
                        isSelected 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {category}
                      <Badge 
                        variant="secondary" 
                        className={`ml-2 text-xs ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {categoryCount}
                      </Badge>
                    </Button>
                    
                    {/* Tooltip sa opisom kategorije */}
                    {categoryInfo && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                        {categoryInfo.description}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}



        {/* Results Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedCategory ? `Članci u kategoriji "${selectedCategory}"` : 'Najnoviji članci'}
              </h2>
              <p className="text-gray-600">
                {latestBlogs.length} članaka
              </p>
            </div>
          </div>
        </div>

        {/* Blogs Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-50 rounded-2xl p-12 max-w-md mx-auto">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Nema pronađenih članaka
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? `Nema članaka koji odgovaraju pretraživanju "${searchQuery}"`
                  : 'Nema članaka za prikaz'
                }
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory(null)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full"
              >
                Pokušajte ponovo
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Suspense fallback={<div>Učitavanje...</div>}>
              {latestBlogs.map((blog) => (
                <BlogCard 
                  key={blog.id}
                  blog={blog}
                  formatDate={formatDate}
                  getReadingTime={getReadingTime}
                />
              ))}
            </Suspense>
          </div>
        )}



        {/* Middle CTA Section */}
        {latestBlogs.length > 0 && (
          <div className="mt-16 mb-20 flex justify-center">
            <div className="w-full max-w-4xl bg-card/40 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl border border-gray-200 bg-gradient-to-r from-primary/30 via-secondary/20 to-primary/30 bg-clip-border relative overflow-hidden">
              <div className="text-center relative z-10">
                <h3 className="text-3xl font-normal mb-8 text-foreground">
                  Organizovana ordinacija počinje ovde.
                </h3>
                <div className="flex justify-center">
                  <Link href="/kontakt?source=blog">
                    <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium">
                      Saznaj kako
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Articles Section */}
        {recommendedBlogs.length > 0 && latestBlogs.length > 0 && (
          <div className="mt-16 mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Preporučeni članci</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Pronađite više korisnih saveta i informacija o digitalizaciji stomatološke ordinacije
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Suspense fallback={<div>Učitavanje...</div>}>
                {recommendedBlogs.map((blog) => (
                  <BlogCard 
                    key={blog.id}
                    blog={blog}
                    formatDate={formatDate}
                    getReadingTime={getReadingTime}
                  />
                ))}
              </Suspense>
            </div>
          </div>
        )}

        {/* CTA Section */}
        {latestBlogs.length > 0 && (
          <div className="mt-20">
            <div className="bg-card/40 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-gray-200 bg-gradient-to-r from-primary/30 via-secondary/20 to-primary/30 bg-clip-border relative overflow-hidden">
              <div className="text-center relative z-10">
                <h3 className="text-4xl md:text-5xl font-normal text-foreground mb-6 leading-tight">
                  Spremni da digitalizujete ordinaciju?<br />
                  <span className="text-primary">Start za 5 minuta.</span>
                </h3>

                <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed mb-12">
                  Zakažite demo i saznajte kako da automatizujete zakazivanja, smanjite broj propuštenih termina i uštedite 10+ sati nedeljno. Sve to bez komplikovane obuke.
                </p>

                {/* Contact Form */}
                <div className="max-w-md mx-auto mb-8">
                  <DemoForm 
                    title="Zakažite demo"
                    description="Kontaktirajte nas za besplatan demo Odontoa sistema"
                    buttonText="Zakaži demo"
                  />
                </div>

                {/* Additional Info */}
                <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-center">
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
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 