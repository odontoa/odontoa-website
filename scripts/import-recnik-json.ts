/* npm run recnik:import -- <putanja/do/export.json> [--dry-run] [--overwrite]

   Uvozi recnik iz JSON exporta (format: docs/RECNIK_IMPORT_FORMAT.md) u
   src/lib/content/recnik/data/:
     - data/sources.ts, data/reviewers.ts
     - data/terms/<categoryId>.ts (pojmovi grupisani po kategoriji)
     - data/terms/index.ts (spisak fajlova; generise se)

   Pravila:
   1. JSON se validira (zod sema + validator recnika). Bilo kakva greska: nista se ne upisuje.
   2. Zapis sa postojecim id-jem i drugacijim sadrzajem je KONFLIKT. Bez --overwrite import
      staje; sa --overwrite novi zapis zamenjuje stari. Isti sadrzaj se preskace.
   3. Slug koji vec koristi drugi pojam je uvek greska.
   4. Podaci se ne menjaju niti "ispravljaju" (ni terminologija, ni tekst). Upisuje se tacno
      ono sto je u JSON-u.
   --dry-run: sve provere i izvestaj, bez upisa. */

import { existsSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { importFileSchema } from '@/lib/content/recnik/import-schema';
import { RECNIK_SOURCES } from '@/lib/content/recnik/data/sources';
import { RECNIK_REVIEWERS } from '@/lib/content/recnik/data/reviewers';
import { TERM_FILES } from '@/lib/content/recnik/data/terms';
import { formatIssues, formatStats, validateRecnik } from '@/lib/content/recnik/validate';
import type { RecnikDataset, RecnikReviewer, RecnikSource, RecnikTerm } from '@/lib/content/recnik/types';

const DATA_DIR = path.join(process.cwd(), 'src/lib/content/recnik/data');
const TERMS_DIR = path.join(DATA_DIR, 'terms');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const overwrite = args.includes('--overwrite');
const inputPath = args.find((a) => !a.startsWith('--'));

function fail(message: string): never {
  console.error(`\n${message}\n`);
  process.exit(1);
}

if (!inputPath) fail('Upotreba: npm run recnik:import -- <export.json> [--dry-run] [--overwrite]');
if (!existsSync(inputPath)) fail(`Fajl ne postoji: ${inputPath}`);

/* Poredjenje sadrzaja nezavisno od redosleda kljuceva. */
function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value as object)
      .sort()
      .filter((k) => (value as Record<string, unknown>)[k] !== undefined)
      .map((k) => `${JSON.stringify(k)}:${stable((value as Record<string, unknown>)[k])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

type MergeReport = { added: string[]; updated: string[]; unchanged: string[]; conflicts: string[] };

function merge<T extends { id: string }>(existing: T[], incoming: T[], label: string): { result: T[]; report: MergeReport } {
  const report: MergeReport = { added: [], updated: [], unchanged: [], conflicts: [] };
  const result = [...existing];
  const indexById = new Map(result.map((item, i) => [item.id, i]));
  const seenIncoming = new Set<string>();

  for (const item of incoming) {
    if (seenIncoming.has(item.id)) fail(`${label} "${item.id}" se ponavlja u ulaznom JSON-u.`);
    seenIncoming.add(item.id);

    const at = indexById.get(item.id);
    if (at === undefined) {
      indexById.set(item.id, result.length);
      result.push(item);
      report.added.push(item.id);
    } else if (stable(result[at]) === stable(item)) {
      report.unchanged.push(item.id);
    } else if (overwrite) {
      result[at] = item;
      report.updated.push(item.id);
    } else {
      report.conflicts.push(item.id);
    }
  }
  return { result, report };
}

/* ── 1. Ulaz ── */
let raw: unknown;
try {
  raw = JSON.parse(readFileSync(inputPath, 'utf8'));
} catch (error) {
  fail(`JSON nije ispravan: ${(error as Error).message}`);
}

const parsed = importFileSchema.safeParse(raw);
if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.') || '(koren)'}: ${i.message}`).join('\n');
  fail(`Ulazni JSON ne odgovara formatu (docs/RECNIK_IMPORT_FORMAT.md):\n${issues}`);
}
/* Oblik je proveren semom; sadrzajna pravila proverava validateRecnik ispod. */
const input = parsed.data as { sources?: RecnikSource[]; reviewers?: RecnikReviewer[]; terms?: RecnikTerm[] };

/* ── 2. Spajanje sa postojecim podacima ── */
const existingTerms = TERM_FILES.flat();
const sources = merge<RecnikSource>(RECNIK_SOURCES, input.sources ?? [], 'Izvor');
const reviewers = merge<RecnikReviewer>(RECNIK_REVIEWERS, input.reviewers ?? [], 'Recenzent');
const terms = merge<RecnikTerm>(existingTerms, input.terms ?? [], 'Pojam');

for (const term of input.terms ?? []) {
  const owner = existingTerms.find((t) => t.slug === term.slug && t.id !== term.id);
  if (owner) fail(`Slug "${term.slug}" (pojam ${term.id}) vec koristi postojeci pojam ${owner.id}.`);
}

