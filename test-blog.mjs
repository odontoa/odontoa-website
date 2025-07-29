import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bjbfmddrekjmactytaky.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqYmZtZGRyZWtqbWFjdHl0YWt5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ0MDU2MSwiZXhwIjoyMDY5MDE2NTYxfQ.LOppQx_xLdDW7Z7Brkvy6Vit8WFr9g6QrDZZEgVy49A'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTestBlog() {
  try {
    console.log('Creating test blog...')
    
    const testBlog = {
      title: `Test Blog Post ${Date.now()}`,
      slug: `test-blog-post-${Date.now()}`,
      content: 'This is a test blog post content.',
      excerpt: 'This is a test excerpt.',
      author: 'Test Author',
      published: false, // Draft
      meta_description: 'Test meta description',
      tags: ['test', 'dental'],
      faq_schema: '{}'
    }

    const { data, error } = await supabase
      .from('blogs')
      .insert(testBlog)
      .select()

    if (error) {
      console.error('Error creating test blog:', error)
      return
    }

    console.log('✅ Test blog created successfully!')
    console.log('Blog data:', data)

  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

createTestBlog() 