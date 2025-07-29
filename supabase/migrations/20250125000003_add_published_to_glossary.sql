-- Add published column to glossary table
ALTER TABLE public.glossary 
ADD COLUMN published boolean DEFAULT false;

-- Create index for better performance on published column
CREATE INDEX idx_glossary_published ON public.glossary(published);

-- Update RLS policy to only allow public to read published glossary entries
DROP POLICY IF EXISTS "Anyone can read glossary entries" ON public.glossary;
CREATE POLICY "Anyone can read published glossary entries" ON public.glossary
    FOR SELECT USING (published = true); 