const print = (label: string, r: MergeReport) =>
  console.log(
    `${label}: +${r.added.length} novih, ${r.updated.length} zamenjenih, ${r.unchanged.length} bez promene, ${r.conflicts.length} konflikata`,
  );
console.log(`\nImport: ${inputPath}${dryRun ? ' (dry run)' : ''}${overwrite ? ' (--overwrite)' : ''}`);
print('Izvori', sources.report);
print('Recenzenti', reviewers.report);
print('Pojmovi', terms.report);

const conflicts = [
  ...sources.report.conflicts.map((id) => `izvor ${id}`),
  ...reviewers.report.conflicts.map((id) => `recenzent ${id}`),
  ...terms.report.conflicts.map((id) => `pojam ${id}`),
];
if (conflicts.length > 0) {
  fail(
    `KONFLIKTI (postojeci id sa drugacijim sadrzajem): ${conflicts.join(', ')}\n` +
      'Nista nije upisano. Proveri razlike, pa ponovi sa --overwrite ako novi podaci treba da zamene stare.',
  );
}

/* ── 3. Validacija spojenog dataseta ── */
const merged: RecnikDataset = { terms: terms.result, sources: sources.result, reviewers: reviewers.result };
const { errors, warnings, stats } = validateRecnik(merged);
console.log(`\n${formatStats(stats)}`);
if (warnings.length > 0) console.log(`\nUpozorenja (${warnings.length}):\n${formatIssues(warnings)}`);
if (errors.length > 0) fail(`GREŠKE (${errors.length}), nista nije upisano:\n${formatIssues(errors)}`);

if (dryRun) {
  console.log('\nDry run: bez gresaka, nista nije upisano.\n');
  process.exit(0);
}

/* ── 4. Upis ── */
const HEADER = (what: string) =>
  `/* GENERISANO: scripts/import-recnik-json.ts (${what}).\n` +
  '   Rucne izmene su dozvoljene, ali ih sledeci import sa --overwrite moze zameniti. */\n';

function writeTs(file: string, content: string) {
  writeFileSync(file, content.endsWith('\n') ? content : `${content}\n`);
}

writeTs(
  path.join(DATA_DIR, 'sources.ts'),
  `import type { RecnikSource } from '../types';\n\n${HEADER('izvori')}export const RECNIK_SOURCES: RecnikSource[] = ${JSON.stringify(sources.result, null, 2)};`,
);
writeTs(
  path.join(DATA_DIR, 'reviewers.ts'),
  `import type { RecnikReviewer } from '../types';\n\n${HEADER('recenzenti')}export const RECNIK_REVIEWERS: RecnikReviewer[] = ${JSON.stringify(reviewers.result, null, 2)};`,
);

const byCategory = new Map<string, RecnikTerm[]>();
for (const term of terms.result) {
  if (!byCategory.has(term.categoryId)) byCategory.set(term.categoryId, []);
  byCategory.get(term.categoryId)!.push(term);
}

/* Fajlovi kategorija se pisu iz celog spojenog dataseta; fajl kategorije koja vise nema
   pojmova se brise (pojam je premesten u drugu kategoriju). */
for (const file of readdirSync(TERMS_DIR)) {
  if (file !== 'index.ts' && file.endsWith('.ts') && !byCategory.has(file.replace(/\.ts$/, ''))) {
    unlinkSync(path.join(TERMS_DIR, file));
  }
}

const categoryIds = [...byCategory.keys()].sort();
for (const categoryId of categoryIds) {
  const list = byCategory.get(categoryId)!.sort((a, b) => a.id.localeCompare(b.id));
  writeTs(
    path.join(TERMS_DIR, `${categoryId}.ts`),
    `import type { RecnikTerm } from '../../types';\n\n${HEADER(`kategorija: ${categoryId}`)}export const terms: RecnikTerm[] = ${JSON.stringify(list, null, 2)};`,
  );
}

const ident = (id: string) => `terms_${id.replace(/[^a-zA-Z0-9]/g, '_')}`;
writeTs(
  path.join(TERMS_DIR, 'index.ts'),
  [
    '/* GENERISANO: scripts/import-recnik-json.ts prepisuje ovaj fajl pri svakom importu.',
    '   Spisak fajlova sa terminima po kategoriji (data/terms/<categoryId>.ts). */',
    "import type { RecnikTerm } from '../../types';",
    ...categoryIds.map((id) => `import { terms as ${ident(id)} } from './${id}';`),
    '',
    `export const TERM_FILES: RecnikTerm[][] = [${categoryIds.map(ident).join(', ')}];`,
  ].join('\n'),
);

console.log(`\nUpisano: ${categoryIds.length} fajlova kategorija, ${terms.result.length} pojmova, ${sources.result.length} izvora, ${reviewers.result.length} recenzenata.`);
console.log('Sledece: npm run recnik:validate && npm run build\n');
