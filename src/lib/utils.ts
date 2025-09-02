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
        "url": "https://odontoa.com/images/Odontoa - logo pack/social_media_profile_image.png"
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
      "description": safeData.meta_description || safeData.summary,
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
    description: safeData.meta_description || safeData.definition,
    keywords: safeData.tags?.join(', ') || '',
    canonical: pageUrl,
    openGraph: {
      title: safeData.title || safeData.term,
      description: safeData.meta_description || safeData.definition,
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
      description: safeData.meta_description || safeData.definition,
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
 * Enhanced SEO Score calculation with detailed metrics
 */
export function calculateSEOScore(data: any): { score: number; metrics: any } {
  const metrics = {
    title: { score: 0, max: 10, details: '' },
    metaDescription: { score: 0, max: 15, details: '' },
    contentLength: { score: 0, max: 20, details: '' },
    image: { score: 0, max: 10, details: '' },
    altText: { score: 0, max: 5, details: '' },
    tags: { score: 0, max: 10, details: '' },
    faqSchema: { score: 0, max: 10, details: '' },
    internalLinks: { score: 0, max: 10, details: '' },
    structure: { score: 0, max: 10, details: '' }
  }
  
  let totalScore = 0
  
  // 1. Title analysis
  if (data.title) {
    const titleLength = data.title.length
    if (titleLength >= 30 && titleLength <= 60) {
      metrics.title.score = 10
      metrics.title.details = `Naslov ima ${titleLength} karaktera (optimalno 30-60)`
    } else if (titleLength > 0) {
      metrics.title.score = Math.max(0, 10 - Math.abs(titleLength - 45) / 3)
      metrics.title.details = `Naslov ima ${titleLength} karaktera (preporučeno 30-60)`
    } else {
      metrics.title.details = 'Naslov je obavezan'
    }
  }
  
  // 2. Meta description analysis
  if (data.meta_description && data.meta_description.trim().length > 0) {
    const descLength = data.meta_description.length
    if (descLength >= 150 && descLength <= 160) {
      metrics.metaDescription.score = 15
      metrics.metaDescription.details = `Meta opis ima ${descLength} karaktera (optimalno 150-160)`
    } else if (descLength > 0) {
      metrics.metaDescription.score = Math.max(0, 15 - Math.abs(descLength - 155) / 2)
      metrics.metaDescription.details = `Meta opis ima ${descLength} karaktera (preporučeno 150-160)`
    } else {
      metrics.metaDescription.details = 'Meta opis je obavezan za SEO'
    }
  } else {
    metrics.metaDescription.score = 0
    metrics.metaDescription.details = 'Meta Description: 0/15 poena - nije unet'
  }
  
  // 3. Content length analysis
  if (data.content) {
    const textContent = data.content.replace(/<[^>]*>/g, '').trim()
    const wordCount = textContent.split(/\s+/).length
    if (wordCount >= 300) {
      metrics.contentLength.score = 20
      metrics.contentLength.details = `Sadržaj ima ${wordCount} reči (odlično za SEO)`
    } else if (wordCount >= 150) {
      metrics.contentLength.score = 15
      metrics.contentLength.details = `Sadržaj ima ${wordCount} reči (dovoljno)`
    } else if (wordCount >= 50) {
      metrics.contentLength.score = 10
      metrics.contentLength.details = `Sadržaj ima ${wordCount} reči (minimalno)`
    } else {
      metrics.contentLength.details = 'Sadržaj je prekratak (minimum 50 reči)'
    }
  }
  
  // 4. Image analysis
  if (data.image_url || data.featured_image) {
    metrics.image.score = 10
    metrics.image.details = 'Featured slika je postavljena'
  } else {
    metrics.image.details = 'Featured slika poboljšava SEO'
  }
  
  // 5. Alt text analysis
  if (data.alt_text && data.alt_text.trim().length > 0) {
    metrics.altText.score = 5
    metrics.altText.details = 'Alt tekst je postavljen'
  } else {
    metrics.altText.details = 'Alt tekst je obavezan za pristupačnost'
  }
  
  // 6. Tags analysis
  let tagsArr: string[] = [];
  if (Array.isArray(data.tags)) {
    tagsArr = data.tags;
  } else if (typeof data.tags === 'string') {
    tagsArr = data.tags.split(',').map(t => t.trim()).filter(Boolean);
  }
  if (tagsArr.length > 0) {
    const tagCount = tagsArr.length;
    if (tagCount >= 3) {
      metrics.tags.score = 10;
      metrics.tags.details = `${tagCount} tagova (odlično)`;
    } else {
      metrics.tags.score = tagCount * 3;
      metrics.tags.details = `${tagCount} tagova (preporučeno 3+)`;
    }
  } else {
    metrics.tags.details = 'Tagovi poboljšavaju SEO';
  }

  // 7. FAQ Schema analysis
  if (data.faq_schema) {
    try {
      let schemas = [];
      if (typeof data.faq_schema === 'string') {
        const parsed = JSON.parse(data.faq_schema);
        schemas = Array.isArray(parsed) ? parsed : [parsed];
      } else if (Array.isArray(data.faq_schema)) {
        schemas = data.faq_schema;
      } else {
        schemas = [data.faq_schema];
      }
      const faqPage = schemas.find(s => s['@type'] === 'FAQPage' && Array.isArray(s.mainEntity) && s.mainEntity.length > 0);
      if (faqPage) {
        metrics.faqSchema.score = 10;
        metrics.faqSchema.details = `${faqPage.mainEntity.length} FAQ pitanja`;
      } else {
        metrics.faqSchema.score = 5;
        metrics.faqSchema.details = 'FAQ schema postoji ali nema pitanja ili nije FAQPage';
      }
    } catch {
      metrics.faqSchema.details = 'FAQ schema nije validan JSON';
    }
  } else {
    metrics.faqSchema.details = 'FAQ schema poboljšava Rich Results';
  }
  
  // 8. Internal links analysis
  if (data.related_glossary_terms && Array.isArray(data.related_glossary_terms) && data.related_glossary_terms.length > 0) {
    const linkCount = data.related_glossary_terms.length
    metrics.internalLinks.score = Math.min(10, linkCount * 2)
    metrics.internalLinks.details = `${linkCount} internih linkova`
  } else {
    metrics.internalLinks.details = 'Interni linkovi poboljšavaju SEO'
  }
  
  // 9. Content structure analysis
  if (data.content) {
    const hasHeadings = /<h[1-6]/.test(data.content)
    const hasLists = /<[uo]l>|<li>/.test(data.content)
    const hasParagraphs = /<p>/.test(data.content)
    
    let structureScore = 0
    if (hasHeadings) structureScore += 4
    if (hasLists) structureScore += 3
    if (hasParagraphs) structureScore += 3
    
    metrics.structure.score = structureScore
    metrics.structure.details = `Struktura: ${hasHeadings ? 'H1-H6' : ''} ${hasLists ? 'Liste' : ''} ${hasParagraphs ? 'Paragrafi' : ''}`.trim()
  } else {
    metrics.structure.details = 'Struktura sadržaja je važna'
  }
  
  // Calculate total score
  Object.values(metrics).forEach(metric => {
    totalScore += metric.score
  })
  
  return {
    score: Math.round(totalScore),
    metrics
  }
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

/**
 * Comprehensive SEO metadata enhancer for tags
 * Handles meta keywords, Article schema, frontend display, and SEO scoring
 */
export function enhanceSEOWithTags(
  tags: string[],
  title: string,
  summary: string,
  existingMetaKeywords?: string
): {
  metaKeywords: string
  articleSchema: any
  frontendTags: Array<{name: string, slug: string}>
  seoScore: number
} {
  // Clean and validate tags
  const cleanTags = tags
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
    .slice(0, 10) // Limit to 10 tags for SEO

  // Generate meta keywords
  const existingKeywords = existingMetaKeywords ? existingMetaKeywords.split(',').map(k => k.trim()) : []
  const allKeywords = [...new Set([...existingKeywords, ...cleanTags])]
  const metaKeywords = allKeywords.join(', ')

  // Generate Article schema with tags
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "about": cleanTags.map(tag => ({
      "@type": "Thing",
      "name": tag
    })),
    "keywords": metaKeywords
  }

  // Generate frontend tags with slugs
  const frontendTags = cleanTags.map(tag => ({
    name: tag,
    slug: createSEOSlug(tag)
  }))

  // Calculate SEO score based on tag relevance
  let seoScore = 0
  
  // Check if tags match title keywords
  const titleKeywords = extractKeywords(title)
  const titleMatches = cleanTags.filter(tag => 
    titleKeywords.some(keyword => 
      tag.toLowerCase().includes(keyword.toLowerCase()) ||
      keyword.toLowerCase().includes(tag.toLowerCase())
    )
  )
  seoScore += titleMatches.length * 5

  // Check if tags match summary keywords
  const summaryKeywords = extractKeywords(summary)
  const summaryMatches = cleanTags.filter(tag => 
    summaryKeywords.some(keyword => 
      tag.toLowerCase().includes(keyword.toLowerCase()) ||
      keyword.toLowerCase().includes(tag.toLowerCase())
    )
  )
  seoScore += summaryMatches.length * 3

  // Bonus for having optimal number of tags (3-6)
  if (cleanTags.length >= 3 && cleanTags.length <= 6) {
    seoScore += 10
  }

  return {
    metaKeywords,
    articleSchema,
    frontendTags,
    seoScore: Math.min(100, seoScore)
  }
}

/**
 * Suggests relevant tags based on content and title
 */
export function suggestRelevantTags(content: string, title: string): string[] {
  if (!content && !title) return []
  
  // Combine content and title for analysis
  const fullText = `${title} ${content}`.toLowerCase()
  
  // Remove HTML tags
  const cleanText = fullText.replace(/<[^>]*>/g, '')
  
  // Serbian dental/medical keywords
  const dentalKeywords = [
    'stomatologija', 'zub', 'zubi', 'zubar', 'zubara', 'ordinacija', 'pregled',
    'lečenje', 'karijes', 'krunica', 'most', 'implant', 'ortodoncija', 'aparatić',
    'čistiti', 'četkica', 'pasta', 'konac', 'fluor', 'anestezija', 'bol',
    'upala', 'desni', 'plomba', 'ekstrakcija', 'vađenje', 'preventiva',
    'digitalizacija', '3d', 'skener', 'rtg', 'panorama', 'cefalometrija',
    'hirurgija', 'parodontologija', 'endodoncija', 'pedodoncija', 'protetika',
    'estetika', 'beljenje', 'veneers', 'laminati', 'inlej', 'onlej'
  ]
  
  // General medical/health keywords
  const healthKeywords = [
    'zdravlje', 'zdrav', 'bolest', 'simptom', 'dijagnoza', 'terapija',
    'lek', 'antibiotik', 'analgetik', 'upala', 'infekcija', 'bakterija',
    'virus', 'imunitet', 'prevencija', 'kontrola', 'pregled', 'test',
    'rezultat', 'analiza', 'krv', 'urina', 'temperatura', 'pritisak'
  ]
  
  // Technology keywords
  const techKeywords = [
    'digitalizacija', 'tehnologija', 'aplikacija', 'software', 'hardware',
    'online', 'internet', 'web', 'mobilna', 'app', 'sistem', 'platforma',
    'automatizacija', 'ai', 'artificial intelligence', 'machine learning',
    'data', 'analitika', 'cloud', 'backup', 'security', 'privacy'
  ]
  
  // Business keywords
  const businessKeywords = [
    'posao', 'biznis', 'usluga', 'klijent', 'pacijent', 'termin',
    'zakazivanje', 'rezervacija', 'plaćanje', 'cena', 'trošak',
    'profit', 'marketing', 'reklama', 'promocija', 'kvalitet',
    'satisfakcija', 'feedback', 'recenzija', 'preporuka'
  ]
  
  // Combine all keyword categories
  const allKeywords = [...dentalKeywords, ...healthKeywords, ...techKeywords, ...businessKeywords]
  
  // Find matching keywords in text
  const foundKeywords = allKeywords.filter(keyword => 
    cleanText.includes(keyword)
  )
  
  // Extract additional keywords from text using NLP-like approach
  const words = cleanText
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => 
      word.length > 3 && 
      !['i', 'ili', 'a', 'ali', 'pa', 'te', 'da', 'je', 'su', 'bi', 'će', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might'].includes(word)
    )
  
  // Get unique words and limit to top relevant ones
  const uniqueWords = [...new Set(words)].slice(0, 10)
  
  // Combine found keywords with extracted words
  const suggestions = [...foundKeywords, ...uniqueWords]
  
  // Remove duplicates and limit to 6 suggestions
  return [...new Set(suggestions)].slice(0, 6)
}

/**
 * Analyzes content structure for SEO optimization
 */
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

/**
 * Generates combined Article and FAQPage schema as JSON array
 * Ready for Google Rich Results and LLM crawlers
 */
export function generateCombinedSchema(data: any, type: 'blog' | 'glossary'): any[] {
  const safeData = data || {}
  const baseUrl = 'https://odontoa.com'
  const pageUrl = `${baseUrl}/${type === 'blog' ? 'blogovi' : 'recnik'}/${safeData.slug || ''}`
  const currentDate = new Date().toISOString()
  
  // Generate description for JSON-LD - use meta_description exclusively
  const generateDescription = () => {
    if (safeData.meta_description && safeData.meta_description.trim().length > 0) {
      return safeData.meta_description
    }
    // Fallback to content if meta_description is not available
    if (safeData.content) {
      const textContent = safeData.content.replace(/<[^>]*>/g, '').trim()
      const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 0)
      if (sentences.length >= 2) {
        return sentences.slice(0, 2).join('. ').trim() + '.'
      }
      return textContent.substring(0, 160).trim()
    }
    return safeData.definition || ''
  }
  
  const description = generateDescription()
  
  const schemas: any[] = []
  
  // 1. Article Schema
  const articleSchema: any = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": safeData.title || safeData.term,
    "description": description,
    "url": pageUrl,
    "datePublished": safeData.created_at || currentDate,
    "dateModified": safeData.last_modified || safeData.updated_at || safeData.created_at || currentDate,
    "author": {
      "@type": "Organization",
      "name": safeData.author || "Odontoa Tim",
      "url": "https://odontoa.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Odontoa",
      "logo": {
        "@type": "ImageObject",
        "url": "https://odontoa.com/images/Odontoa - logo pack/social_media_profile_image.png",
        "width": 120,
        "height": 60
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    }
  }
  
  // Add image if available
  if (safeData.image_url || safeData.featured_image) {
    articleSchema.image = {
      "@type": "ImageObject",
      "url": safeData.image_url || safeData.featured_image,
      "alt": safeData.alt_text || safeData.title || safeData.term,
      "width": 1200,
      "height": 630
    }
  }
  
  // Add about section from tags
  if (safeData.tags && safeData.tags.length > 0) {
    articleSchema.about = safeData.tags.map((tag: string) => ({
      "@type": "Thing",
      "name": tag
    }))
  }
  
  // Add keywords
  if (safeData.tags && safeData.tags.length > 0) {
    articleSchema.keywords = safeData.tags.join(', ')
  }
  
  // Add word count and reading time for blogs
  if (type === 'blog' && safeData.content) {
    const wordCount = safeData.content.replace(/<[^>]*>/g, '').split(/\s+/).length
    articleSchema.wordCount = wordCount
    articleSchema.timeRequired = `PT${safeData.reading_time || Math.ceil(wordCount / 200)}M`
  }
  
  schemas.push(articleSchema)
  
  // 2. FAQPage Schema (if available)
  if (safeData.faq_schema) {
    try {
      const faqData = typeof safeData.faq_schema === 'string' 
        ? JSON.parse(safeData.faq_schema) 
        : safeData.faq_schema
      
      // Ensure it has the correct structure
      if (faqData && faqData.mainEntity && Array.isArray(faqData.mainEntity)) {
        const faqSchema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqData.mainEntity.map((faq: any) => ({
            "@type": "Question",
            "name": faq.name || faq.question || '',
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.acceptedAnswer?.text || faq.answer || ''
            }
          }))
        }
        schemas.push(faqSchema)
      }
    } catch (error) {
      console.warn('Error parsing FAQ schema:', error)
    }
  }
  
  // 3. WebPage Schema for better SEO
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": safeData.title || safeData.term,
    "description": description,
    "url": pageUrl,
    "datePublished": safeData.created_at || currentDate,
    "dateModified": safeData.last_modified || safeData.updated_at || safeData.created_at || currentDate,
    "author": {
      "@type": "Organization",
      "name": safeData.author || "Odontoa Tim"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Odontoa"
    }
  }
  
  schemas.push(webPageSchema)
  
  // Validate schema output in development mode
  validateSchemaOutput(schemas)
  
  return schemas
}

