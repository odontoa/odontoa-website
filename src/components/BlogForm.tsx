import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/contexts/AuthContext'
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
  AlertCircle
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
  generateAutoFAQ,
  analyzeContentStructure,
  checkKeywordOptimization
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
  summary: z.string().min(10, 'Sažetak mora imati najmanje 10 karaktera'),
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
}

export const BlogForm: React.FC<BlogFormProps> = ({ onSuccess }) => {
  const { user, session, isAdmin } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatingFAQ, setGeneratingFAQ] = useState(false)
  const [seoScore, setSeoScore] = useState(0)
  const [readingTime, setReadingTime] = useState(0)
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

  // Early auth check
  if (!user || !session || !isAdmin) {
    return (
      <Card className="bg-white border border-red-200">
        <CardContent className="p-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              Morate biti ulogovani kao admin da bi kreirali blog post.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      summary: '',
      image_url: '',
      alt_text: '',
      faqSchema: '',
      tags: '',
      related_glossary_terms: '',
      author: 'Odontoa Tim',
      meta_description: '',
      featured_image: '',
    },
  })

  const generateSlug = (title: string) => {
    return createSEOSlug(title)
  }

  const handleTitleChange = (title: string) => {
    form.setValue('title', title)
    if (!form.getValues('slug') || form.getValues('slug') === generateSlug(form.getValues('title'))) {
      form.setValue('slug', generateSlug(title))
    }
    // Auto-generate SEO-optimized meta description
    if (!form.getValues('meta_description') && title.length > 0) {
      const content = form.getValues('content')
      const description = generateMetaDescription(content || title, title)
      form.setValue('meta_description', description)
    }
    // Auto-generate summary
    if (!form.getValues('summary') && title.length > 0) {
      const content = form.getValues('content')
      const summary = generateMetaDescription(content || title, title, 200)
      form.setValue('summary', summary)
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
    
    // Auto-update meta description if empty
    if (!form.getValues('meta_description') && content.length > 50) {
      const title = form.getValues('title')
      const description = generateMetaDescription(content, title)
      form.setValue('meta_description', description)
    }
    
    // Auto-update summary if empty
    if (!form.getValues('summary') && content.length > 100) {
      const title = form.getValues('title')
      const summary = generateMetaDescription(content, title, 200)
      form.setValue('summary', summary)
    }
    
    updateSEOScore()
    generateTopicSuggestions()
    generateRelatedContent()
  }

  const updateSEOScore = () => {
    const formData = form.getValues()
    const score = calculateSEOScore({
      title: formData.title,
      content: formData.content,
      meta_description: formData.meta_description,
      image_url: formData.image_url,
      alt_text: formData.alt_text,
      faq_schema: formData.faqSchema,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
      related_glossary_terms: formData.related_glossary_terms ? formData.related_glossary_terms.split(',').map(t => t.trim()) : []
    }, 'blog')
    setSeoScore(score)
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
    const summary = form.getValues('summary')
    
    if (!title || !content) {
      toast.error('Unesite naslov i sadržaj pre generisanja FAQ-a')
      return
    }

    setGeneratingFAQ(true)
    try {
      // Enhanced FAQ generation with auto-detection
      const faqSchema = generateAutoFAQ(title, content, summary)
      
      if (faqSchema) {
        form.setValue('faqSchema', JSON.stringify(faqSchema, null, 2))
        toast.success('FAQ schema generisan uspešno')
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

      const blogData = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        summary: data.summary,
        image_url: data.image_url || null,
        alt_text: data.alt_text || null,
        faq_schema: faqSchemaJson,
        tags: tagsArray,
        related_glossary_terms: relatedGlossaryArray,
        author: data.author,
        published,
        meta_description: data.meta_description,
        featured_image: data.featured_image || null,
        reading_time: readingTime,
        seo_score: seoScore,
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
                <Label htmlFor="summary" className="text-sm font-medium text-gray-700 flex items-center">
                  Sažetak * (SEO optimizovan)
                  <HelpTooltip 
                    text={tooltipsData.blog.summary.text}
                    icon={tooltipsData.blog.summary.icon}
                  />
                </Label>
                <Textarea
                  id="summary"
                  {...form.register('summary')}
                  disabled={loading}
                  rows={3}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Kratak sažetak za SEO i društvene mreže (150-200 karaktera)"
                />
                <p className="text-xs text-gray-500">
                  Trenutno: {form.watch('summary').length} karaktera
                </p>
                {form.formState.errors.summary && (
                  <p className="text-sm text-red-600">{form.formState.errors.summary.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-sm font-medium text-gray-700 flex items-center">
                  Kratki opis * (za listu blogova)
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
                  placeholder="Kratak opis koji se prikazuje u listi blogova"
                />
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
                  placeholder="Meta opis za pretraživače"
                />
                <p className="text-xs text-gray-500">
                  Trenutno: {form.watch('meta_description').length} karaktera
                </p>
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
                    <Badge variant={seoScore >= 80 ? "default" : seoScore >= 60 ? "secondary" : "destructive"}>
                      {seoScore}/100
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
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
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            {/* Media Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Media i slike</h3>
              
              <div className="space-y-2">
                <Label htmlFor="image_url" className="text-sm font-medium text-gray-700 flex items-center">
                  Featured Image URL
                  <HelpTooltip 
                    text={tooltipsData.blog.image_url.text}
                    icon={tooltipsData.blog.image_url.icon}
                  />
                </Label>
                <Input
                  id="image_url"
                  {...form.register('image_url')}
                  disabled={loading}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                {form.formState.errors.image_url && (
                  <p className="text-sm text-red-600">{form.formState.errors.image_url.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="alt_text" className="text-sm font-medium text-gray-700 flex items-center">
                  Alt Text za sliku
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
                  placeholder="Opis slike za pristupačnost"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="featured_image" className="text-sm font-medium text-gray-700 flex items-center">
                  Legacy Featured Image (za kompatibilnost)
                  <HelpTooltip 
                    text={tooltipsData.blog.featured_image.text}
                    icon={tooltipsData.blog.featured_image.icon}
                  />
                </Label>
                <Input
                  id="featured_image"
                  {...form.register('featured_image')}
                  disabled={loading}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://example.com/legacy-image.jpg"
                />
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