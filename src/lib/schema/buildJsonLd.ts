import { validateISO8601Date, validateAbsoluteUrl, validateSchemaData } from './validators'

export interface SchemaData {
  // Common fields
  title?: string
  term?: string
  slug: string
  description?: string
  meta_description?: string
  image_url?: string
  alt_text?: string
  author?: string
  author_url?: string
  created_at?: string
  updated_at?: string
  last_modified?: string
  content?: string
  full_article?: string
  faq_schema?: any
  tags?: string[]
  category?: string
  difficulty_level?: string
  reading_time?: number
  seo_score?: number
  related_terms?: string[]
  related_blog_posts?: string[]
  why_it_matters?: string
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface Author {
  name: string
  url: string
}

export interface Publisher {
  name: string
  url: string
  logo: string
}

/**
 * Builds WebPage schema with all required fields
 */
export function buildWebPage(data: SchemaData, pageType: 'blog' | 'glossary' | 'press' | 'page'): any {
  const baseUrl = 'https://odontoa.com'
  const pageUrl = `${baseUrl}/${getPagePath(pageType)}/${data.slug}`
  const pageName = data.title || data.term || 'Odontoa'
  const description = data.meta_description || data.description || ''

  if (!description) {
    throw new Error('WebPage schema requires description/meta_description')
  }

  if (!data.author_url) {
    throw new Error('WebPage schema requires author_url')
  }

  const authorUrl = validateAbsoluteUrl(data.author_url)

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageUrl,
    "url": pageUrl,
    "name": pageName,
    "description": description,
    "inLanguage": "sr",
    "datePublished": validateISO8601Date(data.created_at),
    "dateModified": validateISO8601Date(data.last_modified || data.updated_at || data.created_at),
    "author": {
      "@type": "Person",
      "name": data.author || "Odontoa Tim",
      "url": authorUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Odontoa",
      "url": "https://odontoa.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://odontoa.com/images/Odontoa-New-logo-pack-2026/horiyotal_color.png"
      }
    }
  }
}

/**
 * Builds BreadcrumbList schema with minimum 3 breadcrumbs
 */
export function buildBreadcrumbList(data: SchemaData, pageType: 'blog' | 'glossary' | 'press' | 'page'): any {
  const baseUrl = 'https://odontoa.com'
  const pageUrl = `${baseUrl}/${getPagePath(pageType)}/${data.slug}`
  
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Početna", url: baseUrl }
  ]

  // Add section breadcrumb based on page type
  switch (pageType) {
    case 'blog':
      breadcrumbs.push({ name: "Blog", url: `${baseUrl}/blogovi` })
      break
    case 'glossary':
      breadcrumbs.push({ name: "Rečnik", url: `${baseUrl}/recnik` })
      break
    case 'press':
      breadcrumbs.push({ name: "Press", url: `${baseUrl}/press` })
      break
    case 'page':
      // For regular pages, we might add a category or section
      if (data.category) {
        breadcrumbs.push({ name: data.category, url: `${baseUrl}/${data.category.toLowerCase()}` })
      } else {
        // Add a generic section if no category
        breadcrumbs.push({ name: "Informacije", url: `${baseUrl}/informacije` })
      }
      break
  }

  // Add current page
  breadcrumbs.push({ 
    name: data.title || data.term || 'Stranica', 
    url: pageUrl 
  })

  // Ensure minimum 3 breadcrumbs
  if (breadcrumbs.length < 3) {
    breadcrumbs.splice(1, 0, { name: "Sekcija", url: `${baseUrl}/sekcija` })
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }
}

/**
 * Builds Article schema with all required fields and validation
 */
