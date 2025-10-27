import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Image, 
  Search, 
  Trash2, 
  Copy, 
  FileImage,
  Eye
} from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

interface MediaFile {
  name: string
  id: string
  created_at: string
  updated_at: string
  last_accessed_at: string
  metadata: Record<string, any>
}

interface MediaManagerProps {}

export const MediaManager: React.FC<MediaManagerProps> = () => {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<string>('all')
  const [folders, setFolders] = useState<string[]>([])

  useEffect(() => {
    fetchMediaFiles()
  }, [])

  const fetchMediaFiles = async () => {
    setLoading(true)
    try {
      console.log('🔍 Fetching all images from blogs and glossary...')
      
      // Get all images used in blogs and glossary
      const { data: blogs, error: blogsError } = await supabase
        .from('blogs')
        .select('id, title, image_url, featured_image, content')
        .eq('published', true)
      
      if (blogsError) {
        console.error('❌ Error fetching blogs:', blogsError)
        toast.error('Greška pri učitavanju blogova')
        return
      }

      const { data: glossary, error: glossaryError } = await supabase
        .from('glossary')
        .select('id, term, full_article')
        .eq('published', true)
      
      if (glossaryError) {
        console.error('❌ Error fetching glossary:', glossaryError)
        toast.error('Greška pri učitavanju rečnika')
        return
      }

      // Extract all image URLs
      const usedImageUrls = new Set<string>()
      
      // From blogs
      blogs?.forEach(blog => {
        if (blog.image_url) usedImageUrls.add(blog.image_url)
        if (blog.featured_image) usedImageUrls.add(blog.featured_image)
        if (blog.content) {
          const imgMatches = blog.content.match(/src="([^"]*\.(jpg|jpeg|png|gif|webp)[^"]*)"/gi)
          if (imgMatches) {
            imgMatches.forEach(match => {
              const urlMatch = match.match(/src="([^"]*)"/)
              if (urlMatch) usedImageUrls.add(urlMatch[1])
            })
          }
        }
      })

      // From glossary
      glossary?.forEach(entry => {
        if (entry.full_article) {
          const imgMatches = entry.full_article.match(/src="([^"]*\.(jpg|jpeg|png|gif|webp)[^"]*)"/gi)
          if (imgMatches) {
            imgMatches.forEach(match => {
              const urlMatch = match.match(/src="([^"]*)"/)
              if (urlMatch) usedImageUrls.add(urlMatch[1])
            })
          }
        }
      })

      console.log('📊 Found used image URLs:', usedImageUrls.size)

      // Get all files from all folders and subfolders
      const allFiles: MediaFile[] = []
      const folders = ['featured-images', 'blog-content', 'glossary']
      
      for (const folder of folders) {
        try {
          const { data: folderFiles, error } = await supabase.storage
            .from('blog-images')
            .list(folder, { limit: 1000 })

          if (error) {
            console.warn(`⚠️ Error fetching from ${folder}:`, error)
            continue
          }

          if (folderFiles) {
            for (const file of folderFiles) {
              const filePath = `${folder}/${file.name}`
              
              // If it's a folder, get files from it
              if (!file.name.includes('.')) {
                try {
                  const { data: subFiles, error: subError } = await supabase.storage
                    .from('blog-images')
                    .list(filePath, { limit: 1000 })
                    
                  if (!subError && subFiles) {
                    for (const subFile of subFiles) {
                      const subFilePath = `${filePath}/${subFile.name}`
                      
                      // Check if this image is used
                      const isUsed = Array.from(usedImageUrls).some(url => {
                        const decodedUrl = decodeURIComponent(url)
                        return decodedUrl.includes(subFile.name) || 
                               decodedUrl.includes(subFilePath) ||
                               url.includes(subFile.name) || 
                               url.includes(subFilePath)
                      })
                      
                      if (isUsed) {
                        allFiles.push({
                          ...subFile,
                          name: subFilePath,
                          id: subFilePath
                        })
                      }
                    }
                  }
                } catch (subError) {
                  console.warn(`⚠️ Error fetching from subfolder ${filePath}:`, subError)
                }
              } else {
                // Regular file
                const isUsed = Array.from(usedImageUrls).some(url => {
                  const decodedUrl = decodeURIComponent(url)
                  return decodedUrl.includes(file.name) || 
                         decodedUrl.includes(filePath) ||
                         url.includes(file.name) || 
                         url.includes(filePath)
                })
                
                if (isUsed) {
                  allFiles.push({
                    ...file,
                    name: filePath,
                    id: filePath
                  })
                }
              }
            }
          }
        } catch (folderError) {
          console.warn(`⚠️ Exception fetching from ${folder}:`, folderError)
        }
      }

      console.log('📁 Total used files found:', allFiles.length)
      setFiles(allFiles)
      
      // Folder structure with categories
      const allFolders = ['featured-images', 'blog-content', 'glossary']
      setFolders(allFolders)
      
    } catch (error) {
      console.error('Error:', error)
      toast.error('Greška pri učitavanju media fajlova')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteFile = async (filePath: string) => {
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj fajl?')) {
      return
    }

    try {
      const { error } = await supabase.storage
        .from('blog-images')
        .remove([filePath])

      if (error) {
        throw new Error(error.message)
      }

      toast.success('Fajl uspešno obrisan!')
      fetchMediaFiles() // Refresh list
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Greška pri brisanju fajla')
    }
  }



  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('URL kopiran u clipboard!')
    } catch (error) {
      toast.error('Greška pri kopiranju URL-a')
    }
  }

  const getFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileName: string) => {
    if (fileName.includes('/')) {
      return <FileImage className="h-5 w-5 text-blue-500" />
    }
    if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return <FileImage className="h-5 w-5 text-green-500" />
    }
    return <FileImage className="h-5 w-5 text-gray-500" />
  }

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFolder = selectedFolder === 'all' || file.name.startsWith(selectedFolder + '/')
    return matchesSearch && matchesFolder
  })

  // Debug logging
  useEffect(() => {
    console.log('🔍 Current files:', files)
    console.log('🔍 Filtered files:', filteredFiles)
    console.log('🔍 Selected folder:', selectedFolder)
    console.log('🔍 Search term:', searchTerm)
    
    // Log image files specifically
    const imageFiles = files.filter(f => f.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))
    console.log('🖼️ Image files found:', imageFiles)
    
    // Log file names and types
    files.forEach(file => {
      console.log(`📄 File: ${file.name}, Size: ${file.metadata?.size || 0}, Type: ${file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? 'IMAGE' : 'OTHER'}`)
      console.log(`📄 Full file object:`, file)
    })
  }, [files, filteredFiles, selectedFolder, searchTerm])

  const getPublicUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath)
    return data.publicUrl
  }





  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Pretražite fajlove..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Svi fajlovi</option>
            <option value="featured-images">Hero blog slike</option>
            <option value="blog-content">Blog sadržaj</option>
            <option value="glossary">Rečnik</option>
          </select>
          
          <Button
            onClick={fetchMediaFiles}
            disabled={loading}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <Image className="h-4 w-4 mr-2" />
            {loading ? 'Učitavam...' : 'Osveži'}
          </Button>
        </div>
      </div>





      {/* Files Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
            </div>
          ))}
        </div>
      ) : filteredFiles.length > 0 ? (
        <>
          {/* Used Images Summary */}
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-green-800">Korišćene slike u sadržaju</h3>
              <Badge variant="outline" className="text-green-700 border-green-300">
                {files.length} slika
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-green-600">
                  {files.filter(f => f.name.startsWith('featured-images/')).length}
                </div>
                <div className="text-gray-600">Hero blog slike</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-600">
                  {files.filter(f => f.name.startsWith('blog-content/')).length}
                </div>
                <div className="text-gray-600">Blog sadržaj</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-purple-600">
                  {files.filter(f => f.name.startsWith('glossary/')).length}
                </div>
                <div className="text-gray-600">Rečnik</div>
              </div>
            </div>
            <p className="text-xs text-green-700 mt-2">
              💡 Prikazane su samo slike koje se koriste u objavljenim blogovima i rečniku
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map((file) => (
              <Card key={file.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {/* Always show as file if it has image extension */}
                  {file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    // Image file
                    <div>
                      <div className="aspect-video bg-gray-100 flex items-center justify-center">
                        <img
                          src={getPublicUrl(file.name)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLElement
                            target.style.display = 'none'
                            const nextSibling = target.nextElementSibling as HTMLElement
                            if (nextSibling) {
                              nextSibling.style.display = 'flex'
                            }
                          }}
                        />
                        <div className="hidden items-center justify-center text-gray-400">
                          <FileImage className="h-8 w-8" />
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900 text-sm truncate flex-1">
                            {file.name.split('/').pop() || file.name}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {getFileSize(file.metadata?.size || 0)}
                          </Badge>
                        </div>
                        
                        {/* Show folder path if exists */}
                        {file.name.includes('/') && (
                          <p className="text-xs text-gray-500 mb-3">
                            📁 {file.name.split('/').slice(0, -1).join(' / ')}
                          </p>
                        )}
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(getPublicUrl(file.name))}
                            className="flex-1"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Kopiraj URL
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(getPublicUrl(file.name), '_blank')}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteFile(file.name)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Non-image file or folder
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileImage className="h-5 w-5 text-gray-500" />
                        <span className="font-medium text-gray-900">
                          {file.name.includes('/') ? file.name.split('/').pop() : file.name}
                        </span>
                      </div>
                      
                      {/* Show folder path if exists */}
                      {file.name.includes('/') && (
                        <p className="text-xs text-gray-500 mb-3">
                          📁 {file.name.split('/').slice(0, -1).join(' / ')}
                        </p>
                      )}
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {getFileSize(file.metadata?.size || 0)}
                      </p>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(getPublicUrl(file.name))}
                          className="flex-1"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Kopiraj URL
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(getPublicUrl(file.name), '_blank')}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteFile(file.name)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nema korišćenih slika
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedFolder !== 'all' 
              ? 'Pokušajte sa drugačijim kriterijumima pretrage'
              : 'Nema slika koje se koriste u objavljenim blogovima ili rečniku'
            }
          </p>
          <div className="text-sm text-gray-400">
            💡 Slike će se pojaviti ovde kada ih dodate u blog postove ili rečnik
          </div>
        </div>
      )}


    </div>
  )
}
