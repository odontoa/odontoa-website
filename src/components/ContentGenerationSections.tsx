'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  FileText, 
  Image as ImageIcon, 
  Upload, 
  Link as LinkIcon,
  Clock,
  Type,
  List,
  Quote,
  Code,
  Bold,
  Italic,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { RichTextEditor } from './RichTextEditor';

interface ContentGenerationSectionsProps {
  title: string;
  onTitleChange: (title: string) => void;
  slug: string;
  onSlugChange: (slug: string) => void;
  excerpt: string;
  onExcerptChange: (excerpt: string) => void;
  metaDescription: string;
  onMetaDescriptionChange: (description: string) => void;
  content: string;
  onContentChange: (content: string) => void;
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
  altText: string;
  onAltTextChange: (text: string) => void;
  author: string;
  onAuthorChange: (author: string) => void;
  authorUrl: string;
  onAuthorUrlChange: (url: string) => void;
  tags: string;
  onTagsChange: (tags: string) => void;
  featured: boolean;
  onFeaturedChange: (featured: boolean) => void;
  isUploading?: boolean;
  wordCount?: number;
  readingTime?: number;
  onImageUpload?: (file: File) => Promise<void>;
  onInsertGlossaryLink?: (term: string, url: string) => void;
  glossaryTerms?: Array<{ id: string; term: string; slug: string; }>;
}

