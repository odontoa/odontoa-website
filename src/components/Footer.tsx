import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#0a0a0a] border-t border-[#262626] py-16 px-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src="/odontoa-logo1.png" 
                alt="Odontoa Logo" 
                className="h-9 w-auto mr-3"
              />
              <div className="text-white font-bold text-xl">Odontoa</div>
            </div>
            <p className="text-[#a1a1aa] text-sm leading-relaxed mb-6 max-w-sm">
              Digitalno rešenje za upravljanje stomatološkim ordinacijama. 
              Jednostavno, sigurno i efikasno vođenje vaše prakse.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2 text-[#a1a1aa] text-sm">
                <Mail size={16} />
                <span>kontakt@odontoa.rs</span>
              </div>
              <div className="flex items-center space-x-2 text-[#a1a1aa] text-sm">
                <Phone size={16} />
                <span>+381 60 123 4567</span>
              </div>
              <div className="flex items-center space-x-2 text-[#a1a1aa] text-sm">
                <MapPin size={16} />
                <span>Knez Mihailova 42/5, Beograd</span>
              </div>
            </div>

            <p className="text-[#717179] text-xs">
              © 2025 Odontoa. Sva prava zadržana.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Navigacija</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={scrollToTop}
                  className="text-[#a1a1aa] text-sm hover:text-white transition-colors"
                >
                  Početna strana
                </button>
              </li>
              <li><a href="/o-nama" className="text-[#a1a1aa] text-sm hover:text-white transition-colors">O nama</a></li>
              <li><a href="/kontakt" className="text-[#a1a1aa] text-sm hover:text-white transition-colors">Kontakt</a></li>
              <li><a href="/blogovi" className="text-[#a1a1aa] text-sm hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Support & Legal Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Podrška i pravno</h3>
            <ul className="space-y-2">
              <li><a href="/pomoc" className="text-[#a1a1aa] text-sm hover:text-white transition-colors">Pomoć</a></li>
              <li><a href="/demo" className="text-[#a1a1aa] text-sm hover:text-white transition-colors">Demo</a></li>
              <li><a href="/privatnost" className="text-[#a1a1aa] text-sm hover:text-white transition-colors">Politika privatnosti</a></li>
              <li><a href="/uslovi" className="text-[#a1a1aa] text-sm hover:text-white transition-colors">Uslovi korišćenja</a></li>
              <li><a href="/gdpr" className="text-[#a1a1aa] text-sm hover:text-white transition-colors">GDPR</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-[#262626] pt-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-white font-semibold text-lg mb-2">
                Prijavite se na naš newsletter
              </h3>
              <p className="text-[#a1a1aa] text-sm">
                Redovno dobijajte korisne savete o digitalizaciji stomatoloških ordinacija
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Vaša email adresa"
                className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#262626] rounded-lg text-white placeholder:text-[#717179] focus:outline-none focus:border-[#4a9489] text-sm"
              />
              <Button className="bg-[#1976D2] text-white hover:bg-[#1565C0] transition-colors duration-200 font-semibold px-6 py-3" style={{borderRadius: '8px'}}>
                Prijavite se
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-[#262626] flex flex-col md:flex-row items-center justify-between">
          <div className="text-[#717179] text-xs mb-4 md:mb-0">
            Napravljeno sa ❤️ za stomatološke ordinacije u Srbiji
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Social Media Links */}
            <div className="flex items-center space-x-2">
              <a 
                href="https://www.linkedin.com/company/odontoa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-[#1a1a1a] border border-[#262626] rounded-lg flex items-center justify-center hover:bg-[#262626] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-[#a1a1aa]" />
              </a>

              <a 
                href="https://www.youtube.com/@odontoa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-[#1a1a1a] border border-[#262626] rounded-lg flex items-center justify-center hover:bg-[#262626] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4 text-[#a1a1aa]" />
              </a>

              <a 
                href="https://www.facebook.com/odontoa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-[#1a1a1a] border border-[#262626] rounded-lg flex items-center justify-center hover:bg-[#262626] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-[#a1a1aa]" />
              </a>

              <a 
                href="https://www.instagram.com/odontoa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-[#1a1a1a] border border-[#262626] rounded-lg flex items-center justify-center hover:bg-[#262626] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-[#a1a1aa]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
