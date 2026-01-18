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

// Check all terms including drafts
const queryAll = `*[_type == "glossaryTerm"] | order(term asc){
  _id,
  term,
  "slug": slug.current,
  publishedAt,
  _id
}`;

const allTerms = await client.fetch(queryAll);
console.log(`Total terms (including drafts): ${allTerms.length}\n`);

// Check which are drafts
const drafts = allTerms.filter(t => t._id.startsWith('drafts.'));
const published = allTerms.filter(t => !t._id.startsWith('drafts.'));

console.log(`Published: ${published.length}`);
console.log(`Drafts: ${drafts.length}\n`);

if (drafts.length > 0) {
  console.log('Draft terms:');
  drafts.forEach(t => {
    console.log(`  - ${t.term} (${t._id})`);
  });
  console.log('\n⚠️  These terms need to be published in Sanity Studio!');
}
