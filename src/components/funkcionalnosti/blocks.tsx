import type { FeatureBlock } from '@/lib/content/funkcionalnosti';
import Reveal from '@/components/home4/Reveal';

/**
 * Renderer blokova tela stranice funkcionalnosti.
 *
 * Svaki tip bloka ima svoju komponentu, a FeatureBlocks bira po block.type.
 * Podloga se smenjuje bela/siva po redosledu bloka, da se drzi vertikalni
 * ritam home4 sekcija.
 */

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      className="home4-fp-faq__icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BenefitsBlock({ block }: { block: Extract<FeatureBlock, { type: 'benefits' }> }) {
  return (
    <div className="home4-fp-benefits">
      {block.items.map((item, i) => (
        <Reveal key={item.title} delay={i * 0.06} style={{ height: '100%' }}>
          <div className="home4-fp-benefit">
            <div className="home4-fp-benefit__icon">
              <CheckIcon />
            </div>
            <h3 className="home4-fp-benefit__title">{item.title}</h3>
            <p className="home4-fp-benefit__desc">{item.desc}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function StepsBlock({ block }: { block: Extract<FeatureBlock, { type: 'steps' }> }) {
  return (
    <ol className="home4-fp-steps">
      {block.items.map((step) => (
        <li key={step} className="home4-fp-step">
          <span className="home4-fp-step__text">{step}</span>
        </li>
      ))}
    </ol>
  );
}

function ProseBlock({ block }: { block: Extract<FeatureBlock, { type: 'prose' }> }) {
  return (
    <div className="home4-fp-prose">
      {block.paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

/**
 * FAQ na nativnom <details>: akordeon bez klijentskog JS-a i bez nove zavisnosti.
 * Sadrzaj je u DOM-u i kad je zatvoren, pa ga pretrazivaci citaju.
 */
function FaqBlock({ block }: { block: Extract<FeatureBlock, { type: 'faq' }> }) {
  return (
    <div className="home4-fp-faq">
      {block.items.map((item) => (
        <details key={item.q} className="home4-fp-faq__item">
          <summary className="home4-fp-faq__q">
            {item.q}
            <PlusIcon />
          </summary>
          <p className="home4-fp-faq__a">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

function BlockBody({ block }: { block: FeatureBlock }) {
  switch (block.type) {
    case 'benefits':
      return <BenefitsBlock block={block} />;
    case 'steps':
      return <StepsBlock block={block} />;
    case 'prose':
      return <ProseBlock block={block} />;
    case 'faq':
      return <FaqBlock block={block} />;
    default:
      return null;
  }
}

export default function FeatureBlocks({ blocks }: { blocks: FeatureBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => (
        <section
          key={`${block.type}-${block.title}`}
          className={`home4-fp-section${i % 2 === 1 ? ' home4-fp-section--alt' : ''}`}
        >
          <div className="home4-fp-section__inner">
            <Reveal>
              <h2 className="home4-fp-section__title">{block.title}</h2>
            </Reveal>
            <BlockBody block={block} />
          </div>
        </section>
      ))}
    </>
  );
}
