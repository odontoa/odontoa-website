import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#000000] w-full">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-24 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="text-[#4a9489]">Kontakt</span>
            </h1>
            <p className="text-xl text-[#a1a1aa] max-w-3xl mx-auto leading-relaxed">
              Kontaktirajte nas već danas i saznajte kako Odontoa može transformisati vašu stomatološku ordinaciju.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6 border-t border-[#262626]">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Form */}
            <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Pošaljite nam poruku</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Ime i prezime</label>
                    <Input 
                      placeholder="Vaše ime i prezime"
                      className="bg-[#0a0a0a] border-[#262626] text-white placeholder:text-[#717179] focus:border-[#4a9489]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Email adresa</label>
                    <Input 
                      type="email"
                      placeholder="vas.email@primer.com"
                      className="bg-[#0a0a0a] border-[#262626] text-white placeholder:text-[#717179] focus:border-[#4a9489]"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Telefon</label>
                    <Input 
                      placeholder="+381 60 123 4567"
                      className="bg-[#0a0a0a] border-[#262626] text-white placeholder:text-[#717179] focus:border-[#4a9489]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Naziv ordinacije</label>
                    <Input 
                      placeholder="Naziv vaše ordinacije"
                      className="bg-[#0a0a0a] border-[#262626] text-white placeholder:text-[#717179] focus:border-[#4a9489]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Predmet</label>
                  <Input 
                    placeholder="O čemu želite da razgovarate?"
                    className="bg-[#0a0a0a] border-[#262626] text-white placeholder:text-[#717179] focus:border-[#4a9489]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Poruka</label>
                  <Textarea 
                    placeholder="Opišite kako možemo da vam pomognemo..."
                    rows={6}
                    className="bg-[#0a0a0a] border-[#262626] text-white placeholder:text-[#717179] focus:border-[#4a9489] resize-none"
                  />
                </div>

                <Button className="w-full bg-[#1976D2] text-[#FFFFFF] hover:bg-[#1565C0] transition-colors duration-200 font-semibold py-3" style={{borderRadius: '8px'}}>
                  <Send className="mr-2" size={20} />
                  Pošalji poruku
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Kontakt informacije</h2>
                <p className="text-lg text-[#a1a1aa] leading-relaxed mb-8">
                  Naš tim je dostupan da odgovori na sva vaša pitanja i pomogne vam da donesete najbolju odluku za vašu ordinaciju.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#1976D2] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
                    <p className="text-[#a1a1aa]">kontakt@odontoa.rs</p>
                    <p className="text-[#a1a1aa]">podrska@odontoa.rs</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#1976D2] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Telefon</h3>
                    <p className="text-[#a1a1aa]">+381 60 123 4567</p>
                    <p className="text-[#a1a1aa]">+381 11 123 4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#1976D2] rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Adresa</h3>
                    <p className="text-[#a1a1aa]">Knez Mihailova 42/5</p>
                    <p className="text-[#a1a1aa]">11000 Beograd, Srbija</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#1976D2] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Radno vreme</h3>
                    <p className="text-[#a1a1aa]">Ponedeljak - Petak: 09:00 - 17:00</p>
                    <p className="text-[#a1a1aa]">Subota: 10:00 - 14:00</p>
                    <p className="text-[#a1a1aa]">Nedelja: Zatvoreno</p>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Želite demo prezentaciju?</h3>
                <p className="text-[#a1a1aa] mb-6">
                  Zakažite besplatnu demo prezentaciju i vidite kako Odontoa može poboljšati rad vaše ordinacije.
                </p>
                <Button className="w-full bg-[#4a9489] text-white hover:bg-[#3a7a6f] transition-colors duration-200 font-semibold" style={{borderRadius: '8px'}}>
                  Zakaži demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 border-t border-[#262626]">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Često postavljana <span className="text-[#4a9489]">pitanja</span>
            </h2>
            <p className="text-lg text-[#a1a1aa] max-w-2xl mx-auto">
              Odgovori na najčešća pitanja o Odontoa sistemu
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-white mb-4">
                Koliko dugo traje implementacija sistema?
              </h3>
              <p className="text-[#a1a1aa]">
                Implementacija Odontoa sistema obično traje između 1-2 nedelje, 
                uključujući obuku osoblja i migraciju postojećih podataka.
              </p>
            </div>

            <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-white mb-4">
                Da li su moji podaci sigurni?
              </h3>
              <p className="text-[#a1a1aa]">
                Apsolutno. Koristimo najnovije standarde enkripcije i sigurnosti 
                podataka koji su u skladu sa GDPR propisima.
              </p>
            </div>

            <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-white mb-4">
                Mogu li pristupiti sistemu sa mobilnog telefona?
              </h3>
              <p className="text-[#a1a1aa]">
                Da, Odontoa je potpuno responsivna i možete je koristiti na bilo 
                kom uređaju - računaru, tabletu ili mobilnom telefonu.
              </p>
            </div>

            <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-white mb-4">
                Kakva je podrška nakon implementacije?
              </h3>
              <p className="text-[#a1a1aa]">
                Pružamo 24/7 tehničku podršku, redovne ažuriranja sistema i 
                kontinuiranu obuku za nove funkcionalnosti.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage; 