import { NextRequest, NextResponse } from 'next/server';
import { getPublishedTermBySlug, isGlossaryPublic } from '@/lib/content/recnik';

/* Povezani termini za stari blog layout (PostLayout). Izvor je lokalni recnik. */
export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const terms = searchParams.get('terms');

  if (!terms) {
    return NextResponse.json({ error: 'Terms parameter is required' }, { status: 400 });
  }

  /* Dok recnik nije javan, ruta ne otkriva nijedan pojam. */
  if (!isGlossaryPublic()) {
    return NextResponse.json([]);
  }

  const data = terms
    .split(',')
    .map((slug) => getPublishedTermBySlug(slug.trim()))
    .filter((term): term is NonNullable<typeof term> => Boolean(term))
    .sort((a, b) => a.publicTitle.localeCompare(b.publicTitle, 'sr'))
    .map((t) => ({ _id: t.id, term: t.publicTitle, slug: t.slug, definition: t.shortDefinition, category: t.categoryId }));

  return NextResponse.json(data);
}
