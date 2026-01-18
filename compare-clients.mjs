import { createClient as createNextSanityClient } from 'next-sanity';
import { createClient as createSanityClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "peat8sel";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_READ_TOKEN || process.env.SANITY_TOKEN;

const nextClient = createNextSanityClient({
  projectId,
  dataset,
  apiVersion: "2025-11-20",
  useCdn: false,
  perspective: "raw",
  ...(token && { token }),
});

const sanityClient = createSanityClient({
  projectId,
  dataset,
  apiVersion: '2025-11-20',
  useCdn: false,
  token,
});

const query = `*[_type == "glossaryTerm" && !(_id in path("drafts.**")) && defined(slug.current) && defined(publishedAt)] | order(term asc){
  _id,
  term,
  "slug": slug.current
}`;

console.log('Testing with @sanity/client:');
const termsSanity = await sanityClient.fetch(query);
console.log(`Found ${termsSanity.length} terms`);
termsSanity.forEach((t, i) => console.log(`  ${i+1}. ${t.term}`));

console.log('\nTesting with next-sanity:');
const termsNext = await nextClient.fetch(query);
console.log(`Found ${termsNext.length} terms`);
termsNext.forEach((t, i) => console.log(`  ${i+1}. ${t.term}`));

if (termsSanity.length !== termsNext.length) {
  console.log('\n⚠️  DIFFERENCE DETECTED!');
  const sanityIds = new Set(termsSanity.map(t => t._id));
  const nextIds = new Set(termsNext.map(t => t._id));
  const missing = termsSanity.filter(t => !nextIds.has(t._id));
  console.log(`Missing in next-sanity: ${missing.length}`);
  missing.forEach(t => console.log(`  - ${t.term} (${t._id})`));
}
