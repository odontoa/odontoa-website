'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function TestStoragePage() {
  const [status, setStatus] = useState<string>('')
  const [buckets, setBuckets] = useState<any[]>([])
  const [uploadResult, setUploadResult] = useState<string>('')

  const testStorage = async () => {
    setStatus('Testing storage...')
    
    try {
      // Test listing buckets
      const { data: bucketsData, error: listError } = await supabase.storage.listBuckets()
      
      if (listError) {
        setStatus(`Error listing buckets: ${listError.message}`)
        return
      }

      setBuckets(bucketsData || [])
      setStatus(`Found ${bucketsData?.length || 0} buckets`)
      
      // Check for blog-images bucket
      const blogImagesBucket = bucketsData?.find(bucket => bucket.name === 'blog-images')
      
      if (blogImagesBucket) {
        setStatus(`✅ blog-images bucket found! Public: ${blogImagesBucket.public}`)
      } else {
        setStatus('❌ blog-images bucket not found!')
      }
      
    } catch (error) {
      setStatus(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const testUpload = async () => {
    setUploadResult('Testing upload...')
    
    try {
      // Create a test image file
      const testImageContent = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')
      const testFileName = `test-upload-${Date.now()}.png`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(testFileName, testImageContent, {
          contentType: 'image/png',
          upsert: false
        })
      
      if (uploadError) {
        setUploadResult(`❌ Upload failed: ${uploadError.message}`)
        return
      }

      setUploadResult(`✅ Upload successful! File: ${uploadData.path}`)
      
      // Clean up
      await supabase.storage.from('blog-images').remove([testFileName])
      setUploadResult(prev => prev + ' (cleaned up)')
      
    } catch (error) {
      setUploadResult(`❌ Upload error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Storage Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 text-sm">
            <div>NEXT_PUBLIC_SUPABASE_URL: {supabaseUrl ? '✅ Set' : '❌ Not set'}</div>
            <div>NEXT_PUBLIC_SUPABASE_ANON_KEY: {supabaseAnonKey ? '✅ Set' : '❌ Not set'}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Storage Test</h2>
          <button 
            onClick={testStorage}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
          >
            Test Storage Access
          </button>
          <div className="text-sm">
            <div className="mb-2">Status: {status}</div>
            {buckets.length > 0 && (
              <div>
                <div className="font-semibold">Found buckets:</div>
                <ul className="list-disc list-inside">
                  {buckets.map(bucket => (
                    <li key={bucket.name}>
                      {bucket.name} (Public: {bucket.public ? 'Yes' : 'No'})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Test</h2>
          <button 
            onClick={testUpload}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
          >
            Test Upload
          </button>
          <div className="text-sm">
            <div>Result: {uploadResult}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
