# Odontoa Website + Internal CMS

Advanced Dental Practice Management Website with Internal Content Management System for blogs and glossary entries.

## Features

- **Advanced patient management** - Complete dental practice platform
- **Internal Admin CMS** - Content management for blogs and glossary
- **SEO Optimized** - FAQ schema, meta tags, and structured data
- **Role-based Authentication** - Admin-only access with Supabase
- **Automated Backups** - Weekly email reports
- **LLM Integration** - Auto-generated llms.txt for AI visibility

## CMS Features

### Admin Panel (`/admin-panel`)
- ✅ Blog creation and management with Rich Text Editor
- ✅ Glossary/dictionary management
- ✅ Content preview and publishing
- ✅ SEO-friendly content with FAQ schema
- ✅ Weekly automated backups
- ✅ LLM optimization with llms.txt

### Content Types
1. **Blogs** - SEO posts with FAQ schema, tags, publishing status, rich content
2. **Glossary** - Wiki-style dictionary terms with related entries

### SEO & Technical
- **Rich Text Editor** - TipTap-based editor with formatting, images, links
- **Automatic FAQ Schema Generation** - AI-powered question detection and JSON-LD generation
- **LLM Optimization** - Automatic llms.txt generation for AI model ingestion
- **Meta tags and OpenGraph support**
- **Internal linking suggestions**
- **Responsive design with modern UI**

## 🌿 Branch Management

**VAŽNO:** Main branch je zaštićen! Svi development-i idu na numerisane branch-eve.

### Branch Rules:
- **Main branch** - zaštićen, nema direktnih push-eva
- **Development branch-evi** - `NextJS-migrated-version-X` (3, 4, 5, itd.)
- **Nema tagova** - samo branch-evi za verzioniranje

### Automatsko kreiranje branch-a:
```bash
# Kreiraj sledeći branch
./create-next-branch.sh

# Ili ručno
git checkout -b NextJS-migrated-version-X
```

### Workflow:
1. `./create-next-branch.sh` - kreira novi branch
2. Radi promene u kodu
3. `git add . && git commit -m "feat: opis"`
4. `git push origin NextJS-migrated-version-X`
5. Merge u main **samo sa dozvolom**

📋 Detaljna pravila: [BRANCHING_RULES.md](./BRANCHING_RULES.md)

## Prerequisites

- Node.js (version 18 or higher)
- Supabase account and project
- Email service (for backup notifications)

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd odontoa-website
npm install
```

### 2. Environment Setup

Create `.env.local` file:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

Run the SQL schema in your Supabase project:

```bash
# Copy the contents of supabase/schema.sql to your Supabase SQL editor
# This creates tables: blogs, glossary, admin_users, backups
# With proper RLS policies and indexes
```

### 4. Create Admin User

In Supabase Auth, create a user and then add them to admin_users table:

```sql
-- After creating user in Supabase Auth dashboard
INSERT INTO public.admin_users (id, email, role)
VALUES ('user-uuid-from-auth', 'admin@example.com', 'admin');
```

### 5. Development

```bash
npm run dev
```

Visit:
- Main site: `http://localhost:3000`
- Admin panel: `http://localhost:3000/admin-panel`

## Admin Panel Usage

### Accessing Admin Panel

1. Navigate to `/admin-panel`
2. Login with admin credentials
3. Access dashboard with content management options

### New Features (v1.1.0)

#### Rich Text Editor
- **TipTap-based editor** with modern formatting tools
- **Image and link insertion** with URL input
- **Heading levels** (H1, H2, H3) for better content structure
- **Lists and quotes** for better readability
- **Real-time content preview** with character count

#### Enhanced FAQ Generation
- **AI-powered question detection** from content
- **Automatic answer extraction** from surrounding text
- **JSON-LD schema generation** for SEO and AI tools
- **Manual editing capability** for fine-tuning
- **Validation** to ensure proper schema structure

#### LLM Optimization
- **Automatic llms.txt generation** at `/llms.txt`
- **AI-friendly URL listing** for all published content
- **Real-time updates** when content is published
- **Enhanced AI visibility** for ChatGPT, Claude, Perplexity
- **SEO rich results** ready for search engines

#### Modern Blog Design
- **Hero section** with featured content
- **Advanced search and filtering**
- **Responsive card layout** with hover effects
- **Reading time estimation**
- **Category-based navigation**

#### Modern Blog Post Layout
- **Hero section** with gradient background and large title
- **Grid layout** with content and sidebar (3fr/1fr)
- **Table of Contents** - automatically generated from H2 headings
- **Share buttons** - LinkedIn, X, Facebook, native share
- **Related posts** - based on tags and categories
- **Scroll progress bar** - shows reading progress
- **Sticky sidebar** - TOC stays visible on desktop
- **Copy link button** - Medium-style link copying
- **Enhanced typography** - custom prose styles for better readability

### Creating Content

**Blogs:**
- Title, slug (auto-generated)
- Rich content editor with formatting, images, links
- Auto-generated FAQ schema from content
- SEO meta description and tags
- Publishing status (draft/published)
- Automatic llms.txt update on publish
- Content (HTML supported)
- Author, tags
- FAQ Schema (JSON-LD)
- Publish status

**Glossary:**
- Term, slug (auto-generated)  
- Short definition
- Full article (HTML supported)
- Related terms
- FAQ Schema (JSON-LD)

### Content Display

**Blog Pages:** `/blogovi/:slug`
- SEO optimized with meta tags
- FAQ schema markup
- Internal linking
- Social sharing

**Glossary Pages:** `/recnik/:slug`
- Definition and full article
- Related terms sidebar
- SEO structured data

## Backup System

### Automated Backups
- Runs every Sunday at 11:00 PM
- Generates HTML email report
- Stores backup data in Supabase
- Includes all blogs and glossary entries

### Manual Backups
- Available in admin panel
- On-demand backup generation
- Immediate export capability

### Email Reports Include:
- Content statistics
- Recent additions
- SEO compliance check
- FAQ schema status

## SEO Features

### Automatic SEO
- Meta description from content
- OpenGraph tags
- Twitter Cards
- Canonical URLs

### FAQ Schema
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [...]
}
```

### LLM Integration
- Auto-generated `llms.txt`
- Content indexing for AI
- Structured data export

## Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── AdminLogin.tsx   # Admin authentication
│   ├── AdminRoute.tsx   # Protected routing
│   ├── BlogForm.tsx     # Blog creation form
│   ├── GlossaryForm.tsx # Glossary creation form
│   └── ContentList.tsx  # Content management
├── contexts/
│   └── AuthContext.tsx  # Authentication state
├── lib/
│   ├── supabase.ts      # Database client
│   ├── backup.ts        # Backup services
│   └── llms.ts          # LLM integration
├── pages/
│   ├── AdminPanel.tsx   # CMS dashboard
│   ├── BlogSinglePage.tsx
│   ├── RecnikSinglePage.tsx
│   └── ...
└── supabase/
    └── schema.sql       # Database schema
```

## Database Schema

### Tables
- `blogs` - Blog posts with SEO data
- `glossary` - Dictionary entries
- `admin_users` - Admin access control
- `backups` - Backup history

### Security
- Row Level Security (RLS) enabled
- Admin-only write access
- Public read for published content

## Deployment

### Environment Variables
Set in production:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Build
```bash
npm run build
```

### Static Hosting
Deploy `dist/` folder to:
- Netlify
- Vercel
- GitHub Pages
- Any static host

## Email Setup (Production)

For backup emails, integrate with:
- Resend
- SendGrid
- Postmark
- AWS SES

Update `src/lib/backup.ts` with your email service.

## Support

For questions or support:
- Email: ognjen.drinic31@gmail.com
- Create GitHub issues
- Check documentation in `/docs`

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is proprietary software. All rights reserved.

---

Built with ❤️ for dental practices in Serbia
// Force redeploy
