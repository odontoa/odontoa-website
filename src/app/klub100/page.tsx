import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { displayFont } from '@/app/(site)/display-font';
import { pricing } from '@/lib/config/pricing';
import { pageMetadata } from '@/lib/seo/metadata';
import Klub100Form from './Klub100Form';
import './klub100.css';

/* Skrivena promo stranica za Klub 100 (QR sa fizicke kartice ili direktan URL).
   Namerno nije u navigaciji, footeru, sitemap-u ni llms.txt, i nosi noindex, nofollow.
   pageMetadata() za noindex daje follow: true, pa se robots ovde pregazi. */
export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Klub 100 | Odontoa',
    description:
      'Posebni uslovi za prvih 100 stomatoloških ordinacija koje dolaze preko preporuke: Odontoa za 15 € mesečno tokom prve godine.',
    path: '/klub100',
  }),
  robots: { index: false, follow: false },
};

/* Klub 100 uslovi su obecani na stampanoj kartici, pa su ovde fiksni. Samo regularna
   cena dolazi iz javnog cenovnika, da se ne razidje sa glavnim sajtom. */
const PERKS = [
  '15 € mesečno tokom prve godine',
  '30 dana besplatno',
  'Pomoć pri podešavanju ordinacije',
  'Uvoz postojećih pacijenata',
  'Direktna podrška našeg tima',
];

export default function Klub100Page() {
  return (
    <div className={`k100 ${displayFont.variable}`}>
      <header className="k100__top">
        <Link href="/" className="k100__logo" aria-label="Odontoa početna">
          <Image
            src="/images/Odontoa-New-logo-pack-2026/horiyotal_color.png"
            alt="Odontoa"
            width={507}
            height={165}
            priority
          />
        </Link>
      </header>

      <main className="k100__main">
        <section className="k100__hero" aria-labelledby="k100-title">
          <p className="k100__eyebrow">Klub 100</p>
          <h1 id="k100-title" className="k100__title">
            Dobrodošli u Klub&nbsp;100.
          </h1>
          <div className="k100__lead">
            <p>
              Odontoa je otvorila posebne uslove za prvih 100 stomatoloških ordinacija koje nam
              dolaze preko preporuke.
            </p>
            <p>
              Ako ste dobili ovu karticu, možete da koristite Odontou po promotivnoj ceni od 15&nbsp;€
              mesečno tokom prve godine.
            </p>
          </div>
        </section>

        <section className="k100__offer" aria-label="Klub 100 ponuda">
          <div className="k100__price">
            <div className="k100__badge">
              <Image
                src="/images/Odontoa-New-logo-pack-2026/favicon_light.png"
                alt=""
                width={400}
                height={400}
                className="k100__badge-mark"
              />
              <span>Klub 100</span>
            </div>
            <p className="k100__amount">
              <span className="k100__amount-value">15&nbsp;€</span>
              <span className="k100__amount-unit">/ mesečno</span>
            </p>
            <p className="k100__amount-sub">tokom prve godine</p>
            <p className="k100__regular">
              Regularna cena: {pricing.monthly}&nbsp;{pricing.currencySymbol} mesečno
            </p>
          </div>

          <span className="k100__watermark" aria-hidden>
            100
          </span>

          <div className="k100__form">
            <Klub100Form />
          </div>

          <div className="k100__perks">
            <p className="k100__perks-title">Klub 100 pogodnosti</p>
            <ul className="k100__perks-list">
              {PERKS.map((perk) => (
                <li key={perk}>
                  <span className="k100__perk-icon" aria-hidden>
                    <Check size={14} strokeWidth={2.5} />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <p className="k100__terms">
          Ponuda važi za prvih 100 ordinacija koje se prijave preko Klub 100 programa.
        </p>

        <section className="k100__product" aria-labelledby="k100-product-title">
          <h2 id="k100-product-title" className="k100__product-title">
            Sve što Vam treba za svakodnevni rad ordinacije.
          </h2>
          <p className="k100__product-copy">
            Zakazivanje termina, kartoni pacijenata, odontogram, finansije, zubna tehnika,
            dokumentacija, podsetnici i AI asistent - na jednom mestu.
          </p>
        </section>

        <section className="k100__secondary" aria-label="Upoznajte Odontou">
          <p>Želite prvo da pogledate kako Odontoa radi?</p>
          <Link href="/" className="k100__secondary-link">
            Pogledaj Odontou
            <ArrowRight size={16} strokeWidth={2} aria-hidden />
          </Link>
        </section>
      </main>
    </div>
  );
}
