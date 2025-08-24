'use client';

import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-background border-t border-border py-16 px-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center mb-4 hover:opacity-80 transition-opacity">
              <img 
                src="/odontoa-logo1.png" 
                alt="Odontoa Logo" 
                className="h-9 w-auto mr-3"
              />
              <div className="text-foreground font-bold text-xl">Odontoa</div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
              Digitalno rešenje za upravljanje stomatološkim ordinacijama. 
              Jednostavno, sigurno i efikasno vođenje vaše prakse.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                <Mail size={16} />
                <span>kontakt@odontoa.rs</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                <Phone size={16} />
                <span>+381 60 123 4567</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                <MapPin size={16} />
                <span>Krunska 46, Beograd</span>
              </div>
            </div>

            <p className="text-muted-foreground/70 text-xs">
              © 2025 Odontoa. Sva prava zadržana.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-foreground font-semibold text-sm mb-4">Navigacija</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={scrollToTop}
                  className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                >
                  Početna strana
                </button>
              </li>
              <li><Link href="/o-nama" className="text-muted-foreground text-sm hover:text-foreground transition-colors">O nama</Link></li>
              <li><Link href="/kontakt" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Kontakt</Link></li>
              <li><Link href="/blog" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Support & Legal Links */}
          <div>
            <h3 className="text-foreground font-semibold text-sm mb-4">Podrška i pravno</h3>
            <ul className="space-y-2">
              <li><Link href="/pomoc" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Pomoć</Link></li>
              <li><Link href="/demo" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Demo</Link></li>
              <li><Link href="/privatnost" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Politika privatnosti</Link></li>
              <li><Link href="/uslovi" className="text-muted-foreground text-sm hover:text-foreground transition-colors">Uslovi korišćenja</Link></li>
              <li><Link href="/gdpr" className="text-muted-foreground text-sm hover:text-foreground transition-colors">GDPR</Link></li>
              <li><Link href="/admin-panel" className="text-muted-foreground/70 text-xs hover:text-muted-foreground transition-colors">Admin</Link></li>
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
              <Button className="bg-primary text-white hover:bg-primary/80 transition-colors duration-200 font-semibold px-6 py-3" style={{borderRadius: '8px'}}>
                Prijavite se
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between">
          <div className="text-muted-foreground/70 text-xs mb-4 md:mb-0">
            Napravljeno sa ❤️ za stomatološke ordinacije u Srbiji
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Social Media Links */}
            <div className="flex items-center space-x-2">
              <a 
                href="https://www.linkedin.com/company/odontoa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-background border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-muted-foreground" />
              </a>

              <a 
                href="https://www.youtube.com/@odontoa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-background border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4 text-muted-foreground" />
              </a>

              <a 
                href="https://www.facebook.com/odontoa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-background border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-muted-foreground" />
              </a>

              <a 
                href="https://www.instagram.com/odontoa" 
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
