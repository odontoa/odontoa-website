'use client';

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  Copy, 
  ExternalLink,
  ArrowLeft,
  BookOpen,
  Eye,
  TrendingUp
} from 'lucide-react'
import { toast } from 'sonner'
import { RelatedPosts } from './RelatedPosts'
import { ShareButtons } from './ShareButtons'
import { TableOfContents } from './TableOfContents'
import { CTABlock } from './CTABlock'
import { generateCombinedSchema } from '@/lib/utils'

interface PostLayoutProps {
  post: {
    id: string
    title: string
    content: string
    excerpt: string
    summary?: string
    meta_description?: string
    author: string
    created_at: string
    updated_at?: string
    last_modified?: string
    tags: string[]
    featured_image?: string
    image_url?: string
    alt_text?: string
    slug: string
    views_count?: number
    reading_time?: number
    seo_score?: number
    related_glossary_terms?: string[]
    faq_schema?: string
  }
  type?: 'blog' | 'glossary'
  showCTA?: boolean
}

export const PostLayout: React.FC<PostLayoutProps> = ({ 
  post, 
  type = 'blog',
  showCTA = true 
}) => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isSticky, setIsSticky] = useState(false)
  const [relatedGlossaryTerms, setRelatedGlossaryTerms] = useState<any[]>([])

  // Scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setScrollProgress(scrollPercent)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Sticky sidebar detection
  useEffect(() => {
    const handleResize = () => {
      setIsSticky(window.innerWidth >= 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Fetch related glossary terms if available
  useEffect(() => {
    if (post.related_glossary_terms && post.related_glossary_terms.length > 0) {
      fetchRelatedGlossaryTerms()
    }
  }, [post.related_glossary_terms])

  // Add meta keywords to head
  useEffect(() => {
    if (post.tags && post.tags.length > 0) {
      const metaKeywords = document.querySelector('meta[name="keywords"]')
      const keywords = post.tags.join(', ')
      
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords)
      } else {
        const newMetaKeywords = document.createElement('meta')
        newMetaKeywords.setAttribute('name', 'keywords')
        newMetaKeywords.setAttribute('content', keywords)
        document.head.appendChild(newMetaKeywords)
      }
    }
  }, [post.tags])

  const fetchRelatedGlossaryTerms = async () => {
    try {
      const response = await fetch(`/api/glossary/related?terms=${post.related_glossary_terms?.join(',')}`)
      if (response.ok) {
        const data = await response.json()
        setRelatedGlossaryTerms(data)
      }
    } catch (error) {
      console.error('Error fetching related glossary terms:', error)
    }
  }

  const getReadingTime = (content: string) => {
    if (post.reading_time) {
      return `${post.reading_time} min čitanja`
    }
    const wordsPerMinute = 200
    const words = content.split(' ').length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min čitanja`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const copyLink = async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Link kopiran u clipboard!')
      }
    } catch (err) {
      console.error('Error copying link:', err)
      toast.error('Greška pri kopiranju linka')
    }
  }

  const getAuthorInitials = (author: string) => {
    return author
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getFeaturedImage = () => {
    const imageUrl = post.image_url || post.featured_image
    // Don't show placeholder images or empty URLs
    if (!imageUrl || imageUrl.includes('placeholder') || imageUrl.includes('test-')) {
      return null
    }
    return imageUrl
  }

  const getImageAlt = () => {
    return post.alt_text || post.title
  }

  const getBackUrl = () => {
    return type === 'blog' ? '/blogovi' : '/recnik'
  }

  const getBackText = () => {
    return type === 'blog' ? 'Nazad na blogove' : 'Nazad na rečnik'
  }

  // Function to add IDs to headings in HTML content
  const addIdsToHeadings = (htmlContent: string): string => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')
    
    headings.forEach((heading, index) => {
      const text = heading.textContent || ''
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim()
        .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      
      // If ID is empty or duplicate, use index
      const finalId = id || `heading-${index}`
      heading.setAttribute('id', finalId)
    })
    
    return doc.body.innerHTML
  }



  return (
    <div className="min-h-screen bg-white">
      {/* SEO Meta Tags */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateCombinedSchema(post, type))
        }}
      />

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-sky-50 pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Back Button */}
          <div className="mb-8">
            <Link href={getBackUrl()}>
              <Button 
                variant="outline" 
                className="text-gray-700 hover:text-gray-900 border-gray-300 hover:border-gray-400 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 px-4 py-2 rounded-lg"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {getBackText()}
              </Button>
            </Link>
          </div>

          {/* Title and Meta */}
          <div className="max-w-4xl mx-auto">


            <div className="flex items-start justify-between mb-8">
              <h1 className="text-4xl md:text-5xl font-normal leading-tight text-gray-900 flex-1 pr-4">
                {post.title}
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
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/images/Odontoa - logo pack/Icon_color.png" />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                    {getAuthorInitials(post.author)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{getReadingTime(post.content)}</span>
              </div>
              {post.views_count && (
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{post.views_count} pregleda</span>
                </div>
              )}
            </div>



            {/* Summary/Excerpt */}
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              {post.summary || post.excerpt}
            </p>

            {/* Featured Image */}
            {getFeaturedImage() && (
              <div className="aspect-[16/9] rounded-xl shadow-md overflow-hidden">
                <img 
                  src={getFeaturedImage()} 
                  alt={getImageAlt()}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', getFeaturedImage())
                    e.currentTarget.style.display = 'none'
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', getFeaturedImage())
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-12">
            {/* Main Content */}
            <article className="prose prose-lg max-w-none">
              <div 
                className="text-lg leading-8 text-gray-700"
                dangerouslySetInnerHTML={{ __html: addIdsToHeadings(post.content) }}
              />

              {/* CTA at the bottom */}
              <div className="mt-12">
                <CTABlock 
                  type={type} 
                  data={post}
                  variant="gradient"
                />
              </div>

              {/* FAQ Schema Display */}
              {post.faq_schema && (
                <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">
                    Često postavljena pitanja
                  </h3>
                  <div className="space-y-4">
                    {(() => {
                      try {
                        const schemaData = typeof post.faq_schema === 'string' 
                          ? JSON.parse(post.faq_schema) 
                          : post.faq_schema
                        
                        // Handle both old format (single FAQPage) and new format (array with multiple schemas)
                        const faqSchema = Array.isArray(schemaData) 
                          ? schemaData.find(schema => schema['@type'] === 'FAQPage')
                          : schemaData
                        
                        if (faqSchema && faqSchema.mainEntity && Array.isArray(faqSchema.mainEntity)) {
                          return faqSchema.mainEntity.map((faq: any, index: number) => (
                            <div key={index} className="bg-white p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-900 mb-2">
                                {faq.name}
                              </h4>
                              <p className="text-gray-700">
                                {faq.acceptedAnswer.text}
                              </p>
                            </div>
                          ))
                        }
                        return <p className="text-gray-600">Nema dostupnih FAQ podataka.</p>
                      } catch (error) {
                        console.warn('Error parsing FAQ schema:', error)
                        return <p className="text-gray-600">Greška pri učitavanju FAQ podataka.</p>
                      }
                    })()}
                  </div>
                </div>
              )}

              {/* Related Glossary Terms */}
              {relatedGlossaryTerms.length > 0 && (
                <div className="mt-12 p-6 bg-purple-50 rounded-xl border border-purple-200">
                  <h3 className="text-xl font-semibold text-purple-900 mb-4">
                    Povezani rečnički termini
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedGlossaryTerms.map((term, index) => (
                      <Link 
                        key={index} 
                        href={`/recnik/${term.slug}`}
                        className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-semibold text-purple-900 mb-1">
                          {term.term}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {term.definition}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}


            </article>

            {/* Sidebar */}
            <aside className={`${isSticky ? 'sticky top-8' : ''} h-fit`}>
              <div className="space-y-8">
                {/* Table of Contents */}
                <TableOfContents content={post.content} />

                {/* Share Buttons */}
                <ShareButtons 
                  title={post.title}
                  url={typeof window !== 'undefined' ? window.location.href : ''}
                />



                {/* Author Info */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    O autoru
                  </h3>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/images/Odontoa - logo pack/Icon_color.png" />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {getAuthorInitials(post.author)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{post.author}</p>
                      <p className="text-sm text-gray-600">Odontoa Tim</p>
                    </div>
                  </div>
                </div>

                {/* Last Modified */}
                {(post.last_modified || post.updated_at) && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-blue-700">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-medium">Ažurirano</span>
                    </div>
                    <p className="text-sm text-blue-600 mt-1">
                      {formatDate(post.last_modified || post.updated_at!)}
                    </p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <RelatedPosts currentPost={post} />
    </div>
  )
} 