export function buildArticle(data: SchemaData, pageType: 'blog' | 'glossary' | 'press' | 'page'): any {
  const baseUrl = 'https://odontoa.com'
  const pageUrl = `${baseUrl}/${getPagePath(pageType)}/${data.slug}`
  const headline = data.title || data.term || ''
  const description = data.meta_description || data.description || ''
  const content = data.content || data.full_article || ''

  // Validate required fields
  if (!headline) {
    throw new Error('Article schema requires headline (title or term)')
  }
  if (!description) {
    throw new Error('Article schema requires description (meta_description)')
  }
  if (!data.image_url) {
    throw new Error('Article schema requires image_url')
  }
  if (!data.author) {
    throw new Error('Article schema requires author')
  }
  if (!data.author_url) {
    throw new Error('Article schema requires author_url')
  }

  const imageUrl = validateAbsoluteUrl(data.image_url)
  const authorUrl = validateAbsoluteUrl(data.author_url)

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    "description": description,
    "image": imageUrl,
    "author": {
      "@type": "Person",
      "name": data.author,
      "url": authorUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Odontoa",
      "url": "https://odontoa.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://odontoa.com/images/Odontoa-New-logo-pack-2026/horiyotal_color.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    },
    "datePublished": validateISO8601Date(data.created_at),
    "dateModified": validateISO8601Date(data.last_modified || data.updated_at || data.created_at),
    "inLanguage": "sr",
    "articleBody": content,
    "wordCount": content ? content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0,
    "timeRequired": data.reading_time ? `PT${data.reading_time}M` : undefined,
    "keywords": data.tags?.join(', ') || '',
    "category": data.category || undefined
  }
}

/**
 * Builds FAQPage schema with enhanced content extraction
 */
