/**
 * Testimonials (iskustva korisnika)
 *
 * Sekcija je privremeno isključena sa početne (`src/app/(site)/page.tsx`) dok nema pravih korisnika.
 * Naslov na stranici: „Ordinacije koje su prešle na Odontoa“ (eyebrow: Iskustva korisnika).
 *
 * Da je ponovo prikažeš: ukloni komentar oko importa i `<TestimonialCards />` u
 * `src/app/(site)/page.tsx` (iznad `BlogTeaserSection`).
 */
import { Twitter } from 'lucide-react';

interface Testimonial {
  title: string;
  text: string;
  name: string;
  handle: string;
  social: 'twitter' | 'instagram';
}

const TESTIMONIALS: Testimonial[] = [
  {
    title: 'Finansije pod kontrolom',
    text: 'Prešli smo na Odontoa pre šest meseci. Recepcija više ne gubi vreme na telefonske podsetnike, a ja imam pregled finansija u realnom vremenu.',
    name: 'Dr. Ana Nikolić',
    handle: 'Vlasnica ordinacije, Beograd',
    social: 'twitter',
  },
  {
    title: 'Jedan sistem za sve',
    text: 'Konačno jedan sistem za sve — kartone, termine i naplatu. Tim se brže snašao nego što sam očekivala.',
    name: 'Marija Jovanović',
    handle: 'Menadžerka ordinacije, Novi Sad',
    social: 'instagram',
  },
  {
    title: 'Ortodoncija bez papira',
    text: 'Ortodontski karton i praćenje terapija su odlični. Ne moram da listam papire da vidim gde je pacijent u tretmanu.',
    name: 'Dr. Stefan Petrović',
    handle: 'Ortodont, Niš',
    social: 'instagram',
  },
  {
    title: 'Manje propuštenih termina',
    text: 'Zakazivanje traje upola kraće. Pacijenti dobijaju podsetnike, pa imamo mnogo manje propuštenih termina.',
    name: 'Jelena Đorđević',
    handle: 'Recepcija, Kragujevac',
    social: 'twitter',
  },
  {
    title: 'Dokumentacija na jednom mestu',
    text: 'Dokumentacija, RTG snimci i beleške — sve je vezano za pacijenta. Ne gubim vreme na traženje.',
    name: 'Dr. Miloš Stanković',
    handle: 'Oralni hirurg, Beograd',
    social: 'twitter',
  },
  {
    title: 'Pregled cele ordinacije',
    text: 'Upravljam sa 4 stolice i 8 zaposlenih. Odontoa mi daje pregled koji pre nisam imala.',
    name: 'Ivana Mihailović',
    handle: 'Vlasnica poliklinike, Subotica',
    social: 'instagram',
  },
];

export default function TestimonialCards() {
  return (
    <section className="testimonial-cards">
      <div className="testimonial-cards__inner">
        {/* Header */}
        <div className="text-center mb-4">
          <p
            className="mb-4 text-xs font-medium"
            style={{ color: 'var(--stellar-accent)' }}
          >
            Iskustva korisnika
          </p>
          <h2
            className="text-[58px] leading-[1.1] font-medium tracking-tight"
            style={{ color: 'var(--stellar-heading)' }}
          >
            Ordinacije koje su prešle
            <br />
            na Odontoa
          </h2>
        </div>

        {/* Cards grid */}
        <div className="testimonial-cards__grid">
          {TESTIMONIALS.map((item, i) => (
            <div key={i} className="testimonial-card">
              <h3
                className="text-base font-medium mb-3"
                style={{ color: 'var(--stellar-heading)' }}
              >
                {item.title}
              </h3>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: 'var(--stellar-body)' }}
              >
                {item.text}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="testimonial-card__avatar" />
                  <div>
                    <p
                      className="text-sm font-normal"
                      style={{ color: 'var(--stellar-heading)' }}
                    >
                      {item.name}
                    </p>
                    <p
                      className="text-xs font-medium"
                      style={{ color: 'var(--stellar-accent)' }}
                    >
                      {item.handle}
                    </p>
                  </div>
                </div>
                {item.social === 'twitter' ? (
                  <Twitter size={18} style={{ color: '#1da1f2' }} />
                ) : (
                  <div
                    className="w-[18px] h-[18px] rounded-full"
                    style={{
                      background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Social CTA in the middle of bottom row */}
        <div className="flex justify-center mt-[-60px] mb-4 relative z-10">
          <a
            href="#"
            className="btn-purple text-sm"
          >
            Započnite i vi besplatno
          </a>
        </div>
      </div>
    </section>
  );
}
