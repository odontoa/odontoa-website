'use client';

import { useEffect } from 'react';
import { analytics, type GlossaryEventContext } from '@/lib/analytics/events';

/* glossary_view sa parametrima pojma; bez GA-a (nema gtag) je no-op. */
export function GlossaryViewTracker(props: GlossaryEventContext) {
  const { contentId, glossaryTerm, seoEntryTerm, glossaryCluster, categoryId, pagePath } = props;
  useEffect(() => {
    analytics.glossaryView({ contentId, glossaryTerm, seoEntryTerm, glossaryCluster, categoryId, pagePath });
  }, [contentId, glossaryTerm, seoEntryTerm, glossaryCluster, categoryId, pagePath]);

  return null;
}
