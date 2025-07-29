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
  // Remove HTML tags
  const cleanContent = content.replace(/<[^>]*>/g, '')
  
  // Create description from content
  let description = cleanContent
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, maxLength)

  // If content is too short, add title context
  if (description.length < 100) {
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
  const titleKeywords = extractKeywords(title)
  const contentKeywords = extractKeywords(content.replace(/<[^>]*>/g, ''))
  
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
export function generateStructuredData(type: 'article' | 'glossary', data: any) {
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
    "url": `https://odontoa.com/${type === 'article' ? 'blogovi' : 'recnik'}/${data.slug}`,
    "datePublished": data.created_at,
    "dateModified": data.updated_at || data.created_at
  }

  if (type === 'article') {
    return {
      ...baseData,
      "headline": data.title,
      "description": data.meta_description || data.excerpt,
      "author": {
        "@type": "Person",
        "name": data.author
      },
      "keywords": data.tags?.join(', ') || '',
      "articleBody": data.content,
      "image": data.featured_image ? {
        "@type": "ImageObject",
        "url": data.featured_image
      } : undefined
    }
  } else {
    return {
      ...baseData,
      "name": data.term,
      "description": data.definition,
      "inDefinedTermSet": {
        "@type": "DefinedTermSet",
        "name": "Stomatološki rečnik",
        "url": "https://odontoa.com/recnik"
      }
    }
  }
}

/**
 * Generates FAQ structured data
 */
export function generateFAQStructuredData(faqs: Array<{question: string, answer: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
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
 * Sanitizes HTML content for safe rendering
 */
export function sanitizeHTML(html: string): string {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
}
