'use client';

import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { isSectionHidden } from "@/lib/config/hidden-sections";
import { isOpenInComingSoon } from "@/lib/config/site-mode";

/* Stavke privremeno sakrivenih sekcija (blog, recnik, o nama) se filtriraju, ne brisu:
   ukljucuju se iz src/lib/config/hidden-sections.ts. */
const visible = <T extends { href: string }>(items: T[]) => items.filter((item) => !isSectionHidden(item.href));

/* Jedan meni za sve stranice. "Funkcionalnosti" vodi na indeks /funkcionalnosti,
   odakle se bira pojedinacna funkcionalnost; ne skroluje na sekciju pocetne. */
const MENU_ITEMS = visible([
  { name: 'Početna', href: '/' },
  { name: 'Funkcionalnosti', href: '/funkcionalnosti' },
  { name: 'O nama', href: '/o-nama' },
  { name: 'Blogovi', href: '/blogovi' },
  { name: 'Rečnik', href: '/recnik' },
  { name: 'Alati', href: '/alati' },
  { name: 'Kontakt', href: '/kontakt' },
]);

/* comingSoon dolazi od serverskog roditelja (isComingSoon()); tada meni sadrzi samo
   stranice koje su u coming-soon rezimu otvorene, bez linkova ka zatvorenim rutama. */
const Navigation = ({ comingSoon = false }: { comingSoon?: boolean }) => {
  const menuItems = comingSoon ? MENU_ITEMS.filter((item) => isOpenInComingSoon(item.href)) : MENU_ITEMS;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = '/';
  };

  return (
    <header>
      <nav
        data-state={isMenuOpen && 'active'}
        className="fixed z-20 w-full px-2 pt-1 group">
        <div
          className={cn('mx-auto mt-2 max-w-[1240px] px-4 sm:px-6 lg:px-8 transition-all duration-300', isScrolled && 'rounded-2xl border backdrop-blur-lg')}
          style={isScrolled ? { background: 'rgba(247,248,250,0.85)', borderColor: '#e9ebf1' } : undefined}
        >
          <div className={cn(
            'relative flex flex-wrap items-start justify-between gap-6 lg:flex-nowrap lg:gap-0',
            'py-3 lg:py-4'
          )}>
            <div className="flex w-full items-center justify-between lg:w-auto lg:items-start">
              <Link
                href="/"
                aria-label="home"
                onClick={handleHomeClick}
                className="flex items-center space-x-2">
                <Logo />
              </Link>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen == true ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:flex-row lg:h-8 lg:items-center lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              {/* Desktop nav links: right-aligned row, only on lg+ */}
              <ul className={cn('hidden lg:flex lg:items-center text-sm', 'lg:gap-7')}>
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      onClick={item.href === '/' ? handleHomeClick : undefined}
                      className="block duration-150 hover:opacity-100"
                      style={{ color: '#363d4f' }}
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="!mt-0 lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                        onClick={(e) => {
                          setIsMenuOpen(false);
                          if (item.href === '/') {
                            handleHomeClick(e);
                          }
                        }}>
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <a
                  href="https://app.odontoa.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 36,
                    paddingLeft: 20,
                    paddingRight: 20,
                    borderRadius: 999,
                    background: '#6e51e0',
                    color: '#ffffff',
                    fontSize: 13,
                    fontWeight: 500,
                    letterSpacing: '-0.18px',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Prijavi se
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex items-center leading-none', className)}>
      <Image 
        src="/images/Odontoa-New-logo-pack-2026/horiyotal_color.png" 
        alt="Odontoa Logo" 
        width={160}
        height={48}
        className="block h-11 w-auto object-contain sm:h-12"
        priority
      />
    </div>
  );
};

export default Navigation;