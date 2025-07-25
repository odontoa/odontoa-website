export interface FAQItem {
  "@type": "Question"
  name: string
  acceptedAnswer: {
    "@type": "Answer"
    text: string
  }
}

export interface FAQSchema {
  "@context": "https://schema.org"
  "@type": "FAQPage"
  mainEntity: FAQItem[]
}

export class FAQGenerator {
  /**
   * Automatically generates FAQ schema from blog content
   */
  static generateFromContent(title: string, content: string): FAQSchema {
    const questions = this.extractQuestionsFromContent(content)
    const faqItems: FAQItem[] = []

    // Add basic questions based on title
    faqItems.push({
      "@type": "Question",
      name: `Šta je ${title.toLowerCase()}?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: this.extractAnswerFromContent(content, 0, 200)
      }
    })

    // Add extracted questions from content
    questions.forEach((question, index) => {
      const answer = this.extractAnswerFromContent(content, question.position, 300)
      if (answer && answer.length > 50) {
        faqItems.push({
          "@type": "Question",
          name: question.text,
          acceptedAnswer: {
            "@type": "Answer",
            text: answer
          }
        })
      }
    })

    // Add common dental-related questions if we don't have enough
    if (faqItems.length < 3) {
      faqItems.push({
        "@type": "Question",
        name: `Kako funkcioniše ${title.toLowerCase()}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "Detaljne informacije o ovom postupku možete pronaći u našem članku koji objašnjava sve aspekte ove teme."
        }
      })

      faqItems.push({
        "@type": "Question",
        name: `Da li je ${title.toLowerCase()} bezbedno?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "Da, svi naši postupci su bezbedni i odobreni od strane relevantnih medicinskih institucija."
        }
      })
    }

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.slice(0, 10) // Limit to 10 questions
    }
  }

  /**
   * Extracts questions from content by looking for sentences ending with ?
   */
  private static extractQuestionsFromContent(content: string): Array<{text: string, position: number}> {
    const questions: Array<{text: string, position: number}> = []
    
    // Remove HTML tags for better text processing
    const cleanContent = content.replace(/<[^>]*>/g, '')
    
    // Split into sentences and find questions
    const sentences = cleanContent.split(/[.!?]+/).filter(s => s.trim().length > 0)
    
    sentences.forEach((sentence, index) => {
      const trimmedSentence = sentence.trim()
      if (trimmedSentence.endsWith('?')) {
        questions.push({
          text: trimmedSentence,
          position: cleanContent.indexOf(trimmedSentence)
        })
      }
    })

    return questions
  }

  /**
   * Extracts answer text from content starting from a given position
   */
  private static extractAnswerFromContent(content: string, startPosition: number, maxLength: number): string {
    // Remove HTML tags
    const cleanContent = content.replace(/<[^>]*>/g, '')
    
    // Get text starting from position
    const textFromPosition = cleanContent.substring(startPosition)
    
    // Find the next sentence or paragraph
    const nextSentenceEnd = textFromPosition.search(/[.!?]\s+/)
    const endPosition = nextSentenceEnd > 0 ? nextSentenceEnd + 1 : maxLength
    
    let answer = textFromPosition.substring(0, Math.min(endPosition, maxLength))
    
    // Clean up the answer
    answer = answer.trim()
    if (answer.length > maxLength) {
      answer = answer.substring(0, maxLength - 3) + '...'
    }
    
    return answer
  }

  /**
   * Validates FAQ schema structure
   */
  static validateFAQSchema(schema: any): boolean {
    try {
      if (!schema || typeof schema !== 'object') return false
      if (schema['@context'] !== 'https://schema.org') return false
      if (schema['@type'] !== 'FAQPage') return false
      if (!Array.isArray(schema.mainEntity)) return false
      
      return schema.mainEntity.every((item: any) => {
        return item['@type'] === 'Question' && 
               typeof item.name === 'string' &&
               item.acceptedAnswer &&
               item.acceptedAnswer['@type'] === 'Answer' &&
               typeof item.acceptedAnswer.text === 'string'
      })
    } catch {
      return false
    }
  }

  /**
   * Formats FAQ schema for display
   */
  static formatFAQSchema(schema: FAQSchema): string {
    return JSON.stringify(schema, null, 2)
  }

  /**
   * Parses FAQ schema from string
   */
  static parseFAQSchema(schemaString: string): FAQSchema | null {
    try {
      const schema = JSON.parse(schemaString)
      if (this.validateFAQSchema(schema)) {
        return schema
      }
      return null
    } catch {
      return null
    }
  }
} 