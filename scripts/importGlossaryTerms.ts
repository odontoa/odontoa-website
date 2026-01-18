/**
 * Import script for glossary terms from JSON file
 * 
 * ⚠️ VAŽNO: Ovaj script MORA biti ažuriran kada se menja sanity/schemaTypes/glossaryTerm.ts
 * Proveri scripts/SCHEMA_SYNC_CHECKLIST.md pre svake promene!
 * 
 * Usage:
 *   npm run import:glossary <path-to-json-file>
 * 
 * Example:
 *   npm run import:glossary scripts/glossary-terms.json
 * 
 * JSON Format:
 *   [
 *     {
 *       "term": "Abrazija",
 *       "slug": "abrazija", // optional, auto-generated from term if not provided
 *       "definition": "Kratka definicija termina (60-200 karaktera)",
 *       "category": "Opšta stomatologija",
 *       "fullArticle": "Detaljno objašnjenje...", // optional, plain text
 *       "seoTitle": "SEO naslov", // optional
 *       "metaDescription": "SEO opis", // optional
 *       "noindex": false // optional, default false
 *     }
 *   ]
 * 
 * Requires env vars:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_WRITE_TOKEN (write-enabled token, only for scripts, never in runtime)
 * 
 * 🔄 SCHEMA SYNC:
 * - Ako menjaš schema (glossaryTerm.ts), OBAVEZNO ažuriraj:
 *   1. GlossaryTermInput interface (dodaj nova polja)
 *   2. validateTerm() funkciju (dodaj validaciju za obavezna polja)
 *   3. createTermDocument() funkciju (dodaj logiku za kreiranje)
 *   4. Template JSON (dodaj primere)
 *   5. README dokumentaciju
 * - Proveri scripts/SCHEMA_SYNC_CHECKLIST.md za detalje
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load env vars
dotenv.config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset) {
  throw new Error('Missing SANITY_PROJECT_ID or SANITY_DATASET');
}

if (!token) {
  console.error('\n❌ Missing SANITY_WRITE_TOKEN');
  console.error('\n📝 To get a write-enabled token:');
  console.error('   1. Go to https://sanity.io/manage');
  console.error('   2. Select your project');
  console.error('   3. Go to API → Tokens');
  console.error('   4. Create a new token with "Editor" permissions');
  console.error('   5. Add it to .env.local as: SANITY_WRITE_TOKEN=your-token-here');
  console.error('\n⚠️  IMPORTANT:');
  console.error('   - SANITY_WRITE_TOKEN is only for scripts, never use in runtime code!');
  console.error('   - After import, rotate or delete the token for security');
  console.error('   - Never commit .env.local to version control\n');
  throw new Error('Missing SANITY_WRITE_TOKEN: Write-enabled token is required for import script. Add SANITY_WRITE_TOKEN to .env.local');
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-11-20',
  useCdn: false,
  token,
});

/**
 * Validne kategorije iz schema
 * 
 * ⚠️ SYNC: Ako menjaš kategorije u schema (glossaryTerm.ts → category field),
 * OBAVEZNO ažuriraj ovu listu!
 */
const VALID_CATEGORIES = [
  'Opšta stomatologija',
  'Preventivna i dečja stomatologija',
  'Bolesti zuba i endodoncija',
  'Stomatološka protetika',
  'Parodontologija i oralna medicina',
  'Ortopedija vilica (Ortodoncija)',
  'Oralna hirurgija',
  'Maksilofacijalna hirurgija',
];

/**
 * Interface za import podatke
 * 
 * ⚠️ SYNC: Ako dodaješ novo polje u schema, DODAJ ga ovde!
 * Proveri scripts/SCHEMA_SYNC_CHECKLIST.md
 */
interface GlossaryTermInput {
  term: string; // REQUIRED - obavezno polje iz schema
  slug?: string; // OPTIONAL - auto-generiše se ako nije naveden
  definition: string; // REQUIRED - obavezno polje iz schema (60-200 chars)
  category?: string; // OPTIONAL - mora biti iz VALID_CATEGORIES liste
  fullArticle?: string; // OPTIONAL - plain text, konvertuje se u PortableText
  seoTitle?: string; // OPTIONAL - max 60 chars
  metaDescription?: string; // OPTIONAL - max 160 chars
  noindex?: boolean; // OPTIONAL - default false
  
  // ⚠️ NAPOMENA: Polja koja NISU podržana (zahtevaju reference/slike):
  // - tags (array of references)
  // - relatedTerms (array of references)
  // - author (reference)
  // - coverImage (image upload)
  // - faqs (complex structure)
  // Ako treba da se dodaju, implementiraj logiku u createTermDocument()
}

