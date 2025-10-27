# Odontoa Strapi CMS (Beta)

This is the experimental Strapi CMS backend for Odontoa website's blog and glossary content management.

## ⚠️ Experimental Status

This is a **BETA** implementation and does not affect the production system. The existing `/admin-panel` continues to work normally.

## Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd cms-strapi
npm install
```

### Development

```bash
npm run develop
```

The Strapi admin panel will be available at `http://localhost:1337/admin`

### Production

```bash
npm run build
npm run start
```

## Content Types

### Blog Post (`blog-post`)
- **title** (string) - Blog post title
- **slug** (UID) - URL-friendly identifier
- **excerpt** (text) - Short description
- **cover_image** (media) - Featured image
- **tags** (JSON) - Array of tags
- **read_time** (number) - Estimated reading time in minutes
- **main_content** (richtext) - Main blog content
- **faq** (component) - FAQ questions and answers
- **seo_schema** (JSON) - Generated SEO structured data
- **datePublished** (datetime) - Publication date
- **dateModified** (datetime) - Last modification date
- **author** (relation) - Author reference

### Author (`author`)
- **name** (string) - Author name
- **email** (email) - Author email
- **bio** (text) - Author biography
- **avatar** (media) - Author profile image
- **social_links** (JSON) - Social media links
- **blog_posts** (relation) - Related blog posts

## API Endpoints

### Blog Posts
- **GET** `/api/blog-posts` - List all blog posts
- **GET** `/api/blog-posts?populate=*` - List with all relations
- **GET** `/api/blog-posts/:id` - Get single blog post
- **POST** `/api/blog-posts` - Create new blog post
- **PUT** `/api/blog-posts/:id` - Update blog post
- **DELETE** `/api/blog-posts/:id` - Delete blog post

### Authors
- **GET** `/api/authors` - List all authors
- **GET** `/api/authors?populate=*` - List with all relations
- **GET** `/api/authors/:id` - Get single author

## Lifecycle Hooks

The blog-post content type includes lifecycle hooks for:
- Automatic SEO schema generation (TODO)
- Date management (datePublished, dateModified)
- Post-processing after create/update

## Environment Variables

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your_app_keys
DATABASE_FILENAME=.tmp/data.db
```

## Integration with Next.js

The frontend mapping is prepared for:
- `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blog-posts?populate=*`
- Field mapping between Strapi and existing frontend components
- SEO schema integration
- Author relationship handling

## TODO

- [ ] Implement SEO schema generation in lifecycle hooks
- [ ] Add glossary content type
- [ ] Configure authentication and permissions
- [ ] Add image optimization
- [ ] Implement content validation
- [ ] Add backup and export functionality

## Notes

- This is an experimental implementation
- Does not affect existing `/admin-panel` functionality
- All changes are isolated to `/admin2` and `/cms-strapi` folders
- Production system remains unchanged
