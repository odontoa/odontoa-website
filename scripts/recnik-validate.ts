/* npm run recnik:validate
   Proverava ceo dataset recnika (src/lib/content/recnik/data). Izlazni kod 1 ako ima gresaka,
   pa build (prebuild) pada. Upozorenja se samo ispisuju. Podaci se nikad ne menjaju.
   Sa RECNIK_FIXTURES=1 proverava testni dataset (fixtures.ts). */
import { getRecnikDataset } from '@/lib/content/recnik';
import { formatIssues, formatStats, validateRecnik } from '@/lib/content/recnik/validate';

const dataset = getRecnikDataset();
const { errors, warnings, stats } = validateRecnik(dataset);

console.log(`\nRečnik: validacija${process.env.RECNIK_FIXTURES === '1' ? ' (FIXTURES)' : ''}`);
console.log(`Izvora: ${dataset.sources.length} · Recenzenata: ${dataset.reviewers.length}\n`);
console.log(formatStats(stats));

if (warnings.length > 0) {
  console.log(`\nUpozorenja (${warnings.length}):\n${formatIssues(warnings)}`);
}

if (errors.length > 0) {
  console.error(`\nGREŠKE (${errors.length}):\n${formatIssues(errors)}\n`);
  process.exit(1);
}

console.log('\nBez grešaka.\n');
