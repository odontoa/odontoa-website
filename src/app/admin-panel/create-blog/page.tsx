'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AdminRoute } from '@/components/AdminRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminComposeLayout } from '@/components/AdminComposeLayout';
import { ContentGenerationSections } from '@/components/ContentGenerationSections';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useFormDirty } from '@/contexts/FormDirtyContext';
import { useBeforeUnload } from '@/hooks/useBeforeUnload';
import { toast } from 'sonner';
import { 
  calculateReadingTime,
  calculateSEOScore,
  generateMetaDescription,
  createSEOSlug
} from '@/lib/utils';
import { buildCombinedSchema } from '@/lib/schema/buildJsonLd';
import { FAQGenerator } from '@/lib/faqGenerator';

export default function CreateBlogPage() {
  const router = useRouter();
  const { user, session, isAdmin } = useAuth();
  const { setDirty } = useFormDirty();
  
  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [author, setAuthor] = useState('Odontoa Tim');
  const [authorUrl, setAuthorUrl] = useState('https://odontoa.com/o-nama');
  const [tags, setTags] = useState('');
  const [featured, setFeatured] = useState(false);
  const [faqSchema, setFaqSchema] = useState('');
  const [relatedGlossaryTerms, setRelatedGlossaryTerms] = useState('');
  
  // SEO state
  const [focusKeyword, setFocusKeyword] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [seoScore, setSeoScore] = useState(0);
  const [readingTime, setReadingTime] = useState(1);
  
  // UI state
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingFAQ, setIsGeneratingFAQ] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [glossaryTerms, setGlossaryTerms] = useState<Array<{ id: string; term: string; slug: string; }>>([]);

  // Setup beforeunload protection
  useBeforeUnload(isDirty);

  // Track form dirty state
  useEffect(() => {
    const hasChanges = !!(title || slug || excerpt || content || imageUrl || altText || 
                      author || authorUrl || tags || faqSchema || relatedGlossaryTerms ||
                      focusKeyword || metaDescription);
    setIsDirty(hasChanges);
    setDirty(hasChanges);
  }, [title, slug, excerpt, content, imageUrl, altText, author, authorUrl, tags, faqSchema, relatedGlossaryTerms, focusKeyword, metaDescription, setDirty]);

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !slug) {
      const generatedSlug = createSEOSlug(title);
      setSlug(generatedSlug);
    }
  }, [title, slug]);

  // Auto-generate meta description
  useEffect(() => {
    if (content && title && !metaDescription) {
      const description = generateMetaDescription(content, title);
      setMetaDescription(description);
    }
  }, [content, title, metaDescription]);

  // Update reading time
  useEffect(() => {
    if (content) {
      const time = calculateReadingTime(content);
      setReadingTime(time);
    }
  }, [content]);

  // Update SEO score
  useEffect(() => {
    const formData = {
      title,
      slug,
      content,
      meta_description: metaDescription,
      image_url: imageUrl,
      alt_text: altText,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    };
    const seoResult = calculateSEOScore(formData);
    setSeoScore(seoResult.score);
  }, [title, slug, content, metaDescription, imageUrl, altText, tags]);

  // Fetch glossary terms
  useEffect(() => {
    const fetchGlossaryTerms = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/glossary?select=id,term,slug&published=eq.true&limit=50`, {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${session?.access_token || ''}`,
          }
        });
        const terms = await response.json();
        setGlossaryTerms(terms || []);
      } catch (error) {
        console.error('Error fetching glossary terms:', error);
      }
    };

    if (session) {
      fetchGlossaryTerms();
    }
  }, [session]);

  // Handle image upload
  const handleImageUpload = useCallback(async (file: File) => {
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Molimo odaberite validnu sliku.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Slika je prevelika. Maksimalna veličina je 5MB.');
      return;
    }

    if (file.size < 1024) { // Minimum 1KB
      toast.error('Slika je premala. Molimo odaberite veću sliku.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'featured-images');

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload greška');
      }

      if (!result.success) {
        throw new Error(result.error || 'Upload nije uspešan');
      }

      setImageUrl(result.url);
      toast.success('Slika uspešno uploadovana!');
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Greška pri upload-u slike');
    }
  }, []);

  // Handle glossary link insertion
  const handleInsertGlossaryLink = useCallback((term: string, url: string) => {
    // This would typically insert the link into the rich text editor
    // For now, we'll just show a toast
    toast.success(`Link ka "${term}" bi trebalo da se umetne u editor`);
  }, []);

  // Generate FAQ schema
  const handleGenerateFAQ = useCallback(async () => {
    if (!title || !content || !metaDescription || !imageUrl || !altText || !author || !authorUrl || !slug) {
      toast.error('Popunite sva obavezna polja pre generacije schema');
      return;
    }

    setIsGeneratingFAQ(true);
    try {
      const faqSchema = FAQGenerator.generateFromContent(title, content);
      
      if (faqSchema) {
        const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
        
        const combinedSchema = buildCombinedSchema({
          title,
          content,
          meta_description: metaDescription,
          author: author || 'Odontoa Tim',
          author_url: authorUrl,
          slug,
          image_url: imageUrl,
          alt_text: altText,
          tags: tagsArray,
          created_at: new Date().toISOString(),
          faq_schema: faqSchema,
          reading_time: readingTime
        }, 'blog');
        
        setFaqSchema(JSON.stringify(combinedSchema, null, 2));
        toast.success('Kombinovana schema generisana uspešno');
      } else {
        toast.error('Nije moguće generisati FAQ schema za ovaj sadržaj');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Nepoznata greška';
      toast.error(`Greška pri generisanju schema: ${errorMessage}`);
      console.error('FAQ generation error:', error);
    } finally {
      setIsGeneratingFAQ(false);
    }
  }, [title, content, metaDescription, imageUrl, altText, author, authorUrl, slug, tags, readingTime]);

  // Save as draft
  const handleSaveDraft = useCallback(async () => {
    if (!session || !user || !isAdmin) {
      toast.error('Niste ulogovani kao admin');
      return;
    }

    setIsSaving(true);
    try {
      const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
      const relatedGlossaryArray = relatedGlossaryTerms ? relatedGlossaryTerms.split(',').map(term => term.trim()).filter(Boolean) : [];
      
      let faqSchemaJson = null;
      if (faqSchema) {
        try {
          faqSchemaJson = JSON.parse(faqSchema);
        } catch (e) {
          toast.error('Nevalidan FAQ Schema JSON format');
          return;
        }
      }

      const combinedSchema = buildCombinedSchema({
        title,
        content,
        meta_description: metaDescription,
        author,
        author_url: authorUrl,
        slug,
        image_url: imageUrl,
        alt_text: altText,
        tags: tagsArray,
        created_at: new Date().toISOString(),
        faq_schema: faqSchemaJson,
        reading_time: readingTime
      }, 'blog');

      const blogData = {
        title,
        slug,
        content,
        excerpt,
        summary: metaDescription,
        image_url: imageUrl || null,
        alt_text: altText || null,
        faq_schema: JSON.stringify(combinedSchema),
        tags: tagsArray,
        related_glossary_terms: relatedGlossaryArray,
        author,
        author_url: authorUrl,
        published: false,
        featured,
        meta_description: metaDescription,
        featured_image: null,
        reading_time: readingTime,
        seo_score: seoScore,
        meta_keywords: tagsArray.join(', ')
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/blogs`, {
        method: 'POST',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(blogData)
      });

      if (response.ok) {
        toast.success('Blog sačuvan kao draft!');
        setLastSaved(new Date());
        setIsDirty(false);
        setDirty(false);
      } else {
        const errorData = await response.text();
        console.error('Error saving blog:', errorData);
        toast.error('Greška pri čuvanju bloga');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error('Greška pri čuvanju bloga');
    } finally {
      setIsSaving(false);
    }
  }, [session, user, isAdmin, title, slug, content, excerpt, imageUrl, altText, author, authorUrl, tags, featured, faqSchema, relatedGlossaryTerms, metaDescription, readingTime, seoScore, setDirty]);

  // Publish blog
  const handlePublish = useCallback(async () => {
    if (!session || !user || !isAdmin) {
      toast.error('Niste ulogovani kao admin');
      return;
    }

    // Validate required fields
    const missingFields = [];
    if (!title) missingFields.push('Naslov');
    if (!content || content.length < 50) missingFields.push('Sadržaj (najmanje 50 karaktera)');
    if (!metaDescription) missingFields.push('Meta opis');
    if (!imageUrl) missingFields.push('URL slike');
    if (!altText) missingFields.push('Alt tekst');
    if (!author) missingFields.push('Autor');
    if (!authorUrl) missingFields.push('URL autora');
    if (!slug) missingFields.push('Slug');
    
    if (missingFields.length > 0) {
      toast.error(`Popunite sva obavezna polja: ${missingFields.join(', ')}`);
      return;
    }

    setIsSaving(true);
    try {
      const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
      const relatedGlossaryArray = relatedGlossaryTerms ? relatedGlossaryTerms.split(',').map(term => term.trim()).filter(Boolean) : [];
      
      let faqSchemaJson = null;
      if (faqSchema) {
        try {
          faqSchemaJson = JSON.parse(faqSchema);
        } catch (e) {
          toast.error('Nevalidan FAQ Schema JSON format');
          return;
        }
      }

      const combinedSchema = buildCombinedSchema({
        title,
        content,
        meta_description: metaDescription,
        author,
        author_url: authorUrl,
        slug,
        image_url: imageUrl,
        alt_text: altText,
        tags: tagsArray,
        created_at: new Date().toISOString(),
        faq_schema: faqSchemaJson,
        reading_time: readingTime
      }, 'blog');

      const blogData = {
        title,
        slug,
        content,
        excerpt,
        summary: metaDescription,
        image_url: imageUrl,
        alt_text: altText,
        faq_schema: JSON.stringify(combinedSchema),
        tags: tagsArray,
        related_glossary_terms: relatedGlossaryArray,
        author,
        author_url: authorUrl,
        published: true,
        featured,
        meta_description: metaDescription,
        featured_image: null,
        reading_time: readingTime,
        seo_score: seoScore,
        meta_keywords: tagsArray.join(', ')
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/blogs`, {
        method: 'POST',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(blogData)
      });

      if (response.ok) {
        toast.success('Blog objavljen uspešno!');
        router.push('/admin-panel/dashboard');
      } else {
        const errorData = await response.text();
        console.error('Error publishing blog:', errorData);
        toast.error('Greška pri objavljivanju bloga');
      }
    } catch (error) {
      console.error('Error publishing blog:', error);
      toast.error('Greška pri objavljivanju bloga');
    } finally {
      setIsSaving(false);
    }
  }, [session, user, isAdmin, title, slug, content, excerpt, imageUrl, altText, author, authorUrl, tags, featured, faqSchema, relatedGlossaryTerms, metaDescription, readingTime, seoScore, router]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (isDirty) {
      if (confirm('Imate nesačuvane izmene. Da li ste sigurni da želite da napustite stranicu?')) {
        router.push('/admin-panel/dashboard');
      }
    } else {
      router.push('/admin-panel/dashboard');
    }
  }, [isDirty, router]);

  return (
    <AdminRoute>
      <AdminLayout>
        <AdminComposeLayout
        title={title}
        onTitleChange={setTitle}
        breadcrumb="Content Admin"
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onCancel={handleCancel}
        isDirty={isDirty}
        isSaving={isSaving}
        seoScore={seoScore}
        readingTime={readingTime}
        lastSaved={lastSaved || undefined}
        focusKeyword={focusKeyword}
        onFocusKeywordChange={setFocusKeyword}
        metaDescription={metaDescription}
        onMetaDescriptionChange={setMetaDescription}
        imageUrl={imageUrl}
        onImageUrlChange={setImageUrl}
        altText={altText}
        onAltTextChange={setAltText}
        content={content}
        onContentChange={setContent}
        excerpt={excerpt}
        onExcerptChange={setExcerpt}
        slug={slug}
        onSlugChange={setSlug}
        author={author}
        onAuthorChange={setAuthor}
        authorUrl={authorUrl}
        onAuthorUrlChange={setAuthorUrl}
        tags={tags}
        onTagsChange={setTags}
        faqSchema={faqSchema}
        onFaqSchemaChange={setFaqSchema}
        relatedGlossaryTerms={relatedGlossaryTerms}
        onRelatedGlossaryTermsChange={setRelatedGlossaryTerms}
        featured={featured}
        onFeaturedChange={setFeatured}
        glossaryTerms={glossaryTerms}
        onInsertGlossaryLink={handleInsertGlossaryLink}
        onGenerateFAQ={handleGenerateFAQ}
        isGeneratingFAQ={isGeneratingFAQ}
      >
        <ContentGenerationSections
          title={title}
          onTitleChange={setTitle}
          slug={slug}
          onSlugChange={setSlug}
          excerpt={excerpt}
          onExcerptChange={setExcerpt}
          metaDescription={metaDescription}
          onMetaDescriptionChange={setMetaDescription}
          content={content}
          onContentChange={setContent}
          imageUrl={imageUrl}
          onImageUrlChange={setImageUrl}
          altText={altText}
          onAltTextChange={setAltText}
          author={author}
          onAuthorChange={setAuthor}
          authorUrl={authorUrl}
          onAuthorUrlChange={setAuthorUrl}
          tags={tags}
          onTagsChange={setTags}
          featured={featured}
          onFeaturedChange={setFeatured}
          isUploading={isSaving}
          wordCount={content.replace(/<[^>]*>/g, '').split(/\s+/).length}
          readingTime={readingTime}
          onImageUpload={handleImageUpload}
          onInsertGlossaryLink={handleInsertGlossaryLink}
          glossaryTerms={glossaryTerms}
        />
        </AdminComposeLayout>
      </AdminLayout>
    </AdminRoute>
  );
}
