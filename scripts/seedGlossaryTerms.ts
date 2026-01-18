/**
 * Seeding script for glossary terms
 * Creates test data for letters A, B, C (10 terms each) and D, T (3-4 terms each)
 * 
 * Usage:
 *   npm run seed:glossary
 * 
 * Requires env vars:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_TOKEN (write-enabled token)
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
// Try SANITY_TOKEN first (write-enabled), fallback to SANITY_READ_TOKEN (may not work for writes)
const token = process.env.SANITY_TOKEN || process.env.SANITY_READ_TOKEN;

if (!projectId || !dataset) {
  throw new Error('Missing SANITY_PROJECT_ID or SANITY_DATASET');
}

if (!token) {
  console.error('\n❌ Missing SANITY_TOKEN or SANITY_READ_TOKEN');
  console.error('\n📝 To get a write-enabled token:');
  console.error('   1. Go to https://sanity.io/manage');
  console.error('   2. Select your project');
  console.error('   3. Go to API → Tokens');
  console.error('   4. Create a new token with "Editor" permissions');
  console.error('   5. Add it to .env.local as: SANITY_TOKEN=your-token-here\n');
  throw new Error('Missing SANITY_TOKEN (write-enabled token required)');
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-11-20',
  useCdn: false,
  token,
});

// Helper to generate slug from term
function generateSlug(term: string): string {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper to create term document
function createTerm(
  term: string,
  letter: string,
  index: number,
  category: string
) {
  const slug = generateSlug(term);
  const now = new Date().toISOString();
  
  return {
    _type: 'glossaryTerm',
    _id: `glossaryTerm.seed.${slug}`,
    term,
    slug: {
      _type: 'slug',
      current: slug,
    },
    definition: `Kratka definicija za ${term}. Ovo je test podatak za rečnik.`,
    category,
    publishedAt: now,
    updatedAt: now,
    noindex: false,
  };
}

// Test data: A, B, C (10 each), D (4), T (3)
const testData = {
  A: [
    'Abrazija test 01',
    'Aparat test 02',
    'Anestezija test 03',
    'Aplikacija test 04',
    'Analiza test 05',
    'Aparatura test 06',
    'Asepsa test 07',
    'Atrofija test 08',
    'Aplikator test 09',
    'Aktivacija test 10',
  ],
  B: [
    'Bakterija test 01',
    'Bruksizam test 02',
    'Baza test 03',
    'Brid test 04',
    'Brušenje test 05',
    'Baktericid test 06',
    'Barijera test 07',
    'Baza test 08',
    'Brušenje test 09',
    'Bakterija test 10',
  ],
  C: [
    'Cement test 01',
    'Cirkulacija test 02',
    'Cista test 03',
    'Cilj test 04',
    'Cementacija test 05',
    'Cirkulacija test 06',
    'Cista test 07',
    'Cilj test 08',
    'Cement test 09',
    'Cirkulacija test 10',
  ],
  D: [
    'Dijagnoza test 01',
    'Drenaža test 02',
    'Dekontaminacija test 03',
    'Dijagnostika test 04',
  ],
  T: [
    'Termin test 01',
    'Trauma test 02',
    'Terapija test 03',
  ],
};

const category = 'Opšta stomatologija';

async function seedTerms() {
  console.log(`\n🌱 Seeding glossary terms to ${projectId}/${dataset}...\n`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const [letter, terms] of Object.entries(testData)) {
    console.log(`📝 Processing letter ${letter} (${terms.length} terms)...`);

    for (let i = 0; i < terms.length; i++) {
      const term = terms[i];
      const doc = createTerm(term, letter, i + 1, category);

      try {
        // Use createIfNotExists to avoid duplicates
        const result = await client.createIfNotExists(doc);
        if (result._createdAt) {
          created++;
          console.log(`  ✅ Created: ${term}`);
        } else {
          skipped++;
          console.log(`  ⏭️  Skipped (exists): ${term}`);
        }
      } catch (error: any) {
        errors++;
        console.error(`  ❌ Error creating ${term}:`, error.message);
      }
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Created: ${created}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Errors: ${errors}`);
  console.log(`\n✨ Done!\n`);
}

// Run
seedTerms().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
