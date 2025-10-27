'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Clock, 
  Target, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Upload,
  Link as LinkIcon,
  FileText,
  Globe,
  Image as ImageIcon,
  Copy,
  Check,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface AdminComposeLayoutProps {
  children: React.ReactNode;
  title: string;
  onTitleChange: (title: string) => void;
  breadcrumb: string;
  onSaveDraft: () => void;
  onPublish: () => void;
  onCancel: () => void;
  isDirty: boolean;
  isSaving: boolean;
  seoScore: number;
  readingTime: number;
  lastSaved?: Date;
  focusKeyword?: string;
  onFocusKeywordChange?: (keyword: string) => void;
  metaDescription?: string;
  onMetaDescriptionChange?: (description: string) => void;
  imageUrl?: string;
  onImageUrlChange?: (url: string) => void;
  altText?: string;
  onAltTextChange?: (text: string) => void;
  content?: string;
  onContentChange?: (content: string) => void;
  excerpt?: string;
  onExcerptChange?: (excerpt: string) => void;
  slug?: string;
  onSlugChange?: (slug: string) => void;
  author?: string;
  onAuthorChange?: (author: string) => void;
  authorUrl?: string;
  onAuthorUrlChange?: (url: string) => void;
  tags?: string;
  onTagsChange?: (tags: string) => void;
  faqSchema?: string;
  onFaqSchemaChange?: (schema: string) => void;
  relatedGlossaryTerms?: string;
  onRelatedGlossaryTermsChange?: (terms: string) => void;
  featured?: boolean;
  onFeaturedChange?: (featured: boolean) => void;
  glossaryTerms?: Array<{ id: string; term: string; slug: string; }>;
  onInsertGlossaryLink?: (term: string, url: string) => void;
  onGenerateFAQ?: () => void;
  isGeneratingFAQ?: boolean;
}

