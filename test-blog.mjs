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