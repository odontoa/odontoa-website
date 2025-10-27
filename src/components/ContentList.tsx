import React, { useEffect, useState, useCallback } from 'react'
import { supabase, Blog, GlossaryEntry } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Trash2, RefreshCw, Eye, EyeOff, Calendar, User, FileText, BookOpen, Edit, Archive, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'

interface ContentListProps {
  type: 'blogs' | 'glossary'
  filterPublished?: boolean // true = only published, false = only drafts, undefined = all
  showArchived?: boolean // true = show archived items, false = hide archived items, undefined = hide archived
  onEditItem?: (item: Blog | GlossaryEntry) => void
}

export const ContentList: React.FC<ContentListProps> = ({ type, filterPublished, showArchived, onEditItem }) => {
  const { session } = useAuth()
  const [items, setItems] = useState<(Blog | GlossaryEntry)[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  // Optimized fetch function
  const fetchItems = useCallback(async () => {
    console.log('=== CONTENTLIST FETCH START ===')
    console.log('Type:', type, 'FilterPublished:', filterPublished, 'ShowArchived:', showArchived)
    
    setLoading(true)
    try {
      // TODO: Strapi CMS integration - replace Supabase with Strapi API
      // For blogs: ${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blog-posts?populate=*
      // For glossary: ${process.env.NEXT_PUBLIC_STRAPI_URL}/api/glossary-entries?populate=*
      // Fields mapping: title, slug, excerpt, cover_image, tags, read_time, main_content, faq, seo_schema, datePublished, author
      
      let query = supabase
        .from(type)
        .select('*')
        .order('created_at', { ascending: false })

      // Apply filter for blogs and glossary
      if (filterPublished !== undefined) {
        console.log('Applying published filter:', filterPublished)
        query = query.eq('published', filterPublished)
      }

      // Apply archive filter for blogs (temporarily disabled due to RLS issues)
      if (type === 'blogs' && showArchived === true) {
        console.log('Archive functionality temporarily disabled')
        // query = query.eq('archived', true)
      }

      console.log('Executing query...')
      const { data, error } = await query

      console.log('Query result - Data:', data?.length || 0, 'items')
      console.log('Query result - Error:', error)

      if (error) {
        console.error('Fetch error:', error)
        toast.error(`Greška pri učitavanju ${type}: ${error.message}`)
      } else {
        setItems(data || [])
        console.log('✅ Items loaded successfully')
      }
    } catch (err) {
      console.error('Fetch exception:', err)
      toast.error('Dogodila se neočekivana greška')
    } finally {
      setLoading(false)
      console.log('=== CONTENTLIST FETCH END ===')
    }
  }, [type, filterPublished, showArchived])

  // Initial fetch
  useEffect(() => {
    console.log('=== INITIAL FETCH TRIGGERED ===')
    fetchItems()
  }, [fetchItems])

  // Auto-refresh after form submissions and real-time updates
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('=== STORAGE EVENT RECEIVED - REFRESHING ===')
      fetchItems()
    }
    
    const handleCustomEvent = () => {
      console.log('=== CUSTOM EVENT RECEIVED - REFRESHING ===')
      // Add a small delay to ensure the database update is complete
      setTimeout(() => {
        fetchItems()
      }, 1000)
    }
    
    console.log('=== ADDING EVENT LISTENERS ===')
    
    // Listen for storage events (cross-tab)
    window.addEventListener('storage', handleStorageChange)
    
    // Listen for custom events (same tab)
    window.addEventListener('content-updated', handleCustomEvent)
    
    // Set up real-time subscription for immediate updates
    const channel = supabase
      .channel(`${type}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: type
        },
        (payload) => {
          console.log('=== REALTIME UPDATE RECEIVED ===', payload)
          // Debounce the refresh to avoid multiple rapid updates
          setTimeout(() => {
            fetchItems()
          }, 500)
        }
      )
      .subscribe()

    return () => {
      console.log('=== REMOVING EVENT LISTENERS ===')
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('content-updated', handleCustomEvent)
      supabase.removeChannel(channel)
    }
  }, [fetchItems, type])

  // Manual refresh function
  const handleManualRefresh = useCallback(() => {
    console.log('=== MANUAL REFRESH TRIGGERED ===')
    fetchItems()
    toast.success('Lista osvežena')
  }, [fetchItems])

  const handleDelete = async (id: string) => {
    try {
      console.log('=== SUPABASE ARCHIVE START ===')
      console.log('Archiving item ID:', id, 'Type:', type)

      // Get current session
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      
      if (!currentSession?.access_token) {
        toast.error('Niste ulogovani. Molimo ulogujte se ponovo.')
        return
      }

      if (type === 'blogs') {
        // For blogs, use regular DELETE (archive temporarily disabled)
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${type}?id=eq.${id}`, {
          method: 'DELETE',
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${currentSession.access_token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          console.log('=== DELETE SUCCESS ===')
          toast.success('Blog obrisan uspešno')
        } else {
          const errorData = await response.text()
          console.error('=== DELETE ERROR ===', errorData)
          toast.error(`Greška pri brisanju: ${response.status}`)
          return
        }
      } else {
        // For glossary terms, still use DELETE (no archive functionality for glossary yet)
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${type}?id=eq.${id}`, {
          method: 'DELETE',
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${currentSession.access_token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          console.log('=== DELETE SUCCESS ===')
          toast.success('Glossary term obrisan uspešno')
        } else {
          const errorData = await response.text()
          console.error('=== DELETE ERROR ===', errorData)
          toast.error(`Greška pri brisanju: ${response.status}`)
          return
        }
      }
      
      // Trigger immediate refresh
      fetchItems()
      
      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('content-updated'))
    } catch (error) {
      console.error('=== ARCHIVE/DELETE EXCEPTION ===', error)
      toast.error('Greška pri arhiviranju/brisanju')
    }
  }

  const handleTogglePublished = async (id: string, currentPublished: boolean) => {
    try {
      console.log('=== TOGGLE PUBLISHED START ===')
      console.log('Item ID:', id, 'Current published:', currentPublished, 'Type:', type)
      
      setUpdating(id)
      
      // Get current session
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      
      if (!currentSession?.access_token) {
        toast.error('Niste ulogovani. Molimo ulogujte se ponovo.')
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${type}?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${currentSession.access_token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ published: !currentPublished })
      })

      if (response.ok) {
        console.log('=== TOGGLE SUCCESS ===')
        const statusText = !currentPublished ? 'objavljen' : 'povučen'
        toast.success(`${type === 'blogs' ? 'Blog' : 'Glossary term'} ${statusText} uspešno`)
        
        // Trigger immediate refresh
        fetchItems()
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('content-updated'))
      } else {
        const errorData = await response.text()
        console.error('=== TOGGLE ERROR ===', errorData)
        toast.error(`Greška pri ažuriranju: ${response.status}`)
      }
    } catch (error) {
      console.error('=== TOGGLE EXCEPTION ===', error)
      toast.error('Greška pri ažuriranju')
    } finally {
      setUpdating(null)
    }
  }

  // Archive functionality temporarily disabled
  // const handleRestore = async (id: string) => { ... }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getItemTitle = (item: Blog | GlossaryEntry) => {
    return type === 'blogs' ? (item as Blog).title : (item as GlossaryEntry).term
  }

  const getItemSlug = (item: Blog | GlossaryEntry) => {
    return type === 'blogs' ? (item as Blog).slug : (item as GlossaryEntry).slug
  }

  const getItemAuthor = (item: Blog | GlossaryEntry) => {
    return type === 'blogs' ? (item as Blog).author : 'Odontoa Tim'
  }

  const getItemExcerpt = (item: Blog | GlossaryEntry) => {
    return type === 'blogs' ? (item as Blog).excerpt : (item as GlossaryEntry).definition
  }

  const getItemTags = (item: Blog | GlossaryEntry) => {
    return type === 'blogs' ? (item as Blog).tags : (item as GlossaryEntry).related_terms
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {type === 'blogs' ? 'Blogovi' : 'Glossary Terms'}
          </h3>
          <Button variant="outline" size="sm" disabled>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Učitavanje...
          </Button>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const publishedCount = items.filter(item => item.published).length
  const draftCount = items.filter(item => !item.published).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {type === 'blogs' ? 'Blogovi' : 'Glossary Terms'}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
            <span>{items.length} ukupno</span>
            <span>{publishedCount} objavljeno</span>
            <span>{draftCount} draft</span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleManualRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Osveži
        </Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Nema {type === 'blogs' ? 'blogova' : 'glossary terms'} za prikaz
            </h4>
            <p className="text-gray-500">
              {filterPublished === true 
                ? 'Nema objavljenih stavki'
                : filterPublished === false 
                ? 'Nema draft stavki'
                : 'Nema stavki uopšte'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-2">
                      <h4 className="text-base font-medium text-gray-900 leading-tight break-words flex-1">
                        {getItemTitle(item)}
                      </h4>
                      <Badge variant={item.published ? "default" : "secondary"} className={`text-xs flex-shrink-0 ${item.published ? 'text-white' : ''}`}>
                        {item.published ? (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Objavljen
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Draft
                          </>
                        )}
                      </Badge>
                      {/* Archive functionality temporarily disabled */}
                      {/* {false && type === 'blogs' && (item as Blog).archived && (
                        <Badge variant="destructive" className="text-xs">
                          <Archive className="h-3 w-3 mr-1" />
                          Arhiviran
                        </Badge>
                      )} */}
                    </div>
                    
                    <p className="text-gray-600 text-xs mb-2 line-clamp-2 leading-relaxed">
                      {getItemExcerpt(item)}
                    </p>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(item.created_at)}
                      </div>
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {getItemAuthor(item)}
                      </div>
                    </div>
                    
                    {getItemTags(item) && getItemTags(item)!.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {getItemTags(item)!.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                        {getItemTags(item)!.length > 2 && (
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            +{getItemTags(item)!.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Archive functionality temporarily disabled - showing normal controls */}
                    <Switch
                      checked={item.published}
                      onCheckedChange={() => handleTogglePublished(item.id, item.published)}
                      disabled={updating === item.id}
                      className="scale-75"
                    />
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditItem?.(item)}
                      className="h-7 w-7 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Da li ste sigurni?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Ova akcija će trajno obrisati {type === 'blogs' ? 'blog' : 'glossary term'}.
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}