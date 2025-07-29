import { Button } from "@/components/ui/button";
import { Users, Heart, Shield, Stethoscope, Award, Target, Linkedin, Github, Mail, ArrowRight, Star, Zap, Globe, Code } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#0a0a0a] to-[#1a1a1a] w-full">
      {/* Hero Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#4a9489]/10 to-[#1976D2]/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#4a9489]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#1976D2]/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-screen-xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-[#4a9489]/10 border border-[#4a9489]/20 rounded-full px-6 py-3 mb-8">
              <Star className="w-5 h-5 text-[#4a9489]" />
              <span className="text-[#4a9489] font-medium">Inovativna stomatologija</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              O <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4a9489] to-[#1976D2]">nama</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#a1a1aa] max-w-4xl mx-auto leading-relaxed">
              Odontoa je nastala iz potrebe da se stomatološkim ordinacijama u Srbiji 
              omogući <span className="text-[#4a9489] font-semibold">digitalna transformacija</span> kroz intuitivna i sigurna rešenja.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                  Naša <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4a9489] to-[#1976D2]">misija</span>
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-[#4a9489] to-[#1976D2] rounded-full"></div>
              </div>
              <p className="text-xl text-[#a1a1aa] leading-relaxed">
                Verujemo da svaka stomatološka ordinacija zaslužuje najbolju tehnologiju 
                koja će joj omogućiti da se fokusira na ono što je najvažnije - 
                <span className="text-white font-semibold"> zdravlje i zadovoljstvo pacijenata</span>.
              </p>
              <p className="text-xl text-[#a1a1aa] leading-relaxed">
                Naš cilj je da kroz digitalizaciju procesa unapredimo kvalitet 
                stomatoloških usluga u Srbiji i učinimo ih dostupnijim svim građanima.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button className="bg-gradient-to-r from-[#4a9489] to-[#1976D2] text-white hover:from-[#3d7a71] hover:to-[#1565C0] transition-all duration-300 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Kontaktiraj nas
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" className="border-[#4a9489] text-[#4a9489] hover:bg-[#4a9489] hover:text-white px-8 py-4 rounded-xl transition-all duration-300">
                  Saznaj više
                </Button>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#4a9489] to-[#1976D2] rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <img 
                src="/images/2dentists-smiling.jpg" 
                alt="Stomatolozi u Odontoa sistemu" 
                className="relative rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-[#4a9489]/10 border border-[#4a9489]/20 rounded-full px-6 py-3 mb-8">
              <Zap className="w-5 h-5 text-[#4a9489]" />
              <span className="text-[#4a9489] font-medium">Naše vrednosti</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Vrednosti koje nas <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4a9489] to-[#1976D2]">vode</span>
            </h2>
            <p className="text-xl text-[#a1a1aa] max-w-3xl mx-auto">
              Vrednosti koje nas vode u kreiranju najboljih digitalnih rešenja za zdravstvo
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#262626] border border-[#333] rounded-2xl p-8 hover:border-[#4a9489] hover:shadow-2xl hover:shadow-[#4a9489]/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-[#4a9489] to-[#1976D2] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Fokus na pacijenta</h3>
              <p className="text-[#a1a1aa] text-lg leading-relaxed">
                Svaki aspekt našeg sistema dizajniran je sa ciljem poboljšanja iskustva pacijenata
              </p>
            </div>

            <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#262626] border border-[#333] rounded-2xl p-8 hover:border-[#4a9489] hover:shadow-2xl hover:shadow-[#4a9489]/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-[#4a9489] to-[#1976D2] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Sigurnost podataka</h3>
              <p className="text-[#a1a1aa] text-lg leading-relaxed">
                Najviši standardi zaštite medicinskih podataka i privatnosti pacijenata
              </p>
            </div>

            <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#262626] border border-[#333] rounded-2xl p-8 hover:border-[#4a9489] hover:shadow-2xl hover:shadow-[#4a9489]/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-[#4a9489] to-[#1976D2] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Inovacije</h3>
              <p className="text-[#a1a1aa] text-lg leading-relaxed">
                Kontinuirano unapređujemo tehnologiju kako bismo ostali u koraku sa vremenom
              </p>
            </div>

            <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#262626] border border-[#333] rounded-2xl p-8 hover:border-[#4a9489] hover:shadow-2xl hover:shadow-[#4a9489]/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-[#4a9489] to-[#1976D2] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Stethoscope className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Stručnost</h3>
              <p className="text-[#a1a1aa] text-lg leading-relaxed">
                Naš tim čine stručnjaci iz oblasti stomatologije i informacionih tehnologija
              </p>
            </div>

            <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#262626] border border-[#333] rounded-2xl p-8 hover:border-[#4a9489] hover:shadow-2xl hover:shadow-[#4a9489]/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-[#4a9489] to-[#1976D2] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Timski rad</h3>
              <p className="text-[#a1a1aa] text-lg leading-relaxed">
                Verujemo u snagu timskog rada i saradnje sa stomatolozima iz cele Srbije
              </p>
            </div>

            <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#262626] border border-[#333] rounded-2xl p-8 hover:border-[#4a9489] hover:shadow-2xl hover:shadow-[#4a9489]/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-[#4a9489] to-[#1976D2] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Kvalitet</h3>
              <p className="text-[#a1a1aa] text-lg leading-relaxed">
                Ne kompromitujemo kvalitet - svako rešenje mora biti najbolje moguće
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-[#4a9489]/10 border border-[#4a9489]/20 rounded-full px-6 py-3 mb-8">
              <Users className="w-5 h-5 text-[#4a9489]" />
              <span className="text-[#4a9489] font-medium">Naš tim</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Upoznajte <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4a9489] to-[#1976D2]">Odontoa tim</span>
            </h2>
            <p className="text-xl text-[#a1a1aa] max-w-3xl mx-auto">
              Ljudi koji stoje iza revolucionarne platforme za digitalizaciju stomatologije
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Ognjen Drinić */}
            <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#262626] border border-[#333] rounded-3xl p-8 text-center hover:border-[#4a9489] hover:shadow-2xl hover:shadow-[#4a9489]/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="w-32 h-32 bg-gradient-to-r from-[#4a9489] to-[#1976D2] rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Users className="text-white" size={40} />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#4a9489] rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Ognjen Drinić</h3>
              <p className="text-[#4a9489] font-semibold mb-4 text-lg">Co-Founder & Chief Strategist</p>
              <p className="text-[#a1a1aa] text-base leading-relaxed mb-6">
                Strateški um koji vodi Odontoa ka budućnosti digitalne stomatologije
              </p>
              <div className="flex justify-center gap-3">
                <button className="w-10 h-10 bg-[#333] rounded-full flex items-center justify-center hover:bg-[#4a9489] transition-colors">
                  <Linkedin className="w-5 h-5 text-white" />
                </button>
                <button className="w-10 h-10 bg-[#333] rounded-full flex items-center justify-center hover:bg-[#4a9489] transition-colors">
                  <Mail className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Bojan Antović */}
            <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#262626] border border-[#333] rounded-3xl p-8 text-center hover:border-[#4a9489] hover:shadow-2xl hover:shadow-[#4a9489]/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="w-32 h-32 bg-gradient-to-r from-[#4a9489] to-[#1976D2] rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Target className="text-white" size={40} />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#1976D2] rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Bojan Antović</h3>
              <p className="text-[#4a9489] font-semibold mb-4 text-lg">Co-Founder & Head of Sales</p>
              <p className="text-[#a1a1aa] text-base leading-relaxed mb-6">
                Ekspert za tržište koji gradi mostove između tehnologije i stomatologije
              </p>
              <div className="flex justify-center gap-3">
                <button className="w-10 h-10 bg-[#333] rounded-full flex items-center justify-center hover:bg-[#4a9489] transition-colors">
                  <Linkedin className="w-5 h-5 text-white" />
                </button>
                <button className="w-10 h-10 bg-[#333] rounded-full flex items-center justify-center hover:bg-[#4a9489] transition-colors">
                  <Mail className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Petar Kovačević */}
            <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#262626] border border-[#333] rounded-3xl p-8 text-center hover:border-[#4a9489] hover:shadow-2xl hover:shadow-[#4a9489]/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="w-32 h-32 bg-gradient-to-r from-[#4a9489] to-[#1976D2] rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Award className="text-white" size={40} />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#4a9489] rounded-full flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Petar Kovačević</h3>
              <p className="text-[#4a9489] font-semibold mb-4 text-lg">CTO</p>
              <p className="text-[#a1a1aa] text-base leading-relaxed mb-6">
                Tehnološki lider koji osigurava inovativnost i kvalitet platforme
              </p>
              <div className="flex justify-center gap-3">
                <button className="w-10 h-10 bg-[#333] rounded-full flex items-center justify-center hover:bg-[#4a9489] transition-colors">
                  <Linkedin className="w-5 h-5 text-white" />
                </button>
                <button className="w-10 h-10 bg-[#333] rounded-full flex items-center justify-center hover:bg-[#4a9489] transition-colors">
                  <Github className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Aleksa Kovačević */}
            <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#262626] border border-[#333] rounded-3xl p-8 text-center hover:border-[#4a9489] hover:shadow-2xl hover:shadow-[#4a9489]/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="w-32 h-32 bg-gradient-to-r from-[#4a9489] to-[#1976D2] rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Code className="text-white" size={40} />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#4a9489] rounded-full flex items-center justify-center">
                  <Globe className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Aleksa Kovačević</h3>
              <p className="text-[#4a9489] font-semibold mb-4 text-lg">Software Engineer</p>
              <p className="text-[#a1a1aa] text-base leading-relaxed mb-6">
                Inženjer koji kreira robustna i skalabilna rešenja za zdravstvo
              </p>
              <div className="flex justify-center gap-3">
                <button className="w-10 h-10 bg-[#333] rounded-full flex items-center justify-center hover:bg-[#4a9489] transition-colors">
                  <Github className="w-5 h-5 text-white" />
                </button>
                <button className="w-10 h-10 bg-[#333] rounded-full flex items-center justify-center hover:bg-[#4a9489] transition-colors">
                  <Linkedin className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Uroš Pelić */}
            <div className="group bg-gradient-to-br from-[#1a1a1a] to-[#262626] border border-[#333] rounded-3xl p-8 text-center hover:border-[#4a9489] hover:shadow-2xl hover:shadow-[#4a9489]/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="w-32 h-32 bg-gradient-to-r from-[#4a9489] to-[#1976D2] rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Code className="text-white" size={40} />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#1976D2] rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Uroš Pelić</h3>
              <p className="text-[#4a9489] font-semibold mb-4 text-lg">Software Engineer</p>
              <p className="text-[#a1a1aa] text-base leading-relaxed mb-6">
                Specijalista za sigurnost i performanse zdravstvenih aplikacija
              </p>
              <div className="flex justify-center gap-3">
                <button className="w-10 h-10 bg-[#333] rounded-full flex items-center justify-center hover:bg-[#4a9489] transition-colors">
                  <Github className="w-5 h-5 text-white" />
                </button>
                <button className="w-10 h-10 bg-[#333] rounded-full flex items-center justify-center hover:bg-[#4a9489] transition-colors">
                  <Linkedin className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-screen-xl mx-auto text-center">
          <div className="bg-gradient-to-r from-[#1a1a1a] to-[#262626] border border-[#333] rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4a9489]/10 to-[#1976D2]/10"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                Spremni za <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4a9489] to-[#1976D2]">digitalnu transformaciju</span>?
              </h2>
              <p className="text-xl text-[#a1a1aa] max-w-3xl mx-auto mb-12 leading-relaxed">
                Pridružite se stomatolozima koji već koriste Odontoa sistem i unapredite 
                vašu ordinaciju u digitalnom dobu.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button className="bg-gradient-to-r from-[#4a9489] to-[#1976D2] text-white hover:from-[#3d7a71] hover:to-[#1565C0] transition-all duration-300 font-semibold px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg">
                  Započnite besplatno
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" className="border-[#4a9489] text-[#4a9489] hover:bg-[#4a9489] hover:text-white px-10 py-4 rounded-xl transition-all duration-300 text-lg">
                  Kontaktiraj nas
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 