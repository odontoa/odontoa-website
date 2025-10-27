'use client';

import React from 'react';
import { motion } from 'framer-motion';




interface MissionSectionProps {
  title?: string;
}

const OdontoaMissionSection: React.FC<MissionSectionProps> = ({
  title = "Naša misija"
}) => {
  return (
    <section className="section-spacing">
      <div className="max-w-screen-xl mx-auto">
        <div className="md:flex md:flex-row items-center justify-between gap-12">
          {/* Text Content - Left Side */}
          <motion.div 
            className="md:w-[58%] space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              className="text-4xl font-normal leading-tight sm:text-5xl sm:leading-tight text-foreground"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              {title}
            </motion.h2>
            
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-lg leading-relaxed text-muted-foreground">
                Naša misija je da stomatološkim ordinacijama u regionu omogućimo prelazak sa papira na digitalni sistem koji štedi vreme i smanjuje greške.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Verujemo da doktori treba da imaju više fokusa na pacijente, a manje na administraciju.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Kroz Odontoa platformu gradimo most između stomatologije i tehnologije – jednostavno, sigurno i uvek dostupno.
              </p>
            </motion.div>
          </motion.div>
          
          {/* Visual - Right Side */}
          <motion.div 
            className="md:w-[36%] mt-10 md:mt-0 relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Subtle decorative circle background */}
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl transform scale-110 -z-10"></div>
            <div className="bg-muted/50 rounded-3xl overflow-hidden shadow-lg backdrop-blur-sm">
              <img 
                src="/images/nasa-misija-8.png" 
                alt="Digitalna transformacija stomatoloških ordinacija" 
                className="w-full h-auto object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OdontoaMissionSection;
