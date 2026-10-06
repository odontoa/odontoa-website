import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { displayFont } from '@/app/(site)/display-font';
import DemoRequestForm from './DemoRequestForm';
import { pageMetadata } from '@/lib/seo/metadata';
/* site.css nosi --stellar-* tokene i .btn-cta; kontakt.css daje istu karticu i polja kao forma na kontaktu. */
import '@/app/(site)/site.css';
import '../kontakt/kontakt.css';
import './demo.css';

export const metadata: Metadata = pageMetadata({
  title: 'Zakaži demo | Odontoa',
  description: 'Prođi kroz Odontou sa nama za 15 minuta: zakazivanje, karton i finansije na primeru tvoje ordinacije.',
  path: '/demo',
});

/* /demo je ranije preusmeravao na sekciju #demo na pocetnoj, koja vise ne postoji.
   Forma iz te sekcije (ime, email, telefon -> /api/demo) sada zivi ovde. */
export default function DemoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className={`site-page flex-1 ${displayFont.variable}`}>
        <section className="contact demo">
          <div className="contact__inner">
            <div>
              <p className="contact__eyebrow">Demo</p>
              <h1 className="contact__title">Prođi kroz Odontou sa nama za 15 minuta.</h1>
              <p className="contact__lead">
                Na pozivu ti pokažemo zakazivanje, karton i finansije na primeru tvoje ordinacije.
              </p>

              <p className="contact__details-title">Kako izgleda demo</p>
              <dl className="contact__details">
                <div className="contact__detail">
                  <dt>Trajanje</dt>
                  <dd>15 minuta</dd>
                </div>
                <div className="contact__detail">
                  <dt>Priprema</dt>
                  <dd>Nije potrebna</dd>
                </div>
                <div className="contact__detail">
                  <dt>Obaveza</dt>
                  <dd>Bez obaveze</dd>
                </div>
              </dl>

              <div className="demo__alt">
                <span>Radije bi odmah da probaš?</span>
                <Link href="/register" className="hero__link">
                  Započni besplatno
                  <ArrowRight size={15} strokeWidth={2} aria-hidden />
                </Link>
              </div>
            </div>

            <DemoRequestForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
