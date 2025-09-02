'use client';

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { ArrowRight, Zap, Shield, Clock } from "lucide-react";
import { DemoForm } from "@/components/DemoForm";

const CtaSection = () => {
  return (
    <section id="demo" className="section-spacing w-full px-6 bg-background">
      <div className="max-w-screen-xl mx-auto">
        {/* Glassmorphism Container */}
        <motion.div 
          className="bg-card/40 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-gray-200 bg-gradient-to-r from-primary/30 via-secondary/20 to-primary/30 bg-clip-border relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated Grid Pattern Background */}
          <div className="absolute inset-0 pointer-events-none">
            <AnimatedGridPattern
              numSquares={18}
              maxOpacity={0.04}
              duration={12}
              repeatDelay={6}
              width={60}
              height={60}
              className={cn(
                "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
                "opacity-50",
              )}
            />
          </div>
          
          {/* CTA content */}
          <div className="text-center relative z-10">
            <motion.h2 
              className="text-4xl md:text-5xl font-normal text-foreground mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              Spremni da digitalizujete ordinaciju?<br />
              <span className="text-primary">Start za 5 minuta.</span>
            </motion.h2>

            <motion.p 
              className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Zakažite demo i saznajte kako da automatizujete zakazivanja, smanjite broj propuštenih termina i uštedite 10+ sati nedeljno. Sve to bez komplikovane obuke.
            </motion.p>

            {/* Contact Form */}
            <motion.div 
              className="max-w-md mx-auto mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <DemoForm 
                title="Zakažite demo"
                description="Kontaktirajte nas za besplatan demo Odontoa sistema"
                buttonText="Zakaži demo"
              />
            </motion.div>

            {/* Additional Info */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-8 justify-center items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Demo traje 15 minuta</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Bez obaveze</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Odmah dostupan</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