export function buildFaqPage(data: SchemaData): any {
  let faqs: FAQItem[] = []

  // Try to extract FAQs from existing schema
  if (data.faq_schema) {
    try {
      const existingSchema = typeof data.faq_schema === 'string' 
        ? JSON.parse(data.faq_schema) 
        : data.faq_schema

      if (Array.isArray(existingSchema)) {
        // Find FAQPage in combined schema
        const faqPage = existingSchema.find(schema => schema['@type'] === 'FAQPage')
        if (faqPage && faqPage.mainEntity) {
          faqs = faqPage.mainEntity.map((item: any) => ({
            question: item.name || item.question || '',
            answer: item.acceptedAnswer?.text || item.answer || ''
          }))
        }
      } else if (existingSchema['@type'] === 'FAQPage' && existingSchema.mainEntity) {
        faqs = existingSchema.mainEntity.map((item: any) => ({
          question: item.name || item.question || '',
          answer: item.acceptedAnswer?.text || item.answer || ''
        }))
      }
    } catch (error) {
      console.warn('Error parsing existing FAQ schema:', error)
    }
  }

  // If no FAQs found or less than 3, generate contextual ones from content
  if (faqs.length < 3) {
    const contextualFaqs = generateContextualFAQs(data)
    faqs = [...faqs, ...contextualFaqs]
  }

  // Ensure minimum 3 FAQs
  if (faqs.length < 3) {
    const additionalFaqs = generateAdditionalFAQs(data, faqs.length)
    faqs.push(...additionalFaqs)
  }

  // Remove duplicates and limit to 10
  const uniqueFaqs = faqs.filter((faq, index, self) => 
    index === self.findIndex(f => f.question === faq.question)
  ).slice(0, 10)

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": uniqueFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}

/**
 * Builds combined schema array - ALWAYS returns exactly 4 objects
 */
export function buildCombinedSchema(data: SchemaData, pageType: 'blog' | 'glossary' | 'press' | 'page'): any[] {
  try {
    // First validate all required fields
    const validationErrors = validateSchemaData(data, pageType)
    if (validationErrors.length > 0) {
      throw new Error(`Schema validation failed: ${validationErrors.join(', ')}`)
    }

    const schemas = []

    // 1. WebPage schema (required)
    schemas.push(buildWebPage(data, pageType))

    // 2. BreadcrumbList schema (required)
    schemas.push(buildBreadcrumbList(data, pageType))

    // 3. Article schema (required)
    schemas.push(buildArticle(data, pageType))

    // 4. FAQPage schema (required)
    schemas.push(buildFaqPage(data))

    // Validate that we have exactly 4 schemas
    if (schemas.length !== 4) {
      throw new Error(`Combined schema must have exactly 4 objects, got ${schemas.length}`)
    }

    // Validate schema types
    const schemaTypes = schemas.map(schema => schema['@type'])
    const requiredTypes = ['WebPage', 'BreadcrumbList', 'Article', 'FAQPage']
    
    for (const requiredType of requiredTypes) {
      if (!schemaTypes.includes(requiredType)) {
        throw new Error(`Missing required schema type: ${requiredType}`)
      }
    }

    return schemas
  } catch (error) {
    console.error('Error building combined schema:', error)
    throw error
  }
}

/**
 * Helper function to get page path based on type
 */
function getPagePath(pageType: 'blog' | 'glossary' | 'press' | 'page'): string {
  switch (pageType) {
    case 'blog':
      return 'blogovi'
    case 'glossary':
      return 'recnik'
    case 'press':
      return 'press'
    case 'page':
      return ''
    default:
      return ''
  }
}

/**
 * Generates contextual FAQs based on content analysis
 */
function generateContextualFAQs(data: SchemaData): FAQItem[] {
  const faqs: FAQItem[] = []
  const title = data.title || data.term || ''
  const content = data.content || data.full_article || ''
  const definition = data.description || data.meta_description || ''

  // Extract questions from content (sentences ending with ?)
  const questionMatches = content.match(/[^.!?]*\?/g)
  if (questionMatches && questionMatches.length > 0) {
    questionMatches.slice(0, 3).forEach(question => {
      const cleanQuestion = question.trim()
      const answerStart = content.indexOf(cleanQuestion) + cleanQuestion.length
      const answer = content.substring(answerStart, answerStart + 300).trim()
      
      if (answer.length > 50) {
        faqs.push({
          question: cleanQuestion,
          answer: answer + (answer.length >= 300 ? '...' : '')
        })
      }
    })
  }

  // Add definition-based FAQ if we have a term
  if (title && definition && faqs.length < 3) {
    faqs.push({
      question: `Šta je ${title.toLowerCase()}?`,
      answer: definition
    })
  }

  // Add importance FAQ if we have why_it_matters
  if (data.why_it_matters && faqs.length < 3) {
    faqs.push({
      question: `Zašto je ${title.toLowerCase()} važan?`,
      answer: data.why_it_matters
    })
  }

  // Extract questions from headings (H2, H3)
  const headingMatches = content.match(/<h[23][^>]*>(.*?)<\/h[23]>/g)
  if (headingMatches && faqs.length < 3) {
    headingMatches.slice(0, 2).forEach(heading => {
      const headingText = heading.replace(/<[^>]*>/g, '').trim()
      if (headingText.length > 10 && headingText.length < 100) {
        // Find content after this heading
        const headingIndex = content.indexOf(heading)
        const nextHeadingIndex = content.indexOf('<h', headingIndex + heading.length)
        const contentEnd = nextHeadingIndex > 0 ? nextHeadingIndex : content.length
        const answer = content.substring(headingIndex + heading.length, contentEnd)
          .replace(/<[^>]*>/g, '')
          .trim()
          .substring(0, 200)
        
        if (answer.length > 30) {
          faqs.push({
            question: headingText + '?',
            answer: answer + (answer.length >= 200 ? '...' : '')
          })
        }
      }
    })
  }

  return faqs
}

/**
 * Generates additional FAQs to meet minimum requirement
 */
function generateAdditionalFAQs(data: SchemaData, currentCount: number): FAQItem[] {
  const faqs: FAQItem[] = []
  const title = data.title || data.term || ''
  const needed = Math.max(3 - currentCount, 0)

  if (needed === 0) return faqs

  const commonQuestions = [
    {
      question: `Kako funkcioniše ${title.toLowerCase()}?`,
      answer: "Detaljne informacije o ovom postupku možete pronaći u našem članku koji objašnjava sve aspekte ove teme."
    },
    {
      question: `Da li je ${title.toLowerCase()} bezbedno?`,
      answer: "Da, svi naši postupci su bezbedni i odobreni od strane relevantnih medicinskih institucija."
    },
    {
      question: `Kada se koristi ${title.toLowerCase()}?`,
      answer: "Ovaj postupak se koristi u specifičnim situacijama koje odredjuje vaš stomatolog na osnovu individualnih potreba."
    },
    {
      question: `Koji su troškovi ${title.toLowerCase()}?`,
      answer: "Troškovi variraju zavisno od složenosti postupka. Kontaktirajte nas za detaljnu ponudu prilagođenu vašim potrebama."
    },
    {
      question: `Koliko traje oporavak nakon ${title.toLowerCase()}?`,
      answer: "Vreme oporavka varira od pacijenta do pacijenta. Naš tim će vam dati detaljne instrukcije za brži oporavak."
    }
  ]

  for (let i = 0; i < needed && i < commonQuestions.length; i++) {
    faqs.push(commonQuestions[i])
  }

  return faqs
}
