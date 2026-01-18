'use client';

import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

function AboutHeroSection() {
  return (
    <div className="w-full py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <motion.div 
            className="flex flex-col gap-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="flex flex-col gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-tight text-foreground">
                Zašto postoji Odontoa?
              </h1>
              <p className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-xl">
                Od digitalnog kalendara do sigurnog vođenja kartona – razvili smo platformu koja stomatolozima štedi vreme i donosi više fokusa na pacijente.
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button size="lg" className="rounded-lg px-6 py-6 text-base text-white h-auto w-full sm:w-auto">
                Zakaži poziv <PhoneCall className="ml-2 h-4 w-4 text-white" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-lg px-6 py-6 h-auto w-full sm:w-auto">
                Prijavi se ovde <MoveRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            {/* Stats or Key Points */}
            <motion.div 
              className="grid grid-cols-2 gap-6 pt-8 border-t border-border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex flex-col gap-1">
                <div className="text-3xl font-normal text-foreground">10+</div>
                <div className="text-sm text-muted-foreground">Sati uštede nedeljno</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-3xl font-normal text-foreground">100%</div>
                <div className="text-sm text-muted-foreground">Sigurnost podataka</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative rounded-2xl overflow-hidden border border-border bg-muted/30 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none"></div>
              <img 
                src="/images/kanc-nova-4.png" 
                alt="Moderna Odontoa kancelarija" 
                className="w-full h-auto object-contain relative z-10"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export { AboutHeroSection };

