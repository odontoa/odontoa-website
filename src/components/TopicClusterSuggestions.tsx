import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Link, RefreshCw, TrendingUp } from 'lucide-react'

interface SuggestionItem {
  id: string
  title: string
  slug: string
  type: 'blog' | 'glossary'
  relevance: number
  excerpt?: string
}

interface TopicClusterSuggestionsProps {
  suggestions: SuggestionItem[]
  selectedItems: string[]
  onSelectionChange: (selectedSlugs: string[]) => void
  onRefresh?: () => void
  loading?: boolean
  title?: string
  description?: string
}

export const TopicClusterSuggestions: React.FC<TopicClusterSuggestionsProps> = ({
  suggestions,
  selectedItems,
  onSelectionChange,
  onRefresh,
  loading = false,
  title = "🔗 Preporučeni linkovi",
  description = "Na osnovu sadržaja koji pišete, evo predloga za povezivanje:"
}) => {
  const [localSelected, setLocalSelected] = useState<string[]>(selectedItems)

  const handleCheckboxChange = (slug: string, checked: boolean) => {
    const newSelected = checked 
      ? [...localSelected, slug]
      : localSelected.filter(item => item !== slug)
    
    setLocalSelected(newSelected)
    onSelectionChange(newSelected)
  }

  const handleSelectAll = () => {
    const allSlugs = suggestions.map(item => item.slug)
    setLocalSelected(allSlugs)
    onSelectionChange(allSlugs)
  }

  const handleClearAll = () => {
    setLocalSelected([])
    onSelectionChange([])
  }

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 80) return 'bg-green-100 text-green-800 border-green-200'
    if (relevance >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getTypeIcon = (type: 'blog' | 'glossary') => {
    return type === 'blog' ? '📝' : '📖'
  }

  if (suggestions.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="p-6 text-center">
          <div className="text-gray-400 mb-2">
            <Link className="h-8 w-8 mx-auto" />
          </div>
          <p className="text-sm text-gray-500">
            Nema preporučenih linkova za ovaj sadržaj.
          </p>
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              disabled={loading}
              className="mt-2"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Osveži predloge
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium text-blue-900">
              {title}
            </CardTitle>
            <p className="text-xs text-blue-700 mt-1">
              {description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {suggestions.length} predloga
            </Badge>
            {onRefresh && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onRefresh}
                disabled={loading}
                className="h-6 w-6 p-0"
              >
                <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Action buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSelectAll}
            className="text-xs h-7"
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            Izaberi sve
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearAll}
            className="text-xs h-7"
          >
            Očisti sve
          </Button>
        </div>

        {/* Suggestions list */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {suggestions.map((item) => (
            <div 
              key={item.id}
              className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <Checkbox
                checked={localSelected.includes(item.slug)}
                onCheckedChange={(checked) => handleCheckboxChange(item.slug, checked as boolean)}
                className="mt-0.5"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{getTypeIcon(item.type)}</span>
                  <h4 className="text-sm font-normal text-gray-900 truncate">
                    {item.title}
                  </h4>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getRelevanceColor(item.relevance)}`}
                  >
                    {item.relevance}% relevantnost
                  </Badge>
                </div>
                
                {item.excerpt && (
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {item.excerpt}
                  </p>
                )}
                
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {item.type === 'blog' ? 'Blog' : 'Rečnik'}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    /{item.type === 'blog' ? 'blogovi' : 'recnik'}/{item.slug}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        {localSelected.length > 0 && (
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Izabrano: <strong>{localSelected.length}</strong> od {suggestions.length} predloga
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 