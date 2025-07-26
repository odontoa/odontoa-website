import { Button } from "@/components/ui/button";
import { Users, Heart, Shield, Stethoscope, Award, Target } from "lucide-react";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'O nama | Odontoa - Digitalna stomatologija',
  description: 'Upoznajte Odontoa tim i našu misiju da digitalizujemo stomatološke ordinacije u Srbiji. Fokus na pacijente, sigurnost i inovacije.',
  keywords: 'Odontoa, o nama, tim, misija, vrednosti, stomatologija, digitalizacija',
  openGraph: {
    title: 'O nama | Odontoa - Digitalna stomatologija',
    description: 'Upoznajte Odontoa tim i našu misiju da digitalizujemo stomatološke ordinacije u Srbiji.',
    url: 'https://odontoa.com/o-nama',
    siteName: 'Odontoa',
    images: [
      {
        url: '/images/2dentists-smiling.jpg',
        width: 1200,
        height: 630,
        alt: 'Odontoa tim - Stomatolozi',
      },
    ],
    locale: 'sr_RS',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'O nama | Odontoa - Digitalna stomatologija',
    description: 'Upoznajte Odontoa tim i našu misiju da digitalizujemo stomatološke ordinacije u Srbiji.',
    images: ['/images/2dentists-smiling.jpg'],
  },
  alternates: {
    canonical: '/o-nama',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#000000] w-full">
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
                <Stethoscope className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Stručnost</h3>
              <p className="text-[#a1a1aa]">
                Naš tim čine stručnjaci iz oblasti stomatologije i informacionih tehnologija
              </p>
            </div>

            <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-8 hover:border-[#4a9489] transition-colors">
              <div className="w-12 h-12 bg-[#4a9489] rounded-lg flex items-center justify-center mb-6">
                <Users className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Timski rad</h3>
              <p className="text-[#a1a1aa]">
                Verujemo u snagu timskog rada i saradnje sa stomatolozima iz cele Srbije
              </p>
            </div>

            <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-8 hover:border-[#4a9489] transition-colors">
              <div className="w-12 h-12 bg-[#4a9489] rounded-lg flex items-center justify-center mb-6">
                <Award className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Kvalitet</h3>
              <p className="text-[#a1a1aa]">
                Ne kompromitujemo kvalitet - svako rešenje mora biti najbolje moguće
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
              Upoznajte ljude koji stoje iza Odontoa platforme
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-8 text-center">
              <div className="w-24 h-24 bg-[#4a9489] rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Ognjen Drinić</h3>
              <p className="text-[#4a9489] mb-4">Osnivač & CEO</p>
              <p className="text-[#a1a1aa] text-sm">
                Stomatolog sa višegodišnjim iskustvom u digitalizaciji zdravstvenih usluga
              </p>
            </div>

            <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-8 text-center">
              <div className="w-24 h-24 bg-[#4a9489] rounded-full flex items-center justify-center mx-auto mb-6">
                <Stethoscope className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Dr. Ana Petrović</h3>
              <p className="text-[#4a9489] mb-4">Medicinski Direktor</p>
              <p className="text-[#a1a1aa] text-sm">
                Specijalista stomatologije sa fokusom na digitalnu transformaciju
              </p>
            </div>

            <div className="bg-[#1a1a1a] border border-[#262626] rounded-2xl p-8 text-center">
              <div className="w-24 h-24 bg-[#4a9489] rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Marko Jovanović</h3>
              <p className="text-[#4a9489] mb-4">CTO</p>
              <p className="text-[#a1a1aa] text-sm">
                Inženjer sa iskustvom u razvoju zdravstvenih informacionih sistema
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 border-t border-[#262626]">
        <div className="max-w-screen-xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Spremni za <span className="text-[#4a9489]">digitalnu transformaciju</span>?
          </h2>
          <p className="text-lg text-[#a1a1aa] max-w-2xl mx-auto mb-8">
            Pridružite se stomatolozima koji već koriste Odontoa sistem i unapredite 
            vašu ordinaciju u digitalnom dobu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#4a9489] text-white hover:bg-[#3d7a71] px-8 py-3">
              Započnite besplatno
            </Button>
            <Button variant="outline" className="border-[#4a9489] text-[#4a9489] hover:bg-[#4a9489] hover:text-white px-8 py-3">
              Kontaktiraj nas
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 