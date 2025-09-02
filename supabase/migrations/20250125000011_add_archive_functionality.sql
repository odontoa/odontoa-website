-- Add archive functionality to blogs table
-- This migration adds an archived column and modifies the schema to support soft deletion

-- Add archived column to blogs table (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'archived') THEN
        ALTER TABLE public.blogs ADD COLUMN archived boolean DEFAULT false;
    END IF;
END $$;

-- Add archived_at timestamp column (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'archived_at') THEN
        ALTER TABLE public.blogs ADD COLUMN archived_at timestamp with time zone;
    END IF;
END $$;

-- Add archived_by column to track who archived the blog (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'archived_by') THEN
        ALTER TABLE public.blogs ADD COLUMN archived_by uuid REFERENCES auth.users(id);
    END IF;
END $$;

-- Add archive_reason column (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'archive_reason') THEN
        ALTER TABLE public.blogs ADD COLUMN archive_reason text;
    END IF;
END $$;

-- Create index for archived blogs
CREATE INDEX IF NOT EXISTS idx_blogs_archived ON public.blogs(archived);
CREATE INDEX IF NOT EXISTS idx_blogs_archived_at ON public.blogs(archived_at DESC);

-- Update RLS policies to exclude archived blogs from public view
-- Drop existing public read policy
DROP POLICY IF EXISTS "Anyone can read published blogs" ON public.blogs;

-- Create new public read policy that excludes archived blogs
CREATE POLICY "Anyone can read published blogs" ON public.blogs
    FOR SELECT USING (published = true AND archived = false);

-- Create function to archive a blog
CREATE OR REPLACE FUNCTION archive_blog(blog_id uuid, reason text DEFAULT NULL)
RETURNS void AS $$
BEGIN
    UPDATE public.blogs 
    SET 
        archived = true,
        archived_at = timezone('utc'::text, now()),
        archived_by = auth.uid(),
        archive_reason = reason
    WHERE id = blog_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to restore a blog from archive
CREATE OR REPLACE FUNCTION restore_blog(blog_id uuid)
RETURNS void AS $$
BEGIN
    UPDATE public.blogs 
    SET 
        archived = false,
        archived_at = NULL,
        archived_by = NULL,
        archive_reason = NULL
    WHERE id = blog_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on archive functions to admin users
GRANT EXECUTE ON FUNCTION archive_blog(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION restore_blog(uuid) TO authenticated;

-- Create RLS policy for admin users to manage archived blogs
CREATE POLICY "Admin users can manage archived blogs" ON public.blogs
    FOR ALL USING (
        archived = true AND
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE admin_users.id = auth.uid() 
            AND admin_users.role = 'admin'
        )
    );