/**
 * Generate slug from term (matching Sanity's slugify behavior)
 * Normalizes to ASCII, removes diacritics, converts to lowercase
 */
function generateSlug(term: string): string {
  return term
    .toLowerCase()
    .normalize('NFD') // Decompose characters (Č -> C + ˇ)
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (ˇ, ´, etc.)
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dash
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
}

/**
 * Check for slug collisions in the import data
 * Throws error if any slug appears more than once
 */
function checkSlugCollisions(validatedTerms: GlossaryTermInput[]): void {
  const slugMap = new Map<string, string[]>();
  
  for (const termData of validatedTerms) {
    const slug = termData.slug || generateSlug(termData.term);
    if (!slugMap.has(slug)) {
      slugMap.set(slug, []);
    }
    slugMap.get(slug)!.push(termData.term);
  }
  
  const collisions: string[] = [];
  for (const [slug, terms] of slugMap.entries()) {
    if (terms.length > 1) {
      collisions.push(`  Slug "${slug}" -> Terms: ${terms.join(', ')}`);
    }
  }
  
  if (collisions.length > 0) {
    throw new Error(
      `❌ Slug collisions detected! Multiple terms map to the same slug:\n${collisions.join('\n')}\n\n` +
      `Please fix these collisions by providing explicit "slug" values in your JSON file.`
    );
  }
}

/**
 * Validacija term podataka
 * 
 * ⚠️ SYNC: Ako dodaješ novo OBAVEZNO polje u schema, DODAJ validaciju ovde!
 * Proveri scripts/SCHEMA_SYNC_CHECKLIST.md
 */
function validateTerm(termData: any, index: number): GlossaryTermInput {
  const errors: string[] = [];

  // REQUIRED: term (string, required u schema)
  if (!termData.term || typeof termData.term !== 'string' || termData.term.trim().length === 0) {
    errors.push(`[${index}] Missing or invalid 'term' field (REQUIRED)`);
  }

  // REQUIRED: definition (text, required, 60-200 chars u schema)
  if (!termData.definition || typeof termData.definition !== 'string') {
    errors.push(`[${index}] Missing or invalid 'definition' field (REQUIRED)`);
  } else {
    const defLength = termData.definition.trim().length;
    if (defLength < 60) {
      errors.push(`[${index}] Definition too short (${defLength} chars, minimum 60)`);
    }
    if (defLength > 200) {
      errors.push(`[${index}] Definition too long (${defLength} chars, maximum 200)`);
    }
  }

  // OPTIONAL: category (mora biti iz validne liste)
  if (termData.category && !VALID_CATEGORIES.includes(termData.category)) {
    errors.push(`[${index}] Invalid category: "${termData.category}". Valid: ${VALID_CATEGORIES.join(', ')}`);
  }

  // OPTIONAL: seoTitle (max 60 chars u schema)
  if (termData.seoTitle && termData.seoTitle.length > 60) {
    errors.push(`[${index}] SEO title too long (${termData.seoTitle.length} chars, maximum 60)`);
  }

  // OPTIONAL: metaDescription (max 160 chars u schema)
  if (termData.metaDescription && termData.metaDescription.length > 160) {
    errors.push(`[${index}] Meta description too long (${termData.metaDescription.length} chars, maximum 160)`);
  }

  // TODO: Dodaj validaciju za nova obavezna polja ovde kada se dodaju u schema

  if (errors.length > 0) {
    throw new Error(`Validation errors:\n${errors.join('\n')}`);
  }

  return {
    term: termData.term.trim(),
    slug: termData.slug?.trim() || generateSlug(termData.term),
    definition: termData.definition.trim(),
    category: termData.category?.trim() || undefined,
    fullArticle: termData.fullArticle?.trim() || undefined,
    seoTitle: termData.seoTitle?.trim() || undefined,
    metaDescription: termData.metaDescription?.trim() || undefined,
    noindex: termData.noindex ?? false,
  };
}

/**
 * Convert fullArticle plain text to PortableText blocks
 * Splits by blank lines into paragraph blocks
 */
function convertToPortableText(text: string) {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Split by blank lines (double newlines or single newlines with whitespace)
  const paragraphs = text
    .split(/\n\s*\n|\r\n\s*\r\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return paragraphs.map((paragraph, index) => ({
    _type: 'block',
    _key: `block-${index}-${Math.random().toString(36).substr(2, 9)}`,
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: `span-${index}-${Math.random().toString(36).substr(2, 9)}`,
        text: paragraph,
        marks: [],
      },
    ],
    markDefs: [],
  }));
}

