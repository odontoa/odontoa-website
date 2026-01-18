import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_TOKEN || process.env.SANITY_READ_TOKEN;

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-11-20',
  useCdn: false,
  token,
});

const query = `*[_type == "glossaryTerm" && !(_id in path("drafts.**")) && defined(slug.current) && defined(publishedAt)] | order(term asc){
  _id,
  term,
  "slug": slug.current,
  definition,
  category,
  publishedAt
}`;

console.log('Fetching glossary terms...\n');
const terms = await client.fetch(query);
console.log(`Found ${terms.length} terms:\n`);
terms.forEach((term, i) => {
  console.log(`${i + 1}. ${term.term} (slug: ${term.slug}, publishedAt: ${term.publishedAt || 'MISSING'})`);
});

// Also check without publishedAt requirement
const queryAll = `*[_type == "glossaryTerm" && !(_id in path("drafts.**"))] | order(term asc){
  _id,
  term,
  "slug": slug.current,
  publishedAt
}`;
const allTerms = await client.fetch(queryAll);
console.log(`\n\nTotal terms (including without publishedAt): ${allTerms.length}`);
allTerms.forEach((term, i) => {
  if (!term.publishedAt) {
    console.log(`⚠️  ${term.term} - MISSING publishedAt`);
  }
});
