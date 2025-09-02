import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Simulate the app's environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testing App Environment Variables...\n')
console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl)
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Not set')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAppEnv() {
  try {
    // Test storage access
    console.log('\n📋 Testing storage access...')
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Storage access failed:', listError.message)
      return
    }

    console.log('✅ Storage access successful!')
    console.log('Found buckets:', buckets?.map(b => b.name) || [])
    
    // Check for blog-images bucket
    const blogImagesBucket = buckets?.find(bucket => bucket.name === 'blog-images')
    
    if (blogImagesBucket) {
      console.log('✅ blog-images bucket found!')
      
      // Test upload
      console.log('\n📤 Testing upload...')
      const testFileName = `test-env-${Date.now()}.png`
      const testImageContent = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(testFileName, testImageContent, {
          contentType: 'image/png',
          upsert: false
        })
      
      if (uploadError) {
        console.error('❌ Upload failed:', uploadError.message)
      } else {
        console.log('✅ Upload successful!')
        console.log('File uploaded:', uploadData.path)
        
        // Clean up
        await supabase.storage.from('blog-images').remove([testFileName])
        console.log('✅ Test file cleaned up')
      }
    } else {
      console.log('❌ blog-images bucket not found!')
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

testAppEnv()
