'use client';

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { PostLayout } from '@/components/PostLayout'
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
        .update({ 
          views_count: supabase.rpc('increment', { row_id: termId, column_name: 'views_count' })
        })
        .eq('id', termId)
    } catch (error) {
      console.error('Error incrementing view count:', error)
    }
  }

  const fetchRelatedBlogs = async (blogSlugs: string[]) => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, slug, excerpt, created_at, tags')
        .in('slug', blogSlugs)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(6)

      if (!error && data) {
        setRelatedBlogs(data)
      }
    } catch (error) {
      console.error('Error fetching related blogs:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Učitavanje termina...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!term) {
    notFound()
  }

  // Transform glossary entry to match PostLayout interface
  const postData = {
    id: term.id,
    title: term.term,
    slug: term.slug,
    content: term.full_article,
    excerpt: term.definition,
    summary: term.why_it_matters,
    author: 'Odontoa Tim',
    created_at: term.created_at,
    updated_at: term.updated_at,
    last_modified: term.last_modified,
    tags: term.related_terms || [],
    views_count: term.views_count,
    reading_time: term.reading_time,
    seo_score: term.seo_score,
    related_glossary_terms: term.related_terms,
    faq_schema: term.faq_schema,
    category: term.category,
    difficulty_level: term.difficulty_level
  }

  return <PostLayout post={postData} type="glossary" showCTA={true} />
} 