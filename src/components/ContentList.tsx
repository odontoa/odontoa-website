import React, { useEffect, useState } from 'react'
import { supabase, Blog, GlossaryEntry } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Trash2, RefreshCw, Eye, EyeOff, Calendar, User, FileText, BookOpen, Edit } from 'lucide-react'
import { toast } from 'sonner'

interface ContentListProps {
  type: 'blogs' | 'glossary'
  filterPublished?: boolean // true = only published, false = only drafts, undefined = all
  onEditItem?: (item: Blog | GlossaryEntry) => void
}

export const ContentList: React.FC<ContentListProps> = ({ type, filterPublished, onEditItem }) => {
  const { session } = useAuth()
  const [items, setItems] = useState<(Blog | GlossaryEntry)[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    console.log('=== INITIAL FETCH TRIGGERED ===')
    console.log('Type:', type, 'FilterPublished:', filterPublished)
    fetchItemsRawHTTP()
  }, [type, filterPublished])

  const fetchItems = async () => {
    console.log('=== CONTENTLIST FETCH START ===')
    console.log('Type:', type)
    console.log('FilterPublished:', filterPublished)
    
    setLoading(true)
    try {
      let query = supabase
        .from(type)
        .select('*')
        .order('created_at', { ascending: false })

      // Apply filter for blogs and glossary
      if (filterPublished !== undefined) {
        console.log('Applying published filter:', filterPublished)
        query = query.eq('published', filterPublished)
      }

      console.log('Executing query...')
      const { data, error } = await query

      console.log('Query result - Data:', data)
      console.log('Query result - Error:', error)

      if (error) {
        console.error('Fetch error:', error)
        toast.error(`Greška pri učitavanju ${type}: ${error.message}`)
      } else {
        console.log('Setting items:', data?.length || 0, 'items')
        setItems(data || [])
      }
    } catch (err) {
      console.error('Fetch exception:', err)
      toast.error('Dogodila se neočekivana greška')
    } finally {
      setLoading(false)
      console.log('=== CONTENTLIST FETCH END ===')
    }
  }

  // Auto-refresh after form submissions
  React.useEffect(() => {
    const handleStorageChange = () => {
      console.log('=== STORAGE EVENT RECEIVED ===')
      console.log('Type:', type, 'FilterPublished:', filterPublished)
      fetchItemsRawHTTP()
    }
    
    console.log('=== ADDING STORAGE LISTENER ===')
    console.log('Type:', type, 'FilterPublished:', filterPublished)
    
    window.addEventListener('storage', handleStorageChange)
    return () => {
      console.log('=== REMOVING STORAGE LISTENER ===')
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [type, filterPublished])

  const handleDelete = async (id: string) => {
    try {
      console.log('=== SUPABASE DELETE START ===')
      console.log('Deleting item ID:', id, 'Type:', type)

      // Get current session
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      
      if (!currentSession?.access_token) {
        toast.error('Niste ulogovani. Molimo ulogujte se ponovo.')
        return
      }

      const { error } = await supabase
        .from(type)
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Supabase Delete Error:', error)
        toast.error(`Greška pri brisanju: ${error.message}`)
        return
      }

      toast.success(`${type.slice(0, -1)} uspešno obrisan!`)
      fetchItemsRawHTTP()
      console.log('=== SUPABASE DELETE SUCCESS ===')
    } catch (err) {
      console.error('Supabase Delete Exception:', err)
      toast.error('Greška pri brisanju')
    }
  }

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    if (type !== 'blogs' && type !== 'glossary') return
    
    setUpdating(id)
    try {
      console.log('=== SUPABASE TOGGLE START ===')
      console.log('Blog ID:', id, 'Current status:', currentStatus, 'New status:', !currentStatus)

      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      })

      // Get current session
      const sessionPromise = supabase.auth.getSession()
      const { data: { session: currentSession } } = await Promise.race([sessionPromise, timeoutPromise]) as any
      
      if (!currentSession?.access_token) {
        toast.error('Niste ulogovani. Molimo ulogujte se ponovo.')
        return
      }

      const updatePromise = supabase
        .from(type)
        .update({ published: !currentStatus })
        .eq('id', id)
      
      const { error } = await Promise.race([updatePromise, timeoutPromise]) as any

      if (error) {
        console.error('Supabase Toggle Error:', error)
        toast.error(`Greška pri ažuriranju: ${error.message}`)
        return
      }

      const statusText = !currentStatus ? 'objavljem' : 'sklonim sa sajta'
      const contentType = type === 'blogs' ? 'Blog' : 'Termin'
      toast.success(`${contentType} uspešno ${statusText}!`)
      fetchItemsRawHTTP()
      console.log('=== SUPABASE TOGGLE SUCCESS ===')
    } catch (err) {
      console.error('Supabase Toggle Exception:', err)
      if (err instanceof Error && err.message === 'Request timeout') {
        console.error('Toggle request timed out after 10 seconds')
        toast.error('Greška pri ažuriranju - timeout')
      } else {
        toast.error('Greška pri ažuriranju')
      }
    } finally {
      setUpdating(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getTabTitle = () => {
    if (type === 'glossary') {
      if (filterPublished === true) return 'Objavljeni termini'
      if (filterPublished === false) return 'Skice termina'
      return 'Svi termini'
    }
    if (filterPublished === true) return 'Objavljeni blogovi'
    if (filterPublished === false) return 'Draft blogovi (Skice)'
    return 'Svi blogovi'
  }

  const getEmptyStateMessage = () => {
    if (type === 'glossary') {
      if (filterPublished === true) return 'Nema objavljenih termina'
      if (filterPublished === false) return 'Nema draft termina'
      return 'Nema termina'
    }
    if (filterPublished === true) return 'Nema objavljenih blogova'
    if (filterPublished === false) return 'Nema draft blogova'
    return 'Nema blogova'
  }

  const getEmptyStateDescription = () => {
    if (type === 'glossary') {
      if (filterPublished === true) return 'Objavite termin da se pojavi ovde'
      if (filterPublished === false) return 'Kreirajte draft termin da se pojavi ovde'
      return 'Kreirajte prvi termin da biste počeli'
    }
    if (filterPublished === true) return 'Objavite neki draft blog da bi se ovde prikazao'
    if (filterPublished === false) return 'Kreirajte draft blog da bi se ovde prikazao'
    return 'Kreirajte prvi blog da biste počeli'
  }

  const handleManualRefresh = () => {
    console.log('=== MANUAL REFRESH TRIGGERED ===')
    fetchItemsRawHTTP().then(() => {
      toast.success(`Ručno osvežavanje završeno - ${items.length} stavki`)
    })
  }

  const fetchItemsRawHTTP = async () => {
    console.log('=== SUPABASE FETCH START ===')
    console.log('Type:', type)
    console.log('FilterPublished:', filterPublished)
    console.log('FilterPublished type:', typeof filterPublished)
    console.log('FilterPublished === false:', filterPublished === false)
    console.log('FilterPublished === true:', filterPublished === true)
    console.log('🔄 Current loading state:', loading)
    
    // Get current session first
    let currentSession
    try {
      const { data: { session } } = await supabase.auth.getSession()
      currentSession = session
    } catch (error) {
      console.error('Session error:', error)
      toast.error('Greška pri proveri sesije')
      return
    }
    
    if (!currentSession?.access_token) {
      console.error('No session access token available')
      toast.error('Niste ulogovani. Molimo ulogujte se ponovo.')
      return
    }
    
    setLoading(true)
    try {
      let query = supabase
        .from(type)
        .select('*')
        .order('created_at', { ascending: false })
      
      // Apply filter for blogs and glossary
      if (filterPublished !== undefined) {
        console.log('🔍 Applying published filter:', filterPublished)
        query = query.eq('published', filterPublished)
      }

      // Add timeout only for the main query
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 15000) // Increased to 15s
      })
      
      const queryPromise = query
      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any

      if (error) {
        console.error('Supabase Error:', error)
        toast.error(`Greška pri učitavanju: ${error.message}`)
        return
      }

      console.log('Supabase Data:', data?.length || 0, 'items')
      console.log('📊 DETAILED ITEMS DATA:', data?.map(item => ({
        id: item.id,
        title: item.title,
        published: item.published,
        created_at: item.created_at
      })))
      
      setItems(data || [])
      console.log(`✅ Supabase: Loaded ${data?.length || 0} items`)
      console.log('🔍 Current items state after setItems:', data)
    } catch (err) {
      console.error('Supabase Exception:', err)
      if (err instanceof Error && err.message === 'Request timeout') {
        console.error('Request timed out after 15 seconds')
        toast.error('Greška pri učitavanju - timeout. Pokušajte ponovo.')
      } else if (err instanceof Error && err.message.includes('JWT')) {
        console.error('JWT token error:', err.message)
        toast.error('Sesija je istekla. Molimo ulogujte se ponovo.')
      } else {
        console.error('Unknown error:', err)
        toast.error('Greška pri učitavanju podataka. Pokušajte ponovo.')
      }
    } finally {
      console.log('🔄 Setting loading to false')
      setLoading(false)
      console.log('=== SUPABASE FETCH END ===')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-700">Loading {getTabTitle()}...</h3>
                  <div className="flex gap-2">
          <Button
            onClick={handleManualRefresh}
            variant="outline"
            size="sm"
            className="border-blue-300 text-blue-600 hover:bg-blue-50"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Osveži
          </Button>
        </div>
        </div>
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }
  
  // Debug: Check if loading is stuck
  if (loading) {
    console.log('⚠️ LOADING IS TRUE - items length:', items.length)
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          {type === 'blogs' ? (
            filterPublished === false ? (
              <EyeOff className="h-5 w-5 text-yellow-600" />
            ) : filterPublished === true ? (
              <Eye className="h-5 w-5 text-green-600" />
            ) : (
              <FileText className="h-5 w-5 text-blue-600" />
            )
          ) : (
            <BookOpen className="h-5 w-5 text-green-600" />
          )}
          <h3 className="text-xl font-bold text-gray-900">
            {getTabTitle()}
          </h3>
          <Badge variant="secondary" className="text-xs">
            {items.length} ukupno
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleManualRefresh}
            variant="outline"
            size="sm"
            className="border-blue-300 text-blue-600 hover:bg-blue-50"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Osveži
          </Button>
        </div>
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 mb-2">
                {type === 'blogs' ? (
                  filterPublished === false ? (
                    <EyeOff className="h-12 w-12 mx-auto" />
                  ) : filterPublished === true ? (
                    <Eye className="h-12 w-12 mx-auto" />
                  ) : (
                    <FileText className="h-12 w-12 mx-auto" />
                  )
                ) : (
                  <BookOpen className="h-12 w-12 mx-auto" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {getEmptyStateMessage()}
              </h3>
              <p className="text-gray-500">
                {getEmptyStateDescription()}
              </p>
            </CardContent>
          </Card>
        ) : (
          items.map((item) => {
            const isBlog = type === 'blogs'
            const blog = item as Blog
            const glossary = item as GlossaryEntry
            
            return (
              <Card 
                key={item.id} 
                className={`transition-all hover:shadow-lg border-l-4 shadow-sm ${
                  isBlog 
                    ? blog.published 
                      ? 'border-l-green-500 bg-green-50/30' 
                      : 'border-l-yellow-500 bg-yellow-50/30'
                    : 'border-l-blue-500 bg-blue-50/30'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-4">
                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg text-gray-900 truncate">
                          {isBlog ? blog.title : glossary.term}
                        </CardTitle>
                        
                        {(isBlog || type === 'glossary') && (
                          <Badge 
                            variant="secondary" 
                            className={
                              (isBlog ? blog.published : glossary.published)
                                ? 'bg-green-100 text-green-800 border-green-200' 
                                : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            }
                          >
                            {(isBlog ? blog.published : glossary.published) ? (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                Objavljeno
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3 mr-1" />
                                Draft
                              </>
                            )}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {isBlog ? blog.excerpt : glossary.definition.substring(0, 120) + '...'}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.created_at)}
                          </div>
                          
                          {isBlog && blog.author && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {blog.author}
                            </div>
                          )}
                          
                          {isBlog && blog.tags && blog.tags.length > 0 && (
                            <div className="flex gap-1">
                              {blog.tags.slice(0, 3).map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs px-1 py-0">
                                  {tag}
                                </Badge>
                              ))}
                              {blog.tags.length > 3 && (
                                <span className="text-gray-400">+{blog.tags.length - 3} more</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions row */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                      {/* Publish/Draft Toggle for Blogs and Glossary */}
                      {(isBlog || type === 'glossary') && (
                        <div className="flex items-center space-x-2 p-2 bg-white rounded-lg border">
                          <span className="text-xs font-medium text-gray-600">
                            {(isBlog ? blog.published : glossary.published) ? 'Objavljeno' : 'Draft'}
                          </span>
                          <Switch
                            checked={isBlog ? blog.published : glossary.published}
                            onCheckedChange={() => handleTogglePublished(item.id, isBlog ? blog.published : glossary.published)}
                            disabled={updating === item.id}
                            className="data-[state=checked]:bg-green-600"
                          />
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        {/* Edit Button - only for drafts */}
                        {((isBlog && !blog.published) || (type === 'glossary' && !glossary.published)) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditItem?.(item)}
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Uredi
                          </Button>
                      )}

                      {/* Delete Button */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Potvrdite brisanje</AlertDialogTitle>
                            <AlertDialogDescription>
                              Da li ste sigurni da želite da obrišete ovaj {type.slice(0, -1)}? 
                              Ova akcija se ne može poništiti.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Otkaži</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(item.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Obriši
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}