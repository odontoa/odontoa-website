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

const slugsQuery = `*[_type == "glossaryTerm" && !(_id in path("drafts.**")) && defined(slug.current) && defined(publishedAt)]{
  "slug": slug.current
}`;

console.log('Testing glossaryTermSlugsQuery:\n');

const nextSlugs = await nextClient.fetch(slugsQuery);
const sanitySlugs = await sanityClient.fetch(slugsQuery);

console.log(`next-sanity returned ${nextSlugs.length} slugs`);
console.log(`@sanity/client returned ${sanitySlugs.length} slugs\n`);

if (nextSlugs.length !== sanitySlugs.length) {
  console.log('⚠️  DIFFERENCE!');
  const nextSlugSet = new Set(nextSlugs.map(s => s.slug));
  const sanitySlugSet = new Set(sanitySlugs.map(s => s.slug));
  
  const missing = sanitySlugs.filter(s => !nextSlugSet.has(s.slug));
  if (missing.length > 0) {
    console.log(`Missing in next-sanity: ${missing.map(s => s.slug).join(', ')}`);
  }
} else {
  console.log('✅ Both return same number of slugs');
}
