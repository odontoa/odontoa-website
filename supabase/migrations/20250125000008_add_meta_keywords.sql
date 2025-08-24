
-- Add meta_keywords column to blogs table (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'meta_keywords') THEN
        ALTER TABLE public.blogs ADD COLUMN meta_keywords text;
    END IF;
END $$;

-- Add other missing columns that might be needed for SEO (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'summary') THEN
        ALTER TABLE public.blogs ADD COLUMN summary text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'meta_description') THEN
        ALTER TABLE public.blogs ADD COLUMN meta_description text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'image_url') THEN
        ALTER TABLE public.blogs ADD COLUMN image_url text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'alt_text') THEN
        ALTER TABLE public.blogs ADD COLUMN alt_text text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'featured_image') THEN
        ALTER TABLE public.blogs ADD COLUMN featured_image text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'reading_time') THEN
        ALTER TABLE public.blogs ADD COLUMN reading_time integer;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'seo_score') THEN
        ALTER TABLE public.blogs ADD COLUMN seo_score integer;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'related_glossary_terms') THEN
        ALTER TABLE public.blogs ADD COLUMN related_glossary_terms text[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'views_count') THEN
        ALTER TABLE public.blogs ADD COLUMN views_count integer DEFAULT 0;
    END IF;
END $$;

-- Add missing columns to glossary table as well (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'glossary' AND column_name = 'meta_keywords') THEN
        ALTER TABLE public.glossary ADD COLUMN meta_keywords text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'glossary' AND column_name = 'meta_description') THEN
        ALTER TABLE public.glossary ADD COLUMN meta_description text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'glossary' AND column_name = 'image_url') THEN
        ALTER TABLE public.glossary ADD COLUMN image_url text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'glossary' AND column_name = 'alt_text') THEN
        ALTER TABLE public.glossary ADD COLUMN alt_text text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'glossary' AND column_name = 'seo_score') THEN
        ALTER TABLE public.glossary ADD COLUMN seo_score integer;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'glossary' AND column_name = 'reading_time') THEN
        ALTER TABLE public.glossary ADD COLUMN reading_time integer;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'glossary' AND column_name = 'views_count') THEN
        ALTER TABLE public.glossary ADD COLUMN views_count integer DEFAULT 0;
    END IF;
END $$;

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_blogs_meta_keywords ON public.blogs USING gin(to_tsvector('serbian', meta_keywords));
CREATE INDEX IF NOT EXISTS idx_blogs_seo_score ON public.blogs(seo_score DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_views_count ON public.blogs(views_count DESC);
CREATE INDEX IF NOT EXISTS idx_glossary_seo_score ON public.glossary(seo_score DESC);
CREATE INDEX IF NOT EXISTS idx_glossary_views_count ON public.glossary(views_count DESC); 