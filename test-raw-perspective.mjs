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

const clientPublished = createClient({
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
  "slug": slug.current
}`;

console.log('Testing with "raw" perspective:');
const termsRaw = await clientRaw.fetch(query);
console.log(`Found ${termsRaw.length} terms\n`);

console.log('Testing with "published" perspective:');
const termsPublished = await clientPublished.fetch(query);
console.log(`Found ${termsPublished.length} terms\n`);

if (termsRaw.length !== termsPublished.length) {
  console.log('⚠️  DIFFERENCE! Raw perspective returns more terms.');
}
