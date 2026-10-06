'use client';

import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { DetailCrop, DetailFit } from './ProductStage';

export type IndexItem = {
  slug: string;
  name: string;
  desc: string;
  title: string;
  frontWidth: number;
  frontHeight: number;
  focusX: number;
  mobileMin?: number;
};

/**
 * L5 Minimal Product Index za /funkcionalnosti.
 *
 * Desktop: lista linkova levo, jedan veliki product canvas desno. Hover i fokus
 * (tastatura) menjaju prikaz; klik vodi na stranicu funkcionalnosti.
 * Telefon: akordeon na <details>; tap na red otvara prikaz odmah ispod, a navigacija
 * je jedino "Saznaj više". Jedan red otvoren u isto vreme.
 *
 * Nazivi, opisi i linkovi svih sedam su u server HTML-u; JS dodaje samo prikaze.
 * details[slug] su detalji proizvoda renderovani na serveru.
 */
export default function ProductIndex({ items, details }: { items: IndexItem[]; details: Record<string, ReactNode> }) {
  const [active, setActive] = useState(items[0].slug);
  const [open, setOpen] = useState<string | null>(items[0].slug);
  const current = items.find((i) => i.slug === active) ?? items[0];

  return (
    <div className="pi">
      {/* ── Desktop ── */}
      <div className="pi-desk">
        <ol className="pi-list">
          {items.map((it, i) => (
            <li key={it.slug}>
              <Link
                href={`/funkcionalnosti/${it.slug}`}
                className={`pi-row${it.slug === active ? ' is-active' : ''}`}
                onMouseEnter={() => setActive(it.slug)}
                onFocus={() => setActive(it.slug)}
                aria-current={it.slug === active ? 'true' : undefined}
              >
                <span className="pi-row__n" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="pi-row__name">{it.name}</span>
                <ArrowRight size={18} strokeWidth={1.75} aria-hidden className="pi-row__arrow" />
                <span className="pi-row__desc">{it.desc}</span>
              </Link>
            </li>
          ))}
        </ol>

        <div className="pi-canvas">
          <div className="pi-canvas__vis" key={current.slug}>
            <DetailFit width={current.frontWidth}>{details[current.slug]}</DetailFit>
          </div>
          <div className="pi-canvas__cap" key={`${current.slug}-cap`}>
            <span>{current.title}</span>
            <Link href={`/funkcionalnosti/${current.slug}`} tabIndex={-1}>
              Saznaj više
              <ArrowRight size={14} strokeWidth={2} aria-hidden />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Telefon ── */}
      <div className="pi-mob">
        {items.map((it, i) => {
          const isOpen = open === it.slug;
          return (
            <details key={it.slug} className="pi-item" open={isOpen}>
              <summary
                className="pi-sum"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(isOpen ? null : it.slug);
                }}
              >
                <span className="pi-row__n" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="pi-row__name">{it.name}</span>
                <ChevronDown size={18} strokeWidth={1.75} aria-hidden className="pi-sum__chev" />
                <span className="pi-row__desc">{it.desc}</span>
              </summary>
              <div className="pi-panel">
                {isOpen ? (
                  <div className="pi-panel__vis">
                    <DetailCrop width={it.frontWidth} height={it.frontHeight} focusX={it.focusX} minScale={it.mobileMin}>
                      {details[it.slug]}
                    </DetailCrop>
                  </div>
                ) : null}
                <Link href={`/funkcionalnosti/${it.slug}`} className="pi-panel__more">
                  Saznaj više
                  <ArrowRight size={15} strokeWidth={2} aria-hidden />
                </Link>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
