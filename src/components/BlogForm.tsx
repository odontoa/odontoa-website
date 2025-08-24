import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/contexts/AuthContext'
import { useFormDirty } from '@/contexts/FormDirtyContext'
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
  generateCombinedSchema
} from '@/lib/utils'
import { HelpTooltip } from '@/components/ui/tooltip'
import { TopicClusterSuggestions } from '@/components/TopicClusterSuggestions'
import { SEOTestMode } from '@/components/SEOTestMode'
import tooltipsData from '@/data/seo-tooltips.json'
import { supabase } from '@/lib/supabase'

const blogSchema = z.object({
  title: z.string().min(1, 'Naslov je obavezan'),
  slug: z.string().min(1, 'Slug je obavezan'),
  content: z.string().min(50, 'Sadržaj mora imati najmanje 50 karaktera'),
  excerpt: z.string().min(10, 'Kratki opis mora imati najmanje 10 karaktera'),
  image_url: z.string().url('Nevalidna URL adresa').optional().or(z.literal('')),
  alt_text: z.string().optional(),
  faqSchema: z.string().optional(),
  tags: z.string().optional(),
  related_glossary_terms: z.string().optional(),
  author: z.string().min(1, 'Autor je obavezan'),
  meta_description: z.string().min(10, 'Meta opis mora imati najmanje 10 karaktera'),
  featured_image: z.string().url('Nevalidna URL adresa').optional().or(z.literal('')),
})

type BlogFormData = z.infer<typeof blogSchema>

interface BlogFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  initialData?: any
}

export const BlogForm: React.FC<BlogFormProps> = ({ onSuccess, onCancel, initialData }) => {
  const { user, session, isAdmin } = useAuth()
  const { setDirty } = useFormDirty()
  const [loading, setLoading] = useState(false)
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
      meta_description: initialData?.meta_description || '',
      featured_image: initialData?.featured_image || ''
    }
  })

  // Update SEO score when initialData is loaded
  useEffect(() => {
    if (initialData) {
      updateSEOScore()
    }
  }, [initialData])

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
        // Fetch existing content for suggestions
        const { data: existingBlogs } = await supabase
          .from('blogs')
          .select('id, title, slug, tags, content')
          .eq('published', true)
          .limit(20)

        const { data: existingGlossary } = await supabase
          .from('glossary')
          .select('id, term, slug, related_terms, full_article')
          .eq('published', true)
          .limit(20)

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
    
    if (!title) {
      toast.error('Unesite naslov bloga pre generacije schema.')
      return
    }
    
    if (!content || content.length < 50) {
      toast.error('Unesite sadržaj bloga (najmanje 50 karaktera) pre generacije schema.')
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
        
        // Generate combined schema with Article, FAQPage, and WebPage
        const combinedSchema = generateCombinedSchema({
          title,
          content,
          summary: meta_description, // Use meta_description as summary
          author: author || 'Odontoa Tim',
          slug,
          meta_description,
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
      toast.error('Greška pri generisanju FAQ-a')
      console.error('FAQ generation error:', error)
    } finally {
      setGeneratingFAQ(false)
    }
  }

  const submitBlogRawHTTP = async (data: BlogFormData, published: boolean) => {
    console.log('=== RAW HTTP SUBMIT START ===')
    console.log('🔥 PUBLISHED PARAMETER:', published)
    console.log('🔥 PUBLISHED TYPE:', typeof published)
    console.log('🔥 IS DRAFT?:', published === false)
    
    setLoading(true)
    setError('')

    try {
      // Use session from React context instead of Supabase client
      console.log('=== USING CONTEXT SESSION FOR AUTH ===')
      console.log('Session from context:', session)
      console.log('User from context:', user)
      console.log('Is Admin from context:', isAdmin)
      
      if (!session || !user || !isAdmin) {
        setError('Niste ulogovani kao admin')
        toast.error('Niste ulogovani kao admin')
        setLoading(false)
        return
      }

      console.log('=== PREPARING RAW HTTP DATA ===')
      
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

      // Generate combined schema
      const combinedSchema = generateCombinedSchema({
        ...data,
        tags: tagEnhancement.frontendTags.map(tag => tag.name),
        content: data.content,
        created_at: new Date().toISOString(),
        author: data.author,
        slug: data.slug,
        meta_description: data.meta_description,
        image_url: data.image_url,
        featured_image: data.featured_image,
        alt_text: data.alt_text,
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
        published,
        meta_description: data.meta_description,
        featured_image: data.featured_image || null,
        reading_time: readingTime,
        seo_score: seoScore + tagEnhancement.seoScore, // Add tag SEO score
        meta_keywords: tagEnhancement.metaKeywords // Add meta keywords
      }

      console.log('=== MAKING RAW HTTP REQUEST ===')
      console.log('🚀 FINAL BLOG DATA:', blogData)
      console.log('🚀 FINAL PUBLISHED VALUE:', blogData.published)
      console.log('🚀 FINAL PUBLISHED TYPE:', typeof blogData.published)
      console.log('Using session access_token:', session.access_token ? 'present' : 'missing')
      
      const response = await fetch('https://bjbfmddrekjmactytaky.supabase.co/rest/v1/blogs', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqYmZtZGRyZWtqbWFjdHl0YWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDA1NjEsImV4cCI6MjA2OTAxNjU2MX0.jkSPsLNdD1pfm5er4TgHm0T6vVdYaXorlnScFe_X99k',
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(blogData)
      })

      console.log('=== RAW HTTP RESPONSE ===')
      console.log('Status:', response.status)
      console.log('OK:', response.ok)

      if (response.ok) {
        const insertedData = await response.json()
        console.log('=== RAW HTTP SUCCESS ===')
        console.log('Inserted data:', insertedData)
        
        const statusText = published ? 'objavljen' : 'sačuvan kao draft'
        toast.success(`Blog post ${statusText} uspešno!`)
        form.reset()
        window.dispatchEvent(new Event('storage'))
        onSuccess?.()
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
      console.error('=== RAW HTTP SUBMIT ERROR ===', err)
      console.error('Error details:', err)
      setError('Greška pri HTTP pozivu')
      toast.error('Greška pri HTTP pozivu')
    } finally {
      setLoading(false)
      console.log('=== RAW HTTP SUBMIT END ===')
    }
  }

  const onSubmit = (data: BlogFormData) => {
    submitBlogRawHTTP(data, false) // Save as draft
  }

  const onPublish = (data: BlogFormData) => {
    submitBlogRawHTTP(data, true) // Publish immediately
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Kreiraj Novi Blog Post
          </div>
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
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-lg">
            <TabsTrigger value="content" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Sadržaj
            </TabsTrigger>
            <TabsTrigger value="seo" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Globe className="h-4 w-4 mr-2" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="media" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Image className="h-4 w-4 mr-2" />
              Media
            </TabsTrigger>
            <TabsTrigger value="connections" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Link className="h-4 w-4 mr-2" />
              Povezivanje
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Osnovne informacije</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
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
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
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
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
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

            {/* Content Editor */}
            <div className="space-y-4">
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
                />
                {form.formState.errors.content && (
                  <p className="text-sm text-red-600">{form.formState.errors.content.message}</p>
                )}
              </div>
            </div>

            <Separator />

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
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ime autora"
                />
                {form.formState.errors.author && (
                  <p className="text-sm text-red-600">{form.formState.errors.author.message}</p>
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
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
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
                <Label htmlFor="tags" className="text-sm font-medium text-gray-700 flex items-center">
                  Tagovi (odvojeni zarezom)
                  <HelpTooltip 
                    text={tooltipsData.blog.tags.text}
                    icon={tooltipsData.blog.tags.icon}
                  />
                </Label>
                <Input
                  id="tags"
                  {...form.register('tags')}
                  disabled={loading}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="stomatologija, digitalizacija, ordinacija"
                />
                
                {/* Tag Suggestions */}
                {tagSuggestions.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-600">
                      Predloženi tagovi:
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
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
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

          <TabsContent value="media" className="space-y-6">
            {/* Media Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Media i slike</h3>
              
              <div className="space-y-2">
                <Label htmlFor="image_url" className="text-sm font-medium text-gray-700 flex items-center">
                  Featured Image
                  <HelpTooltip 
                    text="Glavna slika za blog. Možete uneti URL ili uploadovati sliku sa računara."
                    icon="🖼️"
                  />
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="image_url"
                    {...form.register('image_url')}
                    disabled={loading || uploadLoading}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 flex-1"
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
                            
                            let fileName = `blog-images/${Date.now()}-${file.name}`
                            
                            // Check if bucket exists first
                            console.log('🔍 Checking if blog-images bucket exists...')
                            const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
                            
                            if (bucketsError) {
                              console.error('🔴 Error checking buckets:', bucketsError)
                              throw new Error('Greška pri proveri storage-a')
                            }
                            
                            const blogImagesBucket = buckets?.find(bucket => bucket.name === 'blog-images')
                            console.log('📦 Available buckets:', buckets?.map(b => b.name))
                            console.log('🎯 Blog-images bucket found:', !!blogImagesBucket)
                            
                            if (!blogImagesBucket) {
                              console.log('⚠️ Blog-images bucket not found, creating...')
                              const { data: newBucket, error: createError } = await supabase.storage.createBucket('blog-images', {
                                public: true,
                                allowedMimeTypes: ['image/*'],
                                fileSizeLimit: 5242880 // 5MB
                              })
                              
                              if (createError) {
                                console.error('🔴 Error creating bucket:', createError)
                                // Try to use existing bucket if available
                                const existingBuckets = buckets?.filter(b => b.public)
                                if (existingBuckets && existingBuckets.length > 0) {
                                  const fallbackBucket = existingBuckets[0]
                                  console.log(`🔄 Using fallback bucket: ${fallbackBucket.name}`)
                                  // Update fileName to use fallback bucket
                                  fileName = `${fallbackBucket.name}/${Date.now()}-${file.name}`
                                } else {
                                  console.error('🔴 No available buckets for fallback')
                                  throw new Error('Greška pri kreiranju storage bucket-a. Molimo kontaktirajte administratora.')
                                }
                              } else {
                                console.log('✅ Blog-images bucket created successfully')
                              }
                            }
                            
                            // Determine bucket name for upload
                            const bucketName = fileName.startsWith('blog-images/') ? 'blog-images' : fileName.split('/')[0]
                            console.log(`📤 Uploading to bucket: ${bucketName}`)
                            
                            // Add timeout for upload (30 seconds)
                            const uploadPromise = supabase.storage
                              .from(bucketName)
                              .upload(fileName, file, {
                                cacheControl: '3600',
                                upsert: false
                              })
                            
                            const timeoutPromise = new Promise((_, reject) => {
                              setTimeout(() => {
                                console.log('⏰ Upload timeout reached')
                                reject(new Error('Upload timeout - pokušajte ponovo'))
                              }, 30000)
                            })
                            
                            console.log('🚀 Starting upload with timeout...')
                            let result: any
                            try {
                              result = await Promise.race([uploadPromise, timeoutPromise])
                            } catch (raceError) {
                              console.error('🔴 Promise.race error:', raceError)
                              throw raceError
                            }
                            const { data, error } = result
                            console.log('✅ Upload completed or timed out')
                            
                            if (error) {
                              console.error('🔴 Supabase upload error:', error)
                              setUploadLoading(false) // Reset loading state immediately
                              if (error.message.includes('already exists')) {
                                throw new Error('Fajl sa istim imenom već postoji. Molimo preimenujte fajl.')
                              } else if (error.message.includes('quota')) {
                                throw new Error('Dostignut je limit za upload. Molimo pokušajte kasnije.')
                              } else if (error.message.includes('file size')) {
                                throw new Error('Fajl je prevelik. Maksimalna veličina je 5MB.')
                              } else if (error.message.includes('timeout')) {
                                throw new Error('Upload timeout - pokušajte ponovo sa manjim fajlom.')
                              } else if (error.message.includes('Bucket not found')) {
                                throw new Error('Storage bucket nije pronađen. Molimo kontaktirajte administratora.')
                              } else if (error.message.includes('bucket')) {
                                throw new Error('Greška sa storage bucket-om. Molimo pokušajte ponovo.')
                              } else {
                                throw new Error(`Upload greška: ${error.message}`)
                              }
                            }
                            
                            const { data: { publicUrl } } = supabase.storage
                              .from(bucketName)
                              .getPublicUrl(fileName)
                            
                            form.setValue('image_url', publicUrl)
                            console.log('✅ Upload successful, URL:', publicUrl)
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
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Opis slike za pristupačnost i SEO"
                />
                {!form.watch('alt_text') && (
                  <p className="text-sm text-orange-600">⚠️ Dodaj alt tekst za SEO i pristupačnost</p>
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
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
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
        <div className="flex items-center justify-end space-x-4 pt-6">
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            disabled={loading}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Sačuvaj kao Draft
          </Button>
          
          <Button
            type="button"
            onClick={form.handleSubmit(onPublish)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <TrendingUp className="h-4 w-4 mr-2" />
            )}
            Objavi odmah
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}