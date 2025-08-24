'use client';

import { Button } from "@/components/ui/button";
import { 
  Users, 
  Heart, 
  ShieldCheck, 
  BrainCircuit, 
  GraduationCap, 
  BadgeCheck, 
  Linkedin, 
  Github, 
  Mail, 
  ArrowRight, 
  Calendar,
  User,
  Zap,
  Globe,
  Code
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";


export default function AboutPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black w-full">
      {/* Hero Section */}
      <section className="w-full pt-32 pb-20 px-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-normal text-white mb-6 leading-tight">
              O nama
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-8">
              Odontoa je nastala iz potrebe da se stomatološkim ordinacijama u Srbiji 
              omogući <span className="text-white font-normal">digitalna transformacija</span> kroz intuitivna i sigurna rešenja.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button className="bg-[#1565C0] text-white hover:bg-[#0D47A1] px-6 py-3 shadow-sm transition-colors duration-200" style={{borderRadius: '8px'}}>
                Kontaktiraj nas
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button className="bg-white text-slate-950 hover:bg-[#4a9489] hover:text-white hover:border-[#4a9489] shadow-sm border border-slate-300 px-6 py-3 transition-colors duration-200" style={{borderRadius: '8px'}}>
                Saznaj više
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-screen-xl mx-auto">
          <div className="md:flex md:flex-row items-center justify-between gap-10">
            <div className="space-y-8 md:w-[60%]">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-6xl font-normal text-white">
                  Naša misija
                </h2>
                <div className="w-20 h-1 bg-[#1565C0] rounded-full"></div>
              </div>
              <p className="text-neutral-400 leading-relaxed">
                Verujemo da svaka stomatološka ordinacija zaslužuje najbolju tehnologiju 
                koja će joj omogućiti da se fokusira na ono što je najvažnije - 
                <span className="text-white font-normal"> zdravlje i zadovoljstvo pacijenata</span>.
              </p>
              <p className="text-neutral-400 leading-relaxed">
                Naš cilj je da kroz digitalizaciju procesa unapredimo kvalitet 
                stomatoloških usluga u Srbiji i učinimo ih dostupnijim svim građanima.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button className="bg-[#1565C0] text-white hover:bg-[#0D47A1] px-6 py-3 shadow-sm transition-colors duration-200" style={{borderRadius: '8px'}}>
                  Kontaktiraj nas
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button className="bg-white text-slate-950 hover:bg-[#4a9489] hover:text-white hover:border-[#4a9489] shadow-sm border border-slate-300 px-6 py-3 transition-colors duration-200" style={{borderRadius: '8px'}}>
                  Saznaj više
                </Button>
              </div>
            </div>
            <div className="relative group md:w-[40%] mt-10 md:mt-0">
              <div className="absolute inset-0 bg-[#1565C0]/20 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <img 
                src="/images/2dentists-smiling.jpg" 
                alt="Stomatolozi u Odontoa sistemu" 
                className="relative rounded-3xl shadow-2xl w-full transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-normal text-white mb-8">
              Vrednosti koje nas vode
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              Vrednosti koje nas vode u kreiranju najboljih digitalnih rešenja za zdravstvo
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                title: "Fokus na pacijenta",
                description: "Svaki aspekt našeg sistema dizajniran je sa ciljem poboljšanja iskustva pacijenata"
              },
              {
                icon: ShieldCheck,
                title: "Sigurnost podataka",
                description: "Najviši standardi zaštite medicinskih podataka i privatnosti pacijenata"
              },
              {
                icon: BrainCircuit,
                title: "Inovacije",
                description: "Kontinuirano unapređujemo tehnologiju kako bismo ostali u koraku sa vremenom"
              },
              {
                icon: GraduationCap,
                title: "Stručnost",
                description: "Naš tim čine stručnjaci iz oblasti stomatologije i informacionih tehnologija"
              },
              {
                icon: Users,
                title: "Timski rad",
                description: "Verujemo u snagu timskog rada i saradnje sa stomatolozima iz cele Srbije"
              },
              {
                icon: BadgeCheck,
                title: "Kvalitet",
                description: "Ne kompromitujemo kvalitet - svako rešenje mora biti najbolje moguće"
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative group block p-2 h-full w-full"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <AnimatePresence>
                  {hoveredIndex === idx && (
                    <motion.span
                      className="absolute inset-0 h-full w-full bg-[#1565C0]/20 block rounded-2xl"
                      layoutId="hoverBackground"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: { duration: 0.15 },
                      }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.15, delay: 0.2 },
                      }}
                    />
                  )}
                </AnimatePresence>
                <div className="rounded-2xl h-full w-full p-4 overflow-hidden bg-neutral-900 border border-transparent group-hover:border-[#1565C0]/30 relative z-20">
                  <div className="relative z-50">
                    <div className="p-4">
                      <div className="bg-[#1565C0]/10 rounded-xl p-3 w-fit mb-6 group-hover:bg-[#1565C0]/20 transition-colors duration-200">
                        <item.icon className="text-[#1565C0] stroke-[1.5]" size={28} />
                      </div>
                      <h3 className="text-2xl font-normal text-white mb-4">{item.title}</h3>
                      <p className="text-neutral-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-normal text-white mb-8">
              Upoznajte Odontoa tim
            </h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              Ljudi koji stoje iza revolucionarne platforme za digitalizaciju stomatologije
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                          {/* Ognjen Drinić */}
              <div className="rounded-xl bg-neutral-900 p-6 flex flex-col items-center text-center gap-2 shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300">
                <div className="bg-[#1565C0]/10 rounded-xl p-3 w-fit mb-4">
                  <Calendar className="text-[#1565C0] stroke-[1.5]" size={40} />
                </div>
                <h3 className="text-2xl font-normal text-white mb-2">Ognjen Drinić</h3>
                <p className="text-[#1565C0] font-normal mb-4">Co-Founder & Chief Strategist</p>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                  Strateški um koji vodi Odontoa ka budućnosti digitalne stomatologije
                </p>
                <div className="flex justify-center gap-3">
                  <button className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-[#1565C0] transition-colors">
                    <Linkedin className="w-5 h-5 text-white" />
                  </button>
                  <button className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-[#1565C0] transition-colors">
                    <Mail className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

                          {/* Bojan Antović */}
              <div className="rounded-xl bg-neutral-900 p-6 flex flex-col items-center text-center gap-2 shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300">
                <div className="bg-[#1565C0]/10 rounded-xl p-3 w-fit mb-4">
                  <User className="text-[#1565C0] stroke-[1.5]" size={40} />
                </div>
                <h3 className="text-2xl font-normal text-white mb-2">Bojan Antović</h3>
                <p className="text-[#1565C0] font-normal mb-4">Co-Founder & Head of Sales</p>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                  Ekspert za tržište koji gradi mostove između tehnologije i stomatologije
                </p>
                <div className="flex justify-center gap-3">
                  <button className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-[#1565C0] transition-colors">
                    <Linkedin className="w-5 h-5 text-white" />
                  </button>
                  <button className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-[#1565C0] transition-colors">
                    <Mail className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

                          {/* Petar Kovačević */}
              <div className="rounded-xl bg-neutral-900 p-6 flex flex-col items-center text-center gap-2 shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300">
                <div className="bg-[#1565C0]/10 rounded-xl p-3 w-fit mb-4">
                  <Code className="text-[#1565C0] stroke-[1.5]" size={40} />
                </div>
                <h3 className="text-2xl font-normal text-white mb-2">Petar Kovačević</h3>
                <p className="text-[#1565C0] font-normal mb-4">CTO</p>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                  Tehnološki lider koji osigurava inovativnost i kvalitet platforme
                </p>
                <div className="flex justify-center gap-3">
                  <button className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-[#1565C0] transition-colors">
                    <Linkedin className="w-5 h-5 text-white" />
                  </button>
                  <button className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-[#1565C0] transition-colors">
                    <Github className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

                          {/* Aleksa Kovačević */}
              <div className="rounded-xl bg-neutral-900 p-6 flex flex-col items-center text-center gap-2 shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300">
                <div className="bg-[#1565C0]/10 rounded-xl p-3 w-fit mb-4">
                  <Zap className="text-[#1565C0] stroke-[1.5]" size={40} />
                </div>
                <h3 className="text-2xl font-normal text-white mb-2">Aleksa Kovačević</h3>
                <p className="text-[#1565C0] font-normal mb-4">Software Engineer</p>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                  Inženjer koji kreira robustna i skalabilna rešenja za zdravstvo
                </p>
                <div className="flex justify-center gap-3">
                  <button className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-[#1565C0] transition-colors">
                    <Github className="w-5 h-5 text-white" />
                  </button>
                  <button className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-[#1565C0] transition-colors">
                    <Linkedin className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

                          {/* Uroš Pelić */}
              <div className="rounded-xl bg-neutral-900 p-6 flex flex-col items-center text-center gap-2 shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300">
                <div className="bg-[#1565C0]/10 rounded-xl p-3 w-fit mb-4">
                  <Globe className="text-[#1565C0] stroke-[1.5]" size={40} />
                </div>
                <h3 className="text-2xl font-normal text-white mb-2">Uroš Pelić</h3>
                <p className="text-[#1565C0] font-normal mb-4">Software Engineer</p>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                  Specijalista za sigurnost i performanse zdravstvenih aplikacija
                </p>
                <div className="flex justify-center gap-3">
                  <button className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-[#1565C0] transition-colors">
                    <Github className="w-5 h-5 text-white" />
                  </button>
                  <button className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-[#1565C0] transition-colors">
                    <Linkedin className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-900 py-20 px-4 relative">
        <div className="max-w-screen-xl mx-auto text-center">
          <h2 className="text-4xl font-normal text-white mb-8">
            Spremni za digitalnu transformaciju?
          </h2>
          <p className="text-neutral-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            Pridružite se stomatolozima koji već koriste Odontoa sistem i unapredite 
            vašu ordinaciju u digitalnom dobu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#1565C0] text-white hover:bg-[#0D47A1] px-6 py-3 shadow-sm transition-colors duration-200" style={{borderRadius: '8px'}}>
              Započnite besplatno
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button className="bg-white text-slate-950 hover:bg-[#4a9489] hover:text-white hover:border-[#4a9489] shadow-sm border border-slate-300 px-6 py-3 transition-colors duration-200" style={{borderRadius: '8px'}}>
              Kontaktiraj nas
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 