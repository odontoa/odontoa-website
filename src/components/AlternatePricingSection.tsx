'use client';

import { Button } from "@/components/ui/button";
import { Zap, Check } from "lucide-react";
import { motion } from "framer-motion";

const AlternatePricingSection = () => {
  return (
    <section className="w-full py-20 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            Planovi prilagođeni veličini ordinacije
          </motion.h2>
          <motion.p 
            className="text-xl text-[#717179] max-w-lg mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Odaberite plan koji odgovara potrebama vaše ordinacije.
          </motion.p>
        </div>

        {/* Pricing Cards Container - Desktop Row Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 max-w-6xl mx-auto relative">
          
          {/* Solo Plan */}
          <motion.div 
            className="relative w-full lg:w-[375.34px] h-[624.78px] bg-[rgba(12.75,12.75,12.75,0.50)] overflow-hidden border border-[#252525] lg:border-r-0 cursor-pointer"
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
          >
            {/* Header */}
            <div className="absolute left-8 top-8 w-[311.34px] h-[92.80px] overflow-hidden">
              <div className="absolute left-0 top-0 w-[86.13px] h-9 text-white text-2xl font-bold leading-9 font-inter">Solo</div>
              <div className="absolute left-0 top-[46.50px] w-[245.75px] h-[45.40px] text-[#717179] text-lg font-normal leading-[23.40px] font-inter">
                Za samostalne stomatologe i<br />male ordinacije sa 1 lokacijom
              </div>
            </div>
            
            {/* Price */}
            <div className="absolute left-8 top-[274.80px] w-[311.34px] h-[82.80px] overflow-hidden">
              <div className="absolute left-0 top-[-0.11px] w-[206px] h-[52px]">
                <span className="text-white text-[44px] font-bold leading-[52px] font-inter">49€</span>
                <span className="text-white text-2xl font-bold leading-[52px] font-inter">/mes</span>
              </div>
              <div className="absolute left-0 top-[62px] w-[231.64px] h-[20.80px] text-[#717179] text-base font-normal leading-[20.80px] font-inter">
                Idealno za početak
              </div>
            </div>
            
            {/* Features */}
            <div className="absolute left-8 top-[381.60px] w-[311.34px] h-[151.19px] overflow-hidden">
              <div className="absolute left-0 top-0 w-[311.34px] h-[20.80px] overflow-hidden">
                <div className="absolute left-0 top-[2.40px] w-4 h-4 overflow-hidden flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div className="absolute left-[26px] top-0 w-[284.29px] h-[20.80px] text-white text-base font-medium leading-[20.80px] font-inter">
                  Online zakazivanje termina
                </div>
              </div>
              <div className="absolute left-0 top-[32.79px] w-[311.34px] h-[20.80px] overflow-hidden">
                <div className="absolute left-0 top-[2.40px] w-4 h-4 overflow-hidden flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div className="absolute left-[26px] top-0 w-[284.29px] h-[20.80px] text-white text-base font-medium leading-[20.80px] font-inter">
                  Digitalni kartoni pacijenata
                </div>
              </div>
              <div className="absolute left-0 top-[65.59px] w-[311.34px] h-[20.80px] overflow-hidden">
                <div className="absolute left-0 top-[2.40px] w-4 h-4 overflow-hidden flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div className="absolute left-[26px] top-0 w-[284.29px] h-[20.80px] text-white text-base font-medium leading-[20.80px] font-inter">
                  Email podsećanja
                </div>
              </div>
              <div className="absolute left-0 top-[98.39px] w-[311.34px] h-[20.80px] overflow-hidden">
                <div className="absolute left-0 top-[2.40px] w-4 h-4 overflow-hidden flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div className="absolute left-[26px] top-0 w-[284.29px] h-[20.80px] text-white text-base font-medium leading-[20.80px] font-inter">
                  Osnovni izveštaji
                </div>
              </div>
            </div>
            
            {/* Button */}
            <div className="absolute left-8 top-[556.78px] w-[311.34px] h-11">
              <Button variant="secondary" className="w-full h-full bg-[#1565C0] text-white hover:bg-[#0D47A1] border-0 text-sm font-medium transition-colors duration-200" style={{borderRadius: '8px'}}>
                Započni besplatno
              </Button>
            </div>
          </motion.div>

          {/* Plus Plan - Featured */}
          <motion.div 
            className="relative w-full lg:w-[375.34px] h-[624.78px] bg-[#0D0D0D] overflow-visible border border-[#252525] cursor-pointer z-10"
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
          >
            {/* Popular Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#4a9489] text-white px-6 py-1.5 rounded-full text-sm font-medium z-20 shadow-lg">
              Najčešći izbor
            </div>
            
            {/* Header */}
            <div className="absolute left-8 top-8 w-[311.34px] h-[92.80px] overflow-hidden">
              <div className="absolute left-0 top-0 w-[84.52px] h-9 text-white text-2xl font-bold leading-9 font-inter">Plus</div>
              <div className="absolute left-0 top-[46.50px] w-[252.28px] h-[45.40px] text-[#717179] text-lg font-normal leading-[23.40px] font-inter">
                Za ordinacije sa više stomatologa<br />i do 3 lokacije
              </div>
            </div>
            
            {/* Price */}
            <div className="absolute left-8 top-[274.80px] w-[311.34px] h-[82.80px] overflow-hidden">
              <div className="absolute left-[-0.34px] top-[-0.11px] w-[216px] h-[52px]">
                <span className="text-white text-[44px] font-bold leading-[52px] font-inter">119€</span>
                <span className="text-white text-2xl font-bold leading-[52px] font-inter">/mes</span>
              </div>
              <div className="absolute left-0 top-[62px] w-[250px] h-[20.80px] text-[#717179] text-base font-normal leading-[20.80px] font-inter">
                Kompletno rešenje za tim
              </div>
            </div>
            
            {/* Features */}
            <div className="absolute left-8 top-[360px] w-[311.34px] h-[180px] overflow-hidden">
              <div className="absolute left-0 top-0 w-[311.34px] h-[20.80px] overflow-hidden">
                <div className="absolute left-0 top-[2.40px] w-4 h-4 overflow-hidden flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div className="absolute left-[26px] top-0 w-[284.29px] h-[20.80px] text-white text-base font-medium leading-[20.80px] font-inter">
                  Sve iz Solo paketa
                </div>
              </div>
              <div className="absolute left-0 top-[32.79px] w-[311.34px] h-[20.80px] overflow-hidden">
                <div className="absolute left-0 top-[2.40px] w-4 h-4 overflow-hidden flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div className="absolute left-[26px] top-0 w-[284.29px] h-[20.80px] text-white text-base font-medium leading-[20.80px] font-inter">
                  Upravljanje timom i dozvolama
                </div>
              </div>
              <div className="absolute left-0 top-[65.59px] w-[311.34px] h-[40.80px] overflow-hidden">
                <div className="absolute left-0 top-[2.40px] w-4 h-4 overflow-hidden flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div className="absolute left-[26px] top-0 w-[284.29px] h-[40.80px] text-white text-base font-medium leading-[20.80px] font-inter">
                  Napredna analitika i<br />finansijski izveštaji
                </div>
              </div>
              <div className="absolute left-0 top-[118.39px] w-[311.34px] h-[20.80px] overflow-hidden">
                <div className="absolute left-0 top-[2.40px] w-4 h-4 overflow-hidden flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div className="absolute left-[26px] top-0 w-[284.29px] h-[20.80px] text-white text-base font-medium leading-[20.80px] font-inter">
                  Prioritetna podrška
                </div>
              </div>
            </div>
            
            {/* Button */}
            <div className="absolute left-8 top-[556.78px] w-[311.34px] h-11">
              <Button className="w-full h-full bg-[#4a9489] text-white hover:bg-[#3a7a6f] border-0 text-sm font-medium transition-colors duration-200" style={{borderRadius: '8px'}}>
                <Zap className="mr-2 h-4 w-4" />
                Započni besplatno
              </Button>
            </div>
          </motion.div>

          {/* Pro Plan */}
          <motion.div 
            className="relative w-full lg:w-[375.34px] h-[624.78px] bg-[rgba(12.75,12.75,12.75,0.50)] overflow-hidden border border-[#252525] lg:border-l-0 cursor-pointer"
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
          >
            {/* Header */}
            <div className="absolute left-8 top-8 w-[311.34px] h-[92.80px] overflow-hidden">
              <div className="absolute left-0 top-0 w-[118.13px] h-9 text-white text-2xl font-bold leading-9 font-inter">Pro</div>
              <div className="absolute left-0 top-[46.50px] w-[267.19px] h-[45.40px] text-[#717179] text-lg font-normal leading-[23.40px] font-inter">
                Za mreže ordinacija i<br />poliklinike sa 4+ lokacije
              </div>
            </div>
            
            {/* Price */}
            <div className="absolute left-8 top-[274.80px] w-[311.34px] h-[82.80px] overflow-hidden">
              <div className="absolute left-0 top-0 w-[164.85px] h-[52px]">
                <span className="text-white text-[44px] font-bold leading-[52px] font-inter">259€</span>
                <span className="text-white text-2xl font-bold leading-[52px] font-inter">/mes</span>
              </div>
              <div className="absolute left-0 top-[62px] w-[280px] h-[20.80px] text-[#717179] text-base font-normal leading-[20.80px] font-inter">
                Enterprise rešenje za skaliranje
              </div>
            </div>
            
            {/* Features */}
            <div className="absolute left-8 top-[360px] w-[311.34px] h-[180px] overflow-hidden">
              <div className="absolute left-0 top-0 w-[311.34px] h-[20.80px] overflow-hidden">
                <div className="absolute left-0 top-[2.40px] w-4 h-4 overflow-hidden flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div className="absolute left-[26px] top-0 w-[284.29px] h-[20.80px] text-white text-base font-medium leading-[20.80px] font-inter">
                  Neograničen broj lokacija
                </div>
              </div>
              <div className="absolute left-0 top-[32.79px] w-[311.34px] h-[20.80px] overflow-hidden">
                <div className="absolute left-0 top-[2.40px] w-4 h-4 overflow-hidden flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div className="absolute left-[26px] top-0 w-[284.29px] h-[20.80px] text-white text-base font-medium leading-[20.80px] font-inter">
                  Centralizovano upravljanje
                </div>
              </div>
              <div className="absolute left-0 top-[65.59px] w-[311.34px] h-[40.80px] overflow-hidden">
                <div className="absolute left-0 top-[2.40px] w-4 h-4 overflow-hidden flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div className="absolute left-[26px] top-0 w-[284.29px] h-[40.80px] text-white text-base font-medium leading-[20.80px] font-inter">
                  API pristup i prilagođene<br />integracije
                </div>
              </div>
              <div className="absolute left-0 top-[118.39px] w-[311.34px] h-[20.80px] overflow-hidden">
                <div className="absolute left-0 top-[2.40px] w-4 h-4 overflow-hidden flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <div className="absolute left-[26px] top-0 w-[284.29px] h-[20.80px] text-white text-base font-medium leading-[20.80px] font-inter">
                  Posvećeni menadžer naloga
                </div>
              </div>
            </div>
            
            {/* Button */}
            <div className="absolute left-8 top-[556.78px] w-[311.34px] h-11">
              <Button variant="secondary" className="w-full h-full bg-[#1565C0] text-white hover:bg-[#0D47A1] border-0 text-sm font-medium transition-colors duration-200" style={{borderRadius: '8px'}}>
                Započni besplatno
              </Button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AlternatePricingSection;
