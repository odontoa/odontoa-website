'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function TestUploadPage() {
  const [status, setStatus] = useState<string>('')
  const [uploadResult, setUploadResult] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const testStorage = async () => {
    setStatus('Testing storage...')
    
    try {
      const { data: buckets, error: listError } = await supabase.storage.listBuckets()
      
      if (listError) {
        setStatus(`Error: ${listError.message}`)
        return
      }

      const blogImagesBucket = buckets?.find(bucket => bucket.name === 'blog-images')
      
      if (blogImagesBucket) {
        setStatus(`✅ blog-images bucket found! Public: ${blogImagesBucket.public}`)
      } else {
        setStatus('❌ blog-images bucket not found!')
      }
      
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadResult(`Selected file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`)
    }
  }

  const testUpload = async () => {
    if (!selectedFile) {
      setUploadResult('Please select a file first')
      return
    }

    setUploadResult('Uploading...')
    
    try {
      const fileName = `test-upload-${Date.now()}-${selectedFile.name}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (uploadError) {
        setUploadResult(`❌ Upload failed: ${uploadError.message}`)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName)

      setUploadResult(`✅ Upload successful! URL: ${publicUrl}`)
      
      // Clean up after 5 seconds
      setTimeout(async () => {
        await supabase.storage.from('blog-images').remove([fileName])
        setUploadResult(prev => prev + ' (cleaned up)')
      }, 5000)
      
    } catch (error) {
      setUploadResult(`❌ Upload error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Upload Test Page</h1>
        
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
            <div>Status: {status}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Test</h2>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileSelect}
            className="mb-4 p-2 border rounded"
          />
          <button 
            onClick={testUpload}
            disabled={!selectedFile}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4 disabled:bg-gray-300"
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
