'use client';

import { Button } from "@/components/ui/button";
import { Zap, Check, ArrowRight, Phone, Star, Crown, Shield } from "lucide-react";
import { motion } from "framer-motion";

const AlternatePricingSection = () => {
  return (
    <section className="section-spacing w-full px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-light text-foreground mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            Planovi prilagođeni
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Odaberite plan koji odgovara potrebama vaše ordinacije.
          </motion.p>
        </div>

        {/* Pricing Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Solo Plan */}
          <motion.div 
            className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-5 w-5 text-blue-500" />
                <h3 className="text-2xl font-light text-foreground">Solo</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed font-light">
                Za samostalne stomatologe i male ordinacije sa 1 lokacijom
              </p>
            </div>
            
            <div className="mb-8">
              <div className="flex items-baseline">
                <span className="text-4xl font-light text-foreground">49€</span>
                <span className="text-muted-foreground ml-2 font-light">/mes</span>
              </div>
              <p className="text-muted-foreground text-sm mt-2 font-light">Idealno za početak</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground mb-3">Osnovne funkcionalnosti</h4>
                {[
                  "Digitalni kartoni pacijenata",
                  "Online zakazivanje termina",
                  "SMS i Email podsećanja",
                  "Osnovni izveštaji i statistika",
                  "Fakture i predračuni",
                  "Radni nalozi za tehničare"
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-foreground font-light text-sm">{feature}</p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-foreground mb-3">Ograničenja</h4>
                <div className="flex items-start">
                  <Check className="h-4 w-4 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-muted-foreground font-light text-sm">Do 500 pacijenata</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-4 w-4 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-muted-foreground font-light text-sm">1 lokacija</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-4 w-4 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-muted-foreground font-light text-sm">Email podrška</p>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              Započni besplatno
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          {/* Plus Plan - Featured */}
          <motion.div 
            className="bg-white border-2 border-blue-500 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Popular Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-1.5 rounded-full text-sm font-medium z-20 shadow-lg">
              Najčešći izbor
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="h-5 w-5 text-blue-500" />
                <h3 className="text-2xl font-light text-foreground">Plus</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed font-light">
                Za ordinacije sa više stomatologa i do 3 lokacije
              </p>
            </div>
            
            <div className="mb-8">
              <div className="flex items-baseline">
                <span className="text-4xl font-light text-foreground">119€</span>
                <span className="text-muted-foreground ml-2 font-light">/mes</span>
              </div>
              <p className="text-muted-foreground text-sm mt-2 font-light">Kompletno rešenje za tim</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground mb-3">Sve iz Solo paketa +</h4>
                {[
                  "Upravljanje timom i dozvolama",
                  "Napredna analitika i finansijski izveštaji",
                  "Upravljanje zalihama i inventarom",
                  "Centralizovano upravljanje do 3 lokacije",
                  "Prioritetna podrška",
                  "API pristup za integracije"
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-foreground font-light text-sm">{feature}</p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-foreground mb-3">Ograničenja</h4>
                <div className="flex items-start">
                  <Check className="h-4 w-4 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-muted-foreground font-light text-sm">Do 2000 pacijenata</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-4 w-4 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-muted-foreground font-light text-sm">Do 3 lokacije</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-4 w-4 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-muted-foreground font-light text-sm">Prioritetna podrška</p>
                </div>
              </div>
            </div>
            
            <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">
              <Zap className="mr-2 h-4 w-4" />
              Započni besplatno
            </Button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div 
            className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-purple-500" />
                <h3 className="text-2xl font-light text-foreground">Pro</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed font-light">
                Za mreže ordinacija i poliklinike sa 4+ lokacije
              </p>
            </div>
            
            <div className="mb-8">
              <div className="flex items-baseline">
                <span className="text-4xl font-light text-foreground">259€</span>
                <span className="text-muted-foreground ml-2 font-light">/mes</span>
              </div>
              <p className="text-muted-foreground text-sm mt-2 font-light">Enterprise rešenje za skaliranje</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground mb-3">Sve iz Plus paketa +</h4>
                {[
                  "Neograničen broj lokacija",
                  "Centralizovano upravljanje mrežom",
                  "Napredne integracije i API pristup",
                  "Prilagođene izveštaje i dashboard",
                  "Posvećeni menadžer naloga",
                  "White-label rešenja"
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-foreground font-light text-sm">{feature}</p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-foreground mb-3">Ograničenja</h4>
                <div className="flex items-start">
                  <Check className="h-4 w-4 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-muted-foreground font-light text-sm">Neograničen broj pacijenata</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-4 w-4 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-muted-foreground font-light text-sm">Neograničen broj lokacija</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-4 w-4 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-muted-foreground font-light text-sm">24/7 prioritetna podrška</p>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              Započni besplatno
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AlternatePricingSection;
