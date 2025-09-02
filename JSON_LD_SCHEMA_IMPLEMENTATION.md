# 🎯 JSON-LD Schema Generator System Implementation

## 📋 Overview

This implementation provides a comprehensive JSON-LD schema generator system for the Odontoa project. Every page (blog, glossary, press, or regular page) now outputs a combined JSON-LD schema as a single array with 4 objects: WebPage, BreadcrumbList, Article, and FAQPage.

## 🏗️ Architecture

### Core Components

1. **Schema Builders** (`src/lib/schema/buildJsonLd.ts`)
   - `buildWebPage()` - Creates WebPage schema
   - `buildBreadcrumbList()` - Creates BreadcrumbList schema  
   - `buildArticle()` - Creates Article schema
   - `buildFaqPage()` - Creates FAQPage schema
   - `buildCombinedSchema()` - Combines all schemas into array

2. **Validators** (`src/lib/schema/validators.ts`)
   - `validateISO8601Date()` - Validates ISO 8601 date format
   - `validateAbsoluteUrl()` - Validates absolute URLs
   - `validateCombinedSchema()` - Validates complete schema array
   - `validateSchemaData()` - Validates required fields

3. **React Component** (`src/components/SeoJsonLd.tsx`)
   - Injects JSON-LD schema into `<Head>` using `dangerouslySetInnerHTML`
   - Provides additional SEO meta tags
   - Includes development mode validation

## 📊 Schema Structure

### 1. WebPage Schema
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://odontoa.com/blogovi/slug",
  "url": "https://odontoa.com/blogovi/slug",
  "name": "Page Title",
  "description": "Meta description",
  "inLanguage": "sr",
  "datePublished": "2025-01-27T10:00:00+02:00",
  "dateModified": "2025-01-27T10:00:00+02:00",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://odontoa.com/o-nama"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Odontoa",
    "url": "https://odontoa.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://odontoa.com/odontoa-logo1.png"
    }
  }
}
```

### 2. BreadcrumbList Schema
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Početna",
      "item": "https://odontoa.com"
    },
    {
      "@type": "ListItem", 
      "position": 2,
      "name": "Blog",
      "item": "https://odontoa.com/blogovi"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Page Title",
      "item": "https://odontoa.com/blogovi/slug"
    }
  ]
}
```

### 3. Article Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "description": "Meta description",
  "image": "https://odontoa.com/images/image.jpg",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://odontoa.com/o-nama"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Odontoa",
    "url": "https://odontoa.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://odontoa.com/odontoa-logo1.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://odontoa.com/blogovi/slug"
  },
  "datePublished": "2025-01-27T10:00:00+02:00",
  "dateModified": "2025-01-27T10:00:00+02:00",
  "inLanguage": "sr",
  "articleBody": "Article content...",
  "wordCount": 500,
  "timeRequired": "PT5M",
  "keywords": "tag1, tag2, tag3"
}
```

### 4. FAQPage Schema
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is this?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "This is the answer..."
      }
    }
  ]
}
```

## 🔧 Implementation Details

### Database Schema Updates

Added required fields to support JSON-LD schema generation:

**Blogs Table:**
- `author_url` (text) - Required for Article schema
- `image_url` (text) - Required for Article schema  
- `alt_text` (text) - Required for accessibility
- `meta_description` (text) - Required for SEO

**Glossary Table:**
- `author` (text) - Required for Article schema
- `author_url` (text) - Required for Article schema
- `image_url` (text) - Required for Article schema
- `alt_text` (text) - Required for accessibility
- `meta_description` (text) - Required for SEO

### Page Integration

**Blog Posts** (`src/app/blogovi/[slug]/page.tsx`):
```typescript
// Generate JSON-LD schema
try {
  const validationErrors = validateSchemaData(data, 'blog')
  if (validationErrors.length > 0) {
    console.warn('Schema validation errors:', validationErrors)
    setSchemaError(validationErrors.join(', '))
  } else {
    const generatedSchema = buildCombinedSchema(data, 'blog')
    setSchema(generatedSchema)
  }
} catch (error) {
  console.error('Error generating schema:', error)
  setSchemaError(error instanceof Error ? error.message : 'Unknown error')
}

// Render schema
{schema.length > 0 && (
  <SeoJsonLd 
    schema={schema}
    pageTitle={`${blog.title} | Odontoa`}
    pageDescription={blog.meta_description || blog.summary || blog.excerpt}
  />
)}
```

**Glossary Terms** (`src/app/recnik/[slug]/page.tsx`):
```typescript
// Generate JSON-LD schema
try {
  const validationErrors = validateSchemaData(data, 'glossary')
  if (validationErrors.length > 0) {
    console.warn('Schema validation errors:', validationErrors)
    setSchemaError(validationErrors.join(', '))
  } else {
    const generatedSchema = buildCombinedSchema(data, 'glossary')
    setSchema(generatedSchema)
  }
} catch (error) {
  console.error('Error generating schema:', error)
  setSchemaError(error instanceof Error ? error.message : 'Unknown error')
}

// Render schema
{schema.length > 0 && (
  <SeoJsonLd 
    schema={schema}
    pageTitle={`${term.term} | Odontoa Rečnik`}
    pageDescription={term.meta_description || term.definition}
  />
)}
```

### Admin Form Updates

**BlogForm** (`src/components/BlogForm.tsx`):
- Added `author_url` field (required)
- Made `image_url` and `alt_text` required
- Updated validation schema
- Updated form submission to include new fields

**GlossaryForm** (`src/components/GlossaryForm.tsx`):
- Added `author`, `author_url`, `image_url`, `alt_text`, `meta_description` fields (all required)
- Updated validation schema
- Updated form submission to include new fields

## ✅ Validation Rules

### Required Fields
- **Slug** - Page identifier
- **Meta Description** - SEO description
- **Image URL** - Featured image (absolute URL)
- **Author** - Content author name
- **Author URL** - Author profile URL (absolute URL)
- **Created Date** - ISO 8601 format

### Validation Functions
- **ISO 8601 Date Validation** - Ensures proper date format with timezone
- **Absolute URL Validation** - Ensures URLs are absolute (https://...)
- **Schema Structure Validation** - Ensures all required schema types are present
- **FAQ Content Validation** - Ensures minimum 3 FAQs with proper structure

## 🧪 Testing

Unit tests are available in `src/lib/schema/__tests__/buildJsonLd.test.ts`:

- **Schema Builder Tests** - Tests for each schema builder function
- **Validation Tests** - Tests for date, URL, and schema validation
- **Error Handling Tests** - Tests for missing required fields
- **Integration Tests** - Tests for combined schema generation

Run tests with:
```bash
npm test src/lib/schema/__tests__/buildJsonLd.test.ts
```

## 🚀 Usage Examples

### Basic Usage
```typescript
import { buildCombinedSchema } from '@/lib/schema/buildJsonLd'
import { SeoJsonLd } from '@/components/SeoJsonLd'

// Generate schema
const schema = buildCombinedSchema(pageData, 'blog')

// Render in component
<SeoJsonLd 
  schema={schema}
  pageTitle="Page Title | Odontoa"
  pageDescription="Page description"
/>
```

### Error Handling
```typescript
import { validateSchemaData } from '@/lib/schema/validators'

try {
  const validationErrors = validateSchemaData(data, 'blog')
  if (validationErrors.length > 0) {
    console.warn('Validation errors:', validationErrors)
    // Handle validation errors
  } else {
    const schema = buildCombinedSchema(data, 'blog')
    // Use schema
  }
} catch (error) {
  console.error('Schema generation error:', error)
  // Handle generation errors
}
```

## 📈 SEO Benefits

### Google Rich Results
- **FAQ Rich Snippets** - FAQ content appears in search results
- **Article Rich Snippets** - Article metadata in search results
- **Breadcrumb Navigation** - Breadcrumb trail in search results
- **WebPage Schema** - Enhanced page information

### LLM Optimization
- **Structured Data** - Clear content structure for AI models
- **Semantic Markup** - Meaningful relationships between content
- **Contextual Information** - Rich metadata for content understanding

### Performance
- **Client-Side Generation** - No server-side rendering overhead
- **Validation** - Runtime validation prevents invalid schemas
- **Error Handling** - Graceful degradation when schema generation fails

## 🔍 Monitoring

### Development Mode
- Schema validation errors are logged to console
- Visual error indicators for missing required fields
- Schema structure validation warnings

### Production Mode
- Silent error handling to prevent page crashes
- Fallback to basic SEO meta tags if schema generation fails
- Performance monitoring for schema generation time

## 📝 Migration Guide

### For Existing Content
1. **Update Blog Posts** - Add missing required fields (author_url, image_url, alt_text)
2. **Update Glossary Terms** - Add missing required fields (author, author_url, image_url, alt_text, meta_description)
3. **Validate Existing Data** - Ensure all required fields are populated
4. **Test Schema Generation** - Verify schema generation works for all pages

### For New Content
1. **Use Updated Forms** - All required fields are now enforced
2. **Follow Validation Rules** - Ensure all required fields are provided
3. **Test Schema Output** - Verify JSON-LD schema is generated correctly

## 🎯 Future Enhancements

### Planned Features
- **Press Release Schema** - Specific schema for press releases
- **Event Schema** - Schema for dental events and appointments
- **Review Schema** - Schema for patient reviews and testimonials
- **Local Business Schema** - Enhanced local business information

### Performance Optimizations
- **Schema Caching** - Cache generated schemas for better performance
- **Lazy Loading** - Load schema generation only when needed
- **Bundle Optimization** - Reduce bundle size for schema generation

## 🔧 Troubleshooting

### Common Issues

**Missing Required Fields:**
```
Error: Article schema requires image_url
```
Solution: Ensure all required fields are provided in the form.

**Invalid Date Format:**
```
Error: Invalid ISO 8601 date format
```
Solution: Ensure dates are in ISO 8601 format with timezone.

**Invalid URL Format:**
```
Error: Invalid absolute URL format
```
Solution: Ensure all URLs are absolute (https://...).

**Schema Validation Errors:**
```
Error: Combined schema missing required type: FAQPage
```
Solution: Ensure FAQ generation is working correctly.

### Debug Mode
Enable debug mode by setting `NODE_ENV=development` to see detailed validation errors and schema generation logs.

## 📚 Resources

- [Schema.org Documentation](https://schema.org/)
- [Google Rich Results Guidelines](https://developers.google.com/search/docs/advanced/structured-data/intro-structured-data)
- [JSON-LD Specification](https://json-ld.org/)
- [Next.js Head Component](https://nextjs.org/docs/api-reference/next/head)

---

**Implementation Status:** ✅ Complete  
**Last Updated:** January 27, 2025  
**Version:** 1.0.0
