-- Enable RLS
ALTER TABLE IF EXISTS public.blogs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.glossary DISABLE ROW LEVEL SECURITY;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.blogs;
DROP TABLE IF EXISTS public.glossary;
DROP TABLE IF EXISTS public.admin_users;

-- Create admin_users table
CREATE TABLE public.admin_users (
    id uuid REFERENCES auth.users(id) PRIMARY KEY,
    email text UNIQUE NOT NULL,
    role text NOT NULL DEFAULT 'admin',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create blogs table
CREATE TABLE public.blogs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    content text NOT NULL,
    faq_schema jsonb,
    tags text[] DEFAULT '{}',
    author text NOT NULL,
    published boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create glossary table
CREATE TABLE public.glossary (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    term text NOT NULL,
    slug text UNIQUE NOT NULL,
    definition text NOT NULL,
    full_article text NOT NULL,
    faq_schema jsonb,
    related_terms text[] DEFAULT '{}',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create backups table for storing backup information
CREATE TABLE public.backups (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    backup_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    backup_data jsonb,
    email_sent boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glossary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backups ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for blogs table
CREATE POLICY "Admin users can do everything on blogs" ON public.blogs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE admin_users.id = auth.uid() 
            AND admin_users.role = 'admin'
        )
    );

-- Allow public to read published blogs
CREATE POLICY "Anyone can read published blogs" ON public.blogs
    FOR SELECT USING (published = true);

-- Create RLS policies for glossary table
CREATE POLICY "Admin users can do everything on glossary" ON public.glossary
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE admin_users.id = auth.uid() 
            AND admin_users.role = 'admin'
        )
    );

-- Allow public to read glossary entries
CREATE POLICY "Anyone can read glossary entries" ON public.glossary
    FOR SELECT USING (true);

-- Create RLS policies for admin_users table
CREATE POLICY "Admin users can read admin_users" ON public.admin_users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE admin_users.id = auth.uid() 
            AND admin_users.role = 'admin'
        )
    );

-- Create RLS policies for backups table
CREATE POLICY "Admin users can do everything on backups" ON public.backups
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE admin_users.id = auth.uid() 
            AND admin_users.role = 'admin'
        )
    );

-- Create indexes for better performance
CREATE INDEX idx_blogs_slug ON public.blogs(slug);
CREATE INDEX idx_blogs_published ON public.blogs(published);
CREATE INDEX idx_blogs_created_at ON public.blogs(created_at DESC);
CREATE INDEX idx_glossary_slug ON public.glossary(slug);
CREATE INDEX idx_glossary_term ON public.glossary(term);
CREATE INDEX idx_glossary_created_at ON public.glossary(created_at DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON public.blogs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_glossary_updated_at BEFORE UPDATE ON public.glossary
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 