export const ContentGenerationSections: React.FC<ContentGenerationSectionsProps> = ({
  title,
  onTitleChange,
  slug,
  onSlugChange,
  excerpt,
  onExcerptChange,
  metaDescription,
  onMetaDescriptionChange,
  content,
  onContentChange,
  imageUrl,
  onImageUrlChange,
  altText,
  onAltTextChange,
  author,
  onAuthorChange,
  authorUrl,
  onAuthorUrlChange,
  tags,
  onTagsChange,
  featured,
  onFeaturedChange,
  isUploading = false,
  wordCount = 0,
  readingTime = 1,
  onImageUpload,
  onInsertGlossaryLink,
  glossaryTerms = []
}) => {
  const [uploadedImages, setUploadedImages] = useState<Array<{ url: string; alt: string; }>>([]);
  const [activeTab, setActiveTab] = useState('basic');

  // Calculate excerpt character count
  const excerptLength = excerpt.length;
  const excerptStatus = excerptLength >= 50 && excerptLength <= 160 ? 'good' : 
                       excerptLength < 50 ? 'short' : 'long';

  // Get excerpt status color
  const getExcerptStatusColor = () => {
    switch (excerptStatus) {
      case 'good': return 'text-green-600';
      case 'short': return 'text-orange-600';
      case 'long': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Get excerpt status badge
  const getExcerptStatusBadge = () => {
    switch (excerptStatus) {
      case 'good': return <Badge variant="outline" className="text-green-600"><CheckCircle className="h-3 w-3 mr-1" />Optimalno</Badge>;
      case 'short': return <Badge variant="outline" className="text-orange-600"><AlertCircle className="h-3 w-3 mr-1" />Prekratko</Badge>;
      case 'long': return <Badge variant="outline" className="text-red-600"><AlertCircle className="h-3 w-3 mr-1" />Predugačko</Badge>;
      default: return null;
    }
  };

  // Handle image upload
  const handleImageUpload = useCallback(async (file: File) => {
    if (onImageUpload) {
      try {
        await onImageUpload(file);
        toast.success('Slika uspešno uploadovana!');
      } catch (error) {
        toast.error('Greška pri upload-u slike');
      }
    }
  }, [onImageUpload]);

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      handleImageUpload(imageFiles[0]);
    }
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

  return (
    <div className="space-y-6">
      {/* Content Generation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="flex items-center">
            <Type className="h-4 w-4 mr-2" />
            Osnovno
          </TabsTrigger>
          <TabsTrigger value="excerpt" className="flex items-center">
            <Type className="h-4 w-4 mr-2" />
            Kratak opis
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Glavni sadržaj
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center">
            <ImageIcon className="h-4 w-4 mr-2" />
            Dodaci
          </TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Osnovne informacije</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Naslov *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => onTitleChange(e.target.value)}
                  placeholder="Unesite naslov bloga..."
                  className="text-lg font-semibold"
                />
                <p className="text-xs text-gray-500">
                  {title.length}/60 karaktera (optimalno 30-60)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" className="text-sm font-medium">
                  URL Slug *
                </Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => onSlugChange(e.target.value)}
                  placeholder="automatski-generisan-iz-naslova"
                  className="text-sm"
                />
                <p className="text-xs text-gray-500">
                  URL adresa članka (automatski generisan iz naslova)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description" className="text-sm font-medium">
                  Meta opis * (80-160 karaktera)
                </Label>
                <Textarea
                  id="meta_description"
                  value={metaDescription}
                  onChange={(e) => onMetaDescriptionChange(e.target.value)}
                  placeholder="Meta opis za pretraživače..."
                  rows={3}
                  className="resize-none"
                />
                <div className="flex items-center justify-between">
                  <p className={`text-xs ${metaDescription.length >= 80 && metaDescription.length <= 160 ? 'text-green-600' : 'text-orange-600'}`}>
                    {metaDescription.length}/160 karaktera
                  </p>
                  {metaDescription.length >= 80 && metaDescription.length <= 160 ? (
                    <Badge variant="outline" className="text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Optimalno
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-orange-600">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {metaDescription.length < 80 ? 'Prekratko' : 'Predugačko'}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Excerpt Tab */}
        <TabsContent value="excerpt" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kratak opis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-sm font-medium">
                  Kratki opis (50–160 karaktera)
                </Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => onExcerptChange(e.target.value)}
                  placeholder="Kratak opis koji se prikazuje u listi blogova i karticama..."
                  rows={3}
                  className="resize-none"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {excerptLength}/160 karaktera
                  </p>
                  {getExcerptStatusBadge()}
                </div>
                <p className="text-xs text-gray-500">
                  💡 Ovo polje se koristi za UX - prikazuje se u listi blogova i karticama
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Glavni sadržaj</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Sadržaj bloga
                </Label>
                
                {/* Rich Text Editor */}
                <div className="border rounded-lg overflow-hidden">
                  <RichTextEditor
                    value={content}
                    onChange={onContentChange}
                    placeholder="Napišite uvod u 2–3 rečenice, pa pređite na jasne H2 sekcije..."
                    className="min-h-[400px]"
                    blogSlug={slug}
                  />
                </div>

                {/* Content Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Type className="h-4 w-4 mr-1" />
                      {wordCount} reči
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {readingTime} min čitanja
                    </div>
                  </div>
                  
                  {/* Glossary Suggestions */}
                  {glossarySuggestions.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-blue-600">Predlozi linkovanja:</span>
                      {glossarySuggestions.map((term) => (
                        <Button
                          key={term.id}
                          size="sm"
                          variant="outline"
                          onClick={() => onInsertGlossaryLink?.(term.term, `/recnik/${term.slug}`)}
                          className="text-xs h-6 px-2"
                        >
                          <LinkIcon className="h-3 w-3 mr-1" />
                          {term.term}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dodaci</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Hero Image Upload */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Hero slika</Label>
                
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {imageUrl ? (
                    <div className="space-y-3">
                      <img
                        src={imageUrl}
                        alt={altText}
                        className="w-full h-48 object-cover rounded-lg mx-auto"
                      />
                      <div className="space-y-2">
                        <Input
                          value={imageUrl}
                          onChange={(e) => onImageUrlChange(e.target.value)}
                          placeholder="URL slike..."
                          className="text-sm"
                        />
                        <Input
                          value={altText}
                          onChange={(e) => onAltTextChange(e.target.value)}
                          placeholder="Alt tekst (obavezan za SEO)..."
                          className="text-sm"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          Drag & drop sliku ovde ili kliknite za upload
                        </p>
                        <Button
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) handleImageUpload(file);
                            };
                            input.click();
                          }}
                          disabled={isUploading}
                          variant="outline"
                          size="sm"
                        >
                          {isUploading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4 mr-2" />
                          )}
                          Upload sliku
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-gray-500">
                  Preporučene dimenzije: 1280x720px ili veće. Maksimalna veličina: 5MB.
                </p>
              </div>

              {/* Additional Images */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Dodatne slike</Label>
                <div className="grid grid-cols-2 gap-3">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          setUploadedImages(prev => prev.filter((_, i) => i !== index));
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors cursor-pointer"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          handleImageUpload(file);
                          setUploadedImages(prev => [...prev, { url: URL.createObjectURL(file), alt: file.name }]);
                        }
                      };
                      input.click();
                    }}
                  >
                    <Plus className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Dodaj sliku</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Basic Information Accordion */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="basic-info">
          <AccordionTrigger className="text-lg font-medium">
            Osnovne informacije
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-sm font-medium">
                  URL Slug
                </Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => onSlugChange(e.target.value)}
                  placeholder="automatski-generisan-iz-naslova"
                  className="text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author" className="text-sm font-medium">
                  Autor
                </Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => onAuthorChange(e.target.value)}
                  placeholder="Ime autora"
                  className="text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author_url" className="text-sm font-medium">
                URL autora
              </Label>
              <Input
                id="author_url"
                value={authorUrl}
                onChange={(e) => onAuthorUrlChange(e.target.value)}
                placeholder="https://odontoa.com/o-nama"
                className="text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-medium">
                Tagovi (odvojeni zarezom)
              </Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => onTagsChange(e.target.value)}
                placeholder="tag1, tag2, tag3"
                className="text-sm"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => onFeaturedChange(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <Label htmlFor="featured" className="text-sm font-medium">
                Istaknuti članak (Featured)
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
