import { createClient as createNextSanity } from 'next-sanity';
import { createClient as createSanityClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "peat8sel";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_READ_TOKEN || process.env.SANITY_TOKEN;

const nextClient = createNextSanity({
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

const query = `*[_type == "glossaryTerm" && !(_id in path("drafts.**")) && slug.current == $slug && defined(publishedAt)][0]{
  _id,
  term,
  "slug": slug.current,
  definition
}`;

const testSlugs = ['analiza', 'anestezija', 'aparat', 'bakterija'];

console.log('Testing single term queries:\n');

for (const slug of testSlugs) {
  console.log(`Testing slug: "${slug}"`);
  
  const nextResult = await nextClient.fetch(query, { slug });
  const sanityResult = await sanityClient.fetch(query, { slug });
  
  console.log(`  next-sanity: ${nextResult ? nextResult.term : 'NOT FOUND'}`);
  console.log(`  @sanity/client: ${sanityResult ? sanityResult.term : 'NOT FOUND'}`);
  
  if (!nextResult && sanityResult) {
    console.log(`  ⚠️  next-sanity missing term that @sanity/client finds!`);
  }
  console.log('');
}
