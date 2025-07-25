import React, { useEffect, useState } from 'react'
import { supabase, Blog, GlossaryEntry } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Trash2, RefreshCw, Eye, EyeOff, Calendar, User, FileText, BookOpen } from 'lucide-react'
import { toast } from 'sonner'

interface ContentListProps {
  type: 'blogs' | 'glossary'
  filterPublished?: boolean // true = only published, false = only drafts, undefined = all
}

export const ContentList: React.FC<ContentListProps> = ({ type, filterPublished }) => {
  const { session } = useAuth()
  const [items, setItems] = useState<(Blog | GlossaryEntry)[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    // Use Raw HTTP by default since it works
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

      // Apply filter for blogs only
      if (type === 'blogs' && filterPublished !== undefined) {
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
      console.log('=== RAW HTTP DELETE START ===')
      console.log('Deleting item ID:', id, 'Type:', type)

      const response = await fetch(`https://bjbfmddrekjmactytaky.supabase.co/rest/v1/${type}?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqYmZtZGRyZWtqbWFjdHl0YWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDA1NjEsImV4cCI6MjA2OTAxNjU2MX0.jkSPsLNdD1pfm5er4TgHm0T6vVdYaXorlnScFe_X99k',
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('Raw HTTP Delete Response Status:', response.status)

      if (response.ok) {
        toast.success(`${type.slice(0, -1)} uspešno obrisan!`)
        fetchItemsRawHTTP()
        console.log('=== RAW HTTP DELETE SUCCESS ===')
      } else {
        const errorData = await response.text()
        console.error('Raw HTTP Delete Error:', errorData)
        toast.error(`Raw HTTP greška: ${response.status}`)
      }
    } catch (err) {
      console.error('Raw HTTP Delete Exception:', err)
      toast.error('Greška pri Raw HTTP pozivu')
    }
  }

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    if (type !== 'blogs') return
    
    setUpdating(id)
    try {
      console.log('=== RAW HTTP TOGGLE START ===')
      console.log('Blog ID:', id, 'Current status:', currentStatus, 'New status:', !currentStatus)

      const response = await fetch(`https://bjbfmddrekjmactytaky.supabase.co/rest/v1/blogs?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqYmZtZGRyZWtqbWFjdHl0YWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDA1NjEsImV4cCI6MjA2OTAxNjU2MX0.jkSPsLNdD1pfm5er4TgHm0T6vVdYaXorlnScFe_X99k',
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ published: !currentStatus })
      })

      console.log('Raw HTTP Toggle Response Status:', response.status)

      if (response.ok) {
        const statusText = !currentStatus ? 'objavljem' : 'sklonim sa sajta'
        toast.success(`Blog uspešno ${statusText}!`)
        fetchItemsRawHTTP()
        console.log('=== RAW HTTP TOGGLE SUCCESS ===')
      } else {
        const errorData = await response.text()
        console.error('Raw HTTP Toggle Error:', errorData)
        toast.error(`Raw HTTP greška: ${response.status}`)
      }
    } catch (err) {
      console.error('Raw HTTP Toggle Exception:', err)
      toast.error('Greška pri Raw HTTP pozivu')
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
    if (type === 'glossary') return 'Rečnik termina'
    if (filterPublished === true) return 'Objavljeni blogovi'
    if (filterPublished === false) return 'Draft blogovi (Skice)'
    return 'Svi blogovi'
  }

  const getEmptyStateMessage = () => {
    if (type === 'glossary') return 'Nema termina'
    if (filterPublished === true) return 'Nema objavljenih blogova'
    if (filterPublished === false) return 'Nema draft blogova'
    return 'Nema blogova'
  }

  const getEmptyStateDescription = () => {
    if (type === 'glossary') return 'Kreirajte prvi termin da biste počeli'
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
    console.log('=== RAW HTTP FETCH START ===')
    console.log('Type:', type)
    console.log('FilterPublished:', filterPublished)
    console.log('FilterPublished type:', typeof filterPublished)
    console.log('FilterPublished === false:', filterPublished === false)
    console.log('FilterPublished === true:', filterPublished === true)
    
    setLoading(true)
    try {
      let url = `https://bjbfmddrekjmactytaky.supabase.co/rest/v1/${type}?select=*&order=created_at.desc`
      
      // Apply filter for blogs only
      if (type === 'blogs' && filterPublished !== undefined) {
        console.log('🔍 Applying published filter via Raw HTTP:', filterPublished)
        url += `&published=eq.${filterPublished}`
        console.log('📍 FINAL URL for', filterPublished === false ? 'DRAFTS' : 'PUBLISHED', ':', url)
      }

      console.log('Raw HTTP URL:', url)

      const response = await fetch(url, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqYmZtZGRyZWtqbWFjdHl0YWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDA1NjEsImV4cCI6MjA2OTAxNjU2MX0.jkSPsLNdD1pfm5er4TgHm0T6vVdYaXorlnScFe_X99k',
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('Raw HTTP Response Status:', response.status)
      console.log('Raw HTTP Response OK:', response.ok)

      if (response.ok) {
        const data = await response.json()
        console.log('Raw HTTP Data:', data?.length || 0, 'items')
        console.log('Raw HTTP Items:', data)
        console.log('📊 DETAILED ITEMS DATA:', data?.map(item => ({
          id: item.id,
          title: item.title,
          published: item.published,
          created_at: item.created_at
        })))
        setItems(data || [])
        // Remove toast to prevent noise - only show on manual refresh
        console.log(`✅ Raw HTTP: Loaded ${data?.length || 0} items`)
      } else {
        const errorData = await response.text()
        console.error('Raw HTTP Error:', errorData)
        toast.error(`Raw HTTP greška: ${response.status}`)
      }
    } catch (err) {
      console.error('Raw HTTP Exception:', err)
      toast.error('Greška pri Raw HTTP pozivu')
    } finally {
      setLoading(false)
      console.log('=== RAW HTTP FETCH END ===')
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
            
            <Button
              onClick={async () => {
                console.log('🧪 CREATING TEST DRAFT - filterPublished:', filterPublished)
                toast.info('Creating test draft...')
                try {
                  const testData = {
                    title: `DEBUG DRAFT ${new Date().toLocaleTimeString()}`,
                    slug: `debug-draft-${Date.now()}`,
                    content: "This is a test draft blog created for debugging the draft display issue.",
                    excerpt: "Debug test excerpt to verify draft functionality",
                    author: "Debug Author", 
                    published: false,
                    meta_description: "Debug meta description for testing"
                  }
                  
                  console.log('🧪 TEST DRAFT DATA:', testData)
                  
                  const response = await fetch('https://bjbfmddrekjmactytaky.supabase.co/rest/v1/blogs', {
                    method: 'POST',
                    headers: {
                      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqYmZtZGRyZWtqbWFjdHl0YWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDA1NjEsImV4cCI6MjA2OTAxNjU2MX0.jkSPsLNdD1pfm5er4TgHm0T6vVdYaXorlnScFe_X99k',
                      'Authorization': `Bearer ${session?.access_token}`,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(testData)
                  })
                  
                  const result = await response.text()
                  console.log('🧪 TEST DRAFT RESPONSE:', response.status, result)
                  
                  if (response.ok) {
                    toast.success('✅ Test draft created! Refreshing...')
                    setTimeout(() => fetchItemsRawHTTP(), 1000)
                  } else {
                    toast.error(`❌ Failed: ${response.status}`)
                    console.error('Test draft failed:', result)
                  }
                } catch (err) {
                  console.error('Test draft error:', err)
                  toast.error('Error creating test draft')
                }
              }}
              variant="outline"
              size="sm"
              className="border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              🧪 Test Draft
            </Button>
            
            <Button
              onClick={async () => {
                console.log('🔧 FIXING NULL PUBLISHED...')
                toast.info('Fixing NULL published values...')
                try {
                  const response = await fetch('https://bjbfmddrekjmactytaky.supabase.co/rest/v1/blogs?published=is.null', {
                    method: 'PATCH',
                    headers: {
                      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqYmZtZGRyZWtqbWFjdHl0YWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDA1NjEsImV4cCI6MjA2OTAxNjU2MX0.jkSPsLNdD1pfm5er4TgHm0T6vVdYaXorlnScFe_X99k',
                      'Authorization': `Bearer ${session?.access_token}`,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ published: false })
                  })
                  
                  if (response.ok) {
                    toast.success('✅ Fixed NULL values! Refreshing...')
                    setTimeout(() => fetchItemsRawHTTP(), 1000)
                  } else {
                    toast.error('❌ Failed to fix NULL values')
                  }
                } catch (err) {
                  console.error('Fix error:', err)
                  toast.error('Error fixing NULL values')
                }
              }}
              variant="outline"
              size="sm"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              🔧 Fix NULL
            </Button>
            
            <Button
              onClick={async () => {
                console.log('🔍 DEBUGGING ALL BLOGS...')
                toast.info('Fetching all blogs for debugging...')
                try {
                  // Fetch ALL blogs without filter
                  const response = await fetch('https://bjbfmddrekjmactytaky.supabase.co/rest/v1/blogs?select=*&order=created_at.desc', {
                    headers: {
                      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqYmZtZGRyZWtqbWFjdHl0YWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDA1NjEsImV4cCI6MjA2OTAxNjU2MX0.jkSPsLNdD1pfm5er4TgHm0T6vVdYaXorlnScFe_X99k',
                      'Content-Type': 'application/json'
                    }
                  })
                  
                  if (response.ok) {
                    const allBlogs = await response.json()
                    console.log('🔍 ALL BLOGS IN DATABASE:', allBlogs)
                    console.log('🔍 TOTAL BLOGS:', allBlogs?.length || 0)
                    console.log('🔍 BLOG DETAILS:', allBlogs?.map(blog => ({
                      id: blog.id,
                      title: blog.title,
                      slug: blog.slug,
                      published: blog.published,
                      published_type: typeof blog.published,
                      created_at: blog.created_at
                    })))
                    
                    const drafts = allBlogs?.filter(blog => blog.published === false) || []
                    const published = allBlogs?.filter(blog => blog.published === true) || []
                    const nullPublished = allBlogs?.filter(blog => blog.published === null) || []
                    
                    console.log('🔍 DRAFTS (published=false):', drafts.length)
                    console.log('🔍 PUBLISHED (published=true):', published.length)
                    console.log('🔍 NULL PUBLISHED (published=null):', nullPublished.length)
                    
                    toast.success(`Debug: ${allBlogs?.length || 0} total, ${drafts.length} drafts, ${published.length} published`)
                  } else {
                    toast.error('❌ Failed to fetch all blogs')
                  }
                } catch (err) {
                  console.error('Debug error:', err)
                  toast.error('Error debugging blogs')
                }
              }}
              variant="outline"
              size="sm"
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              🔍 Debug All
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
            onClick={() => {
              setLoading(true)
              fetchItems().then(() => {
                toast.success('Supabase klijent osvežen')
              }).catch(() => {
                toast.error('Supabase klijent greška')
              })
            }}
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            🔄 Supabase
          </Button>
          
          <Button
            onClick={() => {
              setLoading(true)
              fetchItemsRawHTTP().then(() => {
                toast.success('Raw HTTP osvežen')
              }).catch(() => {
                toast.error('Raw HTTP greška')
              })
            }}
            variant="outline"
            size="sm"
            className="border-green-300 text-green-600 hover:bg-green-50"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            🌐 Raw HTTP
          </Button>
          
          <Button
            onClick={async () => {
              console.log('🧪 CREATING TEST DRAFT - filterPublished:', filterPublished)
              toast.info('Creating test draft...')
              try {
                const testData = {
                  title: `DEBUG DRAFT ${new Date().toLocaleTimeString()}`,
                  slug: `debug-draft-${Date.now()}`,
                  content: "This is a test draft blog created for debugging the draft display issue.",
                  excerpt: "Debug test excerpt to verify draft functionality",
                  author: "Debug Author",
                  published: false,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
                
                const response = await fetch('https://bjbfmddrekjmactytaky.supabase.co/rest/v1/blogs', {
                  method: 'POST',
                  headers: {
                    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqYmZtZGRyZWtqbWFjdHl0YWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDA1NjEsImV4cCI6MjA2OTAxNjU2MX0.jkSPsLNdD1pfm5er4TgHm0T6vVdYaXorlnScFe_X99k',
                    'Authorization': `Bearer ${session?.access_token}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                  },
                  body: JSON.stringify(testData)
                })
                
                if (response.ok) {
                  const createdBlog = await response.json()
                  console.log('✅ Test draft created:', createdBlog)
                  toast.success('✅ Test draft created! Refreshing...')
                  setTimeout(() => fetchItemsRawHTTP(), 1000)
                } else {
                  const errorData = await response.text()
                  console.error('❌ Test draft creation failed:', errorData)
                  toast.error('❌ Test draft creation failed')
                }
              } catch (err) {
                console.error('Test draft error:', err)
                toast.error('Error creating test draft')
              }
            }}
            variant="outline"
            size="sm"
            className="border-purple-300 text-purple-600 hover:bg-purple-50"
          >
            🧪 Test Draft
          </Button>
          
          <Button
            onClick={async () => {
              console.log('🔧 FIXING NULL PUBLISHED...')
              toast.info('Fixing NULL published values...')
              try {
                const response = await fetch('https://bjbfmddrekjmactytaky.supabase.co/rest/v1/blogs?published=is.null', {
                  method: 'PATCH',
                  headers: {
                    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqYmZtZGRyZWtqbWFjdHl0YWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDA1NjEsImV4cCI6MjA2OTAxNjU2MX0.jkSPsLNdD1pfm5er4TgHm0T6vVdYaXorlnScFe_X99k',
                    'Authorization': `Bearer ${session?.access_token}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ published: false })
                })
                
                if (response.ok) {
                  toast.success('✅ Fixed NULL values! Refreshing...')
                  setTimeout(() => fetchItemsRawHTTP(), 1000)
                } else {
                  toast.error('❌ Failed to fix NULL values')
                }
              } catch (err) {
                console.error('Fix error:', err)
                toast.error('Error fixing NULL values')
              }
            }}
            variant="outline"
            size="sm"
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            🔧 Fix NULL
          </Button>
          
          <Button
            onClick={async () => {
              console.log('🔍 DEBUGGING ALL BLOGS...')
              toast.info('Fetching all blogs for debugging...')
              try {
                // Fetch ALL blogs without filter
                const response = await fetch('https://bjbfmddrekjmactytaky.supabase.co/rest/v1/blogs?select=*&order=created_at.desc', {
                  headers: {
                    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqYmZtZGRyZWtqbWFjdHl0YWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDA1NjEsImV4cCI6MjA2OTAxNjU2MX0.jkSPsLNdD1pfm5er4TgHm0T6vVdYaXorlnScFe_X99k',
                    'Content-Type': 'application/json'
                  }
                })
                
                if (response.ok) {
                  const allBlogs = await response.json()
                  console.log('🔍 ALL BLOGS IN DATABASE:', allBlogs)
                  console.log('🔍 TOTAL BLOGS:', allBlogs?.length || 0)
                  console.log('🔍 BLOG DETAILS:', allBlogs?.map(blog => ({
                    id: blog.id,
                    title: blog.title,
                    slug: blog.slug,
                    published: blog.published,
                    published_type: typeof blog.published,
                    created_at: blog.created_at
                  })))
                  
                  const drafts = allBlogs?.filter(blog => blog.published === false) || []
                  const published = allBlogs?.filter(blog => blog.published === true) || []
                  const nullPublished = allBlogs?.filter(blog => blog.published === null) || []
                  
                  console.log('🔍 DRAFTS (published=false):', drafts.length)
                  console.log('🔍 PUBLISHED (published=true):', published.length)
                  console.log('🔍 NULL PUBLISHED (published=null):', nullPublished.length)
                  
                  toast.success(`Debug: ${allBlogs?.length || 0} total, ${drafts.length} drafts, ${published.length} published`)
                } else {
                  toast.error('❌ Failed to fetch all blogs')
                }
              } catch (err) {
                console.error('Debug error:', err)
                toast.error('Error debugging blogs')
              }
            }}
            variant="outline"
            size="sm"
            className="border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            🔍 Debug All
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
                className={`transition-all hover:shadow-md border-l-4 ${
                  isBlog 
                    ? blog.published 
                      ? 'border-l-green-500 bg-green-50/30' 
                      : 'border-l-yellow-500 bg-yellow-50/30'
                    : 'border-l-blue-500 bg-blue-50/30'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg text-gray-900 truncate">
                          {isBlog ? blog.title : glossary.term}
                        </CardTitle>
                        
                        {isBlog && (
                          <Badge 
                            variant="secondary" 
                            className={
                              blog.published 
                                ? 'bg-green-100 text-green-800 border-green-200' 
                                : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            }
                          >
                            {blog.published ? (
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
                          {isBlog ? blog.excerpt || blog.content.substring(0, 120) + '...' : glossary.definition.substring(0, 120) + '...'}
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

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Publish/Draft Toggle for Blogs */}
                      {isBlog && (
                        <div className="flex items-center space-x-2 p-2 bg-white rounded-lg border">
                          <span className="text-xs font-medium text-gray-600">
                            {blog.published ? 'Objavljeno' : 'Draft'}
                          </span>
                          <Switch
                            checked={blog.published}
                            onCheckedChange={() => handleTogglePublished(blog.id, blog.published)}
                            disabled={updating === blog.id}
                            className="data-[state=checked]:bg-green-600"
                          />
                        </div>
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
                </CardHeader>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}