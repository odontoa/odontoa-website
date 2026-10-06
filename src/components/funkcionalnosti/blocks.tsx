import type { ComponentType } from 'react';
import type { FeatureBlock } from '@/lib/content/funkcionalnosti';
import Reveal from '@/components/shared/Reveal';
import StepsFlow from './StepsFlow';
import {
  BellRing,
  BrainCircuit,
  CalendarDays,
  ClipboardCheck,
  Columns2,
  FileSearch,
  FileSignature,
  FileStack,
  History,
  Images,
  ListChecks,
  MessageSquare,
  MessagesSquare,
  MousePointerClick,
  Receipt,
  Sparkles,
  TrendingUp,
  Wallet,
  ZoomIn,
} from 'lucide-react';

/**
 * Renderer blokova tela stranice funkcionalnosti.
 *
 * Svaki tip bloka ima svoju komponentu, a FeatureBlocks bira po block.type.
 *
 * Identitet sekcije je vezan za TIP bloka, ne za njegov redni broj. Ranije je
 * podloga isla po `i % 2`, pa je obrazac zavisio od toga koliko blokova stranica
 * ima: stranica sa 3 bloka i stranica sa 4 bloka nisu imale isti ritam. Sada
 * svaki tip ima stalnu podlogu i stalno poravnanje, pa svih 7 stranica izgleda
 * kao jedan sistem.
 */

/* ── Identitet sekcije po tipu bloka ───────────────────────────────────────
   tone:  podloga sekcije, 'alt' je --stellar-bg-light
   align: 'center' je centrirano zaglavlje (eyebrow + H2), kao WorkflowSection
          i PricingSection na pocetnoj

   Smenjivanje 'alt'/'white' i 'center'/'left' zajedno daju cik-cak ritam
   umesto pet identicnih sekcija poravnatih levo. */

export type SectionTone = 'white' | 'alt';

type SectionMeta = { eyebrow: string; tone: SectionTone; align: 'left' | 'center' };

/* Eyebrow ne sme da ponavlja rec iz naslova bloka ispod sebe:
   "Zašto" bi se sudario sa 3 od 6 prose naslova ("Zašto je ovo važnije...",
   "Zašto trošak laboratorije...", "Zašto asistent unutar sistema..."), a
   "Pitanja" sa "Česta pitanja" na svih 5 FAQ blokova. */
const SECTION_META: Record<FeatureBlock['type'], SectionMeta> = {
  benefits: { eyebrow: 'Prednosti', tone: 'alt', align: 'center' },
  steps: { eyebrow: 'Proces', tone: 'white', align: 'left' },
  prose: { eyebrow: 'Suština', tone: 'alt', align: 'center' },
  faq: { eyebrow: 'Odgovori', tone: 'white', align: 'left' },
};

/**
 * Podloga za sekciju koja dolazi POSLE tela (srodne funkcionalnosti), da se ne
 * dodiruju dve iste podloge. Zavisi od tipa poslednjeg bloka, ne od njihovog
 * broja, pa je rezultat isti za svaku kombinaciju blokova.
 */
export function toneAfterBlocks(blocks: FeatureBlock[]): SectionTone {
  const last = blocks[blocks.length - 1];
  if (!last) return 'alt';
  return SECTION_META[last.type].tone === 'white' ? 'alt' : 'white';
}

/* ── Ikonice kartica ───────────────────────────────────────────────────────
   Sadrzaj (funkcionalnosti.ts) je .ts fajl i ne moze da drzi komponente, pa
   nosi samo kljuc, a mapiranje kljuc -> komponenta stoji ovde. Nepoznat ili
   izostavljen kljuc pada na kvacicu, tako da kartica nikad ne ostane bez glifa.

   Lucide, jer je vec zavisnost i vec se uvozi u FeaturePage.tsx. Velicina i
   debljina linije prate konvenciju sajta za ikonice u pločici (18px / 1.75). */

/**
 * Zub, jedina rucno crtana ikonica u mapi.
 *
 * Lucide nema zub, a Grid2x2 je na njegovom mestu citao kao tabela ili mreza,
 * ne kao zubi. Obris je molar: kupola gore, dva korena dole sa zarezom izmedju.
 *
 * Postavke su namerno identicne lucide ikonicama pored (viewBox 24, fill none,
 * stroke currentColor, round cap/join, 18px, strokeWidth 1.75), pa u pločici
 * sedne kao da je iz istog seta. Prima iste propove kao lucide komponenta.
 */
