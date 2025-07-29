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
import { Loader2, Save, BookOpen, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { 
  createSEOSlug, 
  generateMetaDescription, 
  generateSEOKeywords,
  generateStructuredData 
} from '@/lib/utils'

const glossarySchema = z.object({
  term: z.string().min(1, 'Termin je obavezan'),
  slug: z.string().min(1, 'Slug je obavezan'),
  definition: z.string().min(10, 'Definicija mora imati najmanje 10 karaktera'),
  fullArticle: z.string().min(50, 'Članak mora imati najmanje 50 karaktera'),
  faqSchema: z.string().optional(),
  relatedTerms: z.string().optional(),
  published: z.boolean().default(false),
})

type GlossaryFormData = z.infer<typeof glossarySchema>

interface GlossaryFormProps {
  onSuccess?: () => void
}

export const GlossaryForm: React.FC<GlossaryFormProps> = ({ onSuccess }) => {
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
      faqSchema: '',
      relatedTerms: '',
      published: false,
    },
  })

  const generateSlug = (term: string) => {
    return createSEOSlug(term)
  }

  const handleTermChange = (term: string) => {
    form.setValue('term', term)
    if (!form.getValues('slug') || form.getValues('slug') === generateSlug(form.getValues('term'))) {
      form.setValue('slug', generateSlug(term))
    }
  }

  const generateAutoFAQ = async () => {
    const term = form.getValues('term')
    const definition = form.getValues('definition')
    
    if (!term || !definition) {
      toast.error('Unesite termin i definiciju pre generisanja FAQ-a')
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
          },
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
        ]
      }
      
      form.setValue('faqSchema', JSON.stringify(faqData, null, 2))
      toast.success('FAQ automatski generisan!')
    } catch (error) {
      toast.error('Greška pri generisanju FAQ-a')
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
        faq_schema: faqSchemaJson,
        related_terms: relatedTermsArray,
        published: data.published,
      }

      console.log('=== MAKING GLOSSARY RAW HTTP REQUEST ===')
      console.log('Glossary data:', glossaryData)
      console.log('Using session access_token:', session.access_token ? 'present' : 'missing')
      
      const response = await fetch('https://bjbfmddrekjmactytaky.supabase.co/rest/v1/glossary', {
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
    } finally {
      setLoading(false)
      console.log('=== GLOSSARY RAW HTTP SUBMIT END ===')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700">
        <CardHeader className="text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-6 w-6" />
              <CardTitle className="text-2xl font-bold">Kreiranje Rečničkog Termina</CardTitle>
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
                  <Label htmlFor="term" className="text-sm font-medium text-gray-700">
                    Termin *
                  </Label>
                  <Input
                    id="term"
                    {...form.register('term')}
                    onChange={(e) => handleTermChange(e.target.value)}
                    disabled={loading}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500"
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
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500"
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
                  disabled={loading}
                  rows={3}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500"
                  placeholder="Unesite kratku definiciju termina (min 10 karaktera)"
                />
                {form.formState.errors.definition && (
                  <p className="text-sm text-red-600">{form.formState.errors.definition.message}</p>
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
                  disabled={loading}
                  rows={12}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500"
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

            <Separator />

            {/* Related Terms Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Povezani sadržaj</h3>
              
              <div className="space-y-2">
                <Label htmlFor="relatedTerms" className="text-sm font-medium text-gray-700">
                  Povezani termini
                </Label>
                <Input
                  id="relatedTerms"
                  {...form.register('relatedTerms')}
                  disabled={loading}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500"
                  placeholder="termin1, termin2, termin3"
                />
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
                  className="border-green-300 text-green-600 hover:bg-green-50"
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
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500 font-mono text-sm"
                  placeholder="Kliknite 'Auto-generiši FAQ' da se automatski kreira..."
                />
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
                  form.setValue('published', false)
                  form.handleSubmit(
                    (data) => submitGlossaryRawHTTP(data),
                    (errors) => {
                      console.log('Validation errors:', errors)
                      setError('Molimo popunite sva obavezna polja ispravno')
                      toast.error('Molimo popunite sva obavezna polja ispravno')
                    }
                  )()
                }}
                disabled={loading} 
                className="order-2 sm:order-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 font-semibold"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Sačuvaj kao skicu
              </Button>
              
              <Button 
                type="button"
                onClick={() => {
                  form.setValue('published', true)
                  form.handleSubmit(
                    (data) => submitGlossaryRawHTTP(data),
                    (errors) => {
                      console.log('Validation errors:', errors)
                      setError('Molimo popunite sva obavezna polja ispravno')
                      toast.error('Molimo popunite sva obavezna polja ispravno')
                    }
                  )()
                }}
                disabled={loading} 
                className="order-1 sm:order-3 bg-green-600 hover:bg-green-700 text-white px-8 py-3 font-semibold min-w-[160px]"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Objavi Termin
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}