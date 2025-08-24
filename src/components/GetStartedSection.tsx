'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Phone } from "lucide-react";
import { motion } from "framer-motion";

const GetStartedSection = () => {
  return (
    <section className="section-spacing w-full px-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="relative">
          {/* Background Image Overlay */}
          <div 
            className="absolute inset-0 bg-[#0D0D0D] opacity-90 outline outline-1 outline-[#252525] outline-offset-[-1px] rounded-3xl"
            style={{
              backgroundImage: 'url(/images/1dentist-smiling.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />

          {/* Content */}
          <div className="relative flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 lg:gap-12 p-6 lg:p-10 min-h-[600px] lg:min-h-[500px]">
            
            {/* Video Preview Card */}
            <div className="w-full max-w-md lg:w-[420px] bg-white rounded-xl p-6 py-[42px] lg:self-center flex-shrink-0 lg:ml-auto shadow-sm border border-gray-200">
              
              <h4 className="text-[#4a9489] text-sm font-semibold uppercase mb-3 tracking-widest text-left">
                Pogledajte Odontoa u akciji
              </h4>

              <motion.h2 
                className="text-[#09090B] text-2xl lg:text-[26px] font-normal leading-tight lg:leading-[36px] mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                Pogledajte Odontoa sistem u akciji za 2 minuta
              </motion.h2>

              <p className="text-[#3f3f46] text-sm leading-relaxed mb-6">
                Vidite kako dr Milenković iz Beograda koristi Odontoa sistem za upravljanje svojom ordinacijom.
              </p>

              {/* Video Preview Placeholder */}
              <div className="relative bg-gray-100 rounded-lg h-48 mb-6 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                <div className="flex items-center gap-3 text-[#4a9489]">
                  <Play className="w-8 h-8" />
                  <span className="font-medium">Pogledajte demo</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  className="bg-[#0D0D0D] text-white text-sm font-medium border border-transparent hover:bg-[#4a9489] px-5 py-3 transition-colors duration-200 w-full rounded-lg"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Rezervišite live demo poziv
                </Button>

                <Button 
                  variant="outline"
                  className="text-[#0D0D0D] border-[#0D0D0D] text-sm font-medium hover:bg-[#0D0D0D] hover:text-white px-5 py-3 transition-colors duration-200 w-full rounded-lg"
                >
                  Počnite besplatnu probu
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetStartedSection;
