-- Add only the missing fields for JSON-LD schema requirements

-- Add missing fields to blogs table
ALTER TABLE public.blogs 
ADD COLUMN IF NOT EXISTS author_url text DEFAULT 'https://odontoa.com/o-nama';

-- Add missing fields to glossary table
ALTER TABLE public.glossary 
ADD COLUMN IF NOT EXISTS author text DEFAULT 'Odontoa Tim',
ADD COLUMN IF NOT EXISTS author_url text DEFAULT 'https://odontoa.com/o-nama';

-- Create indexes for new fields if they don't exist
CREATE INDEX IF NOT EXISTS idx_blogs_author_url ON public.blogs(author_url);
CREATE INDEX IF NOT EXISTS idx_glossary_author ON public.glossary(author);
CREATE INDEX IF NOT EXISTS idx_glossary_author_url ON public.glossary(author_url);
