'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, Send, BookOpen, Monitor, Download, Shield, Trash2, Zap, Users, DollarSign, ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function ContactPage() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    clinic: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage({ type: 'success', text: data.message });
        setContactForm({
          name: '',
          email: '',
          phone: '',
          clinic: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitMessage({ type: 'error', text: data.error || 'Greška pri slanju poruke' });
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'Greška pri slanju poruke. Pokušajte ponovo.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  const faqItems = [
    {
      id: 'item-1',
      question: 'Da li je teško naučiti program?',
      answer: 'Prosečno vreme da se savlada sve je 2-3 dana normalnog rada. Imamo video tutorijale na srpskom i besplatnu podršku.',
      icon: BookOpen
    },
    {
      id: 'item-2',
      question: 'Šta ako se pokvari računar?',
      answer: 'Odontoa ne zahteva instalaciju – sve radi u pregledaču i čuva se bezbedno u oblaku. Možete da pristupite svojim podacima sa bilo kog uređaja, u bilo koje doba dana, samo uz internet vezu i svoj nalog.',
      icon: Monitor
    },
    {
      id: 'item-3',
      question: 'Da li mogu da izvezem svoje kartone?',
      answer: 'Da, u bilo kom trenutku možete da preuzmete sve pacijente u Excel tabeli. Vaši podaci su vaši.',
      icon: Download
    },
    {
      id: 'item-4',
      question: 'Da li su podaci o pacijentima bezbedni?',
      answer: 'Svi podaci se čuvaju po evropskim standardima bezbednosti. Niko sem vas ne može da vidi kartone vaših pacijenata. Kada kucate podatke, oni se automatski šifruju kao u banci.',
      icon: Shield
    },
    {
      id: 'item-5',
      question: 'Šta ako neki pacijent traži da obrišem njegove podatke?',
      answer: 'Jednostavno kliknete "obriši pacijenta" i svi njegovi podaci se trajno brišu iz sistema. Program vam automatski napravi potvrdu da je podatke obrisali, koju možete da pokažete pacijentu.',
      icon: Trash2
    },
    {
      id: 'item-6',
      question: 'Koliko košta Odontoa sistem?',
      answer: 'Naš sistem ima fleksibilne cene koje se prilagođavaju veličini vaše ordinacije. Kontaktirajte nas za personalizovanu ponudu.',
      icon: DollarSign
    },
    {
      id: 'item-7',
      question: 'Koliko traje implementacija?',
      answer: 'Implementacija traje svega nekoliko minuta jer je sistem potpuno web-based i spreman za rad odmah po registraciji. Ukoliko želite da prebacite postojeće podatke iz ordinacije (kartone, evidenciju, termine), naš tim će vam pomoći u procesu migracije. Vreme trajanja zavisi od količine podataka, ali ceo proces je jednostavan i uz našu podršku prolazi bez zastoja u radu ordinacije.',
      icon: Zap
    },
    {
      id: 'item-8',
      question: 'Da li pružate obuku za osoblje?',
      answer: 'Da, pružamo kompletnu obuku za sve članove vašeg tima, uključujući i kontinuiranu podršku.',
      icon: Users
    },
    {
      id: 'item-9',
      question: 'Koliko košta instaliranje?',
      answer: 'Nema instalacije niti dodatnih troškova. Dovoljno je da se registrujete i odmah možete da pristupite svom nalogu sa bilo kog računara ili pametnog telefona, u bilo koje vreme, samo preko internet pregledača.',
      icon: DollarSign
    },
  ];

  return (
    <div className="min-h-screen bg-background w-full pt-20">
      {/* Hero Section - Full Width */}
      <section className="w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-100 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-20"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-indigo-100 rounded-full opacity-30"></div>
        </div>
        
        {/* Content container with max-width for readability */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-normal text-foreground mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              Kontakt
            </motion.h1>
            <motion.p 
              className="text-xl lg:text-2xl text-gray-600 leading-relaxed mb-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Kontaktirajte nas već danas i saznajte kako Odontoa može transformisati vašu praksu
            </motion.p>
            
            {/* Contact info cards */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">info@odontoa.com</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <Phone className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Telefon</h3>
                <p className="text-gray-600">+381 11 123 4567</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Radno vreme</h3>
                <p className="text-gray-600">Pon-Pet: 9-17h</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-spacing border-t border-border">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Form - LEVA STRANA */}
            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-normal text-foreground mb-6">Pošaljite nam poruku</h2>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Ime i prezime</label>
                    <Input 
                      name="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Vaše ime i prezime"
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email adresa</label>
                    <Input 
                      name="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="vas.email@primer.com"
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Telefon</label>
                    <Input 
                      name="phone"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+381 60 123 4567"
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Naziv ordinacije</label>
                    <Input 
                      name="clinic"
                      value={contactForm.clinic}
                      onChange={(e) => setContactForm(prev => ({ ...prev, clinic: e.target.value }))}
                      placeholder="Naziv vaše ordinacije"
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Predmet</label>
                  <Input 
                    name="subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="O čemu želite da razgovarate?"
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Poruka</label>
                  <Textarea 
                    name="message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Opišite kako možemo da vam pomognemo..."
                    rows={6}
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary resize-none"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white hover:bg-primary/90 transition-colors duration-200 font-medium py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Slanje...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 text-white" size={20} />
                      Pošalji poruku
                    </>
                  )}
                </Button>
                
                {submitMessage && (
                  <div className={`p-3 rounded-lg text-sm ${
                    submitMessage.type === 'success' 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {submitMessage.text}
                  </div>
                )}
              </form>
            </div>

            {/* Contact Info - DESNA STRANA */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-normal text-foreground mb-6">Kontakt informacije</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Naš tim je dostupan da odgovori na sva vaša pitanja i pomogne vam da donesete najbolju odluku za vašu ordinaciju.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white border-2 border-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Email</h3>
                    <p className="text-muted-foreground">info@odontoa.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white border-2 border-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Telefon</h3>
                    <p className="text-muted-foreground">+381 60 123 4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white border-2 border-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Adresa</h3>
                    <p className="text-muted-foreground">Krunska</p>
                    <p className="text-muted-foreground">11000 Beograd, Srbija</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white border-2 border-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Radno vreme</h3>
                    <p className="text-muted-foreground">Ponedeljak - Petak: 9:00 - 17:00</p>
                    <p className="text-muted-foreground">Subota: 9:00 - 13:00</p>
                    <p className="text-muted-foreground">Nedelja: Zatvoreno</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-medium text-foreground mb-4">Hitna podrška</h3>
                <p className="text-muted-foreground mb-4">
                  Za hitne slučajeve i tehničku podršku, kontaktirajte nas direktno na:
                </p>
                <div className="flex items-center space-x-2">
                  <Phone className="text-primary" size={16} />
                  <span className="text-primary font-medium">+381 60 123 4567</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-spacing border-t border-border">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-normal text-foreground mb-6">
              Često postavljena <span className="text-primary">pitanja</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Odgovori na najčešća pitanja o Odontoa platformi
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Accordion
              type="single"
              collapsible
              className="w-full">
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border-border">
                  <AccordionTrigger className="text-foreground hover:text-primary transition-colors text-base">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-primary" />
                      {item.question}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing w-full px-6 bg-background">
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
                className="max-w-md mx-auto bg-white rounded-xl p-6 shadow-sm mb-8 border border-gray-200"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
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
                    className="px-5 py-3 transition-colors duration-200 w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Zakaži demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <p className="text-xs text-gray-500 mt-2 text-center leading-relaxed">
                    Vaši podaci su zaštićeni u skladu sa GDPR regulativom.{" "}
                    <a href="/privacy" className="text-primary hover:underline">
                      Politika privatnosti
                    </a>
                  </p>
                </form>
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
    </div>
  );
} 