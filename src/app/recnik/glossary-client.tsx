'use client';

import { useState, useMemo, type ReactNode } from 'react';
import { Search, BookOpen, Hash, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import type { RecnikTermSummary } from '@/lib/content/recnik/types';
import { displayFont } from '@/app/(site)/display-font';
/* site.css nosi --stellar-* tokene na .site-page wrapperu, feature-page.css
   hero/sekcije/CTA. Rečnik koristi isti sistem kao stranice funkcionalnosti. */
import '@/app/(site)/site.css';
import '@/app/(site)/funkcionalnosti/feature-page.css';
import './recnik.css';

type CategoryOption = { id: string; title: string; path: string; termCount: number };

interface GlossaryClientProps {
  /** Lagani sazeci javnih pojmova (bez clanka, FAQ-a i izvora). */
  terms: RecnikTermSummary[];
  /** Kategorije sa bar jednim javnim pojmom, iz RECNIK_CATEGORIES. */
  categories: CategoryOption[];
  /** Server-renderovan breadcrumb. */
  breadcrumbs: ReactNode;
}

const ALL = 'sve';

const alphabet = ['#', 'A', 'B', 'C', 'Č', 'Ć', 'D', 'Dž', 'Đ', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'Lj', 'M', 'N', 'Nj', 'O', 'P', 'R', 'S', 'Š', 'T', 'U', 'V', 'Z', 'Ž'];

/* Vizuelno se po slovu prikazuje do 6 pojmova; ostali su u HTML-u (crawlable <a>),
   samo sakriveni CSS-om dok se slovo ne rasiri. */
const PER_LETTER_LIMIT = 6;

/* Pretraga bez obzira na velika slova i dijakritiku ("cesalj" nalazi "češalj"). */
function normalize(value: string): string {
  return value
    .toLocaleLowerCase('sr')
    .replace(/đ/g, 'dj')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

const letterOrder = (letter: string) => {
  const i = alphabet.indexOf(letter);
  return i === -1 ? alphabet.length : i;
};

export default function GlossaryClient({ terms, categories, breadcrumbs }: GlossaryClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(ALL);
  const [expandedLetters, setExpandedLetters] = useState<Set<string>>(new Set());

  const searchIndex = useMemo(
    () =>
      new Map(
        terms.map((t) => [
          t.id,
          normalize([t.publicTitle, t.medicalCanonicalTerm, t.shortDefinition, ...t.searchAliases].join(' ')),
        ]),
      ),
    [terms],
  );

  const filteredTerms = useMemo(() => {
    const query = normalize(searchQuery.trim());
    return terms.filter(
      (t) =>
        (selectedCategory === ALL || t.categoryId === selectedCategory) &&
        (!query || searchIndex.get(t.id)!.includes(query)),
    );
  }, [terms, searchIndex, searchQuery, selectedCategory]);

  // Grupisanje po slovu srpske abecede (firstLetter dolazi sa servera)
  const termsByLetter = useMemo(() => {
    const grouped: Record<string, RecnikTermSummary[]> = {};
    for (const term of filteredTerms) {
      (grouped[term.firstLetter] ??= []).push(term);
    }
    for (const letter of Object.keys(grouped)) {
      grouped[letter].sort((a, b) => a.publicTitle.localeCompare(b.publicTitle, 'sr'));
    }
    return grouped;
  }, [filteredTerms]);

  const availableLetters = Object.keys(termsByLetter).sort((a, b) => letterOrder(a) - letterOrder(b));
  const lettersWithTerms = useMemo(() => new Set(terms.map((t) => t.firstLetter)), [terms]);

  const getLetterId = (letter: string): string =>
    letter === '#' ? 'slovo-num' : `slovo-${letter.toLowerCase().replace(/\s+/g, '-')}`;

  const handleLetterClick = (letter: string) => {
    const element = document.getElementById(getLetterId(letter));
    if (element) {
      // Offset za fiksni header
      const offset = 100;
      const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const toggleLetterExpansion = (letter: string) => {
    const next = new Set(expandedLetters);
    if (next.has(letter)) next.delete(letter);
    else next.add(letter);
    setExpandedLetters(next);
  };

  return (
    <div className={`site-page min-h-screen bg-white w-full ${displayFont.variable}`}>
      {/* ── Hero: naslov, pretraga, abeceda ── */}
      <section className="page-hero recnik-hero">
        <div className="page-hero__inner">
          {breadcrumbs}
          <h1 className="page-hero__title">Stomatološki rečnik</h1>
          <p className="page-hero__lead">
            Kompletan stomatološki rečnik sa objašnjenjima i definicijama
          </p>
        </div>

        {/* Pretraga + kategorija */}
        <div className="recnik-toolbar">
          <label className="recnik-search">
            <span className="sr-only">Pretraga termina</span>
            <Search className="recnik-search__icon" size={18} aria-hidden />
            <input
              type="search"
              className="recnik-field"
              placeholder="Šta tražite?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
          <label className="recnik-select">
            <span className="sr-only">Kategorija</span>
            <select
              className="recnik-field"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value={ALL}>Sve kategorije</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
            <ChevronDown className="recnik-select__chevron" size={16} aria-hidden />
          </label>
        </div>

        {/* Abeceda */}
        <nav className="recnik-alpha" aria-label="Abeceda">
          {alphabet.map((letter) => {
            const hasTerms = lettersWithTerms.has(letter);
            // Slovo ima termine i u trenutnom filteru
            const isActive = hasTerms && availableLetters.includes(letter);

            return (
              <button
                key={letter}
                type="button"
                onClick={() => hasTerms && handleLetterClick(letter)}
                disabled={!hasTerms}
                className={`recnik-alpha__btn${isActive ? ' recnik-alpha__btn--active' : ''}`}
                aria-label={letter === '#' ? 'Brojevi' : letter}
              >
                {letter === '#' ? <Hash size={14} aria-hidden /> : letter}
              </button>
            );
          })}
        </nav>

        <p className="recnik-count">
          Ukupno {filteredTerms.length} {filteredTerms.length === 1 ? 'termin' : 'termina'}
        </p>
      </section>

      {/* ── Termini po slovima ── */}
      <section className="page-section page-section--alt">
        <div className="page-section__inner">
          {filteredTerms.length === 0 ? (
            <div className="recnik-empty">
              <BookOpen size={44} strokeWidth={1.5} aria-hidden />
              <h2 className="recnik-empty__title">Nema pronađenih termina</h2>
              <p className="recnik-empty__text">
                {searchQuery
                  ? `Nema termina koji odgovaraju pretraživanju "${searchQuery}". Probaj drugo slovo ili pojam.`
                  : 'Pokušajte da prilagodite filtere'}
              </p>
            </div>
          ) : (
            <div className="recnik-columns">
              {availableLetters.map((letter) => {
                const letterTerms = termsByLetter[letter];
                const isExpanded = expandedLetters.has(letter);
                const hasMore = letterTerms.length > PER_LETTER_LIMIT;

                return (
                  <section key={letter} id={getLetterId(letter)} className="recnik-group">
                    <h2 className="recnik-group__letter">{letter}</h2>
                    <ul className="recnik-group__list">
                      {letterTerms.map((term, i) => (
                        <li
                          key={term.id}
                          className={
                            !isExpanded && i >= PER_LETTER_LIMIT ? 'recnik-group__item--extra' : undefined
                          }
                        >
                          <Link href={`/recnik/${term.slug}`} className="recnik-group__link">
                            {term.publicTitle}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {hasMore && (
                      <button
                        type="button"
                        onClick={() => toggleLetterExpansion(letter)}
                        className="recnik-group__more"
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? 'Prikaži manje' : 'Vidi još'}
                        {isExpanded ? (
                          <ChevronUp size={15} aria-hidden />
                        ) : (
                          <ChevronDown size={15} aria-hidden />
                        )}
                      </button>
                    )}
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Zavrsni CTA ── */}
      <section className="page-cta">
        <div className="page-cta__inner">
          <h2 className="page-cta__title">Ne možete da pronađete ono što tražite?</h2>
          <p className="page-cta__lead">
            Predložite termin i dodaćemo ga u rečnik.
          </p>
          <div className="page-cta__actions">
            <Link href="/kontakt" className="hero__btn hero__btn--primary">
              Predloži termin
            </Link>
            <Link href="/register" className="page-cta__ghost">
              Započni besplatno
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
