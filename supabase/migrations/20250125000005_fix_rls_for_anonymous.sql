-- Fix RLS policies to work properly with anonymous users
-- Drop existing policies
DROP POLICY IF EXISTS "Admin users can do everything on glossary" ON public.glossary;
DROP POLICY IF EXISTS "Public read access for published glossary entries" ON public.glossary;

-- Create new policies that work for both authenticated and anonymous users
CREATE POLICY "Admin users can do everything on glossary" ON public.glossary
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE admin_users.id = auth.uid() 
            AND admin_users.role = 'admin'
        )
    );

-- Allow public (including anonymous users) to read published glossary entries
CREATE POLICY "Public read access for published glossary entries" ON public.glossary
    FOR SELECT USING (published = true);

-- Also fix blog policies
DROP POLICY IF EXISTS "Admin users can do everything on blogs" ON public.blogs;
DROP POLICY IF EXISTS "Anyone can read published blogs" ON public.blogs;

CREATE POLICY "Admin users can do everything on blogs" ON public.blogs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE admin_users.id = auth.uid() 
            AND admin_users.role = 'admin'
        )
    );

CREATE POLICY "Public read access for published blogs" ON public.blogs
    FOR SELECT USING (published = true); 