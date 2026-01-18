import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/contexts/AuthContext'
import { useFormDirty } from '@/contexts/FormDirtyContext'
import { useProtectedAction } from '@/hooks/useProtectedAction'
import { useBeforeUnload } from '@/hooks/useBeforeUnload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Loader2, 
  Save, 
  Sparkles, 
  FileText, 
  Globe, 
  Image, 
  Link, 
  Target,
  TrendingUp,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  Info
} from 'lucide-react'
import { toast } from 'sonner'
import { RichTextEditor } from './RichTextEditor'
import { FAQGenerator } from '@/lib/faqGenerator'
import { LLMSService } from '@/lib/llms'
import { 
  createSEOSlug, 
  generateMetaDescription, 
  generateSEOKeywords,
  generateStructuredData,
  calculateReadingTime,
  calculateSEOScore,
  generateTopicClusterSuggestions,
  suggestRelatedContent,
  analyzeContentStructure,
  checkKeywordOptimization,
  suggestRelevantTags,
  enhanceSEOWithTags,
  generateCombinedSchema,
  SUGGESTED_BLOG_TAGS
} from '@/lib/utils'
import { buildCombinedSchema } from '@/lib/schema/buildJsonLd'
import { HelpTooltip } from '@/components/ui/tooltip'
import { TopicClusterSuggestions } from '@/components/TopicClusterSuggestions'
import { SEOTestMode } from '@/components/SEOTestMode'
import tooltipsData from '@/data/seo-tooltips.json'


const blogSchema = z.object({
  title: z.string().min(1, 'Naslov je obavezan'),
  slug: z.string().min(1, 'Slug je obavezan'),
  content: z.string().min(50, 'Sadržaj mora imati najmanje 50 karaktera'),
  excerpt: z.string().min(10, 'Kratki opis mora imati najmanje 10 karaktera'),
  image_url: z.string().url('Nevalidna URL adresa').min(1, 'URL slike je obavezan'),
  alt_text: z.string().min(1, 'Alt tekst je obavezan'),
  faqSchema: z.string().optional(),
  tags: z.string().optional(),
  related_glossary_terms: z.string().optional(),
  author: z.string().min(1, 'Autor je obavezan'),
  author_url: z.string().url('Nevalidna URL adresa').min(1, 'URL autora je obavezan'),
  meta_description: z.string().min(10, 'Meta opis mora imati najmanje 10 karaktera'),
  featured_image: z.string().url('Nevalidna URL adresa').optional().or(z.literal('')),
  featured: z.boolean().default(false),
})

type BlogFormData = z.infer<typeof blogSchema>

interface BlogFormProps {
  onSuccess?: (action: 'created' | 'published' | 'updated') => void
  onCancel?: () => void
  initialData?: any
}

