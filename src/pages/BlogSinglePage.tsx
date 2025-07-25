import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { supabase, Blog } from '@/lib/supabase'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Loader2 } from 'lucide-react'
import { PostLayout } from '@/components/PostLayout'

export default function BlogSinglePage() {
  const { slug } = useParams<{ slug: string }>()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (slug) {
      fetchBlog(slug)
    }
  }, [slug])

  const fetchBlog = async (blogSlug: string) => {
    try {
      console.log('=== FETCHING SINGLE BLOG VIA RAW HTTP ===');
      console.log('Blog slug:', blogSlug);
      
      const response = await fetch(`https://bjbfmddrekjmactytaky.supabase.co/rest/v1/blogs?select=*&slug=eq.${blogSlug}&published=eq.true&limit=1`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqYmZtZGRyZWtqbWFjdHl0YWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDA1NjEsImV4cCI6MjA2OTAxNjU2MX0.jkSPsLNdD1pfm5er4TgHm0T6vVdYaXorlnScFe_X99k',
          'Content-Type': 'application/json'
        }
      });

      console.log('Single blog fetch response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched blog data:', data);
        
        if (data && data.length > 0) {
          setBlog(data[0]);
        } else {
          setError('Blog post not found or not published');
        }
      } else {
        const errorData = await response.text();
        console.error('Single blog fetch error:', errorData);
        setError('Blog post not found or not published');
      }
    } catch (err) {
      console.error('Single blog fetch exception:', err);
      setError('An error occurred while loading the blog post');
    } finally {
      setLoading(false);
    }
  }

  const generateFAQSchema = (blog: Blog) => {
    if (blog.faq_schema) {
      return JSON.stringify(blog.faq_schema)
    }
    return null
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </>
    )
  }

  if (error || !blog) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {error || 'Blog post not found'}
            </h1>
            <a 
              href="/blogovi" 
              className="text-blue-600 hover:text-blue-800 flex items-center justify-center"
            >
              ← Nazad na blogove
            </a>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const faqSchema = generateFAQSchema(blog)

  return (
    <>
      <Helmet>
        <title>{blog.title} | Odontoa Blog</title>
        <meta name="description" content={blog.excerpt || blog.content.substring(0, 160)} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt || blog.content.substring(0, 160)} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${window.location.origin}/blogovi/${blog.slug}`} />
        {blog.featured_image && (
          <meta property="og:image" content={blog.featured_image} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.excerpt || blog.content.substring(0, 160)} />
        <link rel="canonical" href={`${window.location.origin}/blogovi/${blog.slug}`} />
        
        {faqSchema && (
          <script type="application/ld+json">
            {faqSchema}
          </script>
        )}
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "author": {
              "@type": "Person",
              "name": blog.author
            },
            "datePublished": blog.created_at,
            "description": blog.excerpt || blog.content.substring(0, 160),
            "url": `${window.location.origin}/blogovi/${blog.slug}`,
            "image": blog.featured_image,
            "publisher": {
              "@type": "Organization",
              "name": "Odontoa",
              "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/images/odontoa-logo1.png`
              }
            }
          })}
        </script>
      </Helmet>

      <Navigation />
      
      <PostLayout post={blog} />

      <Footer />
    </>
  )
} 