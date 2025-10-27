'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Target, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Copy,
  Check,
  Link as LinkIcon,
  FileText,
  Image as ImageIcon,
  Globe,
  Search,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface SEOPanelProps {
  title: string;
  slug: string;
  metaDescription: string;
  content: string;
  focusKeyword: string;
  onFocusKeywordChange: (keyword: string) => void;
  onMetaDescriptionChange: (description: string) => void;
  imageUrl: string;
  altText: string;
  seoScore: number;
  readingTime: number;
  lastSaved?: Date;
  faqSchema: string;
  onFaqSchemaChange: (schema: string) => void;
  glossaryTerms: Array<{ id: string; term: string; slug: string; }>;
  onInsertGlossaryLink: (term: string, url: string) => void;
  onGenerateFAQ: () => void;
  isGeneratingFAQ: boolean;
}

export const SEOPanel: React.FC<SEOPanelProps> = ({
  title,
  slug,
  metaDescription,
  content,
  focusKeyword,
  onFocusKeywordChange,
  onMetaDescriptionChange,
  imageUrl,
  altText,
  seoScore,
  readingTime,
  lastSaved,
  faqSchema,
  onFaqSchemaChange,
  glossaryTerms,
  onInsertGlossaryLink,
  onGenerateFAQ,
  isGeneratingFAQ
}) => {
  const [seoChecklist, setSeoChecklist] = useState({
    titleLength: false,
    metaLength: false,
    hasH2: false,
    hasInternalLink: false,
    hasAltText: false,
    focusKeywordInTitle: false,
    focusKeywordInSlug: false,
    focusKeywordInMeta: false,
    focusKeywordInContent: false
  });

  const [keywordValidation, setKeywordValidation] = useState({
    inTitle: false,
    inSlug: false,
    inMeta: false,
    inContent: false
  });

  // Update SEO checklist
  useEffect(() => {
    const titleLength = title.length >= 30 && title.length <= 60;
    const metaLength = metaDescription.length >= 80 && metaDescription.length <= 160;
    const hasH2 = content.includes('<h2>') || content.includes('<h3>');
    const hasInternalLink = content.includes('<a href=');
    const hasAltText = altText.length > 0;
    
    const focusKeywordLower = focusKeyword.toLowerCase();
    const focusKeywordInTitle = focusKeywordLower && title.toLowerCase().includes(focusKeywordLower);
    const focusKeywordInSlug = focusKeywordLower && slug.toLowerCase().includes(focusKeywordLower);
    const focusKeywordInMeta = focusKeywordLower && metaDescription.toLowerCase().includes(focusKeywordLower);
    const focusKeywordInContent = focusKeywordLower && content.toLowerCase().includes(focusKeywordLower);

    setSeoChecklist({
      titleLength,
      metaLength,
      hasH2,
      hasInternalLink,
      hasAltText,
      focusKeywordInTitle,
      focusKeywordInSlug,
      focusKeywordInMeta,
      focusKeywordInContent
    });

    setKeywordValidation({
      inTitle: focusKeywordInTitle,
      inSlug: focusKeywordInSlug,
      inMeta: focusKeywordInMeta,
      inContent: focusKeywordInContent
    });
  }, [title, metaDescription, content, altText, focusKeyword, slug]);

  // Get SEO score color
  const getSeoScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get SEO score badge variant
  const getSeoScoreVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 80) return 'default';
    if (score >= 50) return 'secondary';
    return 'destructive';
  };

  // Copy to clipboard
  const copyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} kopiran u clipboard`);
    } catch (err) {
      toast.error('Greška pri kopiranju');
    }
  }, []);

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'upravo sada';
    if (minutes === 1) return 'pre 1 minuta';
    if (minutes < 60) return `pre ${minutes} minuta`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return 'pre 1 sat';
    if (hours < 24) return `pre ${hours} sati`;
    
    const days = Math.floor(hours / 24);
    if (days === 1) return 'pre 1 dan';
    return `pre ${days} dana`;
  };

  // Get glossary suggestions based on content
  const getGlossarySuggestions = () => {
    if (!content || !glossaryTerms.length) return [];
    
    const contentLower = content.toLowerCase();
    return glossaryTerms
      .filter(term => contentLower.includes(term.term.toLowerCase()))
      .slice(0, 3);
  };

  const glossarySuggestions = getGlossarySuggestions();

  // Generate Google SERP preview
  const generateSERPPreview = () => {
    const displayTitle = title || 'Untitled Blog Post';
    const displayMeta = metaDescription || 'No meta description provided';
    const displayUrl = slug ? `https://odontoa.com/blogovi/${slug}` : 'https://odontoa.com/blogovi/...';
    
    return {
      title: displayTitle,
      meta: displayMeta,
      url: displayUrl
    };
  };

  const serpPreview = generateSERPPreview();

  return (
    <div className="space-y-4">
      {/* SEO Score Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Target className="h-5 w-5 mr-2" />
            SEO Analiza
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* SEO Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">SEO Score</span>
              <Badge variant={getSeoScoreVariant(seoScore)}>
                {seoScore}/100
              </Badge>
            </div>
            <Progress value={seoScore} className="h-2" />
            <p className={`text-xs ${getSeoScoreColor(seoScore)}`}>
              {seoScore >= 80 ? 'Odličan' : seoScore >= 50 ? 'Dobar' : 'Potrebno poboljšanje'}
            </p>
          </div>

          {/* Reading Time */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Vreme čitanja</span>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {readingTime} min
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Google SERP Preview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Google Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-white border border-gray-200 rounded-lg">
              <div className="text-blue-600 text-sm hover:underline cursor-pointer">
                {serpPreview.title}
              </div>
              <div className="text-green-700 text-xs mt-1">
                {serpPreview.url}
              </div>
              <div className="text-gray-600 text-sm mt-1">
                {serpPreview.meta}
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Ovo je kako će vaš blog izgledati u Google pretrazi
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Focus Keyword */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Fokus Ključna Reč</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={focusKeyword}
            onChange={(e) => onFocusKeywordChange(e.target.value)}
            placeholder="Unesite fokus ključnu reč..."
            className="text-sm"
          />
          
          {/* Keyword Validation */}
          {focusKeyword && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-700">Ključna reč u:</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'inTitle', label: 'Naslov', valid: keywordValidation.inTitle },
                  { key: 'inSlug', label: 'Slug', valid: keywordValidation.inSlug },
                  { key: 'inMeta', label: 'Meta opis', valid: keywordValidation.inMeta },
                  { key: 'inContent', label: 'Sadržaj', valid: keywordValidation.inContent }
                ].map((item) => (
                  <div key={item.key} className="flex items-center space-x-2 text-xs">
                    {item.valid ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-red-500" />
                    )}
                    <span className={item.valid ? 'text-green-700' : 'text-red-700'}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SEO Checklist */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">SEO Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <TooltipProvider>
            {[
              { key: 'titleLength', label: 'Naslov optimalne dužine (30-60)', tooltip: 'Naslov treba da ima između 30 i 60 karaktera za optimalnu SEO performansu' },
              { key: 'metaLength', label: 'Meta opis optimalne dužine (80-160)', tooltip: 'Meta opis treba da ima između 80 i 160 karaktera' },
              { key: 'hasH2', label: 'H2 prisutan u tekstu', tooltip: 'Dodajte H2 naslove za bolju strukturu sadržaja' },
              { key: 'hasInternalLink', label: 'Najmanje 1 interna veza', tooltip: 'Dodajte interne linkove ka rečniku ili drugim člancima' },
              { key: 'hasAltText', label: 'Alt tekst postavljen', tooltip: 'Dodajte alt tekst za hero sliku' },
              { key: 'focusKeywordInTitle', label: 'Fokus ključna reč u naslovu', tooltip: 'Uključite fokus ključnu reč u naslov' },
              { key: 'focusKeywordInSlug', label: 'Fokus ključna reč u slug-u', tooltip: 'Uključite fokus ključnu reč u URL slug' },
              { key: 'focusKeywordInMeta', label: 'Fokus ključna reč u meta opisu', tooltip: 'Uključite fokus ključnu reč u meta opis' },
              { key: 'focusKeywordInContent', label: 'Fokus ključna reč u sadržaju', tooltip: 'Uključite fokus ključnu reč u glavni sadržaj' }
            ].map((item) => (
              <Tooltip key={item.key}>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2 text-sm">
                    {seoChecklist[item.key as keyof typeof seoChecklist] ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className={seoChecklist[item.key as keyof typeof seoChecklist] ? 'text-green-700' : 'text-red-700'}>
                      {item.label}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </CardContent>
      </Card>

      {/* Hero Image */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <ImageIcon className="h-5 w-5 mr-2" />
            Hero Slika
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={altText}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Nema slike</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Input
              value={imageUrl}
              onChange={(e) => {/* Handle image URL change */}}
              placeholder="URL slike ili upload..."
              className="text-sm"
            />
            
            <Input
              value={altText}
              onChange={(e) => {/* Handle alt text change */}}
              placeholder="Alt tekst (obavezan za SEO)"
              className="text-sm"
            />
            
            {!altText && (
              <p className="text-xs text-orange-600 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Dodaj alt tekst za SEO
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Glossary Linking */}
      {glossarySuggestions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <LinkIcon className="h-5 w-5 mr-2" />
              Predlozi Linkovanja
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {glossarySuggestions.map((term) => (
              <div key={term.id} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-900">{term.term}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onInsertGlossaryLink(term.term, `/recnik/${term.slug}`)}
                  className="text-xs"
                >
                  Umetni link
                </Button>
              </div>
            ))}
            <Badge variant="outline" className="text-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Pokriveno
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* Structured Data */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Structured Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">JSON-LD Schema</span>
              <div className="flex items-center space-x-2">
                {faqSchema ? (
                  <>
                    <Badge variant="outline" className="text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Valid
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(faqSchema, 'Schema')}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <Badge variant="outline" className="text-orange-600">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Nije generisana
                  </Badge>
                )}
              </div>
            </div>
            
            <textarea
              value={faqSchema}
              onChange={(e) => onFaqSchemaChange(e.target.value)}
              placeholder="JSON-LD schema će biti automatski generisana..."
              className="w-full h-32 text-xs font-mono bg-gray-50 border border-gray-200 rounded p-2 resize-none"
              readOnly
            />
            
            <Button
              onClick={onGenerateFAQ}
              disabled={isGeneratingFAQ}
              variant="outline"
              size="sm"
              className="w-full"
            >
              {isGeneratingFAQ ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              Generiši FAQ Schema
            </Button>
            
            <p className="text-xs text-gray-500">
              Schema se automatski ubacuje pri objavi
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Status & Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Status & Akcije</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status</span>
            <Badge variant="outline">Draft</Badge>
          </div>
          
          {lastSaved && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Poslednja izmena</span>
              <span className="text-xs text-gray-500">{formatTimeAgo(lastSaved)}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
