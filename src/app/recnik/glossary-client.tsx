'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, BookOpen, Hash, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import Link from 'next/link';
import type { SanityGlossaryTerm } from '@/lib/sanity.queries';

interface GlossaryClientProps {
  initialTerms: SanityGlossaryTerm[];
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
    const grouped: { [key: string]: SanityGlossaryTerm[] } = {};
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

  const getDisplayedTerms = (letter: string, terms: SanityGlossaryTerm[]) => {
    const isExpanded = expandedLetters.has(letter);
    if (isExpanded) {
      return terms;
    }
    return terms.slice(0, PER_LETTER_LIMIT);
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <section className="w-full border-b border-border bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-4">
              Rečnik
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Kompletan stomatološki rečnik sa objašnjenjima i definicijama
            </p>

            {/* Search Bar + Category Filter Toolbar */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Šta tražite?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 text-base bg-card border-border focus:ring-ring focus:ring-2 rounded-2xl w-full"
                />
              </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[180px] h-12 border-border bg-card rounded-2xl focus:ring-ring focus:ring-2">
                    <SelectValue placeholder="Kategorija" />
                  </SelectTrigger>
                  <SelectContent>
              {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                  {category}
                      </SelectItem>
              ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

        {/* Alphabet Navigation */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 justify-center overflow-x-auto pb-2 scrollbar-hide">
            {alphabet.map((letter) => {
                  const termCount = getTermsByLetter(letter).length;
                  const hasTerms = termCount > 0;
                  // Check if this letter has terms in filtered results
                  const isActive = availableLetters.includes(letter);

              return (
                <Button
                  key={letter}
                  variant="outline"
                  size="sm"
                      onClick={() => hasTerms && handleLetterClick(letter)}
                  disabled={!hasTerms}
                  className={`
                        ${isActive && hasTerms
                      ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/15' 
                      : 'border-border text-foreground hover:bg-accent'
                    }
                    ${!hasTerms ? 'opacity-50 cursor-not-allowed' : ''}
                    rounded-full px-4 py-2 shrink-0
                  `}
                >
                  {letter === '#' ? <Hash className="h-4 w-4" /> : letter}
                </Button>
                  );
                })}
              </div>
            </div>

            {/* Meta Info */}
            <p className="text-sm text-muted-foreground">
              Ukupno {filteredTerms.length} {filteredTerms.length === 1 ? 'termin' : 'termina'}
            </p>
          </div>
        </div>
      </section>

      {/* Directory View */}
      <div className="max-w-6xl mx-auto mt-12 px-4 sm:px-6 lg:px-8 pb-12">
          {filteredTerms.length === 0 ? (
          <div className="text-center py-16">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nema pronađenih termina
              </h3>
              <p className="text-muted-foreground">
                {searchQuery 
                ? `Nema termina koji odgovaraju pretraživanju "${searchQuery}". Probaj drugo slovo ili pojam.`
                  : 'Pokušajte da prilagodite filtere'
                }
              </p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3" style={{ columnGap: '3rem' }}>
            {availableLetters.map((letter) => {
              const terms = termsByLetter[letter];
              const isExpanded = expandedLetters.has(letter);
              const hasMore = terms.length > PER_LETTER_LIMIT;
              const visibleTerms = isExpanded ? terms : terms.slice(0, PER_LETTER_LIMIT);
              const letterId = getLetterId(letter);

              return (
                <section 
                  key={letter}
                  id={letterId} 
                  className="scroll-mt-20 mb-12 break-inside-avoid"
                  style={{ breakInside: 'avoid' }}
                >
                  {/* Letter Heading */}
                  <h2 className="text-4xl font-semibold tracking-tight text-foreground">
                    {letter}
                  </h2>
                  <div className="mt-3 h-px w-full bg-border" />

                  {/* Terms List */}
                  <div className="mt-5 space-y-3">
                    {visibleTerms.map((term) => (
                      <div key={term._id}>
                        <Link
                          href={`/recnik/${term.slug}`}
                          className="text-foreground hover:text-primary hover:underline underline-offset-4 transition-colors"
                        >
                          {term.term}
                        </Link>
                      </div>
                    ))}
                  </div>

                  {/* Show More/Less Toggle - Only if hasMore */}
                  {hasMore && (
                    <button
                      onClick={() => toggleLetterExpansion(letter)}
                      className="mt-4 inline-flex items-center text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-4 transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          Prikaži manje
                          <ChevronUp className="ml-1 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Vidi još
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </button>
                  )}
                </section>
              );
            })}
                  </div>
        )}

        {/* Minimal Editorial CTA */}
        <div className="mt-20 pt-12 border-t border-border text-center">
          <p className="text-muted-foreground mb-4">
                Ne možete da pronađete ono što tražite?
              </p>
          <Button variant="ghost" asChild>
            <Link href="/kontakt" className="text-primary hover:text-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
              Predloži termin
            </Link>
                </Button>
              </div>
      </div>
    </div>
  );
}
