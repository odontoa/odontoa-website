import type { RecnikBlock } from '@/lib/content/recnik';

/* Clanak termina iz lokalnog recnika. Elementi i klase su isti kao sto ih je davao
   PortableTextRenderer za Sanity sadrzaj, pa .recnik-article stilovi ostaju isti. */
export default function GlossaryArticle({ blocks }: { blocks: RecnikBlock[] }) {
  if (blocks.length === 0) return null;
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
                {block.items.map((item, j) => <li key={j} className="ml-4">{item}</li>)}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i} className="list-decimal list-inside mb-4 space-y-2">
                {block.items.map((item, j) => <li key={j} className="ml-4">{item}</li>)}
              </ol>
            );
          default:
            return <p key={i} className="mb-4 leading-7">{block.text}</p>;
        }
      })}
    </div>
  );
}
