'use client';

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { PostLayout } from '@/components/PostLayout'
import { notFound } from 'next/navigation'

interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  author: string
  created_at: string
  tags: string[]
  featured_image?: string
  published: boolean
}

interface PageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: PageProps) {
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlog()
  }, [params.slug])

  const fetchBlog = async () => {
    try {
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
    } catch (error) {
      console.error('Error:', error)
      notFound()
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Učitavanje bloga...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!blog) {
    notFound()
  }

  return <PostLayout post={blog} />
} 