'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { analytics, type GlossaryLinkType } from '@/lib/analytics/events';

/* Link sa stranice pojma koji salje select_content (sadrzaj) ili cta_click (CTA).
   Obican <a> u server HTML-u (crawlable), bez UTM parametara. */

type Source = { glossaryTerm: string; contentId: string };

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
  source: Source;
} & (
  | { kind: 'content'; contentType: GlossaryLinkType; contentId: string }
  | { kind: 'cta'; ctaName: string }
);

export default function TrackedGlossaryLink(props: Props) {
  const { href, className, children, source } = props;
  const onClick = () => {
    if (props.kind === 'cta') {
      analytics.glossaryCtaClick({
        ctaName: props.ctaName,
        linkUrl: href,
        sourceGlossaryTerm: source.glossaryTerm,
        sourceContentId: source.contentId,
      });
    } else {
      analytics.glossarySelectContent({
        contentType: props.contentType,
        contentId: props.contentId,
        linkUrl: href,
        sourceGlossaryTerm: source.glossaryTerm,
        sourceContentId: source.contentId,
      });
    }
  };

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
