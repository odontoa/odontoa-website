import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Use the same environment variables as the app
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAppStorage() {
  console.log('🔍 Testing App Storage Access...\n')

  try {
    // 1. List all buckets
    console.log('📋 Listing all buckets:')
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError)
      return
    }

    console.log('Found buckets:', buckets?.map(b => b.name) || [])
    console.log('Available buckets: ▸', buckets || [])
    
    // 2. Check if blog-images bucket exists
    const blogImagesBucket = buckets?.find(bucket => bucket.name === 'blog-images')
    
    if (blogImagesBucket) {
      console.log('✅ blog-images bucket found!')
      console.log('   - Public:', blogImagesBucket.public)
      console.log('   - File size limit:', blogImagesBucket.file_size_limit)
      console.log('   - Allowed MIME types:', blogImagesBucket.allowed_mime_types)
      
      // 3. Test listing files in bucket
      console.log('\n📁 Listing files in blog-images bucket:')
      const { data: files, error: filesError } = await supabase.storage
        .from('blog-images')
        .list()
      
      if (filesError) {
        console.error('❌ Error listing files:', filesError)
      } else {
        console.log('Files in bucket:', files?.map(f => f.name) || [])
      }
      
      // 4. Test upload permissions (create a test image file)
      console.log('\n📤 Testing upload permissions...')
      const testFileName = `test-image-${Date.now()}.png`
      const testImageContent = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64') // 1x1 transparent PNG
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(testFileName, testImageContent, {
          contentType: 'image/png',
          upsert: false
        })
      
      if (uploadError) {
        console.error('❌ Upload test failed:', uploadError.message)
        
        // Check if it's a permission issue
        if (uploadError.message.includes('permission') || uploadError.message.includes('policy')) {
          console.log('💡 This might be a RLS policy issue. Check the policies in Supabase dashboard.')
        }
      } else {
        console.log('✅ Upload test successful!')
        console.log('   - File uploaded:', uploadData.path)
        
        // 5. Test public URL generation
        const { data: { publicUrl } } = supabase.storage
          .from('blog-images')
          .getPublicUrl(testFileName)
        
        console.log('   - Public URL:', publicUrl)
        
        // 6. Clean up test file
        console.log('\n🧹 Cleaning up test file...')
        const { error: deleteError } = await supabase.storage
          .from('blog-images')
          .remove([testFileName])
        
        if (deleteError) {
          console.error('⚠️ Could not delete test file:', deleteError.message)
        } else {
          console.log('✅ Test file cleaned up successfully')
        }
      }
      
    } else {
      console.log('❌ blog-images bucket not found!')
      console.log('💡 This means the app cannot see the bucket')
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the test
testAppStorage()
