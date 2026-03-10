'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/analytics/events';

interface GlossaryViewTrackerProps {
  slug: string;
  term: string;
}

export function GlossaryViewTracker({ slug, term }: GlossaryViewTrackerProps) {
  useEffect(() => {
    analytics.glossaryView(slug, term);
  }, [slug, term]);

  return null;
}
