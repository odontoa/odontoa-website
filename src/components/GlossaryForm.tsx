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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Loader2, 
  Save, 
  BookOpen, 
  Sparkles, 
  Globe, 
  Target,
  Clock,
  AlertCircle,
  TrendingUp,
  Link,
  Info,
  Upload,
  Image,
  X
} from 'lucide-react'
import { toast } from 'sonner'
import { 
  createSEOSlug, 
  generateMetaDescription, 
  generateSEOKeywords,
  generateStructuredData,
  calculateReadingTime,
  calculateSEOScore,
  generateTopicClusterSuggestions,
  suggestRelatedContent
} from '@/lib/utils'
import { buildCombinedSchema } from '@/lib/schema/buildJsonLd'
import { supabase } from '@/lib/supabase'

const glossarySchema = z.object({
  term: z.string().min(1, 'Termin je obavezan'),
  slug: z.string().min(1, 'Slug je obavezan'),
  definition: z.string().min(10, 'Definicija mora imati najmanje 10 karaktera'),
  fullArticle: z.string().min(50, 'Članak mora imati najmanje 50 karaktera'),
  why_it_matters: z.string().optional(),
  related_blog_posts: z.string().optional(),
  faqSchema: z.string().optional(),
  relatedTerms: z.string().optional(),
  category: z.string().optional(),
  difficulty_level: z.string().default('beginner'),
  author: z.string().min(1, 'Autor je obavezan'),
  author_url: z.string().url('Nevalidna URL adresa').min(1, 'URL autora je obavezan'),
  image_url: z.string().url('Nevalidna URL adresa').min(1, 'URL slike je obavezan'),
  alt_text: z.string().min(1, 'Alt tekst je obavezan'),
  meta_description: z.string().min(10, 'Meta opis mora imati najmanje 10 karaktera'),
  published: z.boolean().default(false),
})

type GlossaryFormData = z.infer<typeof glossarySchema>

