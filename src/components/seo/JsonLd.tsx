import { serializeJsonLd } from '@/lib/structured-data/page-graph';

/* Server komponenta: JSON-LD ide u server-renderovan HTML, bez klijentskog JS-a. */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
