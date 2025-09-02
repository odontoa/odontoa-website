import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log('🔍 Testing environment variables in API route...')
    console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl)
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Not set')

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        error: 'Environment variables not set',
        supabaseUrl: !!supabaseUrl,
        supabaseAnonKey: !!supabaseAnonKey
      }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Test storage access
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      return NextResponse.json({
        error: 'Storage access failed',
        message: listError.message
      }, { status: 500 })
    }

    const blogImagesBucket = buckets?.find(bucket => bucket.name === 'blog-images')

    return NextResponse.json({
      success: true,
      environmentVariables: {
        supabaseUrl: !!supabaseUrl,
        supabaseAnonKey: !!supabaseAnonKey
      },
      storage: {
        buckets: buckets?.map(b => b.name) || [],
        blogImagesBucket: !!blogImagesBucket
      }
    })

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
