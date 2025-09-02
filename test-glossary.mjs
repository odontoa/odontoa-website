import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTestGlossary() {
  try {
    console.log('Creating test glossary term...')
    
    const testTerm = {
      term: 'Test Term',
      slug: 'test-term',
      definition: 'This is a test definition.',
      full_article: 'This is a test full article content.',
      faq_schema: '{}',
      related_terms: ['dental', 'health']
    }

    const { data, error } = await supabase
      .from('glossary')
      .insert(testTerm)
      .select()

    if (error) {
      console.error('Error creating test glossary term:', error)
      return
    }

    console.log('✅ Test glossary term created successfully!')
    console.log('Glossary data:', data)

  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

createTestGlossary() 