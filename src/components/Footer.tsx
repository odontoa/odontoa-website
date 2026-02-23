'use client';

import { Button } from "@/components/ui/button";
import { Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { businessConfig } from "@/lib/config/business";

const Footer = () => {
  return (
    <footer className="w-full bg-background border-t border-border py-16 px-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Logo and Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center mb-4 hover:opacity-80 transition-opacity">
              <Image 
                src="/images/Odontoa-New-logo-pack-2026/horiyotal_color.png" 
                alt="Odontoa Logo" 
                width={160}
                height={48}
                className="h-12 w-auto"
                priority
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
              Digitalno rešenje za upravljanje stomatološkim ordinacijama. 
              Jednostavno, sigurno i efikasno vođenje vaše prakse.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                <Mail size={16} />
                <span>{businessConfig.email}</span>
              </div>
              {/* Telefon sakriven dok se ne registruje office broj */}
              {/* <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                <Phone size={16} />
                <span>{businessConfig.phone}</span>
              </div> */}
              <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                <MapPin size={16} />
                <span>{businessConfig.address.street}, {businessConfig.address.city}</span>
              </div>
            </div>

            <p className="text-muted-foreground/70 text-xs">
              © 2026 Odontoa. Sva prava zadržana.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-foreground font-semibold text-sm mb-4">Navigacija</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Početna strana</Link></li>
              <li><Link href="/o-nama" className="text-muted-foreground text-sm hover:text-foreground transition-colors">O nama</Link></li>
              <li><Link href="/kontakt" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Kontakt</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-foreground font-semibold text-sm mb-4">Resursi</h3>
            <ul className="space-y-2">
              <li><Link href="/blogovi" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="/recnik" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Rečnik</Link></li>
            </ul>
          </div>

          {/* Support & Legal Links */}
          <div>
            <h3 className="text-foreground font-semibold text-sm mb-4">Podrška i uslovi</h3>
            <ul className="space-y-2">
              <li><Link href="/pomoc-i-pravno#pomoc" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Pomoć</Link></li>
              <li><Link href="/politika-privatnosti" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Politika privatnosti</Link></li>
              <li><Link href="/uslovi-koriscenja" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Uslovi korišćenja</Link></li>
              <li><Link href="/gdpr" className="text-muted-foreground text-sm hover:text-foreground transition-colors">GDPR</Link></li>
              <li><Link href="/demo" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Demo</Link></li>
              <li><Link href="/admin-panel" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/70 text-xs hover:text-muted-foreground transition-colors">Admin</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-border pt-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-foreground font-semibold text-lg mb-2">
                Prijavite se na naš newsletter
              </h3>
              <p className="text-muted-foreground text-sm">
                Redovno dobijajte korisne savete o digitalizaciji stomatoloških ordinacija
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Vaša email adresa"
                className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm"
              />
              <Button variant="pillPrimary" size="pill">
                Prijavite se
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom section - social links */}
        <div className="pt-8 border-t border-border flex justify-end">
          <div className="flex items-center space-x-4">
            {/* Social Media Links */}
            <div className="flex items-center space-x-2">
              <a 
                href={businessConfig.social.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-background border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-muted-foreground" />
              </a>

              <a 
                href={businessConfig.social.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-background border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-muted-foreground" />
              </a>

              <a 
                href={businessConfig.social.instagram}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-background border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-muted-foreground" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