export const AdminComposeLayout: React.FC<AdminComposeLayoutProps> = ({
  children,
  title,
  onTitleChange,
  breadcrumb,
  onSaveDraft,
  onPublish,
  onCancel,
  isDirty,
  isSaving,
  seoScore,
  readingTime,
  lastSaved,
  focusKeyword = '',
  onFocusKeywordChange,
  metaDescription = '',
  onMetaDescriptionChange,
  imageUrl = '',
  onImageUrlChange,
  altText = '',
  onAltTextChange,
  content = '',
  onContentChange,
  excerpt = '',
  onExcerptChange,
  slug = '',
  onSlugChange,
  author = '',
  onAuthorChange,
  authorUrl = '',
  onAuthorUrlChange,
  tags = '',
  onTagsChange,
  faqSchema = '',
  onFaqSchemaChange,
  relatedGlossaryTerms = '',
  onRelatedGlossaryTermsChange,
  featured = false,
  onFeaturedChange,
  glossaryTerms = [],
  onInsertGlossaryLink,
  onGenerateFAQ,
  isGeneratingFAQ = false
}) => {
  const router = useRouter();
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(lastSaved || null);
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

  // Auto-save functionality
  useEffect(() => {
    if (!isDirty) return;

    const autosaveInterval = setInterval(() => {
      if (isDirty && !isSaving) {
        setAutosaveStatus('saving');
        onSaveDraft();
        setLastSavedTime(new Date());
        setTimeout(() => setAutosaveStatus('saved'), 1000);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autosaveInterval);
  }, [isDirty, isSaving, onSaveDraft]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        onSaveDraft();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        onPublish();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSaveDraft, onPublish]);

  // SEO checklist calculation
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
    <div className="space-y-6">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm -mx-6 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Breadcrumb and Title */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Nazad
            </Button>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500 min-w-0">
              <span className="truncate">Admin</span>
              <span>/</span>
              <span className="font-medium text-gray-900">Kreiraj blog</span>
            </div>
          </div>

          {/* Center: Title Input */}
          <div className="flex-1 max-w-2xl mx-8">
            <Input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Unesite naslov bloga..."
              className="text-lg font-semibold border-0 shadow-none focus:ring-0 bg-transparent"
            />
          </div>

          {/* Right: Actions and Status */}
          <div className="flex items-center space-x-4 shrink-0">
            {/* Autosave Status */}
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              {autosaveStatus === 'saving' && (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Čuvam...</span>
                </>
              )}
              {autosaveStatus === 'saved' && lastSavedTime && (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Sačuvano {formatTimeAgo(lastSavedTime)}</span>
                </>
              )}
              {autosaveStatus === 'idle' && isDirty && (
                <>
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span>Nesačuvane izmene</span>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                onClick={onSaveDraft}
                disabled={isSaving}
                variant="outline"
                size="sm"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Sačuvaj kao Draft
              </Button>
              
              <Button
                onClick={onPublish}
                disabled={isSaving}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Eye className="h-4 w-4 mr-2" />
                Objavi odmah
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Content Generation */}
        <div className="lg:col-span-2 space-y-6">
          {children}
        </div>

        {/* Right Column - SEO/Meta Panel */}
        <div className="space-y-4">
          {/* SEO Score Card */}
          <Card className="sticky top-24">
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
          <Card className="border-2 border-blue-200 bg-blue-50/30">
            <CardHeader className="pb-3 bg-blue-100/50">
              <CardTitle className="text-lg flex items-center text-blue-800">
                <Globe className="h-5 w-5 mr-2" />
                🔍 Google Preview - Kako će izgledati u pretrazi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-white border-2 border-blue-300 rounded-lg shadow-sm">
                  <div className="text-blue-600 text-sm hover:underline cursor-pointer font-medium">
                    {serpPreview.title}
                  </div>
                  <div className="text-green-700 text-xs mt-1 font-mono">
                    {serpPreview.url}
                  </div>
                  <div className="text-gray-600 text-sm mt-1 leading-relaxed">
                    {serpPreview.meta}
                  </div>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-800 font-medium">
                    ⚠️ Ovo je kako će vaš blog izgledati u Google pretrazi - veoma bitno za SEO!
                  </p>
                </div>
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
                onChange={(e) => onFocusKeywordChange?.(e.target.value)}
                placeholder="Unesite fokus ključnu reč..."
                className="text-sm"
              />
              <p className="text-xs text-gray-500">
                Ključna reč koja će se koristiti za SEO optimizaciju
              </p>
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
                  onChange={(e) => onImageUrlChange?.(e.target.value)}
                  placeholder="URL slike ili upload..."
                  className="text-sm"
                />
                
                <Input
                  value={altText}
                  onChange={(e) => onAltTextChange?.(e.target.value)}
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
                      onClick={() => onInsertGlossaryLink?.(term.term, `/recnik/${term.slug}`)}
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
                      (() => {
                        try {
                          const parsed = JSON.parse(faqSchema);
                          const hasFAQ = parsed['@graph']?.some((item: any) => item['@type'] === 'FAQPage') || 
                                        parsed['@type'] === 'FAQPage' ||
                                        (Array.isArray(parsed) && parsed.some((item: any) => item['@type'] === 'FAQPage'));
                          return (
                            <>
                              <Badge variant="outline" className={hasFAQ ? "text-green-600" : "text-orange-600"}>
                                {hasFAQ ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Valid
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Warning
                                  </>
                                )}
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
                          );
                        } catch (e) {
                          return (
                            <Badge variant="outline" className="text-red-600">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Error
                            </Badge>
                          );
                        }
                      })()
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
                  onChange={(e) => onFaqSchemaChange?.(e.target.value)}
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
              
              {lastSavedTime && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Poslednja izmena</span>
                  <span className="text-xs text-gray-500">{formatTimeAgo(lastSavedTime)}</span>
                </div>
              )}
              
              <div className="space-y-2 pt-2">
                <Button
                  onClick={onSaveDraft}
                  disabled={isSaving}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Sačuvaj kao Draft
                </Button>
                
                <Button
                  onClick={onPublish}
                  disabled={isSaving}
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Objavi odmah
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};