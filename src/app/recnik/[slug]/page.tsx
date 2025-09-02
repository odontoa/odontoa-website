'use client';

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { PostLayout } from '@/components/PostLayout'
import { SeoJsonLd } from '@/components/SeoJsonLd'
import { buildCombinedSchema } from '@/lib/schema/buildJsonLd'
import { validateSchemaData, validateDevelopmentWarnings } from '@/lib/schema/validators'
import { notFound } from 'next/navigation'

interface GlossaryEntry {
  id: string
  term: string
  slug: string
  definition: string
  full_article: string
  why_it_matters?: string
  related_blog_posts?: string[]
  faq_schema?: string
  related_terms: string[]
  created_at: string
  updated_at?: string
  last_modified?: string
  published: boolean
  views_count?: number
  reading_time?: number
  seo_score?: number
  category?: string
  difficulty_level?: string
  author?: string
  author_url?: string
  image_url?: string
  alt_text?: string
  meta_description?: string
}

interface PageProps {
  params: {
    slug: string
  }
}

export default function GlossaryTermPage({ params }: PageProps) {
  const [term, setTerm] = useState<GlossaryEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([])
  const [schema, setSchema] = useState<any[]>([])
  const [schemaError, setSchemaError] = useState<string>('')

  useEffect(() => {
    fetchTerm()
  }, [params.slug])

  const fetchTerm = async () => {
    try {
      const { data, error } = await supabase
        .from('glossary')
        .select('*')
        .eq('slug', params.slug)
        .eq('published', true)
        .single()

      if (error || !data) {
        console.error('Error fetching term:', error)
        notFound()
        return
      }

      setTerm(data)
      
      // Generate JSON-LD schema with enhanced validation
      try {
        const validationErrors = validateSchemaData(data, 'glossary')
        if (validationErrors.length > 0) {
          console.warn('❌ Schema validation errors:', validationErrors)
          setSchemaError(validationErrors.join(', '))
        } else {
          const generatedSchema = buildCombinedSchema(data, 'glossary')
          setSchema(generatedSchema)
          
          // Development mode warnings
          validateDevelopmentWarnings(data, 'glossary')
          
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
      
      // Fetch related blogs if available
      if (data.related_blog_posts && data.related_blog_posts.length > 0) {
        fetchRelatedBlogs(data.related_blog_posts)
      }
    } catch (error) {
      console.error('Error:', error)
      notFound()
    } finally {
      setLoading(false)
    }
  }

  const incrementViewCount = async (termId: string) => {
    try {
      await supabase
        .from('glossary')
        .update({ views_count: supabase.rpc('increment', { row_id: termId, column_name: 'views_count' }) })
        .eq('id', termId)
    } catch (error) {
      console.error('Error incrementing view count:', error)
    }
  }

  const fetchRelatedBlogs = async (blogIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .in('id', blogIds)
        .eq('published', true)

      if (!error && data) {
        setRelatedBlogs(data)
      }
    } catch (error) {
      console.error('Error fetching related blogs:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!term) {
    notFound()
  }

  // Extract visible content for FAQ synchronization validation
  const visibleContent = term.full_article.replace(/<[^>]*>/g, '')

  return (
    <>
      {/* Enhanced SEO JSON-LD with visible content validation */}
      {schema.length > 0 && (
        <SeoJsonLd 
          schema={schema}
          pageTitle={`${term.term} | Odontoa Rečnik`}
          pageDescription={term.meta_description || term.definition}
          visibleContent={visibleContent}
        />
      )}
      
      {/* Schema error display in development */}
      {process.env.NODE_ENV === 'development' && schemaError && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 max-w-md">
          <strong>Schema Error:</strong> {schemaError}
        </div>
      )}

      <PostLayout
        post={{
          id: term.id,
          title: term.term,
          content: term.full_article,
          excerpt: term.definition,
          author: term.author || 'Odontoa Tim',
          created_at: term.created_at,
          updated_at: term.updated_at,
          last_modified: term.last_modified,
          tags: term.related_terms || [],
          featured_image: term.image_url,
          image_url: term.image_url,
          alt_text: term.alt_text,
          slug: term.slug,
          views_count: term.views_count,
          reading_time: term.reading_time,
          seo_score: term.seo_score,
          related_glossary_terms: term.related_terms,
          faq_schema: term.faq_schema
        }}
        type="glossary"
        showCTA={true}
      />
    </>
  )
} 