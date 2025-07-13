import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Users, Heart, Shield, Stethoscope, Award, Target } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#000000] w-full">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-24 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              O <span className="text-[#4a9489]">nama</span>
            </h1>
            <p className="text-xl text-[#a1a1aa] max-w-3xl mx-auto leading-relaxed">
              Odontoa je nastala iz potrebe da se stomatološkim ordinacijama u Srbiji 
              omogući digitalna transformacija kroz intuitivna i sigurna rešenja.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 border-t border-[#262626]">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Naša <span className="text-[#4a9489]">misija</span>
              </h2>
              <p className="text-lg text-[#a1a1aa] leading-relaxed mb-6">
                Verujemo da svaka stomatološka ordinacija zaslužuje najbolju tehnologiju 
                koja će joj omogućiti da se fokusira na ono što je najvažnije - zdravlje 
                i zadovoljstvo pacijenata.
              </p>
              <p className="text-lg text-[#a1a1aa] leading-relaxed mb-8">
                Naš cilj je da kroz digitalizaciju procesa unapredimo kvalitet 
                stomatoloških usluga u Srbiji i učinimo ih dostupnijim svim građanima.
              </p>
              <Button className="bg-[#1976D2] text-[#FFFFFF] hover:bg-[#1565C0] transition-colors duration-200 font-semibold shadow-sm px-8 py-3" style={{borderRadius: '8px'}}>
                Kontaktiraj nas
              </Button>
            </div>
            <div className="relative">
              <img 
                src="/images/2dentists-smiling.jpg" 
                alt="Stomatolozi u Odontoa sistemu" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-6 border-t border-[#262626]">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Naše <span className="text-[#4a9489]">vrednosti</span>
            </h2>
            <p className="text-lg text-[#a1a1aa] max-w-2xl mx-auto">
              Vrednosti koje nas vode u kreiranju najboljih digitalnih rešenja za zdravstvo
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-8 hover:border-[#4a9489] transition-colors">
              <div className="w-12 h-12 bg-[#4a9489] rounded-lg flex items-center justify-center mb-6">
                <Heart className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Fokus na pacijenta</h3>
              <p className="text-[#a1a1aa]">
                Svaki aspekt našeg sistema dizajniran je sa ciljem poboljšanja iskustva pacijenata
              </p>
            </div>

            <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-8 hover:border-[#4a9489] transition-colors">
              <div className="w-12 h-12 bg-[#4a9489] rounded-lg flex items-center justify-center mb-6">
                <Shield className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Sigurnost podataka</h3>
              <p className="text-[#a1a1aa]">
                Najviši standardi zaštite medicinskih podataka i privatnosti pacijenata
              </p>
            </div>

            <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-8 hover:border-[#4a9489] transition-colors">
              <div className="w-12 h-12 bg-[#4a9489] rounded-lg flex items-center justify-center mb-6">
                <Target className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Inovacije</h3>
              <p className="text-[#a1a1aa]">
                Kontinuirano unapređujemo tehnologiju kako bismo ostali u koraku sa vremenom
              </p>
            </div>

            <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-8 hover:border-[#4a9489] transition-colors">
              <div className="w-12 h-12 bg-[#4a9489] rounded-lg flex items-center justify-center mb-6">
                <Users className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Partnerstvo</h3>
              <p className="text-[#a1a1aa]">
                Gradimo dugoročne partnerske odnose sa našim klijentima
              </p>
            </div>

            <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-8 hover:border-[#4a9489] transition-colors">
              <div className="w-12 h-12 bg-[#4a9489] rounded-lg flex items-center justify-center mb-6">
                <Stethoscope className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Medicinska ekspertiza</h3>
              <p className="text-[#a1a1aa]">
                Razumemo specifičnosti rada stomatoloških ordinacija iz prve ruke
              </p>
            </div>

            <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-8 hover:border-[#4a9489] transition-colors">
              <div className="w-12 h-12 bg-[#4a9489] rounded-lg flex items-center justify-center mb-6">
                <Award className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Kvalitet</h3>
              <p className="text-[#a1a1aa]">
                Težimo izvrsnosti u svakom segmentu našeg rada i proizvoda
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6 border-t border-[#262626]">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Naš <span className="text-[#4a9489]">tim</span>
            </h2>
            <p className="text-lg text-[#a1a1aa] max-w-2xl mx-auto">
              Stručnjaci sa dugogodišnjim iskustvom u oblasti medicine i tehnologije
            </p>
          </div>
          
          <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-semibold text-white mb-6">
                Iskustvo koje možete da verujete
              </h3>
              <p className="text-lg text-[#a1a1aa] leading-relaxed mb-8">
                Naš tim čine stručnjaci sa dugogodišnjim iskustvom u oblasti informacionih 
                tehnologija i medicinskih sistema. Kroz blisko sarađivanje sa stomatološkim 
                ordinacijama širom Srbije, razvili smo duboko razumevanje potreba i izazova 
                sa kojima se susreću zdravstveni radnici u svakodnevnom radu.
              </p>
              <p className="text-lg text-[#a1a1aa] leading-relaxed">
                Kombinujemo tehnološku ekspertizu sa praktičnim znanjem o radu stomatoloških 
                ordinacija kako bismo kreirali rešenja koja stvarno donose vrednost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 border-t border-[#262626]">
        <div className="max-w-screen-xl mx-auto">
          <div className="bg-gradient-to-r from-[#1976D2] to-[#4a9489] rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Spremni ste da se pridružite Odontoa porodici?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Kontaktirajte nas danas i saznajte kako možemo pomoći vašoj ordinaciji 
              da postane efikasnija i modernija.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-[#1976D2] hover:bg-gray-100 transition-colors duration-200 font-semibold px-8 py-3" style={{borderRadius: '8px'}}>
                Kontaktiraj nas
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#1976D2] transition-colors duration-200 font-semibold px-8 py-3" style={{borderRadius: '8px'}}>
                Zakaži demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage; 