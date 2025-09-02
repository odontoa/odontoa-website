'use client';

import { Button } from "@/components/ui/button";
import { Globe, Bell, TrendingUp, Zap, BarChart3, MousePointer, Calendar, XCircle, Trophy, Play, Wifi, Building2, Shield, BarChart3 as BarChart3Icon, Calendar as CalendarIcon, ClipboardCheck, BookOpen, Monitor, Download, DollarSign, Trash2, FileText, Search, Camera, Receipt, Package, Wrench, MessageCircle, X, Maximize2, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";

const AiPresenceSection = () => {
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
    title: string;
    description: string;
  } | null>(null);

  const featureCards = [
    {
      id: 1,
      category: "Online 24/7",
      title: "ZAKAZIVANJE",
      description: "Automatski SMS/email podsetnici za pacijente",
      image: "/images/zakzaivanje-termina.png",
      alt: "Kalendar i zakazivanje"
    },
    {
      id: 2,
      category: "Za tehničare",
      title: "RADNI NALOZI",
      description: "Kreirajte i pratite naloge u realnom vremenu",
      image: "/images/radni nalozi mockup.png",
      alt: "Lista radnih naloga"
    },
    {
      id: 3,
      category: "Prihodi/troškovi",
      title: "FAKTURAIRANJE",
      description: "Praćenje profitabilnosti po tretmanima",
      image: "/images/fakturisanje-nova-slika.png",
      alt: "Fakturairanje"
    },
    {
      id: 4,
      category: "Stručni tim",
      title: "PODRŠKA",
      description: "Dostupan radnim danima za tehničku podršku",
      image: "/images/podrska:nova:slika:odontoa.png",
      alt: "Podrška tim"
    }
  ];

  const handleCardClick = (card: typeof featureCards[0]) => {
    setSelectedImage({
      src: card.image,
      alt: card.alt,
      title: card.title,
      description: card.description
    });
  };

  const closePopup = () => {
    setSelectedImage(null);
  };



  return (
    <div className="section-spacing w-full min-h-screen relative bg-background">
      <div className="max-w-7xl mx-auto px-4">

        {/* Introduction Heading */}
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-4xl md:text-[44px] font-normal text-foreground leading-tight mb-8 max-w-[620px] mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            Sve što vam treba na jednom mestu
          </motion.h2>
        </motion.div>

        {/* Hero Section - Digitalni kartoni + Analitika */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Left Content */}
              <div className="w-full lg:w-1/2">
                <span className="text-primary text-sm uppercase tracking-widest font-normal mb-4 block">KOMPLETNA KONTROLA</span>
                <motion.h3 
                  className="text-foreground text-4xl lg:text-5xl font-bold leading-tight mb-6"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  Digitalni kartoni + Analitika
                </motion.h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  Kompletan medicinski karton sa finansijskim pregledom i detaljnom analitikom na jednom ekranu
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Finansijski pregled
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 text-primary" />
                    Digitalni kartoni
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Real-time analitika
                  </div>
                </div>
              </div>

              {/* Right Image */}
              <div className="w-full lg:w-1/2 relative group cursor-pointer overflow-visible">
                <div className="relative overflow-visible rounded-xl p-4">
                  <img 
                    alt="Dashboard - kompletna kontrola" 
                    className="w-full h-auto object-contain transition-all duration-500 ease-out group-hover:scale-105 rounded-xl shadow-lg group-hover:shadow-xl border border-gray-200" 
                    src="/images/prodaja2.png"
                    style={{
                      filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.15))',
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      transformOrigin: 'center center'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid - 2x2 Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {featureCards.map((card, index) => (
            <motion.div 
              key={card.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => handleCardClick(card)}
            >
              <div className="mb-4">
                <span className="text-primary text-xs uppercase tracking-widest font-normal mb-2 block">{card.category}</span>
                <h4 className="text-foreground text-xl font-bold mb-2">{card.title}</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  {card.description}
                </p>
              </div>
              <div className="relative overflow-hidden rounded-lg">
                <img 
                  alt={card.alt} 
                  className="w-full h-32 object-cover transition-all duration-500 ease-out group-hover:scale-105" 
                  src={card.image}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <Maximize2 className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 px-4 max-w-3xl mx-auto">
          <h4 className="text-foreground text-xl font-normal mb-8 text-center">Odgovori na česta pitanja</h4>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-border">
              <AccordionTrigger className="text-foreground hover:text-primary transition-colors text-base">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Da li je teško naučiti program?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm">
                Prosečno vreme da se savlada sve je 2-3 dana normalnog rada. Imamo video tutorijale na srpskom i besplatnu podršku.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-border">
              <AccordionTrigger className="text-foreground hover:text-primary transition-colors text-base">
                <div className="flex items-center gap-3">
                  <Monitor className="h-5 w-5 text-primary" />
                  Šta ako se pokvari računar?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm">
                Odontoa ne zahteva instalaciju – sve radi u pregledaču i čuva se bezbedno u oblaku. Možete da pristupite svojim podacima sa bilo kog uređaja, u bilo koje doba dana, samo uz internet vezu i svoj nalog.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-border">
              <AccordionTrigger className="text-foreground hover:text-primary transition-colors text-base">
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5 text-primary" />
                  Da li mogu da izvezem svoje kartone?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm">
                Da, u bilo kom trenutku možete da preuzmete sve pacijente u Excel tabeli. Vaši podaci su vaši.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-border">
              <AccordionTrigger className="text-foreground hover:text-primary transition-colors text-base">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  Da li su podaci o pacijentima bezbedni?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm">
                Svi podaci se čuvaju po evropskim standardima bezbednosti. Niko sem vas ne može da vidi kartone vaših pacijenata. Kada kucate podatke, oni se automatski šifruju kao u banci.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-border">
              <AccordionTrigger className="text-foreground hover:text-primary transition-colors text-base">
                <div className="flex items-center gap-3">
                  <Trash2 className="h-5 w-5 text-primary" />
                  Šta ako neki pacijent traži da obrišem njegove podatke?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm">
                Jednostavno kliknete "obriši pacijenta" i svi njegovi podaci se trajno brišu iz sistema. Program vam automatski napravi potvrdu da je podatke obrisali, koju možete da pokažete pacijentu.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border-border">
              <AccordionTrigger className="text-foreground hover:text-primary transition-colors text-base">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Koliko košta Odontoa sistem?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm">
                Naš sistem ima fleksibilne cene koje se prilagođavaju veličini vaše ordinacije. Kontaktirajte nas za personalizovanu ponudu.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border-border">
              <AccordionTrigger className="text-foreground hover:text-primary transition-colors text-base">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-primary" />
                  Koliko traje implementacija?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm">
                Implementacija traje svega nekoliko minuta jer je sistem potpuno web-based i spreman za rad odmah po registraciji. Ukoliko želite da prebacite postojeće podatke iz ordinacije (kartone, evidenciju, termine), naš tim će vam pomoći u procesu migracije. Vreme trajanja zavisi od količine podataka, ali ceo proces je jednostavan i uz našu podršku prolazi bez zastoja u radu ordinacije.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="border-border">
              <AccordionTrigger className="text-foreground hover:text-primary transition-colors text-base">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  Da li pružate obuku za osoblje?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm">
                Da, pružamo kompletnu obuku za sve članove vašeg tima, uključujući i kontinuiranu podršku.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9" className="border-border">
              <AccordionTrigger className="text-foreground hover:text-primary transition-colors text-base">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Koliko košta instaliranje?
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm">
                Nema instalacije niti dodatnih troškova. Dovoljno je da se registrujete i odmah možete da pristupite svom nalogu sa bilo kog računara ili pametnog telefona, u bilo koje vreme, samo preko internet pregledača.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Image Popup Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
          >
            <motion.div
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedImage.title}</h3>
                  <p className="text-muted-foreground text-sm">{selectedImage.description}</p>
                </div>
                <button
                  onClick={closePopup}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {/* Image Container */}
              <div className="p-6">
                <div className="relative">
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    className="w-full h-auto object-contain rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AiPresenceSection;