/**
 * Build document data for upsert
 * Returns object with all fields to set (for both create and patch)
 * 
 * ⚠️ SYNC: Ako dodaješ novo polje u schema, DODAJ ga ovde!
 * - Obavezna polja: uvek u doc objektu
 * - Opciona polja: sa if proverom (if (termData.field))
 * Proveri scripts/SCHEMA_SYNC_CHECKLIST.md
 */
function buildTermDocumentData(termData: GlossaryTermInput) {
  const slug = termData.slug || generateSlug(termData.term);
  const now = new Date().toISOString();

  // REQUIRED fields (iz schema)
  const doc: any = {
    term: termData.term, // REQUIRED
    slug: {
      _type: 'slug',
      current: slug,
    }, // REQUIRED
    definition: termData.definition, // REQUIRED
    updatedAt: now, // Always update
    noindex: termData.noindex || false, // Default false
  };

  // publishedAt - only set on create (via setIfMissing in patch)
  // We'll handle this separately in upsert logic

  // OPTIONAL fields (dodaj samo ako postoje u JSON-u)
  if (termData.category) {
    doc.category = termData.category;
  }

  if (termData.fullArticle) {
    doc.fullArticle = convertToPortableText(termData.fullArticle);
  }

  if (termData.seoTitle) {
    doc.seoTitle = termData.seoTitle;
  }

  if (termData.metaDescription) {
    doc.metaDescription = termData.metaDescription;
  }

  // TODO: Dodaj logiku za nova polja ovde kada se dodaju u schema
  // Primer:
  // if (termData.newField) {
  //   doc.newField = termData.newField;
  // }

  return doc;
}

/**
 * Compare existing document with new data and return changed fields
 * Used for preview diff in dry-run and update logging
 */
async function getChangedFields(
  existingDocId: string,
  newDocData: any,
  client: any
): Promise<string[]> {
  // Fetch full existing document for comparison
  const existingDoc = await client.fetch(
    `*[_id==$id][0]{term, definition, category, seoTitle, metaDescription, noindex, fullArticle}`,
    { id: existingDocId }
  );

  if (!existingDoc) {
    return ['all']; // Document exists but we can't fetch it (shouldn't happen)
  }

  const changedFields: string[] = [];

  // Compare fields (simple string comparison for most)
  if (existingDoc.term !== newDocData.term) {
    changedFields.push('term');
  }
  if (existingDoc.definition !== newDocData.definition) {
    changedFields.push('definition');
  }
  if (existingDoc.category !== newDocData.category) {
    changedFields.push('category');
  }
  if (existingDoc.seoTitle !== newDocData.seoTitle) {
    changedFields.push('seoTitle');
  }
  if (existingDoc.metaDescription !== newDocData.metaDescription) {
    changedFields.push('metaDescription');
  }
  if (existingDoc.noindex !== newDocData.noindex) {
    changedFields.push('noindex');
  }

  // For fullArticle, compare if it exists (PortableText is complex, so we check if it changed)
  if (newDocData.fullArticle) {
    // Simple check: if existing doesn't have it or lengths differ significantly
    if (!existingDoc.fullArticle || 
        JSON.stringify(existingDoc.fullArticle).length !== JSON.stringify(newDocData.fullArticle).length) {
      changedFields.push('fullArticle');
    }
  } else if (existingDoc.fullArticle) {
    // Removing fullArticle
    changedFields.push('fullArticle');
  }

  return changedFields;
}

