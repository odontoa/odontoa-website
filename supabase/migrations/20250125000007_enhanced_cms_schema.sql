-- Fix migration for enhanced CMS schema
-- This migration adds missing columns and fixes issues from the previous migration

-- Add missing columns to blogs table (if not already added)
ALTER TABLE public.blogs 
ADD COLUMN IF NOT EXISTS summary TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS alt_text TEXT,
ADD COLUMN IF NOT EXISTS related_glossary_terms TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reading_time INTEGER,
ADD COLUMN IF NOT EXISTS seo_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_modified TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Add missing columns to glossary table (if not already added)
ALTER TABLE public.glossary 
ADD COLUMN IF NOT EXISTS why_it_matters TEXT,
ADD COLUMN IF NOT EXISTS related_blog_posts TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS difficulty_level TEXT DEFAULT 'beginner',
ADD COLUMN IF NOT EXISTS seo_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reading_time INTEGER,
ADD COLUMN IF NOT EXISTS last_modified TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Create topic_clusters table if not exists
CREATE TABLE IF NOT EXISTS public.topic_clusters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cluster_name TEXT NOT NULL,
  cluster_slug TEXT UNIQUE NOT NULL,
  description TEXT,
  keywords TEXT[] DEFAULT '{}',
  cluster_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create content_analytics table if not exists
CREATE TABLE IF NOT EXISTS public.content_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('blog', 'glossary')),
  views_count INTEGER DEFAULT 0,
  engagement_score FLOAT DEFAULT 0,
  seo_score INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create indexes if not exist
CREATE INDEX IF NOT EXISTS idx_blogs_related_glossary_terms ON public.blogs USING GIN (related_glossary_terms);
CREATE INDEX IF NOT EXISTS idx_blogs_views_count ON public.blogs (views_count);
CREATE INDEX IF NOT EXISTS idx_blogs_seo_score ON public.blogs (seo_score);
CREATE INDEX IF NOT EXISTS idx_blogs_last_modified ON public.blogs (last_modified);

CREATE INDEX IF NOT EXISTS idx_glossary_related_blog_posts ON public.glossary USING GIN (related_blog_posts);
CREATE INDEX IF NOT EXISTS idx_glossary_views_count ON public.glossary (views_count);
CREATE INDEX IF NOT EXISTS idx_glossary_category ON public.glossary (category);
CREATE INDEX IF NOT EXISTS idx_glossary_difficulty_level ON public.glossary (difficulty_level);
CREATE INDEX IF NOT EXISTS idx_glossary_seo_score ON public.glossary (seo_score);
CREATE INDEX IF NOT EXISTS idx_glossary_last_modified ON public.glossary (last_modified);

CREATE INDEX IF NOT EXISTS idx_topic_clusters_slug ON public.topic_clusters (cluster_slug);
CREATE INDEX IF NOT EXISTS idx_topic_clusters_keywords ON public.topic_clusters USING GIN (keywords);
CREATE INDEX IF NOT EXISTS idx_topic_clusters_score ON public.topic_clusters (cluster_score);

CREATE INDEX IF NOT EXISTS idx_content_analytics_content_id ON public.content_analytics (content_id);
CREATE INDEX IF NOT EXISTS idx_content_analytics_content_type ON public.content_analytics (content_type);

-- Create or replace utility functions
CREATE OR REPLACE FUNCTION update_last_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_modified = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_reading_time(content TEXT)
RETURNS INTEGER AS $$
BEGIN
  -- Calculate reading time based on content length (200 characters per minute)
  RETURN GREATEST(1, LENGTH(content) / 200);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_seo_score(
  title TEXT,
  content TEXT,
  summary TEXT,
  image_url TEXT,
  tags TEXT[]
)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
  word_count INTEGER;
BEGIN
  -- Title length (50-60 chars optimal)
  IF LENGTH(title) BETWEEN 50 AND 60 THEN 
    score := score + 20;
  ELSIF LENGTH(title) BETWEEN 30 AND 70 THEN 
    score := score + 10;
  END IF;
  
  -- Content length (minimum 300 words)
  word_count := array_length(regexp_split_to_array(content, '\s+'), 1);
  IF word_count >= 300 THEN 
    score := score + 20;
  ELSIF word_count >= 150 THEN 
    score := score + 10;
  END IF;
  
  -- Summary presence
  IF summary IS NOT NULL AND LENGTH(summary) > 0 THEN 
    score := score + 15;
  END IF;
  
  -- Image presence
  IF image_url IS NOT NULL AND LENGTH(image_url) > 0 THEN 
    score := score + 15;
  END IF;
  
  -- Tags presence
  IF array_length(tags, 1) >= 3 THEN 
    score := score + 10;
  ELSIF array_length(tags, 1) >= 1 THEN 
    score := score + 5;
  END IF;
  
  -- Content quality indicators
  IF content LIKE '%h1%' OR content LIKE '%h2%' OR content LIKE '%h3%' THEN 
    score := score + 5;
  END IF;
  
  IF content LIKE '%<img%' THEN 
    score := score + 5;
  END IF;
  
  IF content LIKE '%<ul%' OR content LIKE '%<ol%' THEN 
    score := score + 5;
  END IF;
  
  RETURN LEAST(100, score);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic updates
