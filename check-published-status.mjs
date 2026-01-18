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

// Check all terms
const query = `*[_type == "glossaryTerm" && !(_id in path("drafts.**")) && defined(slug.current) && defined(publishedAt)] | order(term asc){
  _id,
  term,
  publishedAt,
  _rev
}`;

const terms = await client.fetch(query);
console.log(`Total terms: ${terms.length}\n`);

// Check if they're in drafts
terms.forEach(t => {
  const isDraft = t._id.startsWith('drafts.');
  console.log(`${t.term}: ${t._id} ${isDraft ? '(DRAFT)' : '(PUBLISHED)'} - publishedAt: ${t.publishedAt}`);
});
