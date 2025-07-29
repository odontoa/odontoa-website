'use client';

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  Copy, 
  ExternalLink,
  ArrowLeft,
  BookOpen
} from 'lucide-react'
import { toast } from 'sonner'
import { RelatedPosts } from './RelatedPosts'
import { ShareButtons } from './ShareButtons'
import { TableOfContents } from './TableOfContents'

interface PostLayoutProps {
  post: {
    id: string
    title: string
    content: string
    excerpt: string
    author: string
    created_at: string
    tags: string[]
    featured_image?: string
    slug: string
  }
}

export const PostLayout: React.FC<PostLayoutProps> = ({ post }) => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isSticky, setIsSticky] = useState(false)

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

  const getReadingTime = (content: string) => {
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
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link kopiran u clipboard!')
    } catch (error) {
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

  return (
    <div className="min-h-screen bg-white">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-sky-50 pt-8 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/blogovi">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Nazad na blogove
              </Button>
            </Link>
          </div>

          {/* Title and Meta */}
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              {post.tags && post.tags.slice(0, 2).map((tag, index) => (
                <Link key={index} href={`/blogovi?category=${tag}`}>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>

            <div className="flex items-start justify-between mb-8">
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-gray-900 flex-1 pr-4">
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
                  <AvatarImage src="/images/odontoa-logo1.png" />
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
            </div>

            {/* Excerpt */}
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              {post.excerpt}
            </p>

            {/* Featured Image */}
            {post.featured_image && (
              <div className="aspect-[16/9] rounded-xl shadow-md overflow-hidden">
                <img 
                  src={post.featured_image} 
                  alt={post.title}
                  className="w-full h-full object-cover"
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
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

            {/* Sidebar */}
            <aside className={`${isSticky ? 'sticky top-8' : ''} h-fit`}>
              <div className="space-y-8">
                {/* Table of Contents */}
                <TableOfContents content={post.content} />

                {/* Share Buttons */}
                <ShareButtons 
                  title={post.title}
                  url={window.location.href}
                />

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Tagovi
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Link key={index} href={`/blogovi?category=${tag}`}>
                          <Badge 
                            variant="outline" 
                            className="hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-colors cursor-pointer"
                          >
                            {tag}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author Info */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    O autoru
                  </h3>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/images/odontoa-logo1.png" />
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