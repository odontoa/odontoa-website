import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    // Fetch related glossary terms
    const { data, error } = await supabase
      .from('glossary')
      .select('id, term, slug, definition, category, difficulty_level')
      .in('slug', termSlugs)
      .eq('published', true)
      .order('term', { ascending: true });

    if (error) {
      console.error('Error fetching related glossary terms:', error);
      return NextResponse.json({ error: 'Failed to fetch related terms' }, { status: 500 });
    }

    return NextResponse.json(data || []);

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 