async function importTerms(jsonFilePath: string, dryRun: boolean = false) {
  console.log(`\n📖 Reading terms from: ${jsonFilePath}\n`);

  // Read and parse JSON file
  let termsData: any[];
  try {
    const filePath = path.resolve(jsonFilePath);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    termsData = JSON.parse(fileContent);
  } catch (error: any) {
    throw new Error(`Failed to read JSON file: ${error.message}`);
  }

  if (!Array.isArray(termsData)) {
    throw new Error('JSON file must contain an array of terms');
  }

  if (termsData.length === 0) {
    throw new Error('JSON file is empty');
  }

  console.log(`✅ Found ${termsData.length} terms to import\n`);

  // Validate all terms first
  console.log('🔍 Validating terms...');
  const validatedTerms: GlossaryTermInput[] = [];
  for (let i = 0; i < termsData.length; i++) {
    try {
      validatedTerms.push(validateTerm(termsData[i], i));
    } catch (error: any) {
      console.error(`❌ Validation failed for term ${i + 1}:`, error.message);
      throw error;
    }
  }
  console.log(`✅ All ${validatedTerms.length} terms validated\n`);

  // Check for slug collisions BEFORE importing
  console.log('🔍 Checking for slug collisions...');
  try {
    checkSlugCollisions(validatedTerms);
    console.log('✅ No slug collisions detected\n');
  } catch (error: any) {
    console.error('\n❌ Import stopped due to slug collisions!\n');
    throw error;
  }

  // Import terms with UPSERT logic
  if (dryRun) {
    console.log(`🔍 DRY-RUN MODE: Simulating import to ${projectId}/${dataset}...\n`);
  } else {
    console.log(`🌱 Importing to ${projectId}/${dataset}...\n`);
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  const now = new Date().toISOString();

  for (let i = 0; i < validatedTerms.length; i++) {
    const termData = validatedTerms[i];
    const slug = termData.slug || generateSlug(termData.term);
    const docData = buildTermDocumentData(termData);

    try {
      // Fetch existing document by slug
      const existingDoc = await client.fetch(
        `*[_type=="glossaryTerm" && slug.current==$slug][0]{_id, publishedAt}`,
        { slug }
      );

      if (existingDoc && existingDoc._id) {
        // UPDATE: Document exists
        // Fetch full document for comparison to show diff
        const changedFields = await getChangedFields(existingDoc._id, docData, client);
        
        if (dryRun) {
          // In dry-run, check what would change
          if (changedFields.length > 0) {
            updated++;
            console.log(`  🔄 [${i + 1}/${validatedTerms.length}] Would update: ${termData.term}`);
            console.log(`     Changed fields: ${changedFields.join(', ')}`);
          } else {
            skipped++;
            console.log(`  ⏭️  [${i + 1}/${validatedTerms.length}] Would skip (no changes): ${termData.term}`);
          }
        } else {
          // Real update: patch it
          // Use setIfMissing for publishedAt to preserve original publish date
          let patch = client.patch(existingDoc._id).set(docData);
          
          // Only set publishedAt if it doesn't exist (preserve original publish date)
          if (!existingDoc.publishedAt) {
            patch = patch.setIfMissing({ publishedAt: now });
          }
          
          await patch.commit();
          updated++;
          
          if (changedFields.length > 0) {
            console.log(`  🔄 [${i + 1}/${validatedTerms.length}] Updated: ${termData.term}`);
            console.log(`     Changed: ${changedFields.join(', ')}`);
          } else {
            console.log(`  🔄 [${i + 1}/${validatedTerms.length}] Updated: ${termData.term} (no field changes detected)`);
          }
        }
      } else {
        // CREATE: Document doesn't exist
        if (dryRun) {
          created++;
          console.log(`  ✅ [${i + 1}/${validatedTerms.length}] Would create: ${termData.term}`);
        } else {
          const newDoc = {
            _type: 'glossaryTerm',
            _id: `glossaryTerm.${slug}`,
            ...docData,
            publishedAt: now, // Set on create
          };
          
          await client.create(newDoc);
          created++;
          console.log(`  ✅ [${i + 1}/${validatedTerms.length}] Created: ${termData.term}`);
        }
      }
    } catch (error: any) {
      errors++;
      console.error(`  ❌ [${i + 1}/${validatedTerms.length}] Error processing "${termData.term}":`, error.message);
    }
  }

  console.log(`\n📊 Summary:`);
  if (dryRun) {
    console.log(`   🔍 DRY-RUN MODE - No changes were made`);
  }
  console.log(`   ✅ ${dryRun ? 'Would create' : 'Created'}: ${created}`);
  console.log(`   🔄 ${dryRun ? 'Would update' : 'Updated'}: ${updated}`);
  if (dryRun && skipped > 0) {
    console.log(`   ⏭️  Would skip (no changes): ${skipped}`);
  }
  console.log(`   ❌ Errors: ${errors}`);
  if (dryRun) {
    console.log(`\n💡 To apply these changes, run without --dry-run flag\n`);
  } else {
    console.log(`\n✨ Done!\n`);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const jsonFilePath = args.find(arg => !arg.startsWith('--'));

if (!jsonFilePath) {
  console.error('\n❌ Missing JSON file path');
  console.error('\nUsage:');
  console.error('  npm run import:glossary <path-to-json-file> [--dry-run]');
  console.error('\nExamples:');
  console.error('  npm run import:glossary scripts/glossary-terms.json');
  console.error('  npm run import:glossary -- --dry-run scripts/glossary-terms.json');
  console.error('\nOptions:');
  console.error('  --dry-run    Simulate import without making changes');
  console.error('\nSee scripts/glossary-terms-template.json for format\n');
  process.exit(1);
}

// Run import
importTerms(jsonFilePath, dryRun).catch((error) => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});
