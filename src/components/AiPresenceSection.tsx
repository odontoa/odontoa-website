import { Button } from "@/components/ui/button";
import { Globe, Bell, TrendingUp, Zap, BarChart3, MousePointer } from "lucide-react";
import { motion } from "framer-motion";

const AiPresenceSection = () => {
  return <div className="w-full min-h-screen relative py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.h2 
            className="text-4xl md:text-[44px] font-bold text-white leading-[52px] mb-8 max-w-[520px] mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            Pametni uvidi za bolju praksu
          </motion.h2>
          <motion.p 
            className="text-[#717179] text-xl font-medium leading-[26px] mb-12 max-w-[500px] mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Odontoa vam pruža jasnu analitiku u realnom vremenu:
          </motion.p>
          <div className="flex gap-4 justify-center">
            <Button variant="default" className="bg-[#1565C0] text-white hover:bg-[#0D47A1] px-8 py-3 transition-colors duration-200" style={{borderRadius: '8px'}}>
              Započni besplatno
            </Button>
            <Button className="bg-[#171717] text-white hover:bg-[#4a9489] px-8 py-3 shadow-sm transition-colors duration-200" style={{borderRadius: '8px'}}>
              Zakaži demo
            </Button>
          </div>
        </div>

        {/* First Content Section - Sentiment Analysis */}
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
                <motion.h3 
                  className="text-white text-4xl font-bold leading-[44px] mb-4"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  Analiza prihoda i prodaje
                </motion.h3>
                <motion.p 
                  className="text-[#717179] text-lg font-medium leading-[23.4px]"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Detaljni pregled finansijskih performansi ordinacije, analiza prihoda po tretmanima i praćenje rentabilnosti.
                </motion.p>
              </div>

              {/* Feature List */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Zap size={20} className="text-[#EB894C] flex-shrink-0" />
                  <span className="text-white text-base font-medium">Mesečne i godišnje prihode</span>
                </div>
                <div className="flex items-center gap-4">
                  <Zap size={20} className="text-[#EB894C] flex-shrink-0" />
                  <span className="text-white text-base font-medium">Najrentabilnije tretmane</span>
                </div>
                <div className="flex items-center gap-4">
                  <Zap size={20} className="text-[#EB894C] flex-shrink-0" />
                  <span className="text-white text-base font-medium">Finansijske trendove i prognoze</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Content Section - Live AI Mentions */}
        <div className="border-t border-l border-r border-[#252525] mb-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 pt-6 lg:pt-0 px-4">
              <div className="mb-8">
                <motion.h3 
                  className="text-white text-4xl font-bold leading-[44px] mb-4"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  Optimizovano zakazivanje
                </motion.h3>
                <motion.p 
                  className="text-[#717179] text-lg font-medium leading-[23.4px]"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Predlozi termina prema trajanju tretmana i dostupnosti osoblja.
                </motion.p>
              </div>

              {/* Feature List */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Globe size={20} className="text-[#797BEC] flex-shrink-0" />
                  <span className="text-white text-base font-medium">Pametno predlaganje termina</span>
                </div>
                <div className="flex items-center gap-4">
                  <Bell size={20} className="text-[#797BEC] flex-shrink-0" />
                  <span className="text-white text-base font-medium">Automatski podsetnici</span>
                </div>
                <div className="flex items-center gap-4">
                  <TrendingUp size={20} className="text-[#797BEC] flex-shrink-0" />
                  <span className="text-white text-base font-medium">Optimizacija kapaciteta</span>
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

        {/* Third Content Section - Referral Analytics */}
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
                <motion.h3 
                  className="text-white text-4xl font-bold leading-[44px] mb-4"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  Statistika dolazaka pacijenata
                </motion.h3>
                <motion.p 
                  className="text-[#717179] text-lg font-medium leading-[23.4px]"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Statistika pokazuje koliko pacijenata dolazi, otkazuje ili ne dolazi — po danima, lekarima i tretmanima.
                </motion.p>
              </div>

              {/* Feature List */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <BarChart3 size={20} className="text-[#EB894C] flex-shrink-0" />
                  <span className="text-white text-base font-medium">Statistika dolazaka</span>
                </div>
                <div className="flex items-center gap-4">
                  <Bell size={20} className="text-[#EB894C] flex-shrink-0" />
                  <span className="text-white text-base font-medium">Analiza otkazanih termina</span>
                </div>
                <div className="flex items-center gap-4">
                  <MousePointer size={20} className="text-[#EB894C] flex-shrink-0" />
                  <span className="text-white text-base font-medium">Najefikasnije procedure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};

export default AiPresenceSection;
