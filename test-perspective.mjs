import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_TOKEN || process.env.SANITY_READ_TOKEN;

// Test with "published" perspective (like next-sanity client)
const clientPublished = createClient({
  projectId,
  dataset,
  apiVersion: '2025-11-20',
  useCdn: false,
  token,
  perspective: 'published',
});

// Test without perspective
const clientRaw = createClient({
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
  publishedAt
}`;

console.log('Testing with "published" perspective:');
const termsPublished = await clientPublished.fetch(query);
console.log(`Found ${termsPublished.length} terms\n`);

console.log('Testing without perspective:');
const termsRaw = await clientRaw.fetch(query);
console.log(`Found ${termsRaw.length} terms\n`);

if (termsPublished.length !== termsRaw.length) {
  console.log('⚠️  DIFFERENCE DETECTED!');
  console.log('Published perspective:', termsPublished.map(t => t.term));
  console.log('Raw:', termsRaw.map(t => t.term));
}
