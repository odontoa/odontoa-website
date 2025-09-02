-- Add featured field to blogs table
ALTER TABLE public.blogs ADD COLUMN featured boolean DEFAULT false;

-- Create index for better performance when querying featured blogs
CREATE INDEX idx_blogs_featured ON public.blogs(featured) WHERE featured = true;
