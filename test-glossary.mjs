import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bjbfmddrekjmactytaky.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqYmZtZGRyZWtqbWFjdHl0YWt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ0MDU2MSwiZXhwIjoyMDY5MDE2NTYxfQ.LOppQx_xLdDW7Z7Brkvy6Vit8WFr9g6QrDZZEgVy49A'

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