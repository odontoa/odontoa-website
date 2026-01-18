'use client'

import React from 'react'
import Head from 'next/head'
import { validateCombinedSchema, validateDevelopmentWarnings } from '@/lib/schema/validators'

interface SeoJsonLdProps {
  schema: any[]
  pageTitle?: string
  pageDescription?: string
  visibleContent?: string // For FAQ content synchronization validation
  canonicalUrl?: string // Canonical URL for the page
}

export const SeoJsonLd: React.FC<SeoJsonLdProps> = ({ 
  schema, 
  pageTitle = 'Odontoa',
  pageDescription = 'Stomatološka ordinacija Odontoa',
  visibleContent = '',
  canonicalUrl
}) => {
  // Validate schema in development mode
  if (process.env.NODE_ENV === 'development') {
    const isValid = validateCombinedSchema(schema)
    if (!isValid) {
      console.error('❌ Invalid schema provided to SeoJsonLd component:', schema)
    } else {
      console.log('✅ Schema validation passed')
    }

    // Additional development warnings
    if (schema.length > 0) {
      const webPage = schema.find(s => s['@type'] === 'WebPage')
      const breadcrumbList = schema.find(s => s['@type'] === 'BreadcrumbList')
      const article = schema.find(s => s['@type'] === 'Article')
      const faqPage = schema.find(s => s['@type'] === 'FAQPage')

      // Log schema structure
      console.log('📊 Schema Structure:', {
        webPage: webPage ? '✅' : '❌',
        breadcrumbList: breadcrumbList ? `✅ (${breadcrumbList.itemListElement?.length || 0} breadcrumbs)` : '❌',
        article: article ? '✅' : '❌',
        faqPage: faqPage ? `✅ (${faqPage.mainEntity?.length || 0} FAQs)` : '❌'
      })

      // Validate FAQ content synchronization if visible content is provided
      if (visibleContent && faqPage) {
        const syncWarnings = validateFAQContentSync(faqPage, visibleContent)
        if (syncWarnings.length > 0) {
          console.warn('⚠️ FAQ Content Sync Warnings:', syncWarnings)
        }
      }
    }
  }

  // Ensure schema is an array
  const schemaArray = Array.isArray(schema) ? schema : [schema]
  
  // Validate schema length
  if (schemaArray.length !== 4) {
    console.error(`❌ Schema must have exactly 4 objects, got ${schemaArray.length}`)
    if (process.env.NODE_ENV === 'development') {
      return null // Don't render invalid schema in development
    }
  }
  
  // Generate JSON-LD script content
  const jsonLdContent = JSON.stringify(schemaArray, null, 2)

  return (
    <Head>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdContent
        }}
      />
      
      {/* Additional SEO meta tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Odontoa" />
      <meta property="og:locale" content="sr_RS" />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:site" content="@odontoa" />
      
      {/* Additional structured data hints */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Serbian" />
      <meta name="geo.region" content="RS" />
      <meta name="geo.placename" content="Serbia" />
      
      {/* Schema.org hints */}
      <meta name="schema:type" content="WebPage" />
      <meta name="schema:language" content="sr" />
      
      {/* Canonical URL */}
      {canonicalUrl && (
        <link rel="canonical" href={canonicalUrl} />
      )}
    </Head>
  )
}

// Helper function for FAQ content synchronization validation
function validateFAQContentSync(faqPage: any, visibleContent: string): string[] {
  const warnings: string[] = []
  
  try {
    if (!faqPage.mainEntity || !Array.isArray(faqPage.mainEntity)) {
      return warnings
    }
    
    const cleanContent = visibleContent.replace(/<[^>]*>/g, '').toLowerCase()
    
    faqPage.mainEntity.forEach((faq: any, index: number) => {
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

export default SeoJsonLd

