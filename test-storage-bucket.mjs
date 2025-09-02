import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Use environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testStorageBucket() {
  console.log('🔍 Testing Storage Bucket...\n')

  try {
    // 1. List all buckets
    console.log('📋 Listing all buckets:')
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError)
      return
    }

    console.log('Found buckets:', buckets?.map(b => b.name) || [])
    
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
      
      // 4. Test upload permissions (create a test file)
      console.log('\n📤 Testing upload permissions...')
      const testFileName = `test-${Date.now()}.txt`
      const testContent = 'This is a test file for storage bucket verification.'
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(testFileName, testContent, {
          contentType: 'text/plain',
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
      console.log('\n💡 To create the bucket, run the SQL script in Supabase dashboard:')
      console.log(`
-- Create blog-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  5242880, -- 5MB
  ARRAY['image/*']
) ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for the bucket
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Allow public read" ON storage.objects
FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Allow authenticated updates" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'blog-images')
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'blog-images');
      `)
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the test
testStorageBucket()
