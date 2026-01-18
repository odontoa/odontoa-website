import { createClient } from 'next-sanity';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "peat8sel";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_READ_TOKEN;

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-11-20",
  useCdn: false,
  perspective: "published",
  ...(token && { token }),
});

const query = `*[_type == "glossaryTerm" && !(_id in path("drafts.**")) && defined(slug.current) && defined(publishedAt)] | order(term asc){
  _id,
  term,
  "slug": slug.current,
  definition,
  category,
  publishedAt
}`;

console.log('Testing with next-sanity client (same as in app):\n');
const terms = await client.fetch(query);
console.log(`Found ${terms.length} terms:\n`);
terms.forEach((term, i) => {
  console.log(`${i + 1}. ${term.term} (${term.category || 'no category'})`);
});
