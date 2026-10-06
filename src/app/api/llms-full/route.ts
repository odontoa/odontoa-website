import { NextResponse } from 'next/server';
import {
  ensureRecnikValid,
  getCategoryById,
  getIndexableTerms,
  getTermPath,
  getTermSources,
  isGlossaryPublic,
} from '@/lib/content/recnik';
import { isComingSoon } from '@/lib/config/site-mode';
import { absoluteUrl } from '@/lib/config/site-url';

/* llms-full.txt (rewrite /llms-full.txt -> /api/llms-full): opcioni, masinski citljiv spisak
   svih objavljenih pojmova recnika, generisan iz istog izvora kao stranice. Nista u rutiranju
   ni indeksiranju ne zavisi od njega. Dok recnik nije javan, vraca 404. */
export async function GET() {
  if (isComingSoon() || !isGlossaryPublic()) {
    return new NextResponse('Not found\n', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  ensureRecnikValid();
  const terms = getIndexableTerms();

  let body = `# Odontoa — Stomatološki rečnik\n\n`;
  body += `Objavljeni pojmovi sa kratkim definicijama. Indeks: ${absoluteUrl('/recnik')}\n`;
  body += `Broj pojmova: ${terms.length}\n\n`;

  for (const term of terms) {
    const category = getCategoryById(term.categoryId);
    body += `## ${term.publicTitle}\n`;
    body += `URL: ${absoluteUrl(getTermPath(term))}\n`;
    body += `Stručni naziv: ${term.medicalCanonicalTerm}\n`;
    if (category) body += `Kategorija: ${category.title}\n`;
    body += `Definicija: ${term.shortDefinition}\n`;
    const sources = getTermSources(term);
    if (sources.length) body += `Izvori: ${sources.map((s) => s.title).join('; ')}\n`;
    body += `Ažurirano: ${(term.updatedAt || term.publishedAt || '').split('T')[0]}\n\n`;
  }

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