DROP TRIGGER IF EXISTS update_blogs_last_modified ON public.blogs;
CREATE TRIGGER update_blogs_last_modified
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW
  EXECUTE FUNCTION update_last_modified_column();

DROP TRIGGER IF EXISTS update_glossary_last_modified ON public.glossary;
CREATE TRIGGER update_glossary_last_modified
  BEFORE UPDATE ON public.glossary
  FOR EACH ROW
  EXECUTE FUNCTION update_last_modified_column();

DROP TRIGGER IF EXISTS update_topic_clusters_updated_at ON public.topic_clusters;
CREATE TRIGGER update_topic_clusters_updated_at
  BEFORE UPDATE ON public.topic_clusters
  FOR EACH ROW
  EXECUTE FUNCTION update_last_modified_column();

-- Enable Row Level Security
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glossary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for blogs
DROP POLICY IF EXISTS "Public read access for published blogs" ON public.blogs;
CREATE POLICY "Public read access for published blogs" ON public.blogs
  FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Admin full access to blogs" ON public.blogs;
CREATE POLICY "Admin full access to blogs" ON public.blogs
  FOR ALL USING (auth.role() = 'authenticated');

-- Create RLS policies for glossary
DROP POLICY IF EXISTS "Public read access for published glossary" ON public.glossary;
CREATE POLICY "Public read access for published glossary" ON public.glossary
  FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Admin full access to glossary" ON public.glossary;
CREATE POLICY "Admin full access to glossary" ON public.glossary
  FOR ALL USING (auth.role() = 'authenticated');

-- Create RLS policies for topic_clusters
DROP POLICY IF EXISTS "Public read access to topic clusters" ON public.topic_clusters;
CREATE POLICY "Public read access to topic clusters" ON public.topic_clusters
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access to topic clusters" ON public.topic_clusters;
CREATE POLICY "Admin full access to topic clusters" ON public.topic_clusters
  FOR ALL USING (auth.role() = 'authenticated');

-- Create RLS policies for content_analytics
DROP POLICY IF EXISTS "Admin full access to content analytics" ON public.content_analytics;
CREATE POLICY "Admin full access to content analytics" ON public.content_analytics
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default topic clusters
INSERT INTO public.topic_clusters (cluster_name, cluster_slug, description, keywords, cluster_score) VALUES
('Digitalna Stomatologija', 'digitalna-stomatologija', 'Napredne digitalne tehnologije u stomatologiji', ARRAY['digital', 'tehnologija', 'skener', '3d', 'cad', 'cam', 'digitalizacija'], 85),
('Upravljanje Ordinacijom', 'upravljanje-ordinacijom', 'Efikasno upravljanje stomatološkom ordinacijom', ARRAY['ordinacija', 'upravljanje', 'pacijenti', 'termini', 'organizacija', 'efikasnost'], 80),
('Implantologija', 'implantologija', 'Napredne tehnike implantologije', ARRAY['implant', 'implantologija', 'kirurgija', 'kost', 'osteointegracija'], 90),
('Estetska Stomatologija', 'estetska-stomatologija', 'Estetske procedure i tehnike', ARRAY['estetika', 'beljenje', 'veneers', 'krune', 'estetska'], 75),
('Preventivna Stomatologija', 'preventivna-stomatologija', 'Preventivne mere i edukacija', ARRAY['prevencija', 'higijena', 'kontrola', 'edukacija', 'preventivna'], 70)
ON CONFLICT (cluster_slug) DO NOTHING;

-- Update existing records with default values (only if columns exist)
UPDATE public.blogs 
SET summary = COALESCE(summary, LEFT(content, 160)),
    reading_time = COALESCE(reading_time, calculate_reading_time(content))
WHERE summary IS NULL OR reading_time IS NULL;

UPDATE public.glossary 
SET reading_time = COALESCE(reading_time, calculate_reading_time(full_article))
WHERE reading_time IS NULL;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated; 