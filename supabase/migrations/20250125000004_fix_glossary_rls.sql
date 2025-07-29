-- Fix RLS policy for glossary to work with anonymous users
DROP POLICY IF EXISTS "Anyone can read published glossary entries" ON public.glossary;

-- Create a more permissive policy that works for both authenticated and anonymous users
CREATE POLICY "Public read access for published glossary entries" ON public.glossary
    FOR SELECT USING (published = true); 