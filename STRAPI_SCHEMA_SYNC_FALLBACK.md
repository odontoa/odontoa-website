# Strapi Schema Sync Fallback Plan

## 🎯 Current Status
✅ **COMPLETED**: Config sync files pushed to main branch
- Created `config/` folder with Article schema and component definitions
- All new fields included: key_takeaways, faq_items, cta_footer_*, seo_*, breadcrumb_label, geo_focus, structured_data_override
- Components: key-takeaway and faq-item schemas created

## 🚀 Next Steps (Manual)
1. **Trigger Strapi Cloud Deployment** - Click "Trigger deployment" in Strapi Cloud dashboard
2. **Wait for deployment completion** (usually 2-5 minutes)
3. **Test in Content Manager** - Create new Article entry to verify fields appear

## 🔄 Fallback Options (If Config Sync Fails)

### Option 1: Manual Schema Override via Strapi Admin
If fields still don't appear after deployment:

1. **Access Strapi Cloud Admin Panel**
2. **Go to Content-Type Builder**
3. **Edit Article Content Type**
4. **Manually add each field** using the schema definitions below

### Option 2: Database Migration Script
If manual override fails, use this SQL migration:

```sql
-- Add new columns to articles table
ALTER TABLE articles ADD COLUMN key_takeaways JSON;
ALTER TABLE articles ADD COLUMN faq_items JSON;
ALTER TABLE articles ADD COLUMN cta_footer_enabled BOOLEAN DEFAULT false;
ALTER TABLE articles ADD COLUMN cta_footer_headline VARCHAR(255);
ALTER TABLE articles ADD COLUMN cta_footer_subtext TEXT;
ALTER TABLE articles ADD COLUMN cta_footer_button_label VARCHAR(255);
ALTER TABLE articles ADD COLUMN cta_footer_button_url VARCHAR(255);
ALTER TABLE articles ADD COLUMN seo_title VARCHAR(255);
ALTER TABLE articles ADD COLUMN seo_description TEXT;
ALTER TABLE articles ADD COLUMN og_image INTEGER;
ALTER TABLE articles ADD COLUMN breadcrumb_label VARCHAR(255);
ALTER TABLE articles ADD COLUMN geo_focus ENUM('Srbija', 'Balkan', 'Regionalno');
ALTER TABLE articles ADD COLUMN structured_data_override JSON;

-- Create component tables
CREATE TABLE components_blog_key_takeaways (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  icon INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE components_blog_faq_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question VARCHAR(300) NOT NULL,
  answer TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Option 3: Strapi CLI Transfer (Advanced)
If database migration is needed:

```bash
# Export current schema
npx strapi export --file=current-schema.json

# Import updated schema
npx strapi import --file=updated-schema.json
```

## 📋 Field Definitions for Manual Entry

### Article Content Type Fields
```
key_takeaways: Component (blog.key-takeaway, repeatable)
faq_items: Component (blog.faq-item, repeatable)
cta_footer_enabled: Boolean (default: false)
cta_footer_headline: String
cta_footer_subtext: Text
cta_footer_button_label: String
cta_footer_button_url: String
seo_title: String
seo_description: Text
og_image: Media (images only)
breadcrumb_label: String
geo_focus: Enumeration (Srbija, Balkan, Regionalno)
structured_data_override: JSON
```

### Key Takeaway Component
```
title: String (required, max 200)
description: Text (required)
icon: Media (images only, optional)
```

### FAQ Item Component
```
question: String (required, max 300)
answer: Rich Text (required)
order: Integer (default: 0)
```

## 🔍 Verification Checklist
After deployment, verify these fields appear in Content Manager:
- [ ] Key Takeaways section (repeatable component)
- [ ] FAQ Items section (repeatable component)
- [ ] CTA Footer section (enabled, headline, subtext, button)
- [ ] SEO section (title, description, OG image)
- [ ] Additional fields (breadcrumb label, geo focus, structured data)

## 🆘 Emergency Contact
If all methods fail, contact Strapi Cloud support with:
- Project ID: [Your Strapi Cloud Project ID]
- Issue: Schema sync not applying new fields
- Files: config/api/article/schema.json, config/api/blog/components/*

## 📁 Files Created
- `config/api/article/schema.json` - Main Article schema
- `config/api/blog/components/key-takeaway/schema.json` - Key Takeaway component
- `config/api/blog/components/faq-item/schema.json` - FAQ Item component
- `src/api/blog/components/key-takeaway/schema.json` - Source component
- `src/api/blog/components/faq-item/schema.json` - Source component

**Status**: Ready for Strapi Cloud deployment trigger! 🚀
