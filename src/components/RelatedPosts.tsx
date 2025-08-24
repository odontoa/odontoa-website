import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, User, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Post {
  id: string
  title: string
  excerpt: string
  slug: string
  author: string
  created_at: string
  tags: string[]
  featured_image?: string
}

interface RelatedPostsProps {
  currentPost: {
    id: string
    tags: string[]
  }
}

export const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentPost }) => {
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRelatedPosts()
  }, [currentPost])

  const fetchRelatedPosts = async () => {
    try {
      setLoading(true)
      
      // First, try to find posts with similar tags
      let query = supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .neq('id', currentPost.id)
        .order('created_at', { ascending: false })
        .limit(6)

      // If current post has tags, filter by them
      if (currentPost.tags && currentPost.tags.length > 0) {
        // Create OR conditions for tags
        const tagFilters = currentPost.tags.map(tag => `tags.cs.{${tag}}`)
        query = query.or(tagFilters.join(','))
      }

      const { data: taggedPosts, error: taggedError } = await query

      if (taggedError) {
        console.error('Error fetching tagged posts:', taggedError)
      }

      // If we don't have enough posts with similar tags, get recent posts
      let finalPosts = taggedPosts || []
      
      if (finalPosts.length < 3) {
        const { data: recentPosts, error: recentError } = await supabase
          .from('blogs')
          .select('*')
          .eq('published', true)
          .neq('id', currentPost.id)
          .order('created_at', { ascending: false })
          .limit(3 - finalPosts.length)

        if (recentError) {
          console.error('Error fetching recent posts:', recentError)
        } else if (recentPosts) {
          // Merge and remove duplicates
          const allPosts = [...finalPosts, ...recentPosts]
          const uniquePosts = allPosts.filter((post, index, self) => 
            index === self.findIndex(p => p.id === post.id)
          )
          finalPosts = uniquePosts.slice(0, 3)
        }
      } else {
        finalPosts = finalPosts.slice(0, 3)
      }

      setRelatedPosts(finalPosts)
    } catch (error) {
      console.error('Error fetching related posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(' ').length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min čitanja`
  }

  if (loading) {
    return (
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Učitavam slične članke...</p>
          </div>
        </div>
      </section>
    )
  }

  if (relatedPosts.length === 0) {
    return null
  }

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Slični članci koji bi vam mogli biti korisni
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Pronađite više saveta i vodiča za digitalnu stomatologiju
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedPosts.map(post => (
            <article 
              key={post.id} 
              className="group cursor-pointer"
            >
              <Link href={`/blogovi/${post.slug}`} className="block">
                <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-[1.01]">
                  <div className="relative overflow-hidden">
                    <img 
                      src={post.featured_image || '/images/blog-placeholder.jpg'} 
                      alt={post.title} 
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 left-4">
                      <div className="flex flex-wrap gap-2">
                        {post.tags && post.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} className="bg-white/90 text-gray-800 text-xs font-medium">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{getReadingTime(post.excerpt)}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-normal text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:gap-3 transition-all duration-300">
                        <span>Pročitajte</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/blogovi">
            <Button 
              variant="outline"
              size="lg"
              className="px-8 py-3 rounded-full border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Pogledajte sve članke
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
} 