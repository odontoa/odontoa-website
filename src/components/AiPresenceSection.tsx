'use client';

import { Button } from "@/components/ui/button";
import { Globe, Bell, TrendingUp, Zap, BarChart3, MousePointer, Calendar, XCircle, Trophy, Play, Wifi, Building2, Shield } from "lucide-react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AiPresenceSection = () => {
  return <div className="w-full min-h-screen relative py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.h2 
            className="text-4xl md:text-[44px] font-bold text-white leading-[52px] mb-8 max-w-[620px] mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            Pametni uvidi. Brže odluke. Više posla.
          </motion.h2>
          <motion.p 
            className="text-[#717179] text-xl font-medium leading-[26px] mb-12 max-w-[600px] mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Odontoa analizira ključne podatke tvoje ordinacije u realnom vremenu — od zakazivanja do profita. Vi samo gledate kako sve funkcioniše.
          </motion.p>
          <div className="flex gap-4 justify-center">
            <Button variant="default" className="bg-[#1565C0] text-white hover:bg-[#0D47A1] px-8 py-3 transition-colors duration-200" style={{borderRadius: '8px'}}>
              Isprobaj odmah – bez kartice
            </Button>
            <Button className="bg-[#171717] text-white hover:bg-[#4a9489] px-8 py-3 shadow-sm transition-colors duration-200" style={{borderRadius: '8px'}}>
              Pogledaj kako radi u praksi
            </Button>
          </div>
        </div>

        {/* First Content Section - Revenue Analysis */}
        <div className="border-t border-l border-r border-[#252525] mb-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left Image */}
            <div className="w-full lg:w-1/2 relative group cursor-pointer overflow-visible">
              <div className="relative overflow-visible rounded-xl">
                <img alt="Sentiment Analysis Dashboard" className="w-full h-[403px] object-cover transition-all duration-500 ease-out group-hover:scale-105 rounded-xl" src="/images/d7f17d89-beef-45d8-9a70-5875feaa7be2.jpg" />
                
                {/* Dashboard image that expands to show full content */}
                <div className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out group-hover:z-50 overflow-visible">
                  <img 
                    alt="Analiza prodaje i prihoda dashboard" 
                    className="max-w-[85%] max-h-[85%] object-contain transition-all duration-500 ease-out group-hover:scale-110 group-hover:brightness-110 group-hover:contrast-105 rounded-lg shadow-xl group-hover:shadow-2xl group-hover:shadow-[#4a9489]/50" 
                    src="/images/prodaja2.png"
                    style={{
                      filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.4))',
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      transformOrigin: 'center center'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="w-full lg:w-1/2 px-4">
              <div className="mb-8">
                <span className="text-[#4a9489] text-sm uppercase tracking-widest font-semibold mb-2 block">Analitika</span>
                <motion.h3 
                  className="text-white text-4xl font-bold leading-[44px] mb-4 flex items-center gap-2"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  📈 Analiza prihoda i tretmana
                </motion.h3>
                <motion.p 
                  className="text-[#717179] text-lg font-medium leading-[23.4px]"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Odmah vidite koji tretmani donose najviše prihoda, kako se menja promet po mesecima, i gde ima prostora za rast.
                </motion.p>
              </div>

              {/* Feature List */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Zap size={20} className="text-[#EB894C] flex-shrink-0" />
                  <span className="text-white text-base font-medium">Prihodi po tretmanu i lekaru</span>
                </div>
                <div className="flex items-center gap-4">
                  <Zap size={20} className="text-[#EB894C] flex-shrink-0" />
                  <span className="text-white text-base font-medium">Rentabilnost u realnom vremenu</span>
                </div>
                <div className="flex items-center gap-4">
                  <Zap size={20} className="text-[#EB894C] flex-shrink-0" />
                  <span className="text-white text-base font-medium">Predikcija na osnovu prethodnih meseci</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Content Section - Smart Scheduling */}
        <div className="border-t border-l border-r border-[#252525] mb-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 pt-6 lg:pt-0 px-4">
              <div className="mb-8">
                <span className="text-[#4a9489] text-sm uppercase tracking-widest font-semibold mb-2 block">Zakazivanje</span>
                <motion.h3 
                  className="text-white text-4xl font-bold leading-[44px] mb-4 flex items-center gap-2"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  📅 Pametnije zakazivanje termina
                </motion.h3>
                <motion.p 
                  className="text-[#717179] text-lg font-medium leading-[23.4px]"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Odontoa automatski predlaže optimalne termine u skladu sa trajanjem tretmana, zauzetošću tima i dostupnim resursima.
                </motion.p>
              </div>

              {/* Feature List */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Calendar size={20} className="text-[#797BEC] flex-shrink-0" />
                  <span className="text-white text-base font-medium">Predlozi termina u realnom vremenu</span>
                </div>
                <div className="flex items-center gap-4">
                  <Bell size={20} className="text-[#797BEC] flex-shrink-0" />
                  <span className="text-white text-base font-medium">Automatski SMS i email podsetnici</span>
                </div>
                <div className="flex items-center gap-4">
                  <TrendingUp size={20} className="text-[#797BEC] flex-shrink-0" />
                  <span className="text-white text-base font-medium">Optimizacija smena i resursa</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="w-full lg:w-1/2 relative group cursor-pointer overflow-visible">
              <div className="relative overflow-visible rounded-xl">
                <img 
                  alt="Optimizovano zakazivanje dashboard" 
                  className="max-w-[85%] max-h-[85%] object-contain transition-all duration-500 ease-out group-hover:scale-110 group-hover:brightness-110 group-hover:contrast-105 rounded-lg shadow-xl group-hover:shadow-2xl group-hover:shadow-[#797BEC]/50" 
                  src="/images/pacijenti-3.png"
                  style={{
                    filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.4))',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    transformOrigin: 'center center'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Third Content Section - Patient Statistics */}
        <div className="border-t border-l border-r border-[#252525]">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left Image */}
            <div className="w-full lg:w-1/2 relative group cursor-pointer overflow-visible">
              <div className="relative overflow-visible rounded-xl">
                <img alt="Referral Analytics Dashboard" className="w-full h-[403px] object-cover transition-all duration-500 ease-out group-hover:scale-105 rounded-xl" src="/images/d7f17d89-beef-45d8-9a70-5875feaa7be2.jpg" />
                
                {/* Dashboard image that expands to show full content */}
                <div className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out group-hover:z-50 overflow-visible">
                  <img 
                    alt="Statistika dolazaka pacijenata dashboard" 
                    className="max-w-[85%] max-h-[85%] object-contain transition-all duration-500 ease-out group-hover:scale-110 group-hover:brightness-110 group-hover:contrast-105 rounded-lg shadow-xl group-hover:shadow-2xl group-hover:shadow-[#EB894C]/50" 
                    src="/images/izostanak-pacijenata1.png"
                    style={{
                      filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.4))',
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      transformOrigin: 'center center'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="w-full lg:w-1/2 px-4">
              <div className="mb-8">
                <span className="text-[#4a9489] text-sm uppercase tracking-widest font-semibold mb-2 block">Statistika</span>
                <motion.h3 
                  className="text-white text-4xl font-bold leading-[44px] mb-4 flex items-center gap-2"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  📊 Statistika dolazaka i otkazivanja
                </motion.h3>
                <motion.p 
                  className="text-[#717179] text-lg font-medium leading-[23.4px]"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Pratite trendove dolazaka, procenat otkaza i prepoznajte najefikasnije procedure koje pacijenti zaista biraju.
                </motion.p>
              </div>

              {/* Feature List */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Calendar size={20} className="text-[#EB894C] flex-shrink-0" />
                  <span className="text-white text-base font-medium">Prosečna popunjenost termina</span>
                </div>
                <div className="flex items-center gap-4">
                  <XCircle size={20} className="text-[#EB894C] flex-shrink-0" />
                  <span className="text-white text-base font-medium">Stopa otkaza po lekaru</span>
                </div>
                <div className="flex items-center gap-4">
                  <Trophy size={20} className="text-[#EB894C] flex-shrink-0" />
                  <span className="text-white text-base font-medium">Tretmani sa najvišom realizacijom</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Preview Section */}
        <div className="mt-20 text-center px-4">
          <h4 className="text-white text-2xl font-semibold mb-6">🎬 Pogledajte kako izgleda uživo</h4>
          <Button 
            variant="outline" 
            size="lg"
            className="bg-transparent border-2 border-[#4a9489] text-white hover:bg-[#4a9489] hover:text-white transition-all duration-300"
            onClick={() => window.open('https://www.loom.com/share/your-video-id', '_blank')}
          >
            <Play className="mr-2 h-5 w-5" />
            Kratki demo video – 90 sekundi
          </Button>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 px-4 max-w-3xl mx-auto">
          <h4 className="text-white text-2xl font-semibold mb-8 text-center">Odgovori na često pitanja</h4>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-[#252525]">
              <AccordionTrigger className="text-white hover:text-[#4a9489] transition-colors">
                <div className="flex items-center gap-3">
                  <Wifi className="h-5 w-5 text-[#4a9489]" />
                  Da li se Odontoa koristi i bez interneta?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[#717179]">
                Da, Odontoa ima offline režim rada koji vam omogućava da nastavite sa radom čak i kada nemate internet konekciju. Svi podaci se sinhronizuju čim se internet veza ponovo uspostavi.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-[#252525]">
              <AccordionTrigger className="text-white hover:text-[#4a9489] transition-colors">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-[#4a9489]" />
                  Koliko ordinacija mogu registrovati?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[#717179]">
                Možete registrovati neograničen broj ordinacija. Svaka ordinacija dobija svoj zasebni prostor sa prilagođenim podešavanjima, a vi imate centralizovan pregled svih lokacija.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-[#252525]">
              <AccordionTrigger className="text-white hover:text-[#4a9489] transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-[#4a9489]" />
                  Kako se vodi sigurnost podataka pacijenata?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[#717179]">
                Svi podaci su enkriptovani po najvišim standardima (AES-256), čuvaju se u EU data centrima, i u potpunosti su usklađeni sa GDPR regulativom. Redovno radimo backup podataka i security audit-e.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>;
};

export default AiPresenceSection;
