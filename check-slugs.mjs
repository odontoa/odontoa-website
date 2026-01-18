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
  term,
  "slug": slug.current,
  _id
}`;

const terms = await client.fetch(query);
console.log(`Checking ${terms.length} terms:\n`);

terms.forEach((t, i) => {
  console.log(`${i+1}. "${t.term}" -> slug: "${t.slug}"`);
});