/**
 * Validates schema output for development mode
 */
export function validateSchemaOutput(schema: any[]): boolean {
  if (process.env.NODE_ENV !== 'development') {
    return true
  }

  console.log('🔍 Validating schema output...')
  
  // Check if it's an array
  if (!Array.isArray(schema)) {
    console.warn('❌ Schema is not an array')
    return false
  }
  
  // Check if it has at least 1 object
  if (schema.length < 1) {
    console.warn(`❌ Schema should have at least 1 object, got ${schema.length}`)
    return false
  }
  
  // Define valid schema types and their required fields
  const validSchemaTypes = {
    WebPage: ['@context', '@type', 'name', 'description', 'url'],
    Article: ['@context', '@type', 'headline', 'description', 'url', 'author', 'publisher'],
    FAQPage: ['@context', '@type', 'mainEntity']
  }
  
  // Check each schema object
  for (let i = 0; i < schema.length; i++) {
    const obj = schema[i]
    
    if (!obj['@context'] || obj['@context'] !== 'https://schema.org') {
      console.warn(`❌ Schema ${i}: Missing or invalid @context`)
      return false
    }
    
    if (!obj['@type']) {
      console.warn(`❌ Schema ${i}: Missing @type`)
      return false
    }
    
    const schemaType = obj['@type']
    if (!validSchemaTypes[schemaType as keyof typeof validSchemaTypes]) {
      console.warn(`❌ Schema ${i}: Invalid @type "${schemaType}". Valid types: ${Object.keys(validSchemaTypes).join(', ')}`)
      return false
    }
    
    // Check required fields for this type
    const required = validSchemaTypes[schemaType as keyof typeof validSchemaTypes]
    for (const field of required) {
      if (!obj[field]) {
        console.warn(`❌ ${schemaType}: Missing required field '${field}'`)
        return false
      }
    }
  }
  
  // Check optional fields for each schema type
  const article = schema.find(s => s['@type'] === 'Article')
  if (article) {
    if (!article.keywords) {
      console.warn('⚠️ Article: Missing keywords field')
    }
    if (!article.about) {
      console.warn('⚠️ Article: Missing about field')
    }
    if (!article.wordCount) {
      console.warn('⚠️ Article: Missing wordCount field')
    }
    if (!article.timeRequired) {
      console.warn('⚠️ Article: Missing timeRequired field')
    }
    if (!article.datePublished) {
      console.warn('⚠️ Article: Missing datePublished field')
    }
    if (!article.dateModified) {
      console.warn('⚠️ Article: Missing dateModified field')
    }
  }
  
  const faqPage = schema.find(s => s['@type'] === 'FAQPage')
  if (faqPage) {
    if (!faqPage.mainEntity || !Array.isArray(faqPage.mainEntity) || faqPage.mainEntity.length === 0) {
      console.warn('⚠️ FAQPage: Missing or empty mainEntity array')
    } else {
      console.log(`✅ FAQPage: Has ${faqPage.mainEntity.length} questions`)
    }
  }
  
  const webPage = schema.find(s => s['@type'] === 'WebPage')
  if (webPage) {
    if (!webPage.datePublished) {
      console.warn('⚠️ WebPage: Missing datePublished field')
    }
    if (!webPage.dateModified) {
      console.warn('⚠️ WebPage: Missing dateModified field')
    }
  }
  
  console.log('✅ Schema validation passed!')
  console.log('📊 Schema breakdown:')
  console.log(`   - Article: ${article ? '✅' : '❌'}`)
  console.log(`   - FAQPage: ${faqPage ? '✅' : '❌'}`)
  console.log(`   - WebPage: ${webPage ? '✅' : '❌'}`)
  console.log(`   - Total schemas: ${schema.length}`)
  
  return true
}

