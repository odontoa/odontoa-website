'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/analytics/events';

interface BlogViewTrackerProps {
  slug: string;
  title: string;
}

export function BlogViewTracker({ slug, title }: BlogViewTrackerProps) {
  useEffect(() => {
    analytics.blogView(slug, title);
  }, [slug, title]);

  return null;
}