function ToothIcon({ size = 18, strokeWidth = 1.75 }: BenefitIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Simetricno oko x=12: ramena na 4.9 i 19.1, vrhovi korena na 7.8 i 16.2,
          zarez izmedju korena na (12, 13.8). Sirina 14.2 od 24, da opticki
          tezi isto kao lucide glifovi pored, koji popune vise od kutije. */}
      <path d="M12 3.8c-4.5 0-7.1 2.2-7.1 5.2 0 1.7.4 2.9.75 4.6.42 2.1.32 6.6 2.15 6.6 1.35 0 1.45-2.3 1.65-4.1.12-1.1.5-2.3 2.55-2.3s2.43 1.2 2.55 2.3c.2 1.8.3 4.1 1.65 4.1 1.83 0 1.73-4.5 2.15-6.6.35-1.7.75-2.9.75-4.6 0-3-2.6-5.2-7.1-5.2Z" />
    </svg>
  );
}

/* Tip je ComponentType, ne LucideIcon: lucide ikonice su
   ForwardRefExoticComponent, a rucno crtani ToothIcon je obicna funkcija.
   Zajednicki im je samo skup propova koje BenefitIcon prosledjuje.

   size i strokeWidth su `string | number` da se poklope sa LucideProps; sa
   samo `number` lucide komponente nisu dodeljive ovom tipu (varijansa u
   propTypes.size). */
type BenefitIconProps = { size?: string | number; strokeWidth?: string | number };

const BENEFIT_ICONS: Record<string, ComponentType<BenefitIconProps>> = {
  'bell-ring': BellRing,
  'brain-circuit': BrainCircuit,
  'calendar-days': CalendarDays,
  'clipboard-check': ClipboardCheck,
  'columns-2': Columns2,
  'file-search': FileSearch,
  'file-signature': FileSignature,
  'file-stack': FileStack,
  history: History,
  images: Images,
  'list-checks': ListChecks,
  'message-square': MessageSquare,
  'messages-square': MessagesSquare,
  'mouse-pointer-click': MousePointerClick,
  receipt: Receipt,
  sparkles: Sparkles,
  tooth: ToothIcon,
  'trending-up': TrendingUp,
  wallet: Wallet,
  'zoom-in': ZoomIn,
};

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

function BenefitIcon({ name }: { name?: string }) {
  const Icon = name ? BENEFIT_ICONS[name] : undefined;
  if (!Icon) return <CheckIcon />;
  return <Icon size={18} strokeWidth={1.75} aria-hidden />;
}

function PlusIcon() {
  return (
    <svg
      className="page-faq__icon"
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
    <div className="page-benefits">
      {block.items.map((item, i) => (
        <Reveal key={item.title} delay={i * 0.06} style={{ height: '100%' }}>
          <div className="page-benefit">
            <div className="page-benefit__icon">
              <BenefitIcon name={item.icon} />
            </div>
            <h3 className="page-benefit__title">{item.title}</h3>
            <p className="page-benefit__desc">{item.desc}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* Lista je u klijentskoj komponenti zbog sekvencijalne animacije markera i
   kicme; ostali blokovi ostaju serverski. Vidi StepsFlow.tsx. */
function StepsBlock({ block }: { block: Extract<FeatureBlock, { type: 'steps' }> }) {
  return <StepsFlow items={block.items} />;
}

function ProseBlock({ block }: { block: Extract<FeatureBlock, { type: 'prose' }> }) {
  return (
    <div className="page-prose">
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
    <div className="page-faq">
      {block.items.map((item) => (
        <details key={item.q} className="page-faq__item">
          <summary className="page-faq__q">
            {item.q}
            <PlusIcon />
          </summary>
          <p className="page-faq__a">{item.a}</p>
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

/**
 * Zaglavlje sekcije: eyebrow iznad naslova.
 *
 * Eyebrow nosi accent boju u svaku sekciju tela, koja je do sada bila potpuno
 * siva ispod heroja, i oslobadja H2 da bude tvrdnja umesto etikete.
 *
 * Crtica ide samo na sekcije poravnate levo (obrazac .testimonial-quote__eyebrow sa
 * pocetne): uz centriran tekst visi neuravnotezeno, pa centrirane sekcije nose
 * cist uppercase eyebrow.
 */
function SectionHeader({ block }: { block: FeatureBlock }) {
  const meta = SECTION_META[block.type];
  return (
    <Reveal>
      <p className="page-section__eyebrow">
        {meta.align === 'left' && (
          <span className="page-section__dash" aria-hidden="true" />
        )}
        {meta.eyebrow}
      </p>
      <h2 className="page-section__title">{block.title}</h2>
    </Reveal>
  );
}

export default function FeatureBlocks({ blocks }: { blocks: FeatureBlock[] }) {
  return (
    <>
      {blocks.map((block) => {
        const meta = SECTION_META[block.type];
        const classes = [
          'page-section',
          `page-section--${block.type}`,
          meta.tone === 'alt' && 'page-section--alt',
          meta.align === 'center' && 'page-section--center',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <section key={`${block.type}-${block.title}`} className={classes}>
            <div className="page-section__inner">
              <SectionHeader block={block} />
              <BlockBody block={block} />
            </div>
          </section>
        );
      })}
    </>
  );
}