interface GlossaryFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export const GlossaryForm: React.FC<GlossaryFormProps> = ({ onSuccess, onCancel }) => {
  const { user, session, isAdmin } = useAuth()
  const { setDirty } = useFormDirty()
  const { executeProtectedAction } = useProtectedAction()
  const [loading, setLoading] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatingFAQ, setGeneratingFAQ] = useState(false)
  const [seoScore, setSeoScore] = useState(0)
  const [readingTime, setReadingTime] = useState(0)
  const [topicSuggestions, setTopicSuggestions] = useState<any[]>([])
  const [relatedContent, setRelatedContent] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('content')

  // Early auth check
  if (!user || !session || !isAdmin) {
    return (
      <Card className="bg-white border border-red-200">
        <CardContent className="p-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              Morate biti ulogovani kao admin da bi kreirali rečnički termin.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const form = useForm<GlossaryFormData>({
    resolver: zodResolver(glossarySchema),
    defaultValues: {
      term: '',
      slug: '',
      definition: '',
      fullArticle: '',
      why_it_matters: '',
      related_blog_posts: '',
      faqSchema: '',
      relatedTerms: '',
      category: '',
      difficulty_level: 'beginner',
      author: 'Odontoa Tim',
      author_url: 'https://odontoa.com/o-nama',
      image_url: '',
      alt_text: '',
      meta_description: '',
      published: false,
    },
  })

  // Track form dirty state for unsaved changes protection
  useEffect(() => {
    const subscription = form.watch(() => {
      setDirty(form.formState.isDirty)
    })
    
    return () => subscription.unsubscribe()
  }, [form.watch, form.formState.isDirty, setDirty])

  // Setup beforeunload protection
  useBeforeUnload(form.formState.isDirty)

  const generateSlug = (term: string) => {
    return createSEOSlug(term)
  }

  const handleTermChange = (term: string) => {
    form.setValue('term', term)
    if (!form.getValues('slug') || form.getValues('slug') === generateSlug(form.getValues('term'))) {
      form.setValue('slug', generateSlug(term))
    }
    updateSEOScore()
  }

  const handleDefinitionChange = (definition: string) => {
    form.setValue('definition', definition)
    
    // Auto-update reading time
    const time = calculateReadingTime(definition)
    setReadingTime(time)
    
    updateSEOScore()
    generateTopicSuggestions()
    generateRelatedContent()
  }

  const handleFullArticleChange = (fullArticle: string) => {
    form.setValue('fullArticle', fullArticle)
    
    // Auto-update reading time
    const time = calculateReadingTime(fullArticle)
    setReadingTime(time)
    
    updateSEOScore()
    generateTopicSuggestions()
    generateRelatedContent()
  }

  const updateSEOScore = () => {
    const formData = form.getValues()
    const seoResult = calculateSEOScore({
      term: formData.term,
      definition: formData.definition,
      full_article: formData.fullArticle,
      faq_schema: formData.faqSchema,
      related_terms: formData.relatedTerms ? formData.relatedTerms.split(',').map(t => t.trim()) : [],
      category: formData.category,
      difficulty_level: formData.difficulty_level
    })
    setSeoScore(seoResult.score)
  }

  const generateTopicSuggestions = async () => {
    const formData = form.getValues()
    if (formData.fullArticle && formData.term) {
      const tags = formData.relatedTerms ? formData.relatedTerms.split(',').map(t => t.trim()) : []
      const suggestions = generateTopicClusterSuggestions(formData.fullArticle, formData.term, tags)
      setTopicSuggestions(suggestions)
    }
  }

  const generateRelatedContent = async () => {
    const formData = form.getValues()
    if (formData.fullArticle) {
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

        const tags = formData.relatedTerms ? formData.relatedTerms.split(',').map(t => t.trim()) : []
        const suggestions = suggestRelatedContent(formData.fullArticle, tags, allContent)
        setRelatedContent(suggestions)
      } catch (error) {
        console.error('Error generating related content:', error)
      }
    }
  }

  const generateAutoFAQ = async () => {
    const term = form.getValues('term')
    const definition = form.getValues('definition')
    const whyItMatters = form.getValues('why_it_matters')
    const fullArticle = form.getValues('fullArticle')
    const meta_description = form.getValues('meta_description')
    const author = form.getValues('author')
    const author_url = form.getValues('author_url')
    const slug = form.getValues('slug')
    const image_url = form.getValues('image_url')
    const alt_text = form.getValues('alt_text')
    
    // Validate all required fields before generating schema
    const missingFields = []
    if (!term) missingFields.push('Termin')
    if (!definition) missingFields.push('Definicija')
    if (!fullArticle || fullArticle.length < 50) missingFields.push('Članak (najmanje 50 karaktera)')
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
      const faqData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `Šta je ${term}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": definition
            }
          }
        ]
      }

      // Add why it matters question if available
      if (whyItMatters) {
        faqData.mainEntity.push({
          "@type": "Question",
          "name": `Zašto je ${term} važan?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": whyItMatters
          }
        })
      }

      // Add common questions
      faqData.mainEntity.push(
        {
          "@type": "Question", 
          "name": `Kada se koristi ${term}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Detaljne informacije o upotrebi možete pronaći u našem stomatološkom vodiču."
          }
        },
        {
          "@type": "Question",
          "name": `Da li je ${term} bezbedno?`,
          "acceptedAnswer": {
            "@type": "Answer", 
            "text": "Da, svi naši postupci su bezbedni i odobreni od strane relevantnih medicinskih institucija."
          }
        }
      )
      
      // Generate enhanced combined schema with all 4 required objects
      const combinedSchema = buildCombinedSchema({
        term,
        description: definition,
        content: form.getValues('fullArticle'),
        meta_description: form.getValues('meta_description'),
        author: form.getValues('author'),
        author_url: form.getValues('author_url'),
        slug: form.getValues('slug'),
        image_url: form.getValues('image_url'),
        alt_text: form.getValues('alt_text'),
        created_at: new Date().toISOString(),
        faq_schema: faqData,
        category: form.getValues('category'),
        difficulty_level: form.getValues('difficulty_level'),
        why_it_matters: whyItMatters
      }, 'glossary')
      
      form.setValue('faqSchema', JSON.stringify(combinedSchema, null, 2))
      toast.success('Kombinovana schema (WebPage + BreadcrumbList + Article + FAQPage) generisana uspešno!')
      updateSEOScore()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Nepoznata greška'
      toast.error(`Greška pri generisanju schema: ${errorMessage}`)
      console.error('FAQ generation error:', error)
    } finally {
      setGeneratingFAQ(false)
    }
  }

  const submitGlossaryRawHTTP = async (data: GlossaryFormData) => {
    console.log('=== GLOSSARY RAW HTTP SUBMIT START ===')
    
    setLoading(true)
    setError('')

    try {
      // Use session from React context
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

      console.log('=== PREPARING GLOSSARY RAW HTTP DATA ===')
      
      const relatedTermsArray = data.relatedTerms ? data.relatedTerms.split(',').map(term => term.trim()).filter(Boolean) : []
      const relatedBlogPostsArray = data.related_blog_posts ? data.related_blog_posts.split(',').map(post => post.trim()).filter(Boolean) : []
      
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

      const glossaryData = {
        term: data.term,
        slug: data.slug,
        definition: data.definition,
        full_article: data.fullArticle,
        why_it_matters: data.why_it_matters || null,
        related_blog_posts: relatedBlogPostsArray,
        faq_schema: faqSchemaJson,
        related_terms: relatedTermsArray,
        category: data.category || null,
        difficulty_level: data.difficulty_level,
        author: data.author,
        author_url: data.author_url,
        image_url: data.image_url,
        alt_text: data.alt_text,
        meta_description: data.meta_description,
        published: data.published,
        reading_time: readingTime,
        seo_score: seoScore,
      }

      console.log('=== MAKING GLOSSARY RAW HTTP REQUEST ===')
      console.log('Glossary data:', glossaryData)
      console.log('Using session access_token:', session.access_token ? 'present' : 'missing')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/glossary`, {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqYmZtZGRyZWtqbWFjdHl0YWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDA1NjEsImV4cCI6MjA2OTAxNjU2MX0.jkSPsLNdD1pfm5er4TgHm0T6vVdYaXorlnScFe_X99k',
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(glossaryData)
      })

      console.log('=== GLOSSARY RAW HTTP RESPONSE ===')
      console.log('Status:', response.status)
      console.log('OK:', response.ok)

      if (response.ok) {
        const insertedData = await response.json()
        console.log('=== GLOSSARY RAW HTTP SUCCESS ===')
        console.log('Inserted data:', insertedData)
        
        toast.success('Rečnički termin uspešno kreiran!')
        form.reset()
        window.dispatchEvent(new Event('storage'))
        onSuccess?.()
      } else {
        const errorData = await response.text()
        console.error('=== GLOSSARY RAW HTTP ERROR ===')
        console.error('Error data:', errorData)
        setError(`HTTP greška: ${response.status} - ${response.statusText}`)
        toast.error(`HTTP greška: ${response.status}`)
      }
    } catch (err) {
      console.error('=== GLOSSARY RAW HTTP SUBMIT ERROR ===', err)
      console.error('Error details:', err)
      setError('Greška pri HTTP pozivu')
      toast.error('Greška pri HTTP pozivu')
      // Don't call onSuccess on error
    } finally {
      setLoading(false)
      console.log('=== GLOSSARY RAW HTTP SUBMIT END ===')
    }
  }

  const onSubmit = (data: GlossaryFormData) => {
    submitGlossaryRawHTTP(data)
  }

  const handleCancel = () => {
    executeProtectedAction(() => {
      // GlossaryForm is always in create mode - clear all data
      form.reset({
        term: '',
        slug: '',
        definition: '',
        fullArticle: '',
        why_it_matters: '',
        related_blog_posts: '',
        faqSchema: '',
        relatedTerms: '',
        category: '',
        difficulty_level: 'beginner',
        author: 'Odontoa Tim',
        author_url: 'https://odontoa.com/o-nama',
        image_url: '',
        alt_text: '',
        meta_description: '',
        published: false
      })
      
      // Reset dirty state
      setDirty(false)
      
      if (onCancel) {
        onCancel()
      }
    })
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
            Kreiraj Novi Rečnički Termin
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
        {/* Schema Generation Info */}
        <Alert className="border-purple-200 bg-purple-50 mb-6">
          <Info className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-800">
            <strong>💡 Za generisanje JSON-LD schema potrebno je popuniti sva obavezna polja:</strong><br />
            Termin, Slug, Definicija, Članak, Meta opis, URL slike, Alt tekst, Autor, URL autora
          </AlertDescription>
        </Alert>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-lg">
            <TabsTrigger value="content" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <BookOpen className="h-4 w-4 mr-2" />
              Sadržaj
            </TabsTrigger>
            <TabsTrigger value="seo" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Globe className="h-4 w-4 mr-2" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="context" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Info className="h-4 w-4 mr-2" />
              Kontekst
            </TabsTrigger>
            <TabsTrigger value="connections" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
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
                  <Label htmlFor="term" className="text-sm font-medium text-gray-700">
                    Termin *
                  </Label>
                  <Input
                    id="term"
                    {...form.register('term')}
                    onChange={(e) => handleTermChange(e.target.value)}
                    disabled={loading}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Unesite stomatološki termin"
                  />
                  {form.formState.errors.term && (
                    <p className="text-sm text-red-600">{form.formState.errors.term.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-sm font-medium text-gray-700">
                    URL Slug *
                  </Label>
                  <Input
                    id="slug"
                    {...form.register('slug')}
                    disabled={loading}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="automatski-generisan-iz-termina"
                  />
                  {form.formState.errors.slug && (
                    <p className="text-sm text-red-600">{form.formState.errors.slug.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="definition" className="text-sm font-medium text-gray-700">
                  Kratka definicija * (min 10 karaktera)
                </Label>
                <Textarea
                  id="definition"
                  {...form.register('definition')}
                  onChange={(e) => handleDefinitionChange(e.target.value)}
                  disabled={loading}
                  rows={3}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Unesite kratku definiciju termina (min 10 karaktera)"
                />
                {form.formState.errors.definition && (
                  <p className="text-sm text-red-600">{form.formState.errors.definition.message}</p>
                )}
              </div>

              {/* Required fields for JSON-LD schema */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author" className="text-sm font-medium text-gray-700">
                    Autor *
                  </Label>
                  <Input
                    id="author"
                    {...form.register('author')}
                    disabled={loading}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Odontoa Tim"
                  />
                  {form.formState.errors.author && (
                    <p className="text-sm text-red-600">{form.formState.errors.author.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author_url" className="text-sm font-medium text-gray-700">
                    URL autora *
                  </Label>
                  <Input
                    id="author_url"
                    {...form.register('author_url')}
                    disabled={loading}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="https://odontoa.com/o-nama"
                  />
                  {form.formState.errors.author_url && (
                    <p className="text-sm text-red-600">{form.formState.errors.author_url.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image_url" className="text-sm font-medium text-gray-700">
                    URL slike *
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="image_url"
                      {...form.register('image_url')}
                      disabled={loading || uploadLoading}
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 flex-1"
                      placeholder="https://odontoa.com/images/termin-slika.jpg ili kliknite Upload"
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
                            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
                            console.log(`📁 Selected glossary image: ${file.name} (${fileSizeMB}MB)`)
                            
                            if (file.size > 5 * 1024 * 1024) {
                              toast.error(`Fajl je prevelik (${fileSizeMB}MB). Maksimalna veličina je 5MB.`)
                              return
                            }
                            
                            try {
                              setUploadLoading(true)
                              
                              if (!file.type.startsWith('image/')) {
                                throw new Error('Molimo odaberite validnu sliku.')
                              }

                              if (file.size < 1024) {
                                throw new Error('Slika je premala. Molimo odaberite veću sliku.')
                              }
                              
                              // Create FormData for API upload - glossary images go to glossary folder
                              const formData = new FormData()
                              formData.append('file', file)
                              formData.append('folder', 'glossary')

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
                              console.log('✅ Glossary image upload successful, URL:', result.url)
                              toast.success('Slika za glossary uspešno uploadovana!')
                            } catch (error) {
                              console.error('🔴 Glossary image upload error:', error)
                              const errorMessage = error instanceof Error ? error.message : 'Greška pri uploadu slike'
                              toast.error(errorMessage)
                            } finally {
                              setUploadLoading(false)
                            }
                          }
                        }
                        input.click()
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
                  <p className="text-xs text-gray-500">
                    💡 Slika se automatski čuva u "glossary" folderu i može se koristiti za rečničke termine
                  </p>
                  {form.formState.errors.image_url && (
                    <p className="text-sm text-red-600">{form.formState.errors.image_url.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alt_text" className="text-sm font-medium text-gray-700">
                    Alt tekst slike *
                  </Label>
                  <Input
                    id="alt_text"
                    {...form.register('alt_text')}
                    disabled={loading}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Opis slike za pristupačnost"
                  />
                  {form.formState.errors.alt_text && (
                    <p className="text-sm text-red-600">{form.formState.errors.alt_text.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description" className="text-sm font-medium text-gray-700">
                  Meta opis * (150-160 karaktera)
                </Label>
                <Textarea
                  id="meta_description"
                  {...form.register('meta_description')}
                  disabled={loading}
                  rows={3}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Meta opis za pretraživače (obavezan za JSON-LD schema)"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Trenutno: {form.watch('meta_description').length} karaktera
                  </p>
                </div>
                {form.formState.errors.meta_description && (
                  <p className="text-sm text-red-600">{form.formState.errors.meta_description.message}</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Content Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Detaljni sadržaj</h3>
              
              <div className="space-y-2">
                <Label htmlFor="fullArticle" className="text-sm font-medium text-gray-700">
                  Detaljni članak * (min 50 karaktera)
                </Label>
                <Textarea
                  id="fullArticle"
                  {...form.register('fullArticle')}
                  onChange={(e) => handleFullArticleChange(e.target.value)}
                  disabled={loading}
                  rows={12}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Unesite detaljni članak o terminu (minimum 50 karaktera)"
                />
                {form.formState.errors.fullArticle && (
                  <p className="text-sm text-red-600">{form.formState.errors.fullArticle.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  Trenutno: {form.watch('fullArticle').length} karaktera
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            {/* FAQ Schema */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">FAQ Schema</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="faqSchema" className="text-sm font-medium text-gray-700">
                    FAQ JSON Schema
                  </Label>
                  <Button
                    type="button"
                    onClick={generateAutoFAQ}
                    disabled={generatingFAQ || loading}
                    variant="outline"
                    size="sm"
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
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
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 font-mono text-sm"
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

          <TabsContent value="context" className="space-y-6">
            {/* Context Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Kontekst i kategorizacija</h3>
              
              <div className="space-y-2">
                <Label htmlFor="why_it_matters" className="text-sm font-medium text-gray-700">
                  Zašto je važno?
                </Label>
                <Textarea
                  id="why_it_matters"
                  {...form.register('why_it_matters')}
                  disabled={loading}
                  rows={4}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Objašnjenje zašto je ovaj termin važan u stomatologiji..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                    Kategorija
                  </Label>
                  <Select
                    value={form.watch('category')}
                    onValueChange={(value) => form.setValue('category', value)}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Izaberite kategoriju" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="digitalna-stomatologija">Digitalna Stomatologija</SelectItem>
                      <SelectItem value="upravljanje-ordinacijom">Upravljanje Ordinacijom</SelectItem>
                      <SelectItem value="preventivna-stomatologija">Preventivna Stomatologija</SelectItem>
                      <SelectItem value="estetska-stomatologija">Estetska Stomatologija</SelectItem>
                      <SelectItem value="implantologija">Implantologija</SelectItem>
                      <SelectItem value="ortodontija">Ortodontija</SelectItem>
                      <SelectItem value="hirurgija">Hirurgija</SelectItem>
                      <SelectItem value="endodoncija">Endodoncija</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty_level" className="text-sm font-medium text-gray-700">
                    Nivo težine
                  </Label>
                  <Select
                    value={form.watch('difficulty_level')}
                    onValueChange={(value) => form.setValue('difficulty_level', value)}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Izaberite nivo težine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Početnik</SelectItem>
                      <SelectItem value="intermediate">Srednji nivo</SelectItem>
                      <SelectItem value="advanced">Napredni</SelectItem>
                      <SelectItem value="expert">Ekspert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="connections" className="space-y-6">
            {/* Related Terms */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Povezani sadržaj</h3>
              
              <div className="space-y-2">
                <Label htmlFor="relatedTerms" className="text-sm font-medium text-gray-700">
                  Povezani termini (odvojeni zarezom)
                </Label>
                <Input
                  id="relatedTerms"
                  {...form.register('relatedTerms')}
                  disabled={loading}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="termin1, termin2, termin3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="related_blog_posts" className="text-sm font-medium text-gray-700">
                  Povezani blog postovi (slug-ovi odvojeni zarezom)
                </Label>
                <Input
                  id="related_blog_posts"
                  {...form.register('related_blog_posts')}
                  disabled={loading}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="blog-slug-1, blog-slug-2"
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
                      <div key={index} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-purple-900">{suggestion.cluster_name}</span>
                          <Badge variant="outline" className="text-purple-600">
                            {suggestion.score} pts
                          </Badge>
                        </div>
                        <p className="text-sm text-purple-700 mt-1">
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
          {onCancel && (
            <Button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-2" />
              Odustani
            </Button>
          )}
          
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Kreiraj Termin
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}