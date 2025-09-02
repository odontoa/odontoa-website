import React, { useState, useEffect } from 'react'
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TableOfContentsProps {
  content: string
}

interface TocItem {
  id: string
  text: string
  level: number
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    // Parse content to find headings
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')
    
    const items: TocItem[] = []
    const usedIds = new Set<string>()
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1))
      const text = heading.textContent || ''
      
      // Generate a unique ID based on text content
      let id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim()
        .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      
      // If ID is empty or duplicate, use index
      if (!id || usedIds.has(id)) {
        id = `heading-${index}`
      }
      
      usedIds.add(id)
      
      items.push({
        id,
        text,
        level
      })
    })
    
    setTocItems(items)
  }, [content])



  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  if (tocItems.length === 0) {
    return null
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Sadržaj
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <nav className="space-y-2">
          {tocItems.map((item, index) => (
            <button
              key={index}
              onClick={() => scrollToHeading(item.id)}
              className={`block w-full text-left text-sm hover:text-blue-600 transition-colors ${
                item.level === 1 ? 'font-semibold text-gray-900' :
                item.level === 2 ? 'font-medium text-gray-800 ml-2' :
                'text-gray-600 ml-4'
              }`}
            >
              {item.text}
            </button>
          ))}
        </nav>
      )}
    </div>
  )
} 