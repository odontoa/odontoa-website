import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

const TYPE_TO_TAGS: Record<string, string[]> = {
  blogPost: ['sanity-blog'],
  glossaryTerm: ['sanity-glossary'],
  author: ['sanity-blog', 'sanity-glossary'],
  tag: ['sanity-blog', 'sanity-glossary'],
};

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  let body: { _type?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const docType = body._type;
  if (!docType) {
    return NextResponse.json({ error: 'Missing _type in body' }, { status: 400 });
  }

  const tags = TYPE_TO_TAGS[docType];
  if (!tags) {
    return NextResponse.json({ error: `Unknown document type: ${docType}` }, { status: 400 });
  }

  tags.forEach((tag) => revalidateTag(tag));

  return NextResponse.json({
    revalidated: true,
    docType,
    tags,
    at: new Date().toISOString(),
  });
}
