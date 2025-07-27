'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, UserPlus, CalendarCheck2 } from "lucide-react";
import { motion } from "framer-motion";

const GetStartedSection = () => {
  return (
    <section className="w-full py-20 px-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="relative">
          {/* Background Image Overlay */}
          <div 
            className="absolute inset-0 bg-[#0D0D0D] opacity-90 outline outline-1 outline-[#252525] outline-offset-[-1px]"
            style={{
              backgroundImage: 'url(/images/1dentist-smiling.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />

          {/* Content */}
          <div className="relative flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 lg:gap-12 p-6 lg:p-10 min-h-[600px] lg:min-h-[500px]">
            
            {/* Onboarding Card */}
            <div className="w-full max-w-md lg:w-[420px] bg-white rounded-xl p-6 py-[42px] lg:self-center flex-shrink-0 lg:ml-auto shadow-lg">
              
              <h4 className="text-[#4a9489] text-sm font-semibold uppercase mb-3 tracking-widest text-left">
                Spremni da krenete?
              </h4>

              <motion.h2 
                className="text-[#09090B] text-2xl lg:text-[26px] font-bold leading-tight lg:leading-[36px] mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                Vaš put ka digitalnoj ordinaciji počinje danas
              </motion.h2>

              <Button 
                className="bg-[#0D0D0D] text-white text-sm font-medium border border-transparent hover:bg-[#4a9489] px-5 py-3 mb-8 transition-colors duration-200 w-full"
                style={{borderRadius: '8px'}}
              >
                Započni besplatno
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <ul className="space-y-6 text-sm text-[#3f3f46] font-medium leading-6">
                <li className="flex items-start gap-3">
                  <Building2 className="text-[#4a9489] w-5 h-5 flex-shrink-0 mt-1" />
                  <span>
                    <strong className="text-black">Kreirajte profil ordinacije</strong><br />
                    Dodajte adresu, kontakt i specijalizaciju — potrebno je manje od 5 minuta.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <UserPlus className="text-[#4a9489] w-5 h-5 flex-shrink-0 mt-1" />
                  <span>
                    <strong className="text-black">Dodajte lekare i pacijente</strong><br />
                    Unesite tim i kreirajte digitalne kartone.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CalendarCheck2 className="text-[#4a9489] w-5 h-5 flex-shrink-0 mt-1" />
                  <span>
                    <strong className="text-black">Počnite sa zakazivanjem</strong><br />
                    Beležite tretmane i pratite analitiku rada ordinacije.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetStartedSection;
