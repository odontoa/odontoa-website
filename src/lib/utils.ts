import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Creates SEO-optimized slug from title
 * Extracts keywords and creates meaningful slug
 */
export function createSEOSlug(title: string): string {
  if (!title) return ''
  
  // Remove special characters and convert to lowercase
  let slug = title
    .toLowerCase()
    .trim()
    
  // Serbian character mapping
  const serbianMap: { [key: string]: string } = {
    'č': 'c', 'ć': 'c', 'đ': 'd', 'š': 's', 'ž': 'z',
    'Č': 'c', 'Ć': 'c', 'Đ': 'd', 'Š': 's', 'Ž': 'z',
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'ђ': 'dj',
    'е': 'e', 'ж': 'z', 'з': 'z', 'и': 'i', 'ј': 'j', 'к': 'k',
    'л': 'l', 'љ': 'lj', 'м': 'm', 'н': 'n', 'њ': 'nj', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'ћ': 'c', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'c', 'џ': 'dz', 'ш': 's'
  }

  // Replace Serbian characters
  Object.keys(serbianMap).forEach(char => {
    slug = slug.replace(new RegExp(char, 'g'), serbianMap[char])
  })

  // Remove special characters and replace spaces with hyphens
  slug = slug
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens

  // Extract key keywords for better SEO
  const keywords = extractKeywords(title)
  if (keywords.length > 0) {
    const keywordSlug = keywords.slice(0, 3).join('-')
    slug = `${keywordSlug}-${slug}`
  }

  // Limit length for SEO
  if (slug.length > 60) {
    slug = slug.substring(0, 60).replace(/-[^-]*$/, '')
  }

  return slug
}

/**
 * Extracts SEO keywords from title
 */
export function extractKeywords(title: string): string[] {
  if (!title) return []
  
  const stopWords = [
    'i', 'ili', 'a', 'ali', 'pa', 'te', 'da', 'je', 'su', 'bi', 'će',
    'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might'
  ]

  const words = title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => 
      word.length > 2 && 
      !stopWords.includes(word) &&
      !/^\d+$/.test(word) // Not just numbers
    )

  // Return unique words, prioritizing longer words
  return [...new Set(words)].sort((a, b) => b.length - a.length)
}

/**
 * Generates SEO-optimized meta description
 */
export function generateMetaDescription(content: string, title: string, maxLength: number = 160): string {
  if (!content) return ''
  
  // Remove HTML tags
  const cleanContent = content.replace(/<[^>]*>/g, '')
  
  // Create description from content
  let description = cleanContent
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, maxLength)

  // If content is too short, add title context
  if (description.length < 100 && title) {
    const titleContext = `Saznajte sve o ${title.toLowerCase()}. `
    description = titleContext + description
  }

  // Ensure it ends with a complete sentence
  const lastPeriod = description.lastIndexOf('.')
  if (lastPeriod > maxLength * 0.8) {
    description = description.substring(0, lastPeriod + 1)
  }

  return description
}

/**
 * Generates SEO keywords from content and title
 */
export function generateSEOKeywords(title: string, content: string, tags: string[] = []): string[] {
  const titleKeywords = extractKeywords(title || '')
  const cleanContent = content ? content.replace(/<[^>]*>/g, '') : ''
  const contentKeywords = extractKeywords(cleanContent)
  
  // Combine and prioritize
  const allKeywords = [...titleKeywords, ...contentKeywords, ...tags]
  
  // Remove duplicates and limit
  const uniqueKeywords = [...new Set(allKeywords)]
  
  // Return top 10 most relevant keywords
  return uniqueKeywords.slice(0, 10)
}

/**
 * Generates structured data for SEO
 */
export function generateStructuredData(type: 'article' | 'glossary' | 'blog', data: any) {
  const safeData = data || {}
  
  const baseData = {
    "@context": "https://schema.org",
    "@type": type === 'article' ? "Article" : "DefinedTerm",
    "publisher": {
      "@type": "Organization",
      "name": "Odontoa",
      "logo": {
        "@type": "ImageObject",
        "url": "https://odontoa.com/odontoa-logo1.png"
      }
    },
    "url": `https://odontoa.com/${type === 'article' ? 'blogovi' : 'recnik'}/${safeData.slug || ''}`,
    "datePublished": safeData.created_at,
    "dateModified": safeData.last_modified || safeData.updated_at || safeData.created_at
  }

  if (type === 'article' || type === 'blog') {
    return {
      ...baseData,
      "headline": safeData.title,
      "description": safeData.meta_description || safeData.excerpt || safeData.summary,
      "author": {
        "@type": "Person",
        "name": safeData.author
      },
      "keywords": safeData.tags?.join(', ') || '',
      "articleBody": safeData.content,
      "image": safeData.image_url || safeData.featured_image ? {
        "@type": "ImageObject",
        "url": safeData.image_url || safeData.featured_image,
        "alt": safeData.alt_text || safeData.title
      } : undefined,
      "wordCount": safeData.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0,
      "timeRequired": `PT${safeData.reading_time || 5}M`,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://odontoa.com/blogovi/${safeData.slug || ''}`
      }
    }
  } else {
    return {
      ...baseData,
      "name": safeData.term,
      "description": safeData.definition,
      "inDefinedTermSet": {
        "@type": "DefinedTermSet",
        "name": "Stomatološki rečnik",
        "url": "https://odontoa.com/recnik"
      },
      "category": safeData.category,
      "difficulty": safeData.difficulty_level
    }
  }
}

/**
 * Generates FAQ structured data
 */
export function generateFAQStructuredData(faqs: Array<{question: string, answer: string}>) {
  if (!faqs || !Array.isArray(faqs)) return null
  
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question || '',
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer || ''
      }
    }))
  }
}

/**
 * Generates complete SEO data for a page
 */
export function generateCompleteSEOData(data: any, type: 'blog' | 'glossary'): any {
  const safeData = data || {}
  const baseUrl = 'https://odontoa.com'
  const pageUrl = `${baseUrl}/${type === 'blog' ? 'blogovi' : 'recnik'}/${safeData.slug || ''}`
  
  return {
    title: `${safeData.title || safeData.term} | Odontoa`,
    description: safeData.meta_description || safeData.excerpt || safeData.definition,
    keywords: safeData.tags?.join(', ') || '',
    canonical: pageUrl,
    openGraph: {
      title: safeData.title || safeData.term,
      description: safeData.meta_description || safeData.excerpt || safeData.definition,
      url: pageUrl,
      type: type === 'blog' ? 'article' : 'website',
      image: safeData.image_url || safeData.featured_image ? {
        url: safeData.image_url || safeData.featured_image,
        alt: safeData.alt_text || safeData.title || safeData.term,
        width: 1200,
        height: 630
      } : undefined,
      siteName: 'Odontoa',
      locale: 'sr_RS'
    },
    twitter: {
      card: 'summary_large_image',
      title: safeData.title || safeData.term,
      description: safeData.meta_description || safeData.excerpt || safeData.definition,
      image: safeData.image_url || safeData.featured_image,
      creator: '@odontoa'
    },
    structuredData: [
      generateStructuredData(type, safeData),
      ...(safeData.faq_schema ? [JSON.parse(safeData.faq_schema)] : [])
    ]
  }
}

/**
 * Calculates reading time for content
 */
export function calculateReadingTime(content: string): number {
  if (!content) return 1
  const wordsPerMinute = 200
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

/**
 * Calculates SEO score for content
 */
export function calculateSEOScore(data: any, type: 'blog' | 'glossary'): number {
  let score = 0
  
  // Title length (optimal: 50-60 characters)
  const title = data.title || data.term || ''
  if (title && title.length >= 50 && title.length <= 60) {
    score += 20
  } else if (title && title.length >= 30 && title.length <= 70) {
    score += 10
  }
  
  // Content length
  const content = data.content || data.full_article || ''
  if (content && content.length > 1500) {
    score += 20
  } else if (content && content.length > 800) {
    score += 10
  }
  
  // Meta description
  const description = data.meta_description || data.excerpt || data.definition || ''
  if (description && description.length >= 150 && description.length <= 160) {
    score += 15
  } else if (description && description.length >= 120 && description.length <= 170) {
    score += 10
  }
  
  // Has featured image
  if (data.image_url || data.featured_image) {
    score += 10
  }
  
  // Has alt text
  if (data.alt_text) {
    score += 5
  }
  
  // Has FAQ schema
  if (data.faq_schema) {
    score += 15
  }
  
  // Has tags
  if (data.tags && data.tags.length > 0) {
    score += 10
  }
  
  // Has related content
  if (type === 'blog' && data.related_glossary_terms && data.related_glossary_terms.length > 0) {
    score += 10
  }
  if (type === 'glossary' && data.related_blog_posts && data.related_blog_posts.length > 0) {
    score += 10
  }
  
  return Math.min(100, score)
}

/**
 * Suggests related content based on keywords and tags
 */
export function suggestRelatedContent(
  content: string, 
  tags: string[], 
  existingContent: Array<{id: string, title: string, slug: string, tags: string[], content: string}>
): Array<{id: string, title: string, slug: string, relevance_score: number, reason: string}> {
  const suggestions: Array<{id: string, title: string, slug: string, relevance_score: number, reason: string}> = []
  
  // Extract keywords from content
  const cleanContent = content ? content.replace(/<[^>]*>/g, '') : ''
  const contentKeywords = extractKeywords(cleanContent)
  
  existingContent.forEach(item => {
    let score = 0
    const reasons: string[] = []
    
    // Tag matching
    const tagMatches = tags.filter(tag => item.tags.includes(tag))
    if (tagMatches.length > 0) {
      score += tagMatches.length * 10
      reasons.push(`Povezani tagovi: ${tagMatches.join(', ')}`)
    }
    
    // Keyword matching
    const itemKeywords = extractKeywords(item.title + ' ' + item.content.replace(/<[^>]*>/g, ''))
    const keywordMatches = contentKeywords.filter(keyword => 
      itemKeywords.includes(keyword)
    )
    if (keywordMatches.length > 0) {
      score += keywordMatches.length * 5
      reasons.push(`Slični ključni pojmovi: ${keywordMatches.join(', ')}`)
    }
    
    // Title similarity
    const titleSimilarity = calculateTextSimilarity(content, item.title)
    if (titleSimilarity > 0.3) {
      score += Math.floor(titleSimilarity * 20)
      reasons.push('Sličan naslov')
    }
    
    if (score > 0) {
      suggestions.push({
        id: item.id,
        title: item.title,
        slug: item.slug,
        relevance_score: score,
        reason: reasons.join('; ')
      })
    }
  })
  
  return suggestions
    .sort((a, b) => b.relevance_score - a.relevance_score)
    .slice(0, 5)
}

/**
 * Calculates text similarity using simple algorithm
 */
function calculateTextSimilarity(text1: string, text2: string): number {
  if (!text1 || !text2) return 0
  
  const words1 = text1.toLowerCase().split(/\s+/)
  const words2 = text2.toLowerCase().split(/\s+/)
  
  const intersection = words1.filter(word => words2.includes(word))
  const union = [...new Set([...words1, ...words2])]
  
  return union.length > 0 ? intersection.length / union.length : 0
}

/**
 * Generates CTA block for content
 */
export function generateCTABlock(type: 'blog' | 'glossary', data: any): any {
  const safeData = data || {}
  const safeSlug = safeData.slug || ''
  
  const baseCTA = {
    title: "Zanima vas kako sve ovo izgleda u praksi?",
    description: "Zakažite demo i uverite se u prednosti Odontoa sistema.",
    buttonText: "Zakaži demo",
    buttonUrl: "/kontakt",
    variant: "default" as const
  }
  
  if (type === 'blog') {
    return {
      ...baseCTA,
      title: "Spremni da unapredite vašu ordinaciju?",
      description: "Ovaj blog vam je pokazao teoriju. Sada je vreme za praksu.",
      buttonText: "Zakažite besplatan demo",
      buttonUrl: "/kontakt?source=blog&slug=" + safeSlug,
      variant: "default" as const
    }
  } else {
    return {
      ...baseCTA,
      title: "Potrebna vam je pomoć oko ovog termina?",
      description: "Naš tim je tu da vam objasni sve detalje i pomogne u implementaciji.",
      buttonText: "Kontaktirajte nas",
      buttonUrl: "/kontakt?source=glossary&term=" + safeSlug,
      variant: "outline" as const
    }
  }
}

/**
 * Sanitizes HTML content for safe rendering
 */
export function sanitizeHTML(html: string): string {
  if (!html) return ''
  
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
}

/**
 * Generates topic cluster suggestions
 */
export function generateTopicClusterSuggestions(
  content: string,
  title: string,
  tags: string[]
): Array<{cluster_name: string, cluster_slug: string, keywords: string[], score: number}> {
  const suggestions: Array<{cluster_name: string, cluster_slug: string, keywords: string[], score: number}> = []
  
  // Predefined topic clusters for dental industry
  const predefinedClusters = [
    {
      name: "Digitalna Stomatologija",
      keywords: ["digital", "tehnologija", "skener", "3d", "cad", "cam", "intraoral", "fotografija"]
    },
    {
      name: "Upravljanje Ordinacijom",
      keywords: ["ordinacija", "upravljanje", "pacijenti", "termini", "kartoni", "finansije", "analitika"]
    },
    {
      name: "Preventivna Stomatologija",
      keywords: ["prevencija", "higijena", "profilaksa", "fluor", "sealant", "kontrola", "edukacija"]
    },
    {
      name: "Estetska Stomatologija",
      keywords: ["estetika", "beljenje", "veneers", "ortodontija", "smile", "design", "krunice"]
    },
    {
      name: "Implantologija",
      keywords: ["implant", "implantologija", "osteointegracija", "augmentacija", "sinus", "graft"]
    }
  ]
  
  const safeTitle = title || ''
  const safeContent = content || ''
  const safeTags = tags || []
  const allText = (safeTitle + ' ' + safeContent + ' ' + safeTags.join(' ')).toLowerCase()
  
  predefinedClusters.forEach(cluster => {
    let score = 0
    const matchedKeywords: string[] = []
    
    cluster.keywords.forEach(keyword => {
      if (allText.includes(keyword)) {
        score += 10
        matchedKeywords.push(keyword)
      }
    })
    
    if (score > 0) {
      suggestions.push({
        cluster_name: cluster.name,
        cluster_slug: createSEOSlug(cluster.name),
        keywords: matchedKeywords,
        score
      })
    }
  })
  
  return suggestions.sort((a, b) => b.score - a.score).slice(0, 3)
}

// Auto-generate FAQ from content and title
export function generateAutoFAQ(title: string, content: string, summary?: string, whyItMatters?: string) {
  const faqs: Array<{question: string, answer: string}> = []
  
  // Clean content for analysis
  const cleanContent = content ? content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : ''
  const cleanTitle = title ? title.trim() : ''
  const cleanSummary = summary ? summary.trim() : ''
  const cleanWhyItMatters = whyItMatters ? whyItMatters.trim() : ''
  
  // Generate FAQ based on content type
  if (cleanTitle && cleanContent) {
    // FAQ 1: What is [topic]?
    const topic = cleanTitle.toLowerCase().includes('šta je') ? 
      cleanTitle.replace(/šta je\s+/i, '').replace(/\?/g, '') :
      cleanTitle
    
    const answer1 = cleanSummary || cleanContent.substring(0, 200) + '...'
    
    faqs.push({
      question: `Šta je ${topic}?`,
      answer: answer1
    })
    
    // FAQ 2: Why is [topic] important? (if why_it_matters exists)
    if (cleanWhyItMatters) {
      faqs.push({
        question: `Zašto je ${topic} važan?`,
        answer: cleanWhyItMatters
      })
    }
    
    // FAQ 3: How to [action]? (if content contains action words)
    const actionWords = ['kako', 'način', 'metoda', 'tehnika', 'procedura']
    const hasActionContent = actionWords.some(word => cleanContent.toLowerCase().includes(word))
    
    if (hasActionContent) {
      const actionAnswer = cleanContent.length > 300 ? 
        cleanContent.substring(200, 400) + '...' :
        cleanContent
      
      faqs.push({
        question: `Kako se koristi ${topic}?`,
        answer: actionAnswer
      })
    }
  }
  
  return faqs.length > 0 ? generateFAQStructuredData(faqs) : null
}

// Enhanced content analysis for SEO test mode
export function analyzeContentStructure(content: string) {
  if (!content) return {
    hasHeadings: false,
    hasImages: false,
    hasLists: false,
    hasLinks: false,
    wordCount: 0
  }
  
  const hasHeadings = /<h[2-6][^>]*>/i.test(content)
  const hasImages = /<img[^>]*>/i.test(content)
  const hasLists = /<(ul|ol)[^>]*>/i.test(content)
  const hasLinks = /<a[^>]*>/i.test(content)
  const wordCount = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(word => word.length > 0).length
  
  return {
    hasHeadings,
    hasImages,
    hasLists,
    hasLinks,
    wordCount
  }
}

// Check if summary and alt_text contain keywords
export function checkKeywordOptimization(title: string, summary?: string, altText?: string, tags: string[] = []) {
  if (!title) return { summaryOptimized: false, altTextOptimized: false }
  
  const titleKeywords = extractKeywords(title)
  const summaryText = summary || ''
  const altTextContent = altText || ''
  
  const summaryOptimized = titleKeywords.some(keyword => 
    summaryText.toLowerCase().includes(keyword.toLowerCase())
  )
  
  const altTextOptimized = titleKeywords.some(keyword => 
    altTextContent.toLowerCase().includes(keyword.toLowerCase())
  )
  
  return {
    summaryOptimized,
    altTextOptimized,
    titleKeywords
  }
}
