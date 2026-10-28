'use client';

import { Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { businessConfig } from "@/lib/config/business";
import { isSectionHidden } from "@/lib/config/hidden-sections";
import { isOpenInComingSoon } from "@/lib/config/site-mode";

/* Isti redosled, slugovi i nazivi kao FEATURE_PAGES (src/lib/content/funkcionalnosti.ts).
   Lista je ovde, a ne import, da client footer ne povlaci ceo sadrzaj stranica u bundle. */
const FEATURE_LINKS = [
  { href: '/funkcionalnosti/zakazivac-termina', label: 'Zakazivač termina' },
  { href: '/funkcionalnosti/karton-i-odontogram', label: 'Karton i odontogram' },
  { href: '/funkcionalnosti/rtg-i-fotografije', label: 'RTG i fotografije' },
  { href: '/funkcionalnosti/zubna-tehnika', label: 'Zubna tehnika' },
  { href: '/funkcionalnosti/dokumentacija-i-saglasnosti', label: 'Dokumentacija i saglasnosti' },
  { href: '/funkcionalnosti/finansije-i-podsetnici', label: 'Finansije i podsetnici' },
  { href: '/funkcionalnosti/ai-asistent', label: 'AI asistent' },
].filter((link) => !isSectionHidden(link.href));

/* Linkovi privremeno sakrivenih sekcija se filtriraju (src/lib/config/hidden-sections.ts). */
const NAV_LINKS = [
  { href: '/', label: 'Početna' },
  { href: '/funkcionalnosti', label: 'Funkcionalnosti' },
  { href: '/o-nama', label: 'O nama' },
  { href: '/kontakt', label: 'Kontakt' },
].filter((link) => !isSectionHidden(link.href));

const RESOURCE_LINKS = [
  { href: '/blogovi', label: 'Blog' },
  { href: '/recnik', label: 'Rečnik' },
  { href: '/alati', label: 'Besplatni alati' },
].filter((link) => !isSectionHidden(link.href));

const LEGAL_LINKS = [
  { href: '/kontakt', label: 'Pomoć' },
  { href: '/politika-privatnosti', label: 'Politika privatnosti' },
  { href: '/uslovi-koriscenja', label: 'Uslovi korišćenja' },
  { href: '/gdpr', label: 'GDPR' },
  { href: '/demo', label: 'Demo' },
];

/* Raspored po broju kolona sa linkovima: brend uvek zauzima ostatak reda, da kolone
   ostanu uz desnu ivicu. Na tabletu brend ide u svoj red, a kolone u red ispod.
   Klase su pune (ne sklapaju se), da ih Tailwind pronadje. */
const LAYOUT: Record<number, { grid: string; brand: string }> = {
  2: { grid: 'md:grid-cols-2 lg:grid-cols-5', brand: 'md:col-span-2 lg:col-span-3' },
  3: { grid: 'md:grid-cols-3 lg:grid-cols-5', brand: 'md:col-span-3 lg:col-span-2' },
  4: { grid: 'md:grid-cols-4 lg:grid-cols-6', brand: 'md:col-span-4 lg:col-span-2' },
};

/* Link sa tap zonom od ~28px na telefonu; na desktopu ostaje gusta lista. */
const LINK_CLASS = 'inline-block py-1 md:py-0 text-sm transition-colors hover:text-foreground';

/* comingSoon dolazi od serverskog roditelja (isComingSoon()); tada footer prikazuje samo
   linkove ka stranicama koje su u coming-soon rezimu otvorene. */
const Footer = ({ comingSoon = false }: { comingSoon?: boolean }) => {
  const open = <T extends { href: string }>(links: T[]) =>
    comingSoon ? links.filter((link) => isOpenInComingSoon(link.href)) : links;
  const featureLinks = open(FEATURE_LINKS);
  const navLinks = open(NAV_LINKS);
  const resourceLinks = open(RESOURCE_LINKS);
  const legalLinks = open(LEGAL_LINKS);
  const layout = LAYOUT[2 + (featureLinks.length > 0 ? 1 : 0) + (resourceLinks.length > 0 ? 1 : 0)];
  return (
    <footer className="w-full bg-white border-t border-border py-16 px-6">
      {/* 1120px kao sekcije stranice, da leva ivica footera bude u ravni sa sadrzajem iznad */}
      <div className="max-w-[1120px] mx-auto">

        {/* Main columns. Telefon: brend i Funkcionalnosti preko cele sirine, ostale kolone
            po dve u redu. */}
        <div className={`grid grid-cols-2 gap-x-6 gap-y-10 md:gap-8 mb-12 ${layout.grid}`}>

          {/* Logo and Company Info */}
          <div className={`col-span-2 ${layout.brand}`}>
            <Link href="/" className="flex items-center mb-4 hover:opacity-80 transition-opacity">
              <Image
                src="/images/Odontoa-New-logo-pack-2026/horiyotal_color.png"
                alt="Odontoa Logo"
                width={160}
                height={48}
                className="h-10 w-auto"
                priority
              />
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: '#363d4f' }}>
              {/* nowrap: na uskom telefonu "ordinacije." ne ostaje sama u redu */}
              Softver za vođenje <span className="whitespace-nowrap">stomatološke ordinacije.</span>
              <span className="block">Zakazano. Urađeno. Naplaćeno.</span>
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm" style={{ color: '#979fb4' }}>
                <Mail size={14} />
                <span>{businessConfig.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#979fb4' }}>
                <MapPin size={14} />
                <span>{businessConfig.address.street}, {businessConfig.address.city}</span>
              </div>
            </div>
          </div>

          {/* Funkcionalnosti */}
          {featureLinks.length > 0 && (
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-sm font-medium mb-4" style={{ color: '#979fb4' }}>Funkcionalnosti</h3>
              <ul className="space-y-2 md:space-y-3">
                {featureLinks.map((link) => (
                  <li key={link.href}><Link href={link.href} className={LINK_CLASS} style={{ color: '#363d4f' }}>{link.label}</Link></li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-medium mb-4" style={{ color: '#979fb4' }}>Navigacija</h3>
            <ul className="space-y-2 md:space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}><Link href={link.href} className={LINK_CLASS} style={{ color: '#363d4f' }}>{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          {resourceLinks.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-4" style={{ color: '#979fb4' }}>Resursi</h3>
              <ul className="space-y-2 md:space-y-3">
                {resourceLinks.map((link) => (
                  <li key={link.href}><Link href={link.href} className={LINK_CLASS} style={{ color: '#363d4f' }}>{link.label}</Link></li>
                ))}
              </ul>
            </div>
          )}

          {/* Legal */}
          <div>
            <h3 className="text-sm font-medium mb-4" style={{ color: '#979fb4' }}>Podrška i uslovi</h3>
            <ul className="space-y-2 md:space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}><Link href={link.href} className={LINK_CLASS} style={{ color: '#363d4f' }}>{link.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar: copyright levo, mreze desno. Newsletter je uklonjen za launch
            (nije imao handler ni listu), pa linija ide direktno iznad ove trake. */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: '#505a71' }}>
            © 2026 Odontoa. Sva prava zadržana.
          </p>
          <div className="flex items-center gap-2">
            <a
              href={businessConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white border border-border rounded-xl flex items-center justify-center hover:border-[#6e51e0] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" style={{ color: '#6e51e0' }} />
            </a>
            <a
              href={businessConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white border border-border rounded-xl flex items-center justify-center hover:border-[#6e51e0] transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" style={{ color: '#6e51e0' }} />
            </a>
            <a
              href={businessConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white border border-border rounded-xl flex items-center justify-center hover:border-[#6e51e0] transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" style={{ color: '#6e51e0' }} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
