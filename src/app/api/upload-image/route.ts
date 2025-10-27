import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'featured-images'

    if (!file) {
      return NextResponse.json(
        { error: 'Nema fajla za upload' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Samo slike su dozvoljene' },
        { status: 400 }
      )
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Fajl je prevelik. Maksimalna veličina je 5MB' },
        { status: 400 }
      )
    }

    // Validate file size (minimum 1KB to avoid tiny test images)
    if (file.size < 1024) {
      return NextResponse.json(
        { error: 'Slika je premala. Molimo odaberite veću sliku.' },
        { status: 400 }
      )
    }

    // Validate folder name for security - supports main folder types
    const validFolders = [
      'featured-images', 
      'blog-content', 
      'glossary'
    ]
    
    if (!validFolders.includes(folder)) {
      return NextResponse.json(
        { error: `Nevalidan folder za upload: ${folder}` },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileName = `${folder}/${timestamp}-${file.name}`

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return NextResponse.json(
        { error: `Upload greška: ${error.message}` },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: data.path,
      folder: folder,
      fileName: `${timestamp}-${file.name}`,
      fileType: getFileType(folder)
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    )
  }
}

// Helper function to determine file type based on folder
function getFileType(folder: string): string {
  if (folder.startsWith('featured-images') || folder === 'featured-images') {
    return 'featured-image'
  } else if (folder.startsWith('blog-content')) {
    return 'blog-content'
  } else if (folder.startsWith('glossary')) {
    return 'glossary'
  } else if (folder.startsWith('editor-images')) {
    return 'editor-image'
  }
  return 'other'
}
