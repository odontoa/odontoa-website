import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Target, 
  Clock, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  Eye,
  Hash,
  Zap
} from 'lucide-react'

interface SEOTestData {
  title: string
  content: string
  summary?: string
  image_url?: string
  alt_text?: string
  faq_schema?: string
  tags?: string[]
  wordCount: number
  readingTime: number
  seoScore: number
  hasHeadings: boolean
  hasImages: boolean
  hasLists: boolean
  hasLinks: boolean
  titleLength: number
  summaryLength: number
  lastModified?: string
}

interface SEOTestModeProps {
  data: SEOTestData
  className?: string
}

export const SEOTestMode: React.FC<SEOTestModeProps> = ({ data, className = '' }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreVariant = (score: number) => {
    if (score >= 80) return 'default'
    if (score >= 60) return 'secondary'
    return 'destructive'
  }

  const getValidationStatus = (condition: boolean) => {
    return condition ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    )
  }

  const getTitleLengthStatus = () => {
    const { titleLength } = data
    if (titleLength >= 50 && titleLength <= 60) return 'optimal'
    if (titleLength >= 30 && titleLength <= 70) return 'good'
    return 'poor'
  }

  const getSummaryLengthStatus = () => {
    const { summaryLength } = data
    if (summaryLength >= 150 && summaryLength <= 160) return 'optimal'
    if (summaryLength >= 120 && summaryLength <= 180) return 'good'
    return 'poor'
  }

  const getWordCountStatus = () => {
    const { wordCount } = data
    if (wordCount >= 300) return 'excellent'
    if (wordCount >= 150) return 'good'
    return 'poor'
  }

  return (
    <Card className={`border-2 border-blue-200 bg-blue-50/30 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg text-blue-900">
          <Zap className="h-5 w-5 mr-2" />
          🧪 SEO Test Mode
        </CardTitle>
        <p className="text-sm text-blue-700">
          Kontrolni dashboard za Content Lead-a - pregled SEO optimizacije sadržaja
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main SEO Score */}
        <div className="text-center p-4 bg-white rounded-lg border">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold">SEO Score</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Badge 
              variant={getScoreVariant(data.seoScore)} 
              className="text-lg px-4 py-2"
            >
              {data.seoScore}/100
            </Badge>
            <Progress 
              value={data.seoScore} 
              className="w-32 h-3"
            />
          </div>
          <p className={`text-sm mt-2 font-medium ${getScoreColor(data.seoScore)}`}>
            {data.seoScore >= 80 ? 'Odlično!' : 
             data.seoScore >= 60 ? 'Dobro' : 'Potrebno poboljšanje'}
          </p>
        </div>

        {/* Content Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Broj reči</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{data.wordCount}</span>
                <Badge 
                  variant={getWordCountStatus() === 'excellent' ? 'default' : 
                          getWordCountStatus() === 'good' ? 'secondary' : 'destructive'}
                  className="text-xs"
                >
                  {getWordCountStatus() === 'excellent' ? 'Odlično' :
                   getWordCountStatus() === 'good' ? 'Dobro' : 'Kratko'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Vreme čitanja</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{data.readingTime} min</span>
                <Badge variant="outline" className="text-xs">
                  {data.readingTime >= 3 ? 'Detaljno' : 'Kratko'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Length Analysis */}
        <Card className="bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-900">
              📏 Analiza dužine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-600" />
                <span className="text-sm">Naslov</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono">{data.titleLength} karaktera</span>
                <Badge 
                  variant={getTitleLengthStatus() === 'optimal' ? 'default' : 
                          getTitleLengthStatus() === 'good' ? 'secondary' : 'destructive'}
                  className="text-xs"
                >
                  {getTitleLengthStatus() === 'optimal' ? 'Optimalno' :
                   getTitleLengthStatus() === 'good' ? 'Dobro' : 'Popravi'}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-gray-600" />
                <span className="text-sm">Meta opis</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono">{data.summaryLength} karaktera</span>
                <Badge 
                  variant={getSummaryLengthStatus() === 'optimal' ? 'default' : 
                          getSummaryLengthStatus() === 'good' ? 'secondary' : 'destructive'}
                  className="text-xs"
                >
                  {getSummaryLengthStatus() === 'optimal' ? 'Optimalno' :
                   getSummaryLengthStatus() === 'good' ? 'Dobro' : 'Popravi'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Structure Validation */}
        <Card className="bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-900">
              ✅ Struktura sadržaja
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-600" />
                <span className="text-sm">Naslovi (H2, H3)</span>
              </div>
              {getValidationStatus(data.hasHeadings)}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-gray-600" />
                <span className="text-sm">Slike sa alt tekstom</span>
              </div>
              {getValidationStatus(data.hasImages && !!data.alt_text)}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-600" />
                <span className="text-sm">Liste (ul/ol)</span>
              </div>
              {getValidationStatus(data.hasLists)}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-600" />
                <span className="text-sm">Interni linkovi</span>
              </div>
              {getValidationStatus(data.hasLinks)}
            </div>
          </CardContent>
        </Card>

        {/* SEO Elements */}
        <Card className="bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-900">
              🔍 SEO elementi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">📝 Summary</span>
              </div>
              {getValidationStatus(!!data.summary)}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">🖼️ Featured Image</span>
              </div>
              {getValidationStatus(!!data.image_url)}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">❓ FAQ Schema</span>
              </div>
              {getValidationStatus(!!data.faq_schema)}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">🏷️ Tags</span>
              </div>
              {getValidationStatus(!!data.tags && data.tags.length > 0)}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        {data.seoScore < 80 && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-yellow-900 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Preporuke za poboljšanje
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.wordCount < 300 && (
                <p className="text-sm text-yellow-800">
                  • Dodajte više sadržaja (minimum 300 reči)
                </p>
              )}
              {!data.hasHeadings && (
                <p className="text-sm text-yellow-800">
                  • Koristite naslove (H2, H3) za strukturu
                </p>
              )}
              {!data.summary && (
                <p className="text-sm text-yellow-800">
                  • Dodajte meta opis (summary)
                </p>
              )}
              {!data.image_url && (
                <p className="text-sm text-yellow-800">
                  • Dodajte featured image
                </p>
              )}
              {!data.faq_schema && (
                <p className="text-sm text-yellow-800">
                  • Generišite FAQ schema
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Last Modified */}
        {data.lastModified && (
          <div className="text-center text-xs text-gray-500">
            Poslednja izmena: {new Date(data.lastModified).toLocaleString('sr-RS')}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 