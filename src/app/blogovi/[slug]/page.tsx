'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { PostLayout } from '@/components/PostLayout'
import { SeoJsonLd } from '@/components/SeoJsonLd'
import { buildCombinedSchema } from '@/lib/schema/buildJsonLd'
import { validateSchemaData, validateDevelopmentWarnings } from '@/lib/schema/validators'
import { notFound } from 'next/navigation'

interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  summary?: string
  meta_description?: string
  author: string
  author_url?: string
  created_at: string
  updated_at?: string
  last_modified?: string
  tags: string[]
  featured_image?: string
  image_url?: string
  alt_text?: string
  published: boolean
  views_count?: number
  reading_time?: number
  seo_score?: number
  related_glossary_terms?: string[]
  faq_schema?: string
}

interface PageProps {
  params: {
    slug: string
  }
}

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <p className="text-lg text-gray-600 font-medium">Učitavanje članka...</p>
    </div>
  </div>
)

// Memoized SEO Component
const MemoizedSeoJsonLd = React.memo(({ 
  schema, 
  pageTitle, 
  pageDescription, 
  visibleContent 
}: {
  schema: any[]
  pageTitle: string
  pageDescription: string
  visibleContent: string
}) => (
  <SeoJsonLd 
    schema={schema}
    pageTitle={pageTitle}
    pageDescription={pageDescription}
    visibleContent={visibleContent}
  />
))

MemoizedSeoJsonLd.displayName = 'MemoizedSeoJsonLd'

// Memoized PostLayout Component
const MemoizedPostLayout = React.memo(({ 
  post, 
  type 
}: {
  post: Blog
  type: 'blog' | 'glossary'
}) => (
  <PostLayout
    post={post}
    type={type}
    showCTA={true}
  />
))

MemoizedPostLayout.displayName = 'MemoizedPostLayout'

export default function BlogPostPage({ params }: PageProps) {
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedGlossary, setRelatedGlossary] = useState<any[]>([])
  const [schema, setSchema] = useState<any[]>([])
  const [schemaError, setSchemaError] = useState<string>('')

  useEffect(() => {
    fetchBlog()
  }, [params.slug])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', params.slug)
        .eq('published', true)
        .single()

      if (error || !data) {
        console.error('Error fetching blog:', error)
        notFound()
        return
      }

      setBlog(data)
      
      // Generate JSON-LD schema with enhanced validation
      try {
        const validationErrors = validateSchemaData(data, 'blog')
        if (validationErrors.length > 0) {
          console.warn('❌ Schema validation errors:', validationErrors)
          setSchemaError(validationErrors.join(', '))
        } else {
          const generatedSchema = buildCombinedSchema(data, 'blog')
          setSchema(generatedSchema)
          
          // Development mode warnings
          validateDevelopmentWarnings(data, 'blog')
          
          console.log('✅ Schema generated successfully:', {
            webPage: generatedSchema.find(s => s['@type'] === 'WebPage') ? '✅' : '❌',
            breadcrumbList: generatedSchema.find(s => s['@type'] === 'BreadcrumbList') ? '✅' : '❌',
            article: generatedSchema.find(s => s['@type'] === 'Article') ? '✅' : '❌',
            faqPage: generatedSchema.find(s => s['@type'] === 'FAQPage') ? '✅' : '❌'
          })
        }
      } catch (error) {
        console.error('❌ Error generating schema:', error)
        setSchemaError(error instanceof Error ? error.message : 'Unknown error')
      }
      
      // Increment view count
      incrementViewCount(data.id)
      
      // Fetch related glossary terms if available
      if (data.related_glossary_terms && data.related_glossary_terms.length > 0) {
        fetchRelatedGlossary(data.related_glossary_terms)
      }
    } catch (error) {
      console.error('Error:', error)
      notFound()
    } finally {
      setLoading(false)
    }
  }

  const incrementViewCount = async (blogId: string) => {
    try {
      await supabase
        .from('blogs')
        .update({ views_count: supabase.rpc('increment', { row_id: blogId, column_name: 'views_count' }) })
        .eq('id', blogId)
    } catch (error) {
      console.error('Error incrementing view count:', error)
    }
  }

  const fetchRelatedGlossary = async (termIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from('glossary')
        .select('*')
        .in('id', termIds)
        .eq('published', true)

      if (!error && data) {
        setRelatedGlossary(data)
      }
    } catch (error) {
      console.error('Error fetching related glossary:', error)
    }
  }

  // Memoized values for better performance
  const visibleContent = useMemo(() => {
    return blog?.content.replace(/<[^>]*>/g, '') || ''
  }, [blog?.content])

  const pageTitle = useMemo(() => {
    return blog ? `${blog.title} | Odontoa` : ''
  }, [blog?.title])

  const pageDescription = useMemo(() => {
    return blog?.meta_description || blog?.summary || blog?.excerpt || ''
  }, [blog?.meta_description, blog?.summary, blog?.excerpt])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!blog) {
    notFound()
  }

  return (
    <>
      {/* Enhanced SEO JSON-LD with visible content validation */}
      {schema.length > 0 && (
        <MemoizedSeoJsonLd 
          schema={schema}
          pageTitle={pageTitle}
          pageDescription={pageDescription}
          visibleContent={visibleContent}
        />
      )}
      
      {/* Schema error display in development */}
      {process.env.NODE_ENV === 'development' && schemaError && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 max-w-md">
          <strong>Schema Error:</strong> {schemaError}
        </div>
      )}

      <Suspense fallback={<LoadingSpinner />}>
        <MemoizedPostLayout
          post={blog}
          type="blog"
        />
      </Suspense>
    </>
  )
} 