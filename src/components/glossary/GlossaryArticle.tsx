import type { ReactNode } from 'react';
import {
  getPublishedTermById,
  getSourceById,
  getTermPath,
  type RecnikBlock,
  type RecnikRichText,
  type RecnikTerm,
} from '@/lib/content/recnik';
import { isInternalHref, isPublicPath } from '@/lib/routes/public-routes';
import TrackedGlossaryLink from './TrackedGlossaryLink';

/* Clanak pojma iz lokalnog recnika (server komponenta). Elementi i klase su isti kao ranije,
   pa .recnik-article stilovi ostaju isti.

   Linkovi u tekstu se renderuju samo ako cilj postoji i javan je; inace ostaje obican tekst.
   Spoljni linkovi i citati izvora idu sa rel="noopener noreferrer". */

type Source = { glossaryTerm: string; contentId: string };

function renderRichText(text: RecnikRichText, source: Source): ReactNode {
  if (typeof text === 'string') return text;
  return text.map((part, i) => {
    if (typeof part === 'string') return part;

    if (part.type === 'term') {
      const target = getPublishedTermById(part.termId);
      if (!target) return part.text;
      return (
        <TrackedGlossaryLink
          key={i}
          href={getTermPath(target)}
          kind="content"
          contentType="glossary_term"
          contentId={target.id}
          source={source}
        >
          {part.text}
        </TrackedGlossaryLink>
      );
    }

    if (part.type === 'link') {
      if (isInternalHref(part.href)) {
        if (!isPublicPath(part.href)) return part.text;
        const isFeature = part.href.startsWith('/funkcionalnosti/');
        return (
          <TrackedGlossaryLink
            key={i}
            href={part.href}
            kind="content"
            contentType={isFeature ? 'feature_page' : 'landing_page'}
            contentId={part.href}
            source={source}
          >
            {part.text}
          </TrackedGlossaryLink>
        );
      }
      return (
        <a key={i} href={part.href} rel="noopener noreferrer">
          {part.text}
        </a>
      );
    }

    /* cite */
    const cited = getSourceById(part.sourceId);
    const label = part.text ?? cited?.title ?? '';
    if (!cited?.url) return label;
    return (
      <a key={i} href={cited.url} rel="noopener noreferrer">
        {label}
      </a>
    );
  });
}

export default function GlossaryArticle({ blocks, term }: { blocks: RecnikBlock[]; term: RecnikTerm }) {
  if (blocks.length === 0) return null;
  const source: Source = { glossaryTerm: term.medicalCanonicalTerm, contentId: term.id };
  return (
    <div className="prose prose-lg max-w-none">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h2':
            return <h2 key={i} className="text-3xl font-semibold mt-6 mb-3">{block.text}</h2>;
          case 'h3':
            return <h3 key={i} className="text-2xl font-semibold mt-4 mb-2">{block.text}</h3>;
          case 'ul':
            return (
              <ul key={i} className="list-disc list-inside mb-4 space-y-2">
                {block.items.map((item, j) => <li key={j} className="ml-4">{renderRichText(item, source)}</li>)}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i} className="list-decimal list-inside mb-4 space-y-2">
                {block.items.map((item, j) => <li key={j} className="ml-4">{renderRichText(item, source)}</li>)}
              </ol>
            );
          default:
            return <p key={i} className="mb-4 leading-7">{renderRichText(block.text, source)}</p>;
        }
      })}
    </div>
  );
}
