'use client';

import { Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { businessConfig } from "@/lib/config/business";
import { isSectionHidden } from "@/lib/config/hidden-sections";
import { isOpenInComingSoon } from "@/lib/config/site-mode";

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

/* comingSoon dolazi od serverskog roditelja (isComingSoon()); tada footer prikazuje samo
   linkove ka stranicama koje su u coming-soon rezimu otvorene. */
const Footer = ({ comingSoon = false }: { comingSoon?: boolean }) => {
  const open = <T extends { href: string }>(links: T[]) =>
    comingSoon ? links.filter((link) => isOpenInComingSoon(link.href)) : links;
  const navLinks = open(NAV_LINKS);
  const resourceLinks = open(RESOURCE_LINKS);
  const legalLinks = open(LEGAL_LINKS);
  return (
    <footer className="w-full bg-white border-t border-border py-16 px-6">
      <div className="max-w-screen-xl mx-auto">

        {/* Main columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">

          {/* Logo and Company Info. Kad nema kolone Resursi (sve sekcije sakrivene), brend
              zauzima tri kolone, da Navigacija i Podrska ostanu uz desnu ivicu. */}
          <div className={resourceLinks.length > 0 ? 'col-span-1 md:col-span-2' : 'col-span-1 md:col-span-3'}>
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
              Digitalno rešenje za upravljanje stomatološkim ordinacijama.
              Jednostavno, sigurno i efikasno.
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

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-medium mb-4" style={{ color: '#979fb4' }}>Navigacija</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}><Link href={link.href} className="text-sm transition-colors hover:text-foreground" style={{ color: '#363d4f' }}>{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          {resourceLinks.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-4" style={{ color: '#979fb4' }}>Resursi</h3>
              <ul className="space-y-3">
                {resourceLinks.map((link) => (
                  <li key={link.href}><Link href={link.href} className="text-sm transition-colors hover:text-foreground" style={{ color: '#363d4f' }}>{link.label}</Link></li>
                ))}
              </ul>
            </div>
          )}

          {/* Legal */}
          <div>
            <h3 className="text-sm font-medium mb-4" style={{ color: '#979fb4' }}>Podrška i uslovi</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-sm transition-colors hover:text-foreground" style={{ color: '#363d4f' }}>{link.label}</Link></li>
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
