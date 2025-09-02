-- Add missing fields for JSON-LD schema requirements

-- Add fields to blogs table
ALTER TABLE public.blogs 
ADD COLUMN IF NOT EXISTS summary text,
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS alt_text text,
ADD COLUMN IF NOT EXISTS author_url text DEFAULT 'https://odontoa.com/o-nama',
ADD COLUMN IF NOT EXISTS last_modified timestamp with time zone DEFAULT timezone('utc'::text, now()),
ADD COLUMN IF NOT EXISTS views_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS reading_time integer DEFAULT 5,
ADD COLUMN IF NOT EXISTS seo_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS related_glossary_terms text[] DEFAULT '{}';

-- Add fields to glossary table
ALTER TABLE public.glossary 
ADD COLUMN IF NOT EXISTS why_it_matters text,
ADD COLUMN IF NOT EXISTS related_blog_posts text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS difficulty_level text DEFAULT 'beginner',
ADD COLUMN IF NOT EXISTS author text DEFAULT 'Odontoa Tim',
ADD COLUMN IF NOT EXISTS author_url text DEFAULT 'https://odontoa.com/o-nama',
ADD COLUMN IF NOT EXISTS last_modified timestamp with time zone DEFAULT timezone('utc'::text, now()),
ADD COLUMN IF NOT EXISTS views_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS reading_time integer DEFAULT 5,
ADD COLUMN IF NOT EXISTS seo_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS alt_text text,
ADD COLUMN IF NOT EXISTS meta_description text;

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment(row_id uuid, column_name text)
RETURNS integer AS $$
BEGIN
  RETURN COALESCE(
    (SELECT (column_name::text)::integer + 1 
     FROM public.blogs 
     WHERE id = row_id), 1
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate reading time
CREATE OR REPLACE FUNCTION calculate_reading_time(content TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN GREATEST(1, LENGTH(content) / 200); -- 200 chars per minute
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate SEO score
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
BEGIN
  -- Title length (50-60 chars optimal)
  IF LENGTH(title) BETWEEN 50 AND 60 THEN
    score := score + 10;
  ELSIF LENGTH(title) BETWEEN 30 AND 70 THEN
    score := score + 5;
  END IF;
  
  -- Content length (minimum 300 words)
  IF LENGTH(content) > 1500 THEN
    score := score + 10;
  ELSIF LENGTH(content) > 800 THEN
    score := score + 5;
  END IF;
  
  -- Summary/description
  IF summary IS NOT NULL AND LENGTH(summary) > 0 THEN
    score := score + 10;
  END IF;
  
  -- Image
  IF image_url IS NOT NULL AND LENGTH(image_url) > 0 THEN
    score := score + 10;
  END IF;
  
  -- Tags
  IF array_length(tags, 1) > 0 THEN
    score := score + 5;
  END IF;
  
  RETURN LEAST(100, score);
END;
$$ LANGUAGE plpgsql;

-- Create indexes for new fields
CREATE INDEX IF NOT EXISTS idx_blogs_image_url ON public.blogs(image_url);
CREATE INDEX IF NOT EXISTS idx_blogs_author ON public.blogs(author);
CREATE INDEX IF NOT EXISTS idx_blogs_last_modified ON public.blogs(last_modified DESC);
CREATE INDEX IF NOT EXISTS idx_glossary_category ON public.glossary(category);
CREATE INDEX IF NOT EXISTS idx_glossary_difficulty_level ON public.glossary(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_glossary_last_modified ON public.glossary(last_modified DESC);
