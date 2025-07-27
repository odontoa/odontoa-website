'use client';

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="w-full py-20 px-6 bg-black">
      <div className="max-w-6xl mx-auto bg-[#F5F5F4] relative overflow-hidden px-8 py-[65px] rounded-xl shadow-md">
        
        {/* CTA content */}
        <div className="text-center py-8 relative z-10">
          <p className="text-[#4a9489] uppercase text-sm font-semibold tracking-widest mb-2">Zainteresovani?</p>

          <motion.h2 
            className="text-4xl font-bold text-[#09090B] mb-4 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            Spremni da digitalizujete svoju ordinaciju?
          </motion.h2>

          <motion.p 
            className="text-lg text-[#717179] font-medium mb-8 max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Zakažite demo i saznajte kako da automatizujete zakazivanja, smanjite otkaze i uštedite 6+ sati nedeljno. Sve to bez komplikovane obuke.
          </motion.p>

          {/* Contact Form */}
          <div className="max-w-md mx-auto bg-white rounded-xl p-6 shadow-sm mb-8">
            <form className="space-y-4">
              <Input
                type="text"
                placeholder="Ime i prezime"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900"
              />
              <Input
                type="email"
                placeholder="Email adresa"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900"
              />
              <Input
                type="tel"
                placeholder="Broj telefona"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900"
              />
              
              <Button 
                className="bg-[#4a9489] text-white hover:bg-[#3a7a6f] px-5 py-3 transition-colors duration-200 w-full rounded-lg"
              >
                Zakaži demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="text-xs text-gray-500 mt-2 text-center">
                Vaši podaci su zaštićeni u skladu sa GDPR regulativom.{" "}
                <a href="/privacy" className="text-[#4a9489] hover:underline">
                  Politika privatnosti
                </a>
              </p>
            </form>
          </div>

          {/* Additional Info */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#717179]">✓ Bez kartice</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#717179]">✓ Bez ugovorne obaveze</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#717179]">✓ Demo traje 15 minuta</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
