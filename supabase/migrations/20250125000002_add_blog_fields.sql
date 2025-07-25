-- Add new fields to blogs table for enhanced CMS functionality
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS featured_image TEXT;

-- Update existing blogs to have default values
UPDATE blogs 
SET excerpt = SUBSTRING(content, 1, 150) || '...'
WHERE excerpt IS NULL;

UPDATE blogs 
SET meta_description = SUBSTRING(content, 1, 160)
WHERE meta_description IS NULL;

-- Add index for published blogs
CREATE INDEX IF NOT EXISTS idx_blogs_published_created 
ON blogs(published, created_at DESC) 
WHERE published = true; 