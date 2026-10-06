import { NextRequest, NextResponse } from 'next/server';
import { getPublishedTerm } from '@/lib/content/recnik';

/* Povezani termini za stari blog layout (PostLayout). Izvor je lokalni recnik. */
export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const terms = searchParams.get('terms');

  if (!terms) {
    return NextResponse.json({ error: 'Terms parameter is required' }, { status: 400 });
  }

  const data = terms
    .split(',')
    .map((slug) => getPublishedTerm(slug.trim()))
    .filter((term): term is NonNullable<typeof term> => Boolean(term))
    .sort((a, b) => a.term.localeCompare(b.term, 'sr'))
    .map(({ slug, term, definition, category }) => ({ _id: slug, term, slug, definition, category }));

  return NextResponse.json(data);
}
