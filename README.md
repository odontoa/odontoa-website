# Odontoa Website + Internal CMS

Advanced Dental Practice Management Website with Internal Content Management System for blogs and glossary entries.

## Features

- **Advanced patient management** - Complete dental practice platform
- **Internal Admin CMS** - Content management for blogs and glossary
- **SEO Optimized** - FAQ schema, meta tags, and structured data
- **Role-based Authentication** - Admin-only access with Supabase
- **Automated Backups** - Weekly email reports
- **LLM Integration** - Auto-generated llms.txt for AI visibility

## UI Lab V2 — Design-to-Dev Sandbox

Internal UI prototyping sandbox for Odontoa V2 Moodify dashboard. All data is stored in **localStorage** (browser-only, no backend yet).

> For detailed dev documentation, data models, localStorage keys, and backend integration TODOs, see [`src/ui-lab/DEV_HANDOFF.md`](src/ui-lab/DEV_HANDOFF.md).

### Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` then navigate to any UI Lab route below.

### Key Routes

| Route | Screen | CRUD Status |
|-------|--------|-------------|
| `/ui-lab/figma-dashboard` | Dashboard (overview) | UI-only |
| `/ui-lab/pacijenti` | Patient list | **Full CRUD** — create, edit, delete with persistence |
| `/ui-lab/pacijenti/[id]` | Patient details | **Full CRUD** — edit, delete; redirects to list on delete |
| `/ui-lab/finansije/predracun` | Invoices (Predračun) | **Full CRUD** — create, edit, status transitions, delete drafts |
| `/ui-lab/ordinacija/sabloni` | Document templates | **Full CRUD** — create, edit, delete, duplicate |
| `/ui-lab/figma-dashboard/calendar` | Appointments calendar | **Full CRUD** — appointments + recurrence series |
| `/ui-lab/ordinacija/cenovnik` | Therapy price list | Read + framework (edit UI incomplete) |
| `/ui-lab/ordinacija/tehnika` | Lab technicians | Read + framework (edit UI incomplete) |
| `/ui-lab/finansije/uplate` | Payments | UI-only (no CRUD wired) |
| `/ui-lab/finansije/izvestaji` | Reports | Placeholder |

### Persistence

All mutations are persisted immediately to `localStorage`. Refreshing the page restores the last state. Seed data is loaded on first run (15 patients, 7 invoices, 2 templates, 23 appointments).

**Docs update rule:** Whenever data models, persistence layer, or backend service shape changes, update both this file and [`src/ui-lab/DEV_HANDOFF.md`](src/ui-lab/DEV_HANDOFF.md) in the same PR.

---

## CMS Features

### Admin Panel (`/admin-panel`)
- ✅ Blog creation and management with Rich Text Editor
- ✅ Glossary/dictionary management
- ✅ Content preview and publishing
- ✅ SEO-friendly content with FAQ schema
- ✅ Weekly automated backups
- ✅ LLM optimization with llms.txt

### Beta Strapi CMS – testiranje
Trenutno testiramo Strapi CMS kao moguću zamenu za postojeći admin panel. Sadržaj bloga i rečnika će preći u Strapi kad potvrđeno da sve radi kako treba.

**Pristup:** `/admin2` (dostupno samo u development i staging okruženju)
- 🔒 Zaštićeno autentikacijom (isti admin pristup kao `/admin-panel`)
- 🚫 Meta tag `noindex,nofollow` - ne indeksira se u Google-u
- 🔗 Direktan link ka Strapi admin panelu
- 🏷️ Beta badge za jasno označavanje test verzije

### Strapi CMS (Beta) – naredni korak
Trenutno pokrećemo Strapi CMS kao eksperiment za upravljanje blogom i rečnikom. Nakon testiranja može zameniti postojeći admin panel za sadržaj.

**Backend struktura:** `/cms-strapi/`
- 📝 Blog-post content type sa svim potrebnim poljima
- 👤 Author content type za upravljanje autorima
- 🔄 Lifecycle hooks za automatsko generisanje SEO schema
- 🎯 Komponente za FAQ strukturu
- 🔗 API endpoint: `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blog-posts?populate=*`

**Strapi Cloud Setup:**
- `NEXT_PUBLIC_STRAPI_URL` pokazuje na Strapi Cloud instancu (free plan)
- `fetchBlogPosts()` poziva Strapi `/api/articles?populate=*`
- Public role u Strapi mora da ima uključena find i findOne za Article
- Blog listing na sajtu za sada još uvek renderuje podatke iz starog sistema; Strapi je u fazi testiranja

**Preview System:**
- We added `/admin2/strapi-preview` to visually inspect Strapi Cloud content before we fully switch the live blog to Strapi
- This route is protected and noindexed
- Shows normalized article data with cover images, authors, and publication dates

**Eksperimentalno:** Ova funkcionalnost je u beta fazi i ne utiče na postojeći sistem.

## Blog (Strapi CMS)

Blog sadržaj (naslovi, tekstovi, slike) se sada uređuje u Strapi Cloud. Odontoa frontend (Next.js) samo čita javno objavljene članke iz Strapi-ja.

### Strapi Cloud Setup
- **URL**: `NEXT_PUBLIC_STRAPI_URL` pokazuje na Strapi Cloud instancu
- **Collection Type**: Article sa poljima title, slug, description, content, cover, author, publishedAt
- **Public Role**: Ima uključena `find` i `findOne` dozvola za Article kolekciju
- **API Endpoint**: `/api/articles?populate=*` za sve članke, `/api/articles?filters[slug][$eq]=...` za pojedinačne

### Frontend Integracija
- **Lista članaka**: `/blog2` - nova ruta sa Strapi integracijom
- **Pojedinačni članak**: `/blog2/[slug]` - server component sa SEO metadata
- **Admin pregled**: `/admin2/strapi-preview` - interni pregled za admin tim (iza Supabase auth, noindex)
- **Graceful fallback**: Ako Strapi spava, prikazuje se user-friendly poruka umesto 500 greške

### Content Management
- Content tim može objavljivati članke bez developera: dovoljno je da publish-uju u Strapi-ju
- Automatski SEO metadata (title, description, OpenGraph, Twitter Cards)
- JSON-LD structured data (Article, BreadcrumbList)
- Responsive dizajn sa sticky TOC i modernim tipografijom

### TODO: Migracija
- Kada migriramo finalni dizajn, `/blog2` će zameniti `/blog` u glavnom headeru
- Stari `/blog` ide u 301 redirect
- Trenutno postoje oba linka u navigaciji za testiranje

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

## 🔐 Git Account Rules

**CRITICAL:** This project MUST always use the odontoa GitHub account for all git operations.

### Git Configuration Setup:
```bash
# Run this script to set up correct git configuration
./setup-git-odontoa.sh

# Or manually configure:
git config --local user.name "Odontoa Team"
git config --local user.email "odontoa.com@gmail.com"
git remote set-url origin git@github.com-odontoa:odontoa/odontoa-website.git
```

### Account Rules:
- ✅ **Always use**: `odontoa/odontoa-website` repository
- ✅ **Git Email**: `odontoa.com@gmail.com` (for Git commits only)
- ✅ **User**: `Odontoa Team`
- ❌ **Never use**: Personal GitHub accounts
- ❌ **Never push to**: Other repositories

### Pre-push Hook:
- Automatically verifies correct account before each push
- Prevents accidental pushes to wrong repositories
- Auto-corrects user configuration if needed

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
// Force Vercel to use main branch
