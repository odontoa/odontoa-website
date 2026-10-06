'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContactSection } from "@/components/contact/ContactSection";
import { BookOpen, Monitor, Download, Shield, Trash2, Zap, Users, DollarSign, ArrowRight, Clock } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { businessConfig } from "@/lib/config/business";
import { pricing } from "@/lib/config/pricing";
import { SITE_URL } from "@/lib/config/site-url";
import { displayFont } from "@/app/(site)/display-font";
/* site.css nosi --stellar-* tokene na .site-page wrapperu; kontakt.css stilizuje formu. */
import "@/app/(site)/site.css";
import "./kontakt.css";

export default function ContactPage() {
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
      answer: 'Odontoa ne zahteva instalaciju: sve radi u pregledaču i čuva se bezbedno u oblaku. Svojim podacima možeš da pristupiš sa bilo kog uređaja, u bilo koje doba dana, samo uz internet vezu i svoj nalog.',
      icon: Monitor
    },
    {
      id: 'item-3',
      question: 'Da li mogu da izvezem svoje kartone?',
      answer: 'Da, u bilo kom trenutku možeš da preuzmeš sve pacijente u Excel tabeli. Tvoji podaci su tvoji.',
      icon: Download
    },
    {
      id: 'item-4',
      question: 'Da li su podaci o pacijentima bezbedni?',
      answer: 'Svi podaci se čuvaju po evropskim standardima bezbednosti. Niko izvan tvoje ordinacije ne može da vidi kartone tvojih pacijenata. Kada kucaš podatke, oni se automatski šifruju kao u banci.',
      icon: Shield
    },
    {
      id: 'item-5',
      question: 'Šta ako neki pacijent traži da obrišem njegove podatke?',
      answer: 'Jednostavno klikneš „obriši pacijenta“ i svi njegovi podaci se trajno brišu iz sistema. Program ti automatski napravi potvrdu da su podaci obrisani, koju možeš da pokažeš pacijentu.',
      icon: Trash2
    },
    {
      id: 'item-6',
      question: 'Koliko košta Odontoa sistem?',
      answer: `Cena za rani pristup je ${pricing.monthly} ${pricing.currencySymbol} mesečno, uz godišnju naplatu od ${pricing.yearly} ${pricing.currencySymbol} (naplata jednom godišnje). U cenu su uključene sve trenutno dostupne funkcionalnosti, bez naplate po stolici i bez doplate za pojedinačne module. Prvih ${pricing.trialDays} dana koristiš besplatno.`,
      icon: DollarSign
    },
    {
      id: 'item-7',
      question: 'Koliko traje implementacija?',
      answer: 'Implementacija traje svega nekoliko minuta jer sistem radi u pregledaču i spreman je za rad odmah po registraciji. Ako želiš da prebaciš postojeće podatke iz ordinacije (kartone, evidenciju, termine), naš tim će ti pomoći u migraciji. Vreme zavisi od količine podataka, ali je proces jednostavan i uz našu podršku prolazi bez zastoja u radu ordinacije.',
      icon: Zap
    },
    {
      id: 'item-8',
      question: 'Da li pružate obuku za osoblje?',
      answer: 'Da, pružamo kompletnu obuku za sve članove tvog tima, uz kontinuiranu podršku.',
      icon: Users
    },
    {
      id: 'item-9',
      question: 'Koliko košta instaliranje?',
      answer: 'Nema instalacije niti dodatnih troškova. Dovoljno je da se registruješ i odmah možeš da pristupiš svom nalogu sa bilo kog računara ili pametnog telefona, u bilo koje vreme, samo preko internet pregledača.',
      icon: DollarSign
    },
  ];

  return (
    <div className={`site-page min-h-screen bg-white w-full ${displayFont.variable}`}>
      <ContactSection
        title="Kontakt"
        description="Kontaktiraj nas već danas i saznaj kako Odontoa može da unapredi rad tvoje ordinacije. Dostupni smo za pitanja, demo i saradnju."
        phone={businessConfig.phone}
        email={businessConfig.email}
        web={{ label: 'odontoa.com', url: SITE_URL }}
      />

      {/* FAQ Section */}
      <section className="section-spacing border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-normal text-foreground mb-6">
              Često postavljena <span style={{ color: 'var(--stellar-accent)' }}>pitanja</span>
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
                  <AccordionTrigger className="text-foreground hover:text-[var(--stellar-accent)] transition-colors text-base">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" style={{ color: 'var(--stellar-accent)' }} />
                      {item.question}
                    </div>
                  </AccordionTrigger>
                  {/* forceMount: odgovori su uvek u DOM-u, pa su pitanja i odgovori u server HTML-u.
                      Dok je stavka zatvorena, sadrzaj je sakriven (display: none); akordion radi kao ranije. */}
                  <AccordionContent forceMount className="text-muted-foreground text-sm [[data-state=closed]>&]:hidden">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
} 