import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity.client';
import { groq } from 'next-sanity';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const terms = searchParams.get('terms');

    if (!terms) {
      return NextResponse.json({ error: 'Terms parameter is required' }, { status: 400 });
    }

    const termSlugs = terms.split(',').map(term => term.trim()).filter(Boolean);

    if (termSlugs.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch related glossary terms from Sanity
    const query = groq`*[_type == "glossaryTerm" && !(_id in path("drafts.**")) && defined(slug.current) && defined(publishedAt) && slug.current in $termSlugs] | order(term asc){
      _id,
      term,
      "slug": slug.current,
      definition,
      category
    }`;

    const data = await sanityClient.fetch(query, { termSlugs });

    return NextResponse.json(data || []);

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 