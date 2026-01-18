import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "peat8sel";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_READ_TOKEN || process.env.SANITY_TOKEN;

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-11-20',
  useCdn: false,
  token,
});

const slugsQuery = `*[_type == "glossaryTerm" && !(_id in path("drafts.**")) && defined(slug.current) && defined(publishedAt)]{
  "slug": slug.current
}`;

const termQuery = `*[_type == "glossaryTerm" && !(_id in path("drafts.**")) && slug.current == $slug && defined(publishedAt)][0]{
  term,
  "slug": slug.current
}`;

console.log('Testing all slugs can be fetched:\n');
const slugs = await client.fetch(slugsQuery);

let success = 0;
let failed = 0;

for (const { slug } of slugs) {
  const term = await client.fetch(termQuery, { slug });
  if (term) {
    success++;
    console.log(`✅ ${slug} -> ${term.term}`);
  } else {
    failed++;
    console.log(`❌ ${slug} -> NOT FOUND`);
  }
}

console.log(`\n✅ Success: ${success}`);
console.log(`❌ Failed: ${failed}`);
console.log(`Total: ${slugs.length}`);
