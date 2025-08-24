import React from 'react'
import { supabase, Blog } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'
import { PostLayout } from '@/components/PostLayout'
import Link from 'next/link'
import type { Metadata } from 'next'

interface BlogPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  try {
    const response = await fetch('https://bjbfmddrekjmactytaky.supabase.co/rest/v1/blogs?select=slug&published=eq.true', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqYmZtZGRyZWtqbWFjdHl0YWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDA1NjEsImV4cCI6MjA2OTAxNjU2MX0.jkSPsLNdD1pfm5er4TgHm0T6vVdYaXorlnScFe_X99k',
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const blogs = await response.json();
      return blogs.map((blog: { slug: string }) => ({
        slug: blog.slug,
      }));
    }
  } catch (error) {
    console.error('Error generating static params:', error);
  }
  
  return [];
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  try {
    const response = await fetch(`https://bjbfmddrekjmactytaky.supabase.co/rest/v1/blogs?select=*&slug=eq.${params.slug}&published=eq.true&limit=1`, {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqYmZtZGRyZWtqbWFjdHl0YWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDA1NjEsImV4cCI6MjA2OTAxNjU2MX0.jkSPsLNdD1pfm5er4TgHm0T6vVdYaXorlnScFe_X99k',
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const blogs = await response.json();
      if (blogs && blogs.length > 0) {
        const blog = blogs[0];
        return {
          title: `${blog.title} | Odontoa Blog`,
          description: blog.meta_description || blog.content.substring(0, 160),
          openGraph: {
            title: blog.title,
            description: blog.meta_description || blog.content.substring(0, 160),
            type: 'article',
            url: `https://odontoa.com/blog/${blog.slug}`,
            images: blog.featured_image ? [blog.featured_image] : ['/odontoa-logo1.png'],
          },
          twitter: {
            card: 'summary_large_image',
            title: blog.title,
            description: blog.meta_description || blog.content.substring(0, 160),
            images: blog.featured_image ? [blog.featured_image] : ['/odontoa-logo1.png'],
          },
          alternates: {
            canonical: `/blog/${blog.slug}`,
          },
        };
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return {
    title: 'Blog Post Not Found | Odontoa',
    description: 'The requested blog post could not be found.',
  };
}

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const response = await fetch(`https://bjbfmddrekjmactytaky.supabase.co/rest/v1/blogs?select=*&slug=eq.${slug}&published=eq.true&limit=1`, {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqYmZtZGRyZWtqbWFjdHl0YWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDA1NjEsImV4cCI6MjA2OTAxNjU2MX0.jkSPsLNdD1pfm5er4TgHm0T6vVdYaXorlnScFe_X99k',
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data && data.length > 0 ? data[0] : null;
    }
  } catch (error) {
    console.error('Error fetching blog:', error);
  }
  
  return null;
}

export default async function BlogSinglePage({ params }: BlogPageProps) {
  const blog = await getBlog(params.slug);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Blog post not found
          </h1>
          <Link 
            href="/blog" 
            className="text-blue-600 hover:text-blue-800 flex items-center justify-center"
          >
            ← Nazad na blogove
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "author": {
              "@type": "Person",
              "name": blog.author
            },
            "datePublished": blog.created_at,
            "description": blog.meta_description || blog.content.substring(0, 160),
            "url": `https://odontoa.com/blog/${blog.slug}`,
            "image": blog.featured_image,
            "publisher": {
              "@type": "Organization",
              "name": "Odontoa",
              "logo": {
                "@type": "ImageObject",
                "url": "https://odontoa.com/images/odontoa-logo1.png"
              }
            }
          })
        }}
      />
      
      {blog.faq_schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(blog.faq_schema)
          }}
        />
      )}
      
      <PostLayout post={blog} />
    </>
  );
} 