import { 
  buildWebPage, 
  buildBreadcrumbList, 
  buildArticle, 
  buildFaqPage, 
  buildCombinedSchema,
  SchemaData 
} from '../buildJsonLd'
import { validateISO8601Date, validateAbsoluteUrl, validateCombinedSchema } from '../validators'

describe('JSON-LD Schema Builders', () => {
  const mockBlogData: SchemaData = {
    title: 'Test Blog Post',
    slug: 'test-blog-post',
    content: 'This is a test blog post content with some questions? And answers.',
    meta_description: 'A test blog post description for SEO',
    image_url: 'https://odontoa.com/images/test-image.jpg',
    alt_text: 'Test image alt text',
    author: 'Test Author',
    author_url: 'https://odontoa.com/o-nama',
    created_at: '2025-01-27T10:00:00+02:00',
    last_modified: '2025-01-27T10:00:00+02:00',
    tags: ['test', 'blog'],
    reading_time: 5
  }

  const mockGlossaryData: SchemaData = {
    term: 'Test Term',
    slug: 'test-term',
    description: 'A test glossary term definition',
    content: 'This is a detailed article about the test term with some questions? And answers.',
    meta_description: 'A test glossary term description for SEO',
    image_url: 'https://odontoa.com/images/test-term.jpg',
    alt_text: 'Test term image alt text',
    author: 'Test Author',
    author_url: 'https://odontoa.com/o-nama',
    created_at: '2025-01-27T10:00:00+02:00',
    last_modified: '2025-01-27T10:00:00+02:00',
    category: 'Test Category',
    difficulty_level: 'beginner',
    why_it_matters: 'This term is important because...'
  }

  describe('buildWebPage', () => {
    it('should build valid WebPage schema for blog', () => {
      const schema = buildWebPage(mockBlogData, 'blog')
      
      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('WebPage')
      expect(schema['@id']).toBe('https://odontoa.com/blogovi/test-blog-post')
      expect(schema.url).toBe('https://odontoa.com/blogovi/test-blog-post')
      expect(schema.name).toBe('Test Blog Post')
      expect(schema.description).toBe('A test blog post description for SEO')
      expect(schema.inLanguage).toBe('sr')
      expect(schema.author['@type']).toBe('Person')
      expect(schema.author.name).toBe('Test Author')
      expect(schema.author.url).toBe('https://odontoa.com/o-nama')
      expect(schema.publisher['@type']).toBe('Organization')
      expect(schema.publisher.name).toBe('Odontoa')
    })

    it('should build valid WebPage schema for glossary', () => {
      const schema = buildWebPage(mockGlossaryData, 'glossary')
      
      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('WebPage')
      expect(schema['@id']).toBe('https://odontoa.com/recnik/test-term')
      expect(schema.url).toBe('https://odontoa.com/recnik/test-term')
      expect(schema.name).toBe('Test Term')
      expect(schema.description).toBe('A test glossary term description for SEO')
      expect(schema.inLanguage).toBe('sr')
    })

    it('should throw error when description is missing', () => {
      const dataWithoutDescription = { ...mockBlogData, meta_description: undefined, description: undefined }
      expect(() => buildWebPage(dataWithoutDescription, 'blog')).toThrow('WebPage schema requires description/meta_description')
    })

    it('should throw error when author_url is missing', () => {
      const dataWithoutAuthorUrl = { ...mockBlogData, author_url: undefined }
      expect(() => buildWebPage(dataWithoutAuthorUrl, 'blog')).toThrow('WebPage schema requires author_url')
    })
  })

  describe('buildBreadcrumbList', () => {
    it('should build valid BreadcrumbList schema for blog', () => {
      const schema = buildBreadcrumbList(mockBlogData, 'blog')
      
      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('BreadcrumbList')
      expect(schema.itemListElement).toHaveLength(3)
      expect(schema.itemListElement[0].name).toBe('Početna')
      expect(schema.itemListElement[1].name).toBe('Blog')
      expect(schema.itemListElement[2].name).toBe('Test Blog Post')
    })

    it('should build valid BreadcrumbList schema for glossary', () => {
      const schema = buildBreadcrumbList(mockGlossaryData, 'glossary')
      
      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('BreadcrumbList')
      expect(schema.itemListElement).toHaveLength(3)
      expect(schema.itemListElement[0].name).toBe('Početna')
      expect(schema.itemListElement[1].name).toBe('Rečnik')
      expect(schema.itemListElement[2].name).toBe('Test Term')
    })

    it('should ensure minimum 3 breadcrumbs', () => {
      const schema = buildBreadcrumbList(mockBlogData, 'page')
      expect(schema.itemListElement.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('buildArticle', () => {
    it('should build valid Article schema for blog', () => {
      const schema = buildArticle(mockBlogData, 'blog')
      
      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('Article')
      expect(schema.headline).toBe('Test Blog Post')
      expect(schema.description).toBe('A test blog post description for SEO')
      expect(schema.image).toBe('https://odontoa.com/images/test-image.jpg')
      expect(schema.inLanguage).toBe('sr')
      expect(schema.author['@type']).toBe('Person')
      expect(schema.author.name).toBe('Test Author')
      expect(schema.author.url).toBe('https://odontoa.com/o-nama')
      expect(schema.publisher['@type']).toBe('Organization')
      expect(schema.publisher.name).toBe('Odontoa')
    })

    it('should build valid Article schema for glossary', () => {
      const schema = buildArticle(mockGlossaryData, 'glossary')
      
      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('Article')
      expect(schema.headline).toBe('Test Term')
      expect(schema.description).toBe('A test glossary term description for SEO')
      expect(schema.image).toBe('https://odontoa.com/images/test-term.jpg')
      expect(schema.inLanguage).toBe('sr')
    })

    it('should throw error when required fields are missing', () => {
      const invalidData = { ...mockBlogData, image_url: undefined }
      expect(() => buildArticle(invalidData, 'blog')).toThrow('Article schema requires image_url')
    })
  })

  describe('buildFaqPage', () => {
    it('should build valid FAQPage schema with minimum 3 FAQs', () => {
      const schema = buildFaqPage(mockBlogData)
      
      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('FAQPage')
      expect(schema.mainEntity).toBeDefined()
      expect(schema.mainEntity.length).toBeGreaterThanOrEqual(3)
      
      schema.mainEntity.forEach(faq => {
        expect(faq['@type']).toBe('Question')
        expect(faq.name).toBeDefined()
        expect(faq.acceptedAnswer['@type']).toBe('Answer')
        expect(faq.acceptedAnswer.text).toBeDefined()
      })
    })

    it('should extract questions from content', () => {
      const dataWithQuestions = {
        ...mockBlogData,
        content: 'What is this? This is the answer. How does it work? It works like this.'
      }
      const schema = buildFaqPage(dataWithQuestions)
      
      expect(schema.mainEntity.length).toBeGreaterThanOrEqual(3)
      const hasQuestionFromContent = schema.mainEntity.some(faq => 
        faq.name.includes('What is this') || faq.name.includes('How does it work')
      )
      expect(hasQuestionFromContent).toBe(true)
    })

    it('should generate contextual FAQs when content has questions', () => {
      const dataWithQuestions = {
        ...mockBlogData,
        content: '<h2>What is this?</h2><p>This is the answer.</p><h3>How does it work?</h3><p>It works like this.</p>'
      }
      const schema = buildFaqPage(dataWithQuestions)
      
      expect(schema.mainEntity.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('buildCombinedSchema', () => {
    it('should build valid combined schema for blog with exactly 4 objects', () => {
      const schemas = buildCombinedSchema(mockBlogData, 'blog')
      
      expect(Array.isArray(schemas)).toBe(true)
      expect(schemas).toHaveLength(4)
      
      const schemaTypes = schemas.map(schema => schema['@type'])
      expect(schemaTypes).toContain('WebPage')
      expect(schemaTypes).toContain('BreadcrumbList')
      expect(schemaTypes).toContain('Article')
      expect(schemaTypes).toContain('FAQPage')
    })

    it('should build valid combined schema for glossary with exactly 4 objects', () => {
      const schemas = buildCombinedSchema(mockGlossaryData, 'glossary')
      
      expect(Array.isArray(schemas)).toBe(true)
      expect(schemas).toHaveLength(4)
      
      const schemaTypes = schemas.map(schema => schema['@type'])
      expect(schemaTypes).toContain('WebPage')
      expect(schemaTypes).toContain('BreadcrumbList')
      expect(schemaTypes).toContain('Article')
      expect(schemaTypes).toContain('FAQPage')
    })

    it('should throw error when required fields are missing', () => {
      const invalidData = {
        ...mockBlogData,
        image_url: undefined,
        author_url: undefined
      }
      
      expect(() => buildCombinedSchema(invalidData, 'blog')).toThrow()
    })

    it('should validate schema structure', () => {
      const mockBlogData: SchemaData = {
        title: 'Test Blog Post',
        slug: 'test-blog-post',
        content: 'Test content',
        meta_description: 'Test description',
        image_url: 'https://odontoa.com/test.jpg',
        author: 'Test Author',
        author_url: 'https://odontoa.com/o-nama',
        created_at: '2025-01-27T10:00:00+02:00'
      }
      
      const schemas = buildCombinedSchema(mockBlogData, 'blog')
      expect(validateCombinedSchema(schemas)).toBe(true)
    })

    it('should reject schema with wrong number of objects', () => {
      const schemas = [{ '@type': 'WebPage' }]
      expect(validateCombinedSchema(schemas)).toBe(false)
    })

    it('should reject schema with missing required types', () => {
      const schemas = [
        { '@type': 'WebPage' },
        { '@type': 'BreadcrumbList' },
        { '@type': 'Article' }
        // Missing FAQPage
      ]
      expect(validateCombinedSchema(schemas)).toBe(false)
    })
  })
})

describe('Schema Validators', () => {
  describe('validateISO8601Date', () => {
    it('should validate correct ISO 8601 date', () => {
      const date = '2025-01-27T10:00:00+02:00'
      expect(() => validateISO8601Date(date)).not.toThrow()
    })

    it('should throw error for invalid date', () => {
      expect(() => validateISO8601Date('invalid-date')).toThrow()
    })

    it('should throw error for missing date', () => {
      expect(() => validateISO8601Date(undefined)).toThrow()
    })
  })

  describe('validateAbsoluteUrl', () => {
    it('should validate correct absolute URL', () => {
      const url = 'https://odontoa.com/test'
      expect(() => validateAbsoluteUrl(url)).not.toThrow()
    })

    it('should throw error for relative URL', () => {
      expect(() => validateAbsoluteUrl('/test')).toThrow()
    })

    it('should throw error for missing URL', () => {
      expect(() => validateAbsoluteUrl(undefined)).toThrow()
    })
  })

  describe('validateCombinedSchema', () => {
    it('should validate correct combined schema', () => {
      const mockBlogData: SchemaData = {
        title: 'Test Blog Post',
        slug: 'test-blog-post',
        content: 'Test content',
        meta_description: 'Test description',
        image_url: 'https://odontoa.com/test.jpg',
        author: 'Test Author',
        author_url: 'https://odontoa.com/o-nama',
        created_at: '2025-01-27T10:00:00+02:00'
      }
      
      const schemas = buildCombinedSchema(mockBlogData, 'blog')
      expect(validateCombinedSchema(schemas)).toBe(true)
    })

    it('should reject schema with wrong number of objects', () => {
      const schemas = [{ '@type': 'WebPage' }]
      expect(validateCombinedSchema(schemas)).toBe(false)
    })

    it('should reject schema with missing required types', () => {
      const schemas = [
        { '@type': 'WebPage' },
        { '@type': 'BreadcrumbList' },
        { '@type': 'Article' }
        // Missing FAQPage
      ]
      expect(validateCombinedSchema(schemas)).toBe(false)
    })
  })
})
