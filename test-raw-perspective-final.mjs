import { createClient } from 'next-sanity';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "peat8sel";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_READ_TOKEN;

const clientRaw = createClient({
  projectId,
  dataset,
  apiVersion: "2025-11-20",
  useCdn: false,
  perspective: "raw",
  ...(token && { token }),
});

const query = `*[_type == "glossaryTerm" && !(_id in path("drafts.**")) && defined(slug.current) && defined(publishedAt)] | order(term asc){
  _id,
  term,
  "slug": slug.current
}`;

console.log('Testing with "raw" perspective (after fix):\n');
const terms = await clientRaw.fetch(query);
console.log(`Found ${terms.length} terms:\n`);
terms.forEach((t, i) => {
  console.log(`${i+1}. ${t.term}`);
});

if (terms.length === 17) {
  console.log('\n✅ SUCCESS! All 17 terms are now returned.');
} else {
  console.log(`\n⚠️  Expected 17, got ${terms.length}`);
}
