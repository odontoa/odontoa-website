import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Debug environment variables in browser
if (typeof window !== 'undefined') {
  console.log('🔧 Browser - Supabase URL:', supabaseUrl)
  console.log('🔧 Browser - Supabase Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT SET')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  summary: string // New field for SEO
  image_url?: string // New field for featured image
  alt_text?: string // New field for image accessibility
  faq_schema: string
  tags: string[]
  related_glossary_terms: string[] // New field for topic clustering
  meta_description: string
  meta_keywords?: string // New field for SEO keywords
  featured_image?: string
  views_count: number // New field for analytics
  reading_time: number // New field for UX
  seo_score: number // New field for SEO optimization
  last_modified: string // New field for SEO
  created_at: string
  updated_at: string
  author: string
  published: boolean
  featured: boolean
  // Archive fields temporarily disabled
  // archived: boolean // New field for archive functionality
  // archived_at?: string // New field for archive timestamp
  // archived_by?: string // New field for archive user
  // archive_reason?: string // New field for archive reason
}

export interface GlossaryEntry {
  id: string
  term: string
  slug: string
  definition: string
  full_article: string
  why_it_matters?: string // New field for enhanced content
  related_blog_posts: string[] // New field for topic clustering
  faq_schema: string
  related_terms: string[]
  views_count: number // New field for analytics
  category?: string // New field for organization
  difficulty_level: string // New field for content targeting
  seo_score: number // New field for SEO optimization
  last_modified: string // New field for SEO
  published: boolean
  created_at: string
  updated_at: string
}

// New types for enhanced CMS
export interface TopicCluster {
  id: string
  cluster_name: string
  cluster_slug: string
  description?: string
  primary_keywords: string[]
  related_blogs: string[]
  related_glossary_terms: string[]
  cluster_score: number
  created_at: string
  updated_at: string
}

export interface ContentAnalytics {
  id: string
  content_id: string
  content_type: 'blog' | 'glossary'
  views_count: number
  engagement_score: number
  seo_performance: number
  last_updated: string
  created_at: string
}

export interface AdminUser {
  id: string
  email: string
  role: string
  created_at: string
}

export interface Backup {
  id: string
  backup_date: string
  status: string
  backup_data: any
  email_sent: boolean
  created_at: string
}

// Enhanced content creation interfaces
export interface CreateBlogData {
  title: string
  slug: string
  content: string
  excerpt: string
  summary: string
  image_url?: string
  alt_text?: string
  faq_schema?: any
  tags: string[]
  related_glossary_terms?: string[]
  meta_description: string
  meta_keywords?: string // New field for SEO keywords
  featured_image?: string
  author: string
  published: boolean
  featured: boolean
}

export interface CreateGlossaryData {
  term: string
  slug: string
  definition: string
  full_article: string
  why_it_matters?: string
  related_blog_posts?: string[]
  faq_schema?: any
  related_terms: string[]
  category?: string
  difficulty_level?: string
  published: boolean
}

// SEO and LLM optimization interfaces
export interface SEOData {
  title: string
  description: string
  keywords: string[]
  image_url?: string
  alt_text?: string
  canonical_url: string
  og_type: 'article' | 'website'
  twitter_card: 'summary' | 'summary_large_image'
}

export interface StructuredData {
  '@context': string
  '@type': string
  [key: string]: any
}

// Topic clustering interfaces
export interface ContentSuggestion {
  type: 'blog' | 'glossary'
  id: string
  title: string
  slug: string
  relevance_score: number
  reason: string
}

export interface TopicClusterSuggestion {
  cluster_name: string
  cluster_slug: string
  related_content: ContentSuggestion[]
  primary_keywords: string[]
  cluster_score: number
} 