/**
 * Predloženi tagovi za blogove - kategorije za organizaciju sadržaja
 * Ovi tagovi se koriste za preporučivanje članaka i kategorizaciju
 */
export const SUGGESTED_BLOG_TAGS = [
  {
    name: 'Digitalizacija',
    description: 'Elektronski karton, online zakazivanje, digitalni RTG, cloud softver',
    keywords: ['digitalizacija', 'elektronski karton', 'online zakazivanje', 'digitalni rtg', 'cloud softver', 'digitalni rad', 'papir na digitalni']
  },
  {
    name: 'Upravljanje ordinacijom',
    description: 'Plan terapije, organizacija rada, CRM za stomatologe, vođenje tima',
    keywords: ['upravljanje ordinacijom', 'plan terapije', 'organizacija rada', 'crm', 'vođenje tima', 'workflow', 'organizacija']
  },
  {
    name: 'Zalihe i troškovi',
    description: 'Upravljanje zalihama, praćenje potrošnog materijala, optimizacija nabavke',
    keywords: ['zalihe', 'troškovi', 'potrošni materijal', 'nabavka', 'finansije', 'resursi', 'upravljanje zalihama']
  },
  {
    name: 'Iskustvo pacijenata',
    description: 'Automatski podsetnici, komunikacija, preporuke, zadovoljstvo pacijenata',
    keywords: ['iskustvo pacijenata', 'podsetnici', 'komunikacija', 'preporuke', 'zadovoljstvo', 'loyalnost', 'pacijenti']
  }
] as const

export type SuggestedTagName = typeof SUGGESTED_BLOG_TAGS[number]['name']

/**
 * Funkcija za preporučivanje članaka na osnovu tagova
 * Implementira pametnu logiku za pronalaženje relevantnih članaka
 */
export function getRelatedPostsByTags(
  currentTags: string[],
  allPosts: Array<{id: string, title: string, excerpt: string, slug: string, author: string, tags: string[], created_at: string, featured_image?: string, image_url?: string}>,
  excludePostId: string,
  maxPosts: number = 3
): Array<{id: string, title: string, excerpt: string, slug: string, author: string, tags: string[], created_at: string, featured_image?: string, image_url?: string, relevanceScore: number}> {
  
  // Ako nema tagova, vrati najnovije članke
  if (!currentTags || currentTags.length === 0) {
    return allPosts
      .filter(post => post.id !== excludePostId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, maxPosts)
      .map(post => ({ ...post, relevanceScore: 0 }))
  }

  // Mapiraj tagove na kategorije
  const tagCategories = currentTags.map(tag => {
    const category = SUGGESTED_BLOG_TAGS.find(cat => 
      cat.keywords.some(keyword => 
        tag.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(tag.toLowerCase())
      )
    )
    return category?.name || tag
  })

  // Pronađi članke sa sličnim tagovima i izračunaj relevantnost
  const postsWithScores = allPosts
    .filter(post => post.id !== excludePostId)
    .map(post => {
      let relevanceScore = 0
      
      // Direktno poklapanje tagova (najviše bodova)
      const directMatches = post.tags?.filter(tag => 
        currentTags.some(currentTag => 
          tag.toLowerCase() === currentTag.toLowerCase()
        )
      ) || []
      relevanceScore += directMatches.length * 10

      // Poklapanje kategorija
      const postCategories = post.tags?.map(tag => {
        const category = SUGGESTED_BLOG_TAGS.find(cat => 
          cat.keywords.some(keyword => 
            tag.toLowerCase().includes(keyword.toLowerCase()) ||
            keyword.toLowerCase().includes(tag.toLowerCase())
          )
        )
        return category?.name || tag
      }) || []

      const categoryMatches = postCategories.filter(cat => 
        tagCategories.includes(cat)
      )
      relevanceScore += categoryMatches.length * 5

      // Bonus za članke sa više tagova (veća relevantnost)
      if (post.tags && post.tags.length > 0) {
        relevanceScore += Math.min(post.tags.length, 3)
      }

      return {
        ...post,
        relevanceScore
      }
    })
    .filter(post => post.relevanceScore > 0) // Samo relevantni članci
    .sort((a, b) => b.relevanceScore - a.relevanceScore) // Sortiraj po relevantnosti

  // Ako nema dovoljno relevantnih članaka, dodaj najnovije
  if (postsWithScores.length < maxPosts) {
    const recentPosts = allPosts
      .filter(post => post.id !== excludePostId)
      .filter(post => !postsWithScores.find(scored => scored.id === post.id))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, maxPosts - postsWithScores.length)
      .map(post => ({ ...post, relevanceScore: 0 }))

    return [...postsWithScores, ...recentPosts].slice(0, maxPosts)
  }

  return postsWithScores.slice(0, maxPosts)
}
