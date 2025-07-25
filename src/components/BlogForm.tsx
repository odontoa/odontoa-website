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
import { Loader2, Save, Sparkles, FileText, Globe } from 'lucide-react'
import { toast } from 'sonner'
import { RichTextEditor } from './RichTextEditor'
import { FAQGenerator } from '@/lib/faqGenerator'
import { LLMSService } from '@/lib/llms'

const blogSchema = z.object({
  title: z.string().min(1, 'Naslov je obavezan'),
  slug: z.string().min(1, 'Slug je obavezan'),
  content: z.string().min(50, 'Sadržaj mora imati najmanje 50 karaktera'),
  excerpt: z.string().min(10, 'Kratki opis mora imati najmanje 10 karaktera'),
  faqSchema: z.string().optional(),
  tags: z.string().optional(),
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
      faqSchema: '',
      tags: '',
      author: 'Odontoa Tim',
      meta_description: '',
      featured_image: '',
    },
  })

  const generateSlug = (title: string) => {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 50)
    
    // Add timestamp to make it unique
    const timestamp = Date.now()
    return `${baseSlug}-${timestamp}`
  }

  const handleTitleChange = (title: string) => {
    form.setValue('title', title)
    if (!form.getValues('slug') || form.getValues('slug') === generateSlug(form.getValues('title'))) {
      form.setValue('slug', generateSlug(title))
    }
    // Auto-generate meta description from title
    if (!form.getValues('meta_description') && title.length > 0) {
      form.setValue('meta_description', `${title} - Odontoa blog post o stomatologiji i digitalnoj ordinaciji.`)
    }
  }

  const generateAutoFAQ = async () => {
    const title = form.getValues('title')
    const content = form.getValues('content')
    
    if (!title || !content) {
      toast.error('Unesite naslov i sadržaj pre generisanja FAQ-a')
      return
    }

    setGeneratingFAQ(true)
    try {
      // Use the enhanced FAQ generator
      const faqSchema = FAQGenerator.generateFromContent(title, content)
      const formattedSchema = FAQGenerator.formatFAQSchema(faqSchema)
      
      form.setValue('faqSchema', formattedSchema)
      toast.success(`FAQ automatski generisan sa ${faqSchema.mainEntity.length} pitanja!`)
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
        faq_schema: faqSchemaJson,
        tags: tagsArray,
        author: data.author,
        published,
        meta_description: data.meta_description,
        featured_image: data.featured_image || null,
      }

      console.log('=== MAKING RAW HTTP REQUEST ===')
      console.log('🚀 FINAL BLOG DATA:', blogData)
      console.log('🚀 FINAL PUBLISHED VALUE:', blogData.published)
      console.log('🚀 FINAL PUBLISHED TYPE:', typeof blogData.published)

      // Update llms.txt if publishing
      if (published) {
        try {
          await LLMSService.updateLLMSFile()
          console.log('✅ LLMS.txt updated successfully')
        } catch (error) {
          console.error('❌ Error updating LLMS.txt:', error)
          // Don't fail the blog submission if LLMS update fails
        }
      }
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700">
        <CardHeader className="text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6" />
              <CardTitle className="text-2xl font-bold">Kreiranje Blog Posta</CardTitle>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Form */}
      <Card className="border-0 shadow-lg bg-white">
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Validation Errors Display */}
            {Object.keys(form.formState.errors).length > 0 && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-800">
                  <div className="font-semibold mb-2">Ispravite sledeće greške:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(form.formState.errors).map(([key, error]) => (
                      <li key={key}>{error?.message}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Basic Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Osnovne informacije</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Naslov *
                  </Label>
                  <Input
                    id="title"
                    {...form.register('title')}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    disabled={loading}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Unesite naslov blog posta"
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
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
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="automatski-generisan-iz-naslova"
                  />
                  {form.formState.errors.slug && (
                    <p className="text-sm text-red-600">{form.formState.errors.slug.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-sm font-medium text-gray-700">
                  Kratki opis * (min 10 karaktera)
                </Label>
                <Textarea
                  id="excerpt"
                  {...form.register('excerpt')}
                  disabled={loading}
                  rows={3}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Unesite kratki opis blog posta (min 10 karaktera)"
                />
                {form.formState.errors.excerpt && (
                  <p className="text-sm text-red-600">{form.formState.errors.excerpt.message}</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Content Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Sadržaj</h3>
              
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium text-gray-700">
                  Glavni sadržaj * (min 50 karaktera)
                </Label>
                <RichTextEditor
                  value={form.watch('content')}
                  onChange={(value) => form.setValue('content', value)}
                  placeholder="Unesite glavni sadržaj blog posta (minimum 50 karaktera)"
                  className="min-h-[400px]"
                />
                {form.formState.errors.content && (
                  <p className="text-sm text-red-600">{form.formState.errors.content.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  Trenutno: {form.watch('content').length} karaktera
                </p>
              </div>
            </div>

            <Separator />

            {/* SEO Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">SEO & Meta podaci</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_description" className="text-sm font-medium text-gray-700">
                    Meta opis * (min 10 karaktera)
                  </Label>
                  <Textarea
                    id="meta_description"
                    {...form.register('meta_description')}
                    disabled={loading}
                    rows={3}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Meta opis za search engine (min 10 karaktera)"
                  />
                  {form.formState.errors.meta_description && (
                    <p className="text-sm text-red-600">{form.formState.errors.meta_description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-sm font-medium text-gray-700">
                    Tagovi
                  </Label>
                  <Input
                    id="tags"
                    {...form.register('tags')}
                    disabled={loading}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="featured_image" className="text-sm font-medium text-gray-700">
                  Featured slika (URL)
                </Label>
                <Input
                  id="featured_image"
                  {...form.register('featured_image')}
                  disabled={loading}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                {form.formState.errors.featured_image && (
                  <p className="text-sm text-red-600">{form.formState.errors.featured_image.message}</p>
                )}
              </div>
            </div>

            <Separator />

            {/* FAQ Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">FAQ Schema</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateAutoFAQ}
                  disabled={generatingFAQ || loading}
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  {generatingFAQ && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Sparkles className="mr-2 h-4 w-4" />
                  Auto-generiši FAQ
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="faqSchema" className="text-sm font-medium text-gray-700">
                  FAQ JSON Schema
                </Label>
                <Textarea
                  id="faqSchema"
                  {...form.register('faqSchema')}
                  disabled={loading}
                  rows={8}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
                  placeholder="Kliknite 'Auto-generiši FAQ' da se automatski kreira..."
                />
              </div>
            </div>

            <Separator />

            {/* Author Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Autor</h3>
              
              <div className="space-y-2">
                <Label htmlFor="author" className="text-sm font-medium text-gray-700">
                  Autor *
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

            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => form.reset()}
                disabled={loading}
                className="order-3 sm:order-1 border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Poništi
              </Button>
              
              <Button 
                type="button"
                onClick={() => {
                  console.log('🔥 DRAFT BUTTON CLICKED!')
                  const formData = form.getValues()
                  console.log('🔥 FORM DATA BEFORE SUBMIT:', formData)
                  form.handleSubmit(
                    (data) => {
                      console.log('🔥 CALLING submitBlogRawHTTP with published=FALSE')
                      return submitBlogRawHTTP(data, false)
                    },
                    (errors) => {
                      console.log('🔥 FORM VALIDATION ERRORS:', errors)
                      setError('Molimo popunite sva obavezna polja ispravno')
                      toast.error('Molimo popunite sva obavezna polja ispravno')
                    }
                  )()
                }}
                disabled={loading} 
                variant="outline"
                className="order-1 sm:order-2 border-yellow-300 text-yellow-700 hover:bg-yellow-50 px-8 py-3 font-semibold min-w-[160px]"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Sačuvaj kao Draft
              </Button>
              
              <Button 
                type="button"
                onClick={() => {
                  console.log('🚀 PUBLISH BUTTON CLICKED!')
                  const formData = form.getValues()
                  console.log('🚀 FORM DATA BEFORE SUBMIT:', formData)
                  form.handleSubmit(
                    (data) => {
                      console.log('🚀 CALLING submitBlogRawHTTP with published=TRUE')
                      return submitBlogRawHTTP(data, true)
                    },
                    (errors) => {
                      console.log('🚀 FORM VALIDATION ERRORS:', errors)
                      setError('Molimo popunite sva obavezna polja ispravno')
                      toast.error('Molimo popunite sva obavezna polja ispravno')
                    }
                  )()
                }}
                disabled={loading} 
                className="order-2 sm:order-3 bg-green-600 hover:bg-green-700 text-white px-8 py-3 font-semibold min-w-[160px]"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Globe className="mr-2 h-4 w-4" />
                Objavi odmah
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}