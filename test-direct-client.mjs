import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "peat8sel";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_READ_TOKEN || process.env.SANITY_TOKEN;

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-11-20",
  useCdn: false,
  token,
});

const query = `*[_type == "glossaryTerm" && !(_id in path("drafts.**")) && defined(slug.current) && defined(publishedAt)] | order(term asc){
  _id,
  term,
  "slug": slug.current,
  definition,
  fullArticle,
  category,
  tags[]->{ title, "slug": slug.current },
  "relatedTerms": relatedTerms[]->{ term, "slug": slug.current },
  publishedAt,
  "updatedAt": coalesce(updatedAt, publishedAt),
  "authorName": author->name,
  "authorSlug": author->slug.current,
  "authorUrlFromAuthor": author->url,
  authorUrl,
  coverImage,
  coverImageAlt,
  seoTitle,
  metaDescription,
  canonicalUrl,
  noindex,
  faqs
}`;

console.log('Testing with direct @sanity/client (same as in page.tsx now):\n');
const terms = await client.fetch(query);
console.log(`Found ${terms.length} terms:\n`);
terms.forEach((t, i) => {
  console.log(`${i+1}. ${t.term}`);
});

if (terms.length === 17) {
  console.log('\n✅ SUCCESS! All 17 terms returned.');
} else {
  console.log(`\n⚠️  Expected 17, got ${terms.length}`);
}
