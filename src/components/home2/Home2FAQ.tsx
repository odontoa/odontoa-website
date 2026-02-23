'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen, Monitor, Download, Shield, Trash2, DollarSign, Zap, Users } from 'lucide-react';

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

const Home2FAQ = () => {
  return (
    <section className="section-spacing border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
  );
};

export default Home2FAQ;

