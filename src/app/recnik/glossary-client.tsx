'use client';

import { useState, useMemo } from 'react';
import { Search, BookOpen, Hash, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import type { RecnikTerm } from '@/lib/content/recnik';
import { displayFont } from '@/app/(site)/display-font';
/* site.css nosi --stellar-* tokene na .site-page wrapperu, feature-page.css
   hero/sekcije/CTA. Rečnik koristi isti sistem kao stranice funkcionalnosti. */
import '@/app/(site)/site.css';
import '@/app/(site)/funkcionalnosti/feature-page.css';
import './recnik.css';

interface GlossaryClientProps {
  initialTerms: RecnikTerm[];
}

const categories = [
  'Sve',
  'Opšta stomatologija',
  'Preventivna i dečja stomatologija',
  'Bolesti zuba i endodoncija',
  'Stomatološka protetika',
  'Parodontologija i oralna medicina',
  'Ortopedija vilica (Ortodoncija)',
  'Oralna hirurgija',
  'Maksilofacijalna hirurgija',
];

const alphabet = ['#', 'A', 'B', 'C', 'Č', 'Ć', 'D', 'Dž', 'Đ', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'Lj', 'M', 'N', 'Nj', 'O', 'P', 'R', 'S', 'Š', 'T', 'U', 'V', 'Z', 'Ž'];

const PER_LETTER_LIMIT = 6;

export default function GlossaryClient({ initialTerms }: GlossaryClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Sve');
  const [expandedLetters, setExpandedLetters] = useState<Set<string>>(new Set());

  // Filter logic
  const filteredTerms = useMemo(() => {
    let filtered = initialTerms;

    if (searchQuery) {
      filtered = filtered.filter(term =>
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedLetter) {
      if (selectedLetter === '#') {
        filtered = filtered.filter(term => /^\d/.test(term.term));
      } else {
        filtered = filtered.filter(term =>
          term.term.toUpperCase().startsWith(selectedLetter)
        );
      }
    }

    if (selectedCategory !== 'Sve') {
      filtered = filtered.filter(term => term.category === selectedCategory);
    }

    return filtered;
  }, [initialTerms, searchQuery, selectedLetter, selectedCategory]);

  // Group by letter
  const termsByLetter = useMemo(() => {
    const grouped: { [key: string]: RecnikTerm[] } = {};
    filteredTerms.forEach(term => {
      let firstLetter = term.term.charAt(0).toUpperCase();
      // Handle numbers
      if (/^\d/.test(term.term)) {
        firstLetter = '#';
      }
      // Normalize special characters to their base letter for grouping
      // This ensures Č, Ć, Š, Ž are grouped separately
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
      }
      grouped[firstLetter].push(term);
    });
    
    Object.keys(grouped).forEach(letter => {
      grouped[letter].sort((a, b) => a.term.localeCompare(b.term, 'sr'));
    });
    
    return grouped;
  }, [filteredTerms]);

  const availableLetters = Object.keys(termsByLetter).sort();

  const getTermsByLetter = (letter: string) => {
    if (letter === '#') {
      return initialTerms.filter(term => /^\d/.test(term.term));
    }
    return initialTerms.filter(term => 
      term.term.toUpperCase().startsWith(letter)
    );
  };

  const getLetterId = (letter: string): string => {
    if (letter === '#') {
      return 'slovo-num';
    }
    // Create URL-safe ID from letter
    // Keep special characters but encode spaces and make lowercase
    return `slovo-${letter.toLowerCase().replace(/\s+/g, '-')}`;
  };

  const handleLetterClick = (letter: string) => {
    // Primary behavior: scroll to section
    const letterId = getLetterId(letter);
    const element = document.getElementById(letterId);
    if (element) {
      // Add offset for fixed header
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const toggleLetterExpansion = (letter: string) => {
    const newExpanded = new Set(expandedLetters);
    if (newExpanded.has(letter)) {
      newExpanded.delete(letter);
    } else {
      newExpanded.add(letter);
    }
    setExpandedLetters(newExpanded);
  };

  const getDisplayedTerms = (letter: string, terms: RecnikTerm[]) => {
    const isExpanded = expandedLetters.has(letter);
    if (isExpanded) {
      return terms;
    }
    return terms.slice(0, PER_LETTER_LIMIT);
  };

  return (
    <div className={`site-page min-h-screen bg-white w-full ${displayFont.variable}`}>
      {/* ── Hero: naslov, pretraga, abeceda ── */}
      <section className="page-hero recnik-hero">
        <div className="page-hero__inner">
          <p className="page-hero__eyebrow">Rečnik</p>
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
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <ChevronDown className="recnik-select__chevron" size={16} aria-hidden />
          </label>
        </div>

        {/* Abeceda */}
        <nav className="recnik-alpha" aria-label="Abeceda">
          {alphabet.map((letter) => {
            const hasTerms = getTermsByLetter(letter).length > 0;
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
                const terms = termsByLetter[letter];
                const isExpanded = expandedLetters.has(letter);
                const hasMore = terms.length > PER_LETTER_LIMIT;
                const visibleTerms = isExpanded ? terms : terms.slice(0, PER_LETTER_LIMIT);

                return (
                  <section key={letter} id={getLetterId(letter)} className="recnik-group">
                    <h2 className="recnik-group__letter">{letter}</h2>
                    <ul className="recnik-group__list">
                      {visibleTerms.map((term) => (
                        <li key={term.slug}>
                          <Link href={`/recnik/${term.slug}`} className="recnik-group__link">
                            {term.term}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {hasMore && (
                      <button
                        type="button"
                        onClick={() => toggleLetterExpansion(letter)}
                        className="recnik-group__more"
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