export const BlogForm: React.FC<BlogFormProps> = ({ onSuccess, onCancel, initialData }) => {
  const { user, session, isAdmin } = useAuth()
  const { setDirty } = useFormDirty()
  const { executeProtectedAction } = useProtectedAction()
  const [loading, setLoading] = useState(false)
  
  // Store original data for cancel functionality
  const [originalData, setOriginalData] = useState<any>(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatingFAQ, setGeneratingFAQ] = useState(false)
  const [seoScore, setSeoScore] = useState(0)
  const [seoMetrics, setSeoMetrics] = useState<any>({})
  const [readingTime, setReadingTime] = useState(1)
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [topicSuggestions, setTopicSuggestions] = useState<any[]>([])
  const [relatedContent, setRelatedContent] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('content')
  const [showSEOTest, setShowSEOTest] = useState(false)
  const [selectedRelatedContent, setSelectedRelatedContent] = useState<string[]>([])
  const [contentStructure, setContentStructure] = useState({
    hasHeadings: false,
    hasImages: false,
    hasLists: false,
    hasLinks: false,
    wordCount: 0
  })
  const [seoCalculating, setSeoCalculating] = useState(false)

  // Debug upload loading state
  useEffect(() => {
    console.log('📊 Upload loading state changed:', uploadLoading)
  }, [uploadLoading])

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      content: initialData?.content || '',
      excerpt: initialData?.excerpt || '',
      image_url: initialData?.image_url || '',
      alt_text: initialData?.alt_text || '',
      faqSchema: initialData?.faq_schema ? JSON.stringify(initialData.faq_schema, null, 2) : '',
      tags: initialData?.tags ? initialData.tags.join(', ') : '',
      related_glossary_terms: initialData?.related_glossary_terms ? initialData.related_glossary_terms.join(', ') : '',
      author: initialData?.author || 'Odontoa Tim',
      author_url: initialData?.author_url || 'https://odontoa.com/o-nama',
      meta_description: initialData?.meta_description || '',
      featured_image: initialData?.featured_image || '',
      featured: initialData?.featured || false
    }
  })

  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      // Store original data for cancel functionality
      setOriginalData(initialData)
      
      form.reset({
        title: initialData.title || '',
        slug: initialData.slug || '',
        content: initialData.content || '',
        excerpt: initialData.excerpt || '',
        image_url: initialData.image_url || '',
        alt_text: initialData.alt_text || '',
        faqSchema: initialData.faq_schema ? JSON.stringify(initialData.faq_schema, null, 2) : '',
        tags: initialData.tags ? initialData.tags.join(', ') : '',
        related_glossary_terms: initialData.related_glossary_terms ? initialData.related_glossary_terms.join(', ') : '',
        author: initialData.author || 'Odontoa Tim',
        author_url: initialData.author_url || 'https://odontoa.com/o-nama',
        meta_description: initialData.meta_description || '',
        featured_image: initialData.featured_image || '',
        featured: initialData.featured || false
      })
      
      // Inicijalizuj selectedTags za predložene kategorije
      if (initialData.tags && initialData.tags.length > 0) {
        const suggestedTags = initialData.tags.filter(tag => 
          SUGGESTED_BLOG_TAGS.some(suggested => suggested.name === tag)
        )
        setSelectedTags(suggestedTags)
      }
    }
  }, [initialData, form])

  // Auto-update SEO score when relevant fields change (with debounce)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    const subscription = form.watch((value, { name }) => {
      // Only update SEO score for relevant field changes
      if (name && ['title', 'meta_description', 'content', 'tags', 'image_url', 'alt_text'].includes(name)) {
        // Clear previous timeout
        clearTimeout(timeoutId)
        // Debounce SEO score calculation to avoid too frequent updates
        timeoutId = setTimeout(() => {
          updateSEOScore()
        }, 500) // 500ms delay
      }
    })
    
    return () => {
      subscription.unsubscribe()
      clearTimeout(timeoutId)
    }
  }, [form.watch])

  // Track form dirty state for unsaved changes protection
  useEffect(() => {
    const subscription = form.watch(() => {
      setDirty(form.formState.isDirty)
    })
    
    return () => subscription.unsubscribe()
  }, [form.watch, form.formState.isDirty, setDirty])

  // Setup beforeunload protection
  useBeforeUnload(form.formState.isDirty)

  const generateSlug = (title: string) => {
    if (!title) return ''
    
    // Serbian character mapping
    const serbianMap: { [key: string]: string } = {
      'č': 'c', 'ć': 'c', 'đ': 'd', 'š': 's', 'ž': 'z',
      'Č': 'C', 'Ć': 'C', 'Đ': 'D', 'Š': 'S', 'Ž': 'Z',
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'z', 'з': 'z',
      'и': 'i', 'ј': 'j', 'к': 'k', 'л': 'l', 'љ': 'lj', 'м': 'm', 'н': 'n', 'њ': 'nj',
      'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h',
      'ц': 'c', 'ч': 'c', 'џ': 'dz', 'ш': 's'
    }
    
    let slug = title
      .toLowerCase()
      .trim()
    
    // Replace Serbian characters
    Object.entries(serbianMap).forEach(([serbian, latin]) => {
      slug = slug.replace(new RegExp(serbian, 'g'), latin)
    })
    
    // Remove special characters and replace with hyphens
    slug = slug
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    
    // Limit length to 60 characters
    if (slug.length > 60) {
      slug = slug.substring(0, 60).replace(/-+$/, '')
    }
    
    return slug
  }

  const handleTitleChange = (title: string) => {
    form.setValue('title', title)
    if (!form.getValues('slug') || form.getValues('slug') === generateSlug(form.getValues('title'))) {
      form.setValue('slug', generateSlug(title))
    }
    // Auto-generate SEO-optimized meta description (only if content is available)
    if (!form.getValues('meta_description') && title.length > 0) {
      const content = form.getValues('content')
      if (content && content.length > 50) {
        const description = generateMetaDescription(content, title)
        form.setValue('meta_description', description)
      }
    }
    updateSEOScore()
  }

  const handleContentChange = (content: string) => {
    form.setValue('content', content)
    
    // Auto-update reading time
    const time = calculateReadingTime(content)
    setReadingTime(time)
    
    // Analyze content structure
    const structure = analyzeContentStructure(content)
    setContentStructure(structure)
    
    // Generate tag suggestions
    const title = form.getValues('title')
    if (content.length > 50 || title.length > 0) {
      const suggestions = suggestRelevantTags(content, title)
      setTagSuggestions(suggestions)
    }
    
    // Auto-update meta description if empty (only if content is substantial)
    if (!form.getValues('meta_description') && content.length > 100) {
      const title = form.getValues('title')
      const description = generateMetaDescription(content, title)
      form.setValue('meta_description', description)
    }
    
    updateSEOScore()
    generateTopicSuggestions()
    generateRelatedContent()
  }

  const updateSEOScore = () => {
    setSeoCalculating(true)
    const formData = form.getValues()
    const seoResult = calculateSEOScore(formData)
    setSeoScore(seoResult.score)
    setSeoMetrics(seoResult.metrics)
    setSeoCalculating(false)
  }

  const generateTopicSuggestions = async () => {
    const formData = form.getValues()
    if (formData.content && formData.title) {
      const tags = formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
      const suggestions = generateTopicClusterSuggestions(formData.content, formData.title, tags)
      setTopicSuggestions(suggestions)
    }
  }

  const generateRelatedContent = async () => {
    const formData = form.getValues()
    if (formData.content) {
      try {
        // Fetch existing content for suggestions using REST API
        const [blogsResponse, glossaryResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/blogs?select=id,title,slug,tags,content&published=eq.true&limit=20`, {
            headers: {
              'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
              'Authorization': `Bearer ${(session as any)?.access_token || ''}`,
            }
          }),
          fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/glossary?select=id,term,slug,related_terms,full_article&published=eq.true&limit=20`, {
            headers: {
              'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
              'Authorization': `Bearer ${(session as any)?.access_token || ''}`,
            }
          })
        ])

        const existingBlogs = await blogsResponse.json()
        const existingGlossary = await glossaryResponse.json()

        const allContent = [
          ...(existingBlogs || []),
          ...(existingGlossary || []).map(item => ({
            id: item.id,
            title: item.term,
            slug: item.slug,
            tags: item.related_terms || [],
            content: item.full_article
          }))
        ]

        const tags = formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
        const suggestions = suggestRelatedContent(formData.content, tags, allContent)
        setRelatedContent(suggestions)
      } catch (error) {
        console.error('Error generating related content:', error)
      }
    }
  }

  const handleGenerateFAQ = async () => {
    const title = form.getValues('title')
    const content = form.getValues('content')
    const meta_description = form.getValues('meta_description')
    const tags = form.getValues('tags')
    const author = form.getValues('author')
    const slug = form.getValues('slug')
    const image_url = form.getValues('image_url')
    const alt_text = form.getValues('alt_text')
    const author_url = form.getValues('author_url')
    
    // Validate all required fields before generating schema
    const missingFields = []
    if (!title) missingFields.push('Naslov')
    if (!content || content.length < 50) missingFields.push('Sadržaj (najmanje 50 karaktera)')
    if (!meta_description) missingFields.push('Meta opis')
    if (!image_url) missingFields.push('URL slike')
    if (!alt_text) missingFields.push('Alt tekst')
    if (!author) missingFields.push('Autor')
    if (!author_url) missingFields.push('URL autora')
    if (!slug) missingFields.push('Slug')
    
    if (missingFields.length > 0) {
      toast.error(`Popunite sva obavezna polja pre generacije schema: ${missingFields.join(', ')}`)
      return
    }

    setGeneratingFAQ(true)
    try {
      // First generate FAQ schema
      const faqSchema = FAQGenerator.generateFromContent(title, content)
      
      if (faqSchema) {
        // Process tags for SEO enhancement
        const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
        const tagEnhancement = enhanceSEOWithTags(tagsArray, title, meta_description)
        
        // Generate enhanced combined schema with all 4 required objects
        const combinedSchema = buildCombinedSchema({
          title,
          content,
          meta_description,
          author: author || 'Odontoa Tim',
          author_url: form.getValues('author_url'),
          slug,
          image_url,
          alt_text,
          tags: tagEnhancement.frontendTags.map(tag => tag.name),
          created_at: new Date().toISOString(),
          faq_schema: faqSchema,
          reading_time: readingTime
        }, 'blog')
        
        // Set the combined schema in the form
        form.setValue('faqSchema', JSON.stringify(combinedSchema, null, 2))
        toast.success('Kombinovana schema (Article + FAQPage + WebPage) generisana uspešno')
        updateSEOScore()
      } else {
        toast.error('Nije moguće generisati FAQ schema za ovaj sadržaj')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Nepoznata greška'
      toast.error(`Greška pri generisanju schema: ${errorMessage}`)
      console.error('FAQ generation error:', error)
    } finally {
      setGeneratingFAQ(false)
    }
  }

  const submitBlogRawHTTP = async (data: BlogFormData, published: boolean) => {
    
    setLoading(true)
    setError('')

    try {
      // Use session from React context instead of Supabase client
      
      if (!session || !user || !isAdmin) {
        setError('Niste ulogovani kao admin')
        toast.error('Niste ulogovani kao admin')
        setLoading(false)
        return
      }


      
      const tagsArray = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
      const relatedGlossaryArray = data.related_glossary_terms ? data.related_glossary_terms.split(',').map(term => term.trim()).filter(Boolean) : []
      
      // Process tags for SEO enhancement
      const tagEnhancement = enhanceSEOWithTags(tagsArray, data.title, data.meta_description)
      
      let faqSchemaJson = null
      if (data.faqSchema) {
        try {
          faqSchemaJson = JSON.parse(data.faqSchema)
        } catch (e) {
          setError('Nevalidan FAQ Schema JSON format')
          setLoading(false)
          return
        }
      }

      // Generate enhanced combined schema with all 4 required objects
      const combinedSchema = buildCombinedSchema({
        title: data.title,
        content: data.content,
        meta_description: data.meta_description,
        author: data.author,
        author_url: data.author_url,
        slug: data.slug,
        image_url: data.image_url,
        alt_text: data.alt_text,
        tags: tagEnhancement.frontendTags.map(tag => tag.name),
        created_at: new Date().toISOString(),
        faq_schema: faqSchemaJson,
        reading_time: readingTime
      }, 'blog')

      const blogData = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        summary: data.meta_description, // Use meta_description as summary
        image_url: data.image_url || null,
        alt_text: data.alt_text || null,
        faq_schema: JSON.stringify(combinedSchema), // Store combined schema as JSON string
        tags: tagEnhancement.frontendTags.map(tag => tag.name), // Use processed tags
        related_glossary_terms: relatedGlossaryArray,
        author: data.author,
        author_url: data.author_url,
        published,
        featured: data.featured,
        meta_description: data.meta_description,
        featured_image: data.featured_image || null,
        reading_time: readingTime,
        seo_score: seoScore + tagEnhancement.seoScore, // Add tag SEO score
        meta_keywords: tagEnhancement.metaKeywords // Add meta keywords
      }

      // Determine if this is an edit (update) or create operation
      const isEditMode = !!initialData?.id
      const method = isEditMode ? 'PATCH' : 'POST'
      const url = isEditMode 
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/blogs?id=eq.${initialData.id}`
        : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/blogs`
      
      const response = await fetch(url, {
        method,
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${(session as any)?.access_token || ''}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(blogData)
      })

      if (response.ok) {
        const insertedData = await response.json()
        
        const isEditMode = !!initialData?.id
        const actionText = isEditMode ? 'ažuriran' : 'kreiran'
        const statusText = published ? `objavljen i ${actionText}` : `sačuvan kao draft i ${actionText}`
        toast.success(`Blog post ${statusText} uspešno!`)
        
        if (isEditMode) {
          // Don't reset form in edit mode, just call success callback
          onSuccess?.(published ? 'published' : 'updated')
        } else {
          // Reset form only for new blog creation
          form.reset()
          onSuccess?.(published ? 'published' : 'created')
        }
        
        // Trigger immediate refresh for all components
        window.dispatchEvent(new Event('storage'))
        window.dispatchEvent(new CustomEvent('content-updated'))
      } else {
        const errorData = await response.text()
        console.error('=== RAW HTTP ERROR ===')
        console.error('Error data:', errorData)
        
        // Parse error data to show more specific error
        try {
          const errorJson = JSON.parse(errorData)
          if (errorJson.code === '23505' && errorJson.message.includes('blogs_slug_key')) {
            setError(`Greška: Blog sa istim slug-om već postoji. Pokušajte sa drugačijim naslovom.`)
            toast.error('Blog sa istim slug-om već postoji!')
          } else {
            setError(`HTTP greška: ${response.status} - ${errorJson.message || response.statusText}`)
            toast.error(`HTTP greška: ${response.status}`)
          }
        } catch (parseError) {
          setError(`HTTP greška: ${response.status} - ${response.statusText}`)
          toast.error(`HTTP greška: ${response.status}`)
        }
      }
          } catch (err) {
        console.error('Error submitting blog:', err)
        setError('Greška pri HTTP pozivu')
        toast.error('Greška pri HTTP pozivu')
      } finally {
        setLoading(false)
      }
  }

  const onSubmit = (data: BlogFormData) => {
    submitBlogRawHTTP(data, false) // Save as draft
  }

  const handleCancel = () => {
    executeProtectedAction(() => {
      if (initialData) {
        // Edit mode - restore original data
        if (originalData) {
          form.reset({
            title: originalData.title || '',
            slug: originalData.slug || '',
            content: originalData.content || '',
            excerpt: originalData.excerpt || '',
            image_url: originalData.image_url || '',
            alt_text: originalData.alt_text || '',
            faqSchema: originalData.faq_schema ? JSON.stringify(originalData.faq_schema, null, 2) : '',
            tags: originalData.tags ? originalData.tags.join(', ') : '',
            related_glossary_terms: originalData.related_glossary_terms ? originalData.related_glossary_terms.join(', ') : '',
            author: originalData.author || 'Odontoa Tim',
            author_url: originalData.author_url || 'https://odontoa.com/o-nama',
            meta_description: originalData.meta_description || '',
            featured_image: originalData.featured_image || '',
            featured: originalData.featured || false
          })
          
          // Restore selected tags
          if (originalData.tags && originalData.tags.length > 0) {
            const suggestedTags = originalData.tags.filter(tag => 
              SUGGESTED_BLOG_TAGS.some(suggested => suggested.name === tag)
            )
            setSelectedTags(suggestedTags)
          }
        }
      } else {
        // New blog mode - clear all data
        form.reset({
          title: '',
          slug: '',
          content: '',
          excerpt: '',
          image_url: '',
          alt_text: '',
          faqSchema: '',
          tags: '',
          related_glossary_terms: '',
          author: 'Odontoa Tim',
          author_url: 'https://odontoa.com/o-nama',
          meta_description: '',
          featured_image: '',
          featured: false
        })
        setSelectedTags([])
      }
      
      // Reset dirty state
      setDirty(false)
      
      if (onCancel) {
        onCancel()
      }
    })
  }

  const onPublish = (data: BlogFormData) => {
    // Validate required SEO fields before publishing
    const missingFields = []
    if (!data.meta_description || data.meta_description.length < 10) {
      missingFields.push('Meta opis (najmanje 10 karaktera)')
    }
    if (!data.alt_text || data.alt_text.length < 1) {
      missingFields.push('Alt tekst')
    }
    if (!data.author || data.author.length < 1) {
      missingFields.push('Autor')
    }
    if (!data.author_url || data.author_url.length < 1) {
      missingFields.push('URL autora')
    }
    
    if (missingFields.length > 0) {
      toast.error(
        `Ne možete objaviti blog bez obaveznih SEO polja:\n${missingFields.join('\n')}`,
        { duration: 5000 }
      )
      return
    }
    
    submitBlogRawHTTP(data, true) // Publish immediately
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant={seoScore >= 80 ? "default" : seoScore >= 60 ? "secondary" : "destructive"}>
            <Target className="h-3 w-3 mr-1" />
            SEO: {seoScore}/100
          </Badge>
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            {readingTime} min
          </Badge>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Schema Generation Info */}
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>💡 Za generisanje JSON-LD schema potrebno je popuniti sva obavezna polja:</strong><br />
            Naslov, Slug, Sadržaj, Meta opis, URL slike, Alt tekst, Autor, URL autora
          </AlertDescription>
        </Alert>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 bg-white border border-gray-200 rounded-lg shadow-sm">
            <TabsTrigger value="content" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Sadržaj</span>
              <span className="sm:hidden">Sadržaj</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Globe className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">SEO</span>
              <span className="sm:hidden">SEO</span>
            </TabsTrigger>
            <TabsTrigger value="connections" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Link className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Povezivanje</span>
              <span className="sm:hidden">Link</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Osnovne informacije</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700 flex items-center">
                    Naslov *
                    <HelpTooltip 
                      text={tooltipsData.blog.title.text}
                      icon={tooltipsData.blog.title.icon}
                    />
                  </Label>
                  <Input
                    id="title"
                    {...form.register('title')}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    disabled={loading}
                    className="bg-white border-gray-400 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Unesite naslov bloga"
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-sm font-medium text-gray-700 flex items-center">
                    URL Slug *
                    <HelpTooltip 
                      text={tooltipsData.blog.slug.text}
                      icon={tooltipsData.blog.slug.icon}
                    />
                  </Label>
                  <Input
                    id="slug"
                    {...form.register('slug')}
                    disabled={loading}
                    className="bg-white border-gray-400 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="automatski-generisan-iz-naslova"
                  />
                  {form.formState.errors.slug && (
                    <p className="text-sm text-red-600">{form.formState.errors.slug.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-sm font-medium text-gray-700 flex items-center">
                  Kratki opis * (za UX/lista blogova)
                  <HelpTooltip 
                    text={tooltipsData.blog.excerpt.text}
                    icon={tooltipsData.blog.excerpt.icon}
                  />
                </Label>
                <Textarea
                  id="excerpt"
                  {...form.register('excerpt')}
                  disabled={loading}
                  rows={2}
                  className="bg-white border-gray-400 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Kratak opis koji se prikazuje u listi blogova i karticama"
                />
                <p className="text-xs text-gray-500">
                  💡 Ovo polje se koristi za UX - prikazuje se u listi blogova i karticama
                </p>
                {form.formState.errors.excerpt && (
                  <p className="text-sm text-red-600">{form.formState.errors.excerpt.message}</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Hero Image */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Hero Slika</h3>
              
              <div className="space-y-2">
                <Label htmlFor="image_url" className="text-sm font-medium text-gray-700 flex items-center">
                  Hero slika za blog *
                  <HelpTooltip 
                    text="Hero slika koja se prikazuje na vrhu bloga. Možete uneti URL ili uploadovati sliku sa računara."
                    icon="🖼️"
                  />
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="image_url"
                    {...form.register('image_url')}
                    disabled={loading || uploadLoading}
                    className="bg-white border-gray-400 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 flex-1"
                    placeholder="https://example.com/image.jpg ili kliknite Upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const input = document.createElement('input')
                      input.type = 'file'
                      input.accept = 'image/*'
                      input.onchange = async (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0]
                        if (!file) return
                        
                        if (file) {
                          // Show file info before upload
                          const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
                          console.log(`📁 Selected file: ${file.name} (${fileSizeMB}MB)`)
                          
                          if (file.size > 5 * 1024 * 1024) {
                            toast.error(`Fajl je prevelik (${fileSizeMB}MB). Maksimalna veličina je 5MB.`)
                            return
                          }
                          
                          let fallbackTimeout: NodeJS.Timeout
                          
                          try {
                            console.log('🔄 Setting upload loading to true')
                            setUploadLoading(true)
                            
                            // Fallback timeout to reset loading state if something goes wrong
                            fallbackTimeout = setTimeout(() => {
                              console.log('⚠️ Fallback timeout - resetting loading state')
                              setUploadLoading(false)
                            }, 35000) // 35 seconds (5 seconds more than upload timeout)
                            
                            // Validate file type
                            if (!file.type.startsWith('image/')) {
                              setUploadLoading(false) // Reset loading state immediately
                              throw new Error('Molimo odaberite validnu sliku.')
                            }

                            // Validate file size (minimum 1KB to avoid tiny test images)
                            if (file.size < 1024) {
                              setUploadLoading(false) // Reset loading state immediately
                              throw new Error('Slika je premala. Molimo odaberite veću sliku.')
                            }
                            
                            let fileName = `blog-images/${Date.now()}-${file.name}`
                            
                            // Create FormData for API upload
                            const formData = new FormData()
                            formData.append('file', file)
                            formData.append('folder', 'featured-images')

                            console.log('🚀 Starting upload via API...')
                            
                            const response = await fetch('/api/upload-image', {
                              method: 'POST',
                              body: formData
                            })

                            const result = await response.json()

                            if (!response.ok) {
                              throw new Error(result.error || 'Upload greška')
                            }

                            if (!result.success) {
                              throw new Error(result.error || 'Upload nije uspešan')
                            }

                            form.setValue('image_url', result.url)
                            console.log('✅ Upload successful, URL:', result.url)
                            toast.success('Slika uspešno uploadovana!')
                          } catch (error) {
                            console.error('🔴 Upload error:', error)
                            setUploadLoading(false) // Ensure loading is reset
                            const errorMessage = error instanceof Error ? error.message : 'Greška pri uploadu slike'
                            toast.error(errorMessage)
                          } finally {
                            // Clear fallback timeout
                            clearTimeout(fallbackTimeout)
                            // Double-check loading state is reset
                            setUploadLoading(false)
                            console.log('🔄 Upload loading state reset')
                          }
                        }
                      }
                      input.click()
                      // Clean up input element
                      setTimeout(() => {
                        if (input.parentNode) {
                          input.parentNode.removeChild(input)
                        }
                      }, 1000)
                    }}
                    disabled={uploadLoading}
                    className="whitespace-nowrap"
                  >
                    {uploadLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
                {form.formState.errors.image_url && (
                  <p className="text-sm text-red-600">{form.formState.errors.image_url.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="alt_text" className="text-sm font-medium text-gray-700 flex items-center">
                  Alt Text za sliku *
                  <HelpTooltip 
                    text={tooltipsData.blog.alt_text.text}
                    icon={tooltipsData.blog.alt_text.icon}
                  />
                </Label>
                <Input
                  id="alt_text"
                  {...form.register('alt_text')}
                  disabled={loading}
                  className="bg-white border-gray-400 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Opis slike za pristupačnost i SEO"
                />
                {!form.watch('alt_text') && (
                  <p className="text-sm text-orange-600">⚠️ Dodaj alt tekst za SEO i pristupačnost</p>
                )}
              </div>


            </div>

            <Separator />

            {/* Content Editor */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Sadržaj</h3>
              
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium text-gray-700 flex items-center">
                  Glavni sadržaj * (min 50 karaktera)
                  <HelpTooltip 
                    text={tooltipsData.blog.content.text}
                    icon={tooltipsData.blog.content.icon}
                  />
                </Label>
                <RichTextEditor
                  value={form.watch('content')}
                  onChange={(content) => handleContentChange(content)}
                  placeholder="Napišite glavni sadržaj bloga..."
                  className="min-h-[500px]"
                  blogSlug={form.watch('slug')} // Prosleđujemo slug za organizaciju slika
                />
                {form.formState.errors.content && (
                  <p className="text-sm text-red-600">{form.formState.errors.content.message}</p>
                )}
              </div>
            </div>

            <Separator className="my-2" />

            {/* Author */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Autor</h3>
              
              <div className="space-y-2">
                <Label htmlFor="author" className="text-sm font-medium text-gray-700 flex items-center">
                  Autor *
                  <HelpTooltip 
                    text={tooltipsData.blog.author.text}
                    icon={tooltipsData.blog.author.icon}
                  />
                </Label>
                <Input
                  id="author"
                  {...form.register('author')}
                  disabled={loading}
                  className="bg-white border-gray-400 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ime autora"
                />
                {form.formState.errors.author && (
                  <p className="text-sm text-red-600">{form.formState.errors.author.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="author_url" className="text-sm font-medium text-gray-700 flex items-center">
                  URL autora *
                  <HelpTooltip 
                    text="URL stranice autora (obavezan za JSON-LD schema)"
                    icon="link"
                  />
                </Label>
                <Input
                  id="author_url"
                  {...form.register('author_url')}
                  disabled={loading}
                  className="bg-white border-gray-400 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://odontoa.com/o-nama"
                />
                {form.formState.errors.author_url && (
                  <p className="text-sm text-red-600">{form.formState.errors.author_url.message}</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            {/* SEO Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">SEO Optimizacija</h3>
              
              {/* Info about field separation */}
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Važno:</strong> Meta opis se koristi isključivo za SEO (meta tag, JSON-LD). 
                  Kratki opis (excerpt) se koristi za UX u listi blogova. Ova polja su odvojena za bolju kontrolu.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Label htmlFor="meta_description" className="text-sm font-medium text-gray-700 flex items-center">
                  Meta opis * (150-160 karaktera)
                  <HelpTooltip 
                    text={tooltipsData.blog.meta_description.text}
                    icon={tooltipsData.blog.meta_description.icon}
                  />
                </Label>
                <Textarea
                  id="meta_description"
                  {...form.register('meta_description')}
                  disabled={loading}
                  rows={3}
                  className="bg-white border-gray-400 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Meta opis za pretraživače (meta tag, JSON-LD)"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Trenutno: {form.watch('meta_description').length} karaktera
                  </p>
                  {!form.watch('meta_description') && (
                    <p className="text-xs text-orange-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Meta Description: 0/15 poena u SEO score
                    </p>
                  )}
                </div>
                {form.formState.errors.meta_description && (
                  <p className="text-sm text-red-600">{form.formState.errors.meta_description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    {...form.register('featured')}
                    disabled={loading}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-400 rounded"
                  />
                  <Label htmlFor="featured" className="text-sm font-medium text-gray-700 flex items-center">
                    Istaknuti članak (Featured)
                    <HelpTooltip 
                      text="Istaknuti članak će biti prikazan na vrhu blog stranice kao glavni članak"
                      icon="⭐"
                    />
                  </Label>
                </div>
                {form.watch('featured') && (
                  <p className="text-xs text-blue-600 flex items-center">
                    <Info className="h-3 w-3 mr-1" />
                    Ovaj članak će biti prikazan kao istaknuti na blog stranici
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm font-medium text-gray-700 flex items-center">
                  Kategorije članka
                  <HelpTooltip 
                    text="Izaberite kategorije koje najbolje opisuju sadržaj članka. Ovo će pomoći u preporučivanju sličnih članaka."
                    icon="🏷️"
                  />
                </Label>
                
                {/* Predložene kategorije */}
                <div className="space-y-3">
                  <Label className="text-xs font-medium text-gray-600">
                    Izaberite kategorije:
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {SUGGESTED_BLOG_TAGS.map((tag, index) => (
                      <div
                        key={index}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedTags.includes(tag.name)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-400 bg-white'
                        }`}
                        onClick={() => {
                          const currentTags = form.getValues('tags')
                          const tagsArray = currentTags ? currentTags.split(',').map(t => t.trim()).filter(Boolean) : []
                          
                          if (selectedTags.includes(tag.name)) {
                            // Ukloni tag
                            const newTags = tagsArray.filter(t => t !== tag.name).join(', ')
                            form.setValue('tags', newTags)
                            setSelectedTags(selectedTags.filter(t => t !== tag.name))
                          } else {
                            // Dodaj tag
                            if (!tagsArray.includes(tag.name)) {
                              const newTags = [...tagsArray, tag.name].join(', ')
                              form.setValue('tags', newTags)
                              setSelectedTags([...selectedTags, tag.name])
                            }
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{tag.name}</h4>
                            <p className="text-xs text-gray-600 leading-relaxed">{tag.description}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ml-3 ${
                            selectedTags.includes(tag.name)
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-400'
                          }`}>
                            {selectedTags.includes(tag.name) && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Tag Suggestions */}
                {tagSuggestions.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-600">
                      Dodatni predloženi tagovi:
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {tagSuggestions.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 text-blue-600"
                          onClick={() => {
                            const currentTags = form.getValues('tags')
                            const tagsArray = currentTags ? currentTags.split(',').map(t => t.trim()).filter(Boolean) : []
                            if (!tagsArray.includes(tag)) {
                              const newTags = [...tagsArray, tag].join(', ')
                              form.setValue('tags', newTags)
                              setSelectedTags([...selectedTags, tag])
                            }
                          }}
                        >
                          + {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Selected Tags Display */}
                {selectedTags.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-600">
                      Dodati tagovi:
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="default"
                          className="bg-blue-100 text-blue-800 border-blue-200"
                        >
                          {tag}
                          <X
                            className="h-3 w-3 ml-1 cursor-pointer"
                            onClick={() => {
                              const currentTags = form.getValues('tags')
                              const tagsArray = currentTags ? currentTags.split(',').map(t => t.trim()).filter(Boolean) : []
                              const newTags = tagsArray.filter(t => t !== tag).join(', ')
                              form.setValue('tags', newTags)
                              setSelectedTags(selectedTags.filter(t => t !== tag))
                            }}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* FAQ Schema */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">FAQ Schema</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="faqSchema" className="text-sm font-medium text-gray-700 flex items-center">
                    FAQ JSON Schema
                    <HelpTooltip 
                      text={tooltipsData.blog.faq_schema.text}
                      icon={tooltipsData.blog.faq_schema.icon}
                    />
                  </Label>
                  <Button
                    type="button"
                    onClick={handleGenerateFAQ}
                    disabled={generatingFAQ || loading}
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    {generatingFAQ ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Auto-generiši FAQ
                  </Button>
                </div>
                <Textarea
                  id="faqSchema"
                  {...form.register('faqSchema')}
                  disabled={loading}
                  rows={8}
                  className="bg-white border-gray-400 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
                  placeholder="FAQ JSON Schema..."
                />
              </div>
            </div>

            <Separator />

            {/* SEO Score */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">SEO Analiza</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">SEO Score</span>
                    {seoCalculating ? (
                      <div className="flex items-center">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        <span className="text-xs text-gray-500">Računam...</span>
                      </div>
                    ) : (
                      <Badge variant={seoScore >= 80 ? "default" : seoScore >= 60 ? "secondary" : "destructive"}>
                        {seoScore}/100
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          seoScore >= 80 ? 'bg-green-500' : 
                          seoScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${seoScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Vreme čitanja</span>
                    <Badge variant="outline">
                      {readingTime} min
                    </Badge>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Status</span>
                    <Badge variant="outline">
                      Draft
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Detailed SEO Metrics */}
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">Detaljne metrike</h4>
                {seoCalculating ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="p-3 bg-white border border-gray-200 rounded-lg animate-pulse">
                        <div className="flex items-center justify-between mb-1">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-3 bg-gray-200 rounded w-8"></div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(seoMetrics).map(([key, metric]: [string, any]) => (
                      <div key={key} className="p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {metric.score}/{metric.max}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
                          <div 
                            className={`h-1 rounded-full transition-all duration-300 ${
                              metric.score === metric.max ? 'bg-green-500' : 
                              metric.score > metric.max / 2 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${(metric.score / metric.max) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600">{metric.details}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="connections" className="space-y-6">
            {/* Topic Clustering */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Topic Clustering</h3>
              
              <div className="space-y-2">
                <Label htmlFor="related_glossary_terms" className="text-sm font-medium text-gray-700 flex items-center">
                  Povezani rečnički termini (odvojeni zarezom)
                  <HelpTooltip 
                    text={tooltipsData.blog.related_glossary_terms.text}
                    icon={tooltipsData.blog.related_glossary_terms.icon}
                  />
                </Label>
                <Input
                  id="related_glossary_terms"
                  {...form.register('related_glossary_terms')}
                  disabled={loading}
                  className="bg-white border-gray-400 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="termin1, termin2, termin3"
                />
              </div>

              {/* Topic Suggestions */}
              {topicSuggestions.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Predloženi topic clusteri
                  </Label>
                  <div className="space-y-2">
                    {topicSuggestions.map((suggestion, index) => (
                      <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-blue-900">{suggestion.cluster_name}</span>
                          <Badge variant="outline" className="text-blue-600">
                            {suggestion.score} pts
                          </Badge>
                        </div>
                        <p className="text-sm text-blue-700 mt-1">
                          Ključni pojmovi: {suggestion.keywords.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Content Suggestions */}
              {relatedContent.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Predloženi povezani sadržaj
                  </Label>
                  <div className="space-y-2">
                    {relatedContent.map((item, index) => (
                      <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-green-900">{item.title}</span>
                          <Badge variant="outline" className="text-green-600">
                            {item.relevance_score} pts
                          </Badge>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          Razlog: {item.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Error Display */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6">
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            disabled={loading}
            variant="outline"
            className="border-gray-400 text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {initialData ? 'Sačuvaj izmene' : 'Sačuvaj kao Draft'}
          </Button>
          
          <Button
            type="button"
            onClick={form.handleSubmit(onPublish)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <TrendingUp className="h-4 w-4 mr-2" />
            )}
            {initialData ? 'Objavi izmene' : 'Objavi odmah'}
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Odustani
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}