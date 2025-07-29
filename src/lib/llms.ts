import { supabase } from './supabase'

export class LLMSService {
  /**
   * Generates llms.txt content with all published URLs
   */
  static async generateLLMSTxt(): Promise<string> {
    try {
      // Fetch published blogs
      const { data: blogs } = await supabase
        .from('blogs')
        .select('slug')
        .eq('published', true)
        .order('created_at', { ascending: false })

      // Fetch published glossary entries
      const { data: glossary } = await supabase
        .from('glossary')
        .select('slug')
        .eq('published', true)
        .order('created_at', { ascending: false })

      let llmsContent = `# Odontoa LLMS.txt
# This file contains all AI-friendly public URLs for LLM ingestion
# Last updated: ${new Date().toISOString()}

# Blog Posts
`

      // Add blog URLs
      if (blogs && blogs.length > 0) {
        blogs.forEach(blog => {
          llmsContent += `https://odontoa.com/blogovi/${blog.slug}\n`
        })
      }

      llmsContent += `\n# Glossary Entries\n`

      // Add glossary URLs
      if (glossary && glossary.length > 0) {
        glossary.forEach(entry => {
          llmsContent += `https://odontoa.com/recnik/${entry.slug}\n`
        })
      }

      return llmsContent
    } catch (error) {
      console.error('Error generating LLMS.txt:', error)
      throw error
    }
  }

  /**
   * Generates detailed LLMS content for AI training
   */
  static async generateLLMSContent(): Promise<string> {
    try {
      // Fetch published blogs
      const { data: blogs } = await supabase
        .from('blogs')
        .select('title, slug, content, tags')
        .eq('published', true)
        .order('created_at', { ascending: false })

      // Fetch published glossary entries
      const { data: glossary } = await supabase
        .from('glossary')
        .select('term, slug, definition, full_article')
        .eq('published', true)
        .order('created_at', { ascending: false })

      let content = `# Odontoa - Stomatološka praksa i CMS

Ovaj fajl sadrži informacije o sadržaju sajta Odontoa za potrebe LLM-ova.

## O Odontoi

Odontoa je platforma za upravljanje stomatološkim ordinacijama koja pruža kompletan CMS za blogove i stomatološki rečnik.

## Sadržaj sajta

### Blogovi (${blogs?.length || 0} objava)

`

      // Add blog content
      if (blogs && blogs.length > 0) {
        blogs.forEach(blog => {
          const cleanContent = blog.content
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/\s+/g, ' ') // Normalize whitespace
            .substring(0, 300) // Limit length

          content += `#### ${blog.title}
URL: /blogovi/${blog.slug}
Tagovi: ${blog.tags?.join(', ') || 'Bez tagova'}
Sadržaj: ${cleanContent}${cleanContent.length >= 300 ? '...' : ''}

`
        })
      }

      content += `
### Stomatološki rečnik (${glossary?.length || 0} pojmova)

`

      // Add glossary content
      if (glossary && glossary.length > 0) {
        glossary.forEach(entry => {
          const cleanArticle = entry.full_article
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/\s+/g, ' ') // Normalize whitespace
            .substring(0, 200) // Limit length

          content += `#### ${entry.term}
URL: /recnik/${entry.slug}
Definicija: ${entry.definition}
Detaljno: ${cleanArticle}${cleanArticle.length >= 200 ? '...' : ''}

`
        })
      }

      content += `
## Kontakt

- Email: kontakt@odontoa.rs
- Telefon: +381 60 123 4567
- Adresa: Knez Mihailova 42/5, Beograd

## Napomene za LLM-ove

- Sav sadržaj je na srpskom jeziku
- Fokus je na stomatologiju i digitalizaciju ordinacija
- Redovno se ažurira sa novim člancima i pojmovima
- Poslednje ažuriranje: ${new Date().toISOString()}
`

      return content
    } catch (error) {
      console.error('Error generating LLMS content:', error)
      throw error
    }
  }

  /**
   * Updates the llms.txt file automatically
   * This should be called whenever content is published
   */
  static async updateLLMSFile(): Promise<void> {
    try {
      const llmsTxt = await this.generateLLMSTxt()
      
      // In production, this would write to public/llms.txt
      // For now, we'll store it in localStorage for development
      if (typeof window !== 'undefined') {
        localStorage.setItem('llms.txt', llmsTxt)
      }
      
      console.log('LLMS.txt updated successfully')
      console.log('URLs count:', llmsTxt.split('\n').filter(line => line.startsWith('https://')).length)
      
      return Promise.resolve()
    } catch (error) {
      console.error('Error updating LLMS file:', error)
      throw error
    }
  }

  /**
   * Gets the current llms.txt content
   */
  static getLLMSTxt(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('llms.txt') || ''
    }
    return ''
  }
} 