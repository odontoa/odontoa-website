'use client';

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

const FULL_MENU_ITEMS = [
  { name: 'Početna', href: '/' },
  ...(process.env.NODE_ENV !== 'production'
    ? [{ name: 'Home2', href: '/home2' }]
    : []),
  { name: 'O nama', href: '/o-nama' },
  { name: 'Kontakt', href: '/kontakt' },
  { name: 'Blogovi', href: '/blogovi' },
  { name: 'Rečnik', href: '/recnik' },
];

const HOME2_MENU_ITEMS = [
  { name: 'Početna', href: '/' },
  { name: 'Blogovi', href: '/blogovi' },
  { name: 'Kontakt', href: '/kontakt' },
];

const Navigation = () => {
  const pathname = usePathname();
  const isHome2 = pathname === '/home2';
  const menuItems = isHome2 ? HOME2_MENU_ITEMS : FULL_MENU_ITEMS;

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
        data-home2={isHome2 || undefined}
        className="fixed z-20 w-full px-2 pt-1 group">
        <div className={cn('mx-auto mt-2 max-w-[1240px] px-4 sm:px-6 lg:px-8 transition-all duration-300', isScrolled && 'bg-background/50 rounded-2xl border backdrop-blur-lg')}>
          <div className={cn(
            'relative flex flex-wrap items-start justify-between gap-6 lg:flex-nowrap lg:gap-0',
            isHome2 ? 'py-3 lg:py-4' : 'py-3 lg:py-4'
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
              <ul className={cn('hidden lg:flex lg:items-center text-sm', isHome2 ? 'lg:gap-5' : 'lg:gap-7')}>
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      onClick={item.href === '/' ? handleHomeClick : undefined}
                      className="text-muted-foreground hover:text-accent-foreground block duration-150">
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="lg:hidden">
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
                <Button
                  asChild
                  variant="pillPrimary"
                  size="pillSm"
                >
                  <a href="https://app.odontoa.com" target="_blank" rel="noopener noreferrer">
                    <span>Uloguj se</span>
                  </a>
                </Button>
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