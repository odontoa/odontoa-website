-- Fix RLS policies to avoid infinite recursion

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admin users can read admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admin users can do everything on blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admin users can do everything on glossary" ON public.glossary;
DROP POLICY IF EXISTS "Admin users can do everything on backups" ON public.backups;

-- Create new simplified policies for admin_users table
-- Allow users to read their own record
CREATE POLICY "Users can read own admin record" ON public.admin_users
    FOR SELECT USING (auth.uid() = id);

-- Allow service role to do everything (for initial setup)
CREATE POLICY "Service role can do everything on admin_users" ON public.admin_users
    FOR ALL USING (auth.role() = 'service_role');

-- Create new policies for blogs table using auth.uid() directly
CREATE POLICY "Admin users can do everything on blogs" ON public.blogs
    FOR ALL USING (auth.uid() IN (
        SELECT id FROM public.admin_users WHERE role = 'admin'
    ));

-- Create new policies for glossary table using auth.uid() directly  
CREATE POLICY "Admin users can do everything on glossary" ON public.glossary
    FOR ALL USING (auth.uid() IN (
        SELECT id FROM public.admin_users WHERE role = 'admin'
    ));

-- Create new policies for backups table using auth.uid() directly
CREATE POLICY "Admin users can do everything on backups" ON public.backups
    FOR ALL USING (auth.uid() IN (
        SELECT id FROM public.admin_users WHERE role = 'admin'
    )); 