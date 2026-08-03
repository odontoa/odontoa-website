'use client';

import { Button } from "@/components/ui/button";
import { Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { businessConfig } from "@/lib/config/business";

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-border py-16 px-6">
      <div className="max-w-screen-xl mx-auto">

        {/* Main columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">

          {/* Logo and Company Info */}
          <div className="col-span-1 md:col-span-2">
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
              <li><Link href="/" className="text-sm transition-colors hover:text-foreground" style={{ color: '#363d4f' }}>Početna strana</Link></li>
              <li><Link href="/o-nama" className="text-sm transition-colors hover:text-foreground" style={{ color: '#363d4f' }}>O nama</Link></li>
              <li><Link href="/kontakt" className="text-sm transition-colors hover:text-foreground" style={{ color: '#363d4f' }}>Kontakt</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-medium mb-4" style={{ color: '#979fb4' }}>Resursi</h3>
            <ul className="space-y-3">
              <li><Link href="/blogovi" className="text-sm transition-colors hover:text-foreground" style={{ color: '#363d4f' }}>Blog</Link></li>
              <li><Link href="/recnik" className="text-sm transition-colors hover:text-foreground" style={{ color: '#363d4f' }}>Rečnik</Link></li>
              <li><Link href="/alati" className="text-sm transition-colors hover:text-foreground" style={{ color: '#363d4f' }}>Besplatni alati</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-medium mb-4" style={{ color: '#979fb4' }}>Podrška i uslovi</h3>
            <ul className="space-y-3">
              <li><Link href="/pomoc-i-pravno#pomoc" className="text-sm transition-colors hover:text-foreground" style={{ color: '#363d4f' }}>Pomoć</Link></li>
              <li><Link href="/politika-privatnosti" className="text-sm transition-colors hover:text-foreground" style={{ color: '#363d4f' }}>Politika privatnosti</Link></li>
              <li><Link href="/uslovi-koriscenja" className="text-sm transition-colors hover:text-foreground" style={{ color: '#363d4f' }}>Uslovi korišćenja</Link></li>
              <li><Link href="/gdpr" className="text-sm transition-colors hover:text-foreground" style={{ color: '#363d4f' }}>GDPR</Link></li>
              <li><Link href="/demo" className="text-sm transition-colors hover:text-foreground" style={{ color: '#363d4f' }}>Demo</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-border pt-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: '#060b13' }}>
                Budite u toku
              </h3>
              <p className="text-sm" style={{ color: '#979fb4' }}>
                Saveti i vesti iz sveta digitalne stomatologije, jednom mesečno.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Vaš email"
                className="flex-1 px-5 py-3 bg-white border border-border rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#6e51e0] text-sm shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-colors"
              />
              <Button variant="pillAccent" size="pill">
                Prijavi se
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom bar — copyright left, socials right */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
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
