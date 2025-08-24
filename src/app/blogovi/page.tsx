'use client';

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  FileText, 
  Calendar, 
  User, 
  Clock, 
  ArrowRight, 
  Sparkles,
  Filter,
  TrendingUp,
  BookOpen,
  Eye,
  Heart,
  Star,
  Share2,
  Bookmark,
  ChevronRight,
  Tag
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
  published: boolean
  meta_description?: string
}

export default function BlogoviPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    fetchBlogs()
  }, [])

  useEffect(() => {
    filterBlogs()
  }, [blogs, searchQuery, selectedCategory])

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching blogs:', error)
        return
      }

      setBlogs(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterBlogs = () => {
    let filtered = blogs

    if (searchQuery) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(blog =>
        blog.tags && blog.tags.includes(selectedCategory)
      )
    }

    setFilteredBlogs(filtered)
  }

  const getAllCategories = () => {
    const categories = new Set<string>()
    blogs.forEach(blog => {
      if (blog.tags) {
        blog.tags.forEach(tag => categories.add(tag))
      }
    })
    return Array.from(categories).sort()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(' ').length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 font-medium">Učitavanje blogova...</p>
          </div>
        </div>
      </div>
    )
  }

  const featuredBlog = blogs[0] // Prvi blog kao featured
  const regularBlogs = blogs.slice(1) // Ostali blogovi

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Inspirisan Circle.so */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Odontoa Blog
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Pronađite najnovije članke o stomatologiji, digitalnoj ordinaciji i zdravlju zuba. 
              Saveti od stručnjaka za bolju oralnu higijenu.
            </p>

            {/* Search Bar - Inspirisan Smile.io */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Pretražite blogove..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center items-center space-x-8 text-gray-500">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span className="font-medium">{blogs.length} članaka</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">Aktuelno</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span className="font-medium">Popularno</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories Filter - Inspirisan Circle.so */}
        {getAllCategories().length > 0 && (
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
              {getAllCategories().map((category) => {
                const isSelected = selectedCategory === category
                const categoryCount = blogs.filter(blog => 
                  blog.tags && blog.tags.includes(category)
                ).length

                return (
                  <Button
                    key={category}
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
                )
              })}
            </div>
          </div>
        )}

        {/* Featured Blog - Inspirisan Smile.io */}
        {featuredBlog && !selectedCategory && !searchQuery && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured</h2>
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative overflow-hidden">
                  <img 
                    src={featuredBlog.featured_image || '/images/blog-placeholder.jpg'} 
                    alt={featuredBlog.title} 
                    className="w-full h-full object-cover aspect-[4/3]" 
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-gray-800 text-sm font-medium">
                      Featured
                    </Badge>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(featuredBlog.created_at)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {getReadingTime(featuredBlog.content)}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                    <Link href={`/blogovi/${featuredBlog.slug}`} className="hover:text-blue-600 transition-colors">
                      {featuredBlog.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredBlog.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-2" />
                      {featuredBlog.author}
                    </div>
                    
                    <Link href={`/blogovi/${featuredBlog.slug}`}>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-3">
                        Pročitaj više
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Results Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedCategory ? `Članci u kategoriji "${selectedCategory}"` : 'Svi članci'}
              </h2>
              <p className="text-gray-600">
                {filteredBlogs.length} članaka
              </p>
            </div>
          </div>
        </div>

        {/* Blogs Grid - Inspirisan Circle.so */}
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
            {(selectedCategory || searchQuery ? filteredBlogs : regularBlogs).map((blog, index) => (
              <Card 
                key={blog.id} 
                className="group cursor-pointer border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden rounded-xl"
                onMouseEnter={() => setHoveredCard(blog.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden">
                    <img 
                      src={blog.featured_image || '/images/blog-placeholder.jpg'} 
                      alt={blog.title} 
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" 
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
                
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(blog.created_at)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {getReadingTime(blog.content)}
                    </div>
                  </div>
                  
                  <CardTitle className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    <Link href={`/blogovi/${blog.slug}`}>
                      {blog.title}
                    </Link>
                  </CardTitle>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-2" />
                      {blog.author}
                    </div>
                    
                    <Link href={`/blogovi/${blog.slug}`}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full px-4 py-2"
                      >
                        Pročitaj više
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Newsletter Section - Inspirisan Circle.so */}
        {filteredBlogs.length > 0 && (
          <div className="mt-20">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
              <div className="max-w-2xl mx-auto">
                <Sparkles className="h-12 w-12 mx-auto mb-6 text-white/80" />
                <h3 className="text-3xl font-bold mb-4">Ostanite u toku</h3>
                <p className="text-xl text-blue-100 mb-8">
                  Pretplatite se na naš newsletter i dobijte najnovije članke direktno u vašu email adresu
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Vaša email adresa"
                    className="flex-1 h-12 text-lg border-0 bg-white/20 backdrop-blur-sm text-white placeholder:text-blue-200 rounded-xl"
                  />
                  <Button className="h-12 px-8 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-medium">
                    Pretplati se
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 