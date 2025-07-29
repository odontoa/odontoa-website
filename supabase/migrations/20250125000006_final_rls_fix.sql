-- Final RLS fix - make policies work for anonymous users
-- For admin policies, we need to handle the case where auth.uid() might be null

-- Drop and recreate glossary policies
DROP POLICY IF EXISTS "Admin users can do everything on glossary" ON public.glossary;
DROP POLICY IF EXISTS "Public read access for published glossary entries" ON public.glossary;

-- Admin policy that handles null auth.uid()
CREATE POLICY "Admin users can do everything on glossary" ON public.glossary
    FOR ALL USING (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE admin_users.id = auth.uid() 
            AND admin_users.role = 'admin'
        )
    );

-- Public read policy that works for everyone
CREATE POLICY "Public read access for published glossary entries" ON public.glossary
    FOR SELECT USING (published = true);

-- Drop and recreate blog policies
DROP POLICY IF EXISTS "Admin users can do everything on blogs" ON public.blogs;
DROP POLICY IF EXISTS "Public read access for published blogs" ON public.blogs;

-- Admin policy that handles null auth.uid()
CREATE POLICY "Admin users can do everything on blogs" ON public.blogs
    FOR ALL USING (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE admin_users.id = auth.uid() 
            AND admin_users.role = 'admin'
        )
    );

-- Public read policy that works for everyone
CREATE POLICY "Public read access for published blogs" ON public.blogs
    FOR SELECT USING (published = true); 