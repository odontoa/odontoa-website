import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bjbfmddrekjmactytaky.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqYmZtZGRyZWtqbWFjdHl0YWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDA1NjEsImV4cCI6MjA2OTAxNjU2MX0.jkSPsLNdD1pfm5er4TgHm0T6vVdYaXorlnScFe_X99k'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client with explicit configuration to avoid hanging
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
    },
  },
})

// Alternative client factory for fresh instances when needed
export const createFreshSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: false, // Don't persist session for fresh clients
      detectSessionInUrl: false,
    },
  })
}

// Types for our database tables
export interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  faq_schema: string
  tags: string[]
  meta_description: string
  featured_image?: string
  created_at: string
  updated_at: string
  author: string
  published: boolean
}

export interface GlossaryEntry {
  id: string
  term: string
  slug: string
  definition: string
  full_article: string
  faq_schema: string
  related_terms: string[]
  created_at: string
}

export interface AdminUser {
  id: string
  email: string
  role: string
} 