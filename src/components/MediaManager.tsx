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
// Supabase removed - admin panel needs Sanity migration
// import { supabase } from '@/lib/supabase'

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
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [folders, setFolders] = useState<string[]>([])

  useEffect(() => {
    fetchMediaFiles()
  }, [])

  const fetchMediaFiles = async () => {
    setLoading(true)
    try {
      // Supabase removed - MediaManager disabled
      console.warn('MediaManager: Supabase removed. This component needs Sanity migration.')
      toast.error('Media Manager je privremeno onemogućen. Migracija na Sanity je u toku.')
      setFiles([])
      setLoading(false)
      return
    } catch (error) {
      console.error('Error:', error)
      toast.error('Greška pri učitavanju media fajlova')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteFile = async (filePath: string) => {
    toast.error('Media Manager je privremeno onemogućen. Migracija na Sanity je u toku.')
    return
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('URL kopiran u clipboard!')
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      toast.error('Greška pri kopiranju')
    }
  }

  const filteredFiles = files.filter(file => {
    if (searchTerm && !file.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    if (selectedFolder && !file.name.startsWith(selectedFolder)) {
      return false
    }
    return true
  })

  useEffect(() => {
    // Log file names and types
    files.forEach(file => {
      console.log(`📄 File: ${file.name}, Size: ${file.metadata?.size || 0}, Type: ${file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? 'IMAGE' : 'OTHER'}`)
      console.log(`📄 Full file object:`, file)
    })
  }, [files, filteredFiles, selectedFolder, searchTerm])

  const getPublicUrl = (filePath: string) => {
    // Supabase removed - return placeholder
    return '#'
  }

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Pretraži fajlove..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Učitavam fajlove...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredFiles.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileImage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nema pronađenih fajlova</p>
          </CardContent>
        </Card>
      )}

      {/* Files Grid */}
      {!loading && filteredFiles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles.map((file) => {
            const isImage = file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)
            const publicUrl = getPublicUrl(file.name)

            return (
              <Card key={file.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="relative aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    {isImage ? (
                      <img
                        src={publicUrl}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileImage className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => copyToClipboard(publicUrl)}
                          className="bg-white/90 hover:bg-white"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteFile(file.name)}
                          className="bg-white/90 hover:bg-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                      {file.name.split('/').pop()}
                    </p>
                    {file.metadata?.size && (
                      <p className="text-xs text-gray-500">
                        {(file.metadata.size / 1024).toFixed(1)} KB
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
