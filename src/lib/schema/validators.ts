/**
 * Validates ISO 8601 date format
 */
export function validateISO8601Date(dateString?: string): string {
  if (!dateString) {
    throw new Error('Date is required for schema')
  }

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format')
    }

    // Convert to ISO 8601 format with timezone
    const isoString = date.toISOString()
    
    // If the original string has timezone info, preserve it
    if (dateString.includes('+') || dateString.includes('-') && dateString.includes('T')) {
      return dateString
    }

    // Otherwise, add timezone offset
    const offset = date.getTimezoneOffset()
    const hours = Math.abs(Math.floor(offset / 60))
    const minutes = Math.abs(offset % 60)
    const sign = offset > 0 ? '-' : '+'
    
    return `${isoString.slice(0, -1)}${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  } catch (error) {
    throw new Error(`Invalid ISO 8601 date format: ${dateString}`)
  }
}

/**
 * Validates absolute URL format
 */
export function validateAbsoluteUrl(url?: string): string {
  if (!url) {
    throw new Error('URL is required for schema')
  }

  try {
    const urlObj = new URL(url)
    if (urlObj.protocol !== 'https:' && urlObj.protocol !== 'http:') {
      throw new Error('URL must use HTTP or HTTPS protocol')
    }
    return url
  } catch (error) {
    throw new Error(`Invalid absolute URL format: ${url}`)
  }
}

/**
 * Validates that image URL is provided and absolute
 */
export function validateImageUrl(imageUrl?: string): string {
  if (!imageUrl) {
    throw new Error('Image URL is required for schema')
  }
  return validateAbsoluteUrl(imageUrl)
}

/**
 * Validates that author URL is provided and absolute
 */
export function validateAuthorUrl(authorUrl?: string): string {
  if (!authorUrl) {
    throw new Error('Author URL is required for schema')
  }
  return validateAbsoluteUrl(authorUrl)
}

/**
 * Validates FAQ schema structure
 */
export function validateFAQSchema(schema: any): boolean {
  try {
    if (!schema || typeof schema !== 'object') {
      throw new Error('FAQ schema must be an object')
    }
    
    if (schema['@context'] !== 'https://schema.org') {
      throw new Error('FAQ schema must have @context: https://schema.org')
    }
    
    if (schema['@type'] !== 'FAQPage') {
      throw new Error('FAQ schema must have @type: FAQPage')
    }
    
    if (!Array.isArray(schema.mainEntity)) {
      throw new Error('FAQ schema must have mainEntity array')
    }
    
    if (schema.mainEntity.length < 3) {
      throw new Error('FAQ schema must have at least 3 questions')
    }
    
    for (const item of schema.mainEntity) {
      if (item['@type'] !== 'Question') {
        throw new Error('Each FAQ item must have @type: Question')
      }
      
      if (!item.name || typeof item.name !== 'string') {
        throw new Error('Each FAQ item must have a name (question)')
      }
      
      if (!item.acceptedAnswer || item.acceptedAnswer['@type'] !== 'Answer') {
        throw new Error('Each FAQ item must have acceptedAnswer with @type: Answer')
      }
      
      if (!item.acceptedAnswer.text || typeof item.acceptedAnswer.text !== 'string') {
        throw new Error('Each FAQ answer must have text')
      }
    }
    
    return true
  } catch (error) {
    console.error('FAQ schema validation error:', error)
    return false
  }
}

/**
 * Validates combined schema array
 */
export function validateCombinedSchema(schemas: any[]): boolean {
  try {
    if (!Array.isArray(schemas)) {
      throw new Error('Combined schema must be an array')
    }
    
    if (schemas.length !== 4) {
      throw new Error('Combined schema must have exactly 4 schemas (WebPage, BreadcrumbList, Article, FAQPage)')
    }
    
    const requiredTypes = ['WebPage', 'BreadcrumbList', 'Article', 'FAQPage']
    const foundTypes = schemas.map(schema => schema['@type']).filter(Boolean)
    
    for (const requiredType of requiredTypes) {
      if (!foundTypes.includes(requiredType)) {
        throw new Error(`Combined schema missing required type: ${requiredType}`)
      }
    }
    
    // Validate each schema type
    const webPage = schemas.find(s => s['@type'] === 'WebPage')
    const breadcrumbList = schemas.find(s => s['@type'] === 'BreadcrumbList')
    const article = schemas.find(s => s['@type'] === 'Article')
    const faqPage = schemas.find(s => s['@type'] === 'FAQPage')
    
    // Validate WebPage
    if (!webPage.inLanguage || webPage.inLanguage !== 'sr') {
      throw new Error('WebPage schema must have inLanguage: "sr"')
    }
    
    // Validate BreadcrumbList
    if (!breadcrumbList.itemListElement || breadcrumbList.itemListElement.length < 3) {
      throw new Error('BreadcrumbList must have at least 3 breadcrumbs')
    }
    
    // Validate Article
    if (!article.inLanguage || article.inLanguage !== 'sr') {
      throw new Error('Article schema must have inLanguage: "sr"')
    }
    
    if (!article.image) {
      throw new Error('Article schema must have image field')
    }
    
    if (!article.author || article.author['@type'] !== 'Person') {
      throw new Error('Article schema must have author as Person type')
    }
    
    if (!article.author.url) {
      throw new Error('Article author must have url field')
    }
    
    // Validate FAQPage
    if (!faqPage.mainEntity || faqPage.mainEntity.length < 3) {
      throw new Error('FAQPage must have at least 3 questions')
    }
    
    return true
  } catch (error) {
    console.error('Combined schema validation error:', error)
    return false
  }
}

/**
 * Validates that all required fields are present for schema generation
 */
export function validateSchemaData(data: any, pageType: 'blog' | 'glossary' | 'press' | 'page'): string[] {
  const errors: string[] = []
  
  // Common required fields
  if (!data.slug) {
    errors.push('Slug is required')
  }
  
  if (!data.meta_description && !data.description) {
    errors.push('Meta description is required')
  }
  
  if (!data.image_url) {
    errors.push('Image URL is required')
  }
  
  if (!data.author) {
    errors.push('Author is required')
  }
  
  if (!data.author_url) {
    errors.push('Author URL is required')
  }
  
  if (!data.created_at) {
    errors.push('Created date is required')
  }
  
  // Type-specific validations
  if (pageType === 'blog' || pageType === 'glossary') {
    if (!data.title && !data.term) {
      errors.push('Title or term is required')
    }
    
    if (!data.content && !data.full_article) {
      errors.push('Content is required')
    }
  }
  
  return errors
}

/**
 * Validates FAQ content synchronization with visible content
 */
export function validateFAQContentSync(faqSchema: any, visibleContent: string): string[] {
  const warnings: string[] = []
  
  try {
    if (!faqSchema || !faqSchema.mainEntity) {
      warnings.push('FAQ schema is missing or invalid')
      return warnings
    }
    
    const cleanContent = visibleContent.replace(/<[^>]*>/g, '').toLowerCase()
    
    faqSchema.mainEntity.forEach((faq: any, index: number) => {
      const question = faq.name || faq.question || ''
      const answer = faq.acceptedAnswer?.text || faq.answer || ''
      
      // Check if question appears in visible content
      if (question && !cleanContent.includes(question.toLowerCase().replace('?', ''))) {
        warnings.push(`FAQ question ${index + 1} not found in visible content: "${question}"`)
      }
      
      // Check if answer appears in visible content (partial match)
      if (answer) {
        const answerWords = answer.split(' ').slice(0, 5).join(' ').toLowerCase()
        if (!cleanContent.includes(answerWords)) {
          warnings.push(`FAQ answer ${index + 1} may not be in visible content: "${answer.substring(0, 50)}..."`)
        }
      }
    })
    
  } catch (error) {
    warnings.push('Error validating FAQ content synchronization')
  }
  
  return warnings
}

/**
 * Development mode validation warnings
 */
export function validateDevelopmentWarnings(data: any, pageType: 'blog' | 'glossary' | 'press' | 'page'): void {
  if (process.env.NODE_ENV !== 'development') {
    return
  }
  
  const warnings: string[] = []
  
  // Check for missing inLanguage
  if (!data.inLanguage) {
    warnings.push('Missing inLanguage field - should be "sr"')
  }
  
  // Check for missing breadcrumbs
  if (!data.breadcrumbs || data.breadcrumbs.length < 3) {
    warnings.push('Missing or insufficient breadcrumbs (minimum 3 required)')
  }
  
  // Check for insufficient FAQs
  if (data.faq_schema) {
    try {
      const faqData = typeof data.faq_schema === 'string' 
        ? JSON.parse(data.faq_schema) 
        : data.faq_schema
      
      if (faqData.mainEntity && faqData.mainEntity.length < 3) {
        warnings.push('FAQ schema has less than 3 questions (minimum required)')
      }
    } catch (error) {
      warnings.push('Invalid FAQ schema format')
    }
  }
  
  // Log warnings
  if (warnings.length > 0) {
    console.warn('🔍 Schema Development Warnings:', warnings)
  }
}
