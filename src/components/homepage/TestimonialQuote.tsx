import Image from 'next/image';
import Reveal from '@/components/shared/Reveal';

interface Quote {
  text: string;
  name: string;
  practice: string;
  /* null = nema fotografije, prikazuju se inicijali u accent tintu */
  photo: string | null;
  initials: string;
}

const QUOTES: Quote[] = [
  {
    text: 'Najviše mi znači to što su termini sada konzistentni. Pacijenti dobiju podsetnik, dođu na vreme, a ja ne provodim dan krpeći raspored. Mala stvar, ali meni je promenila kako izgleda radni dan.',
    name: 'Dr Željko Sladoje',
    practice: 'Specijalistička stomatološka ordinacija Orto-osmeh',
    photo: '/images/testimonials/dr-zeljko-sladoje.png',
    initials: 'ŽS',
  },
];

/*
  Jedan istaknut citat (pilot ordinacija). Kada bude više citata: mapirati QUOTES
  i dodati `.testimonial-quote__dots` indikator ispod `.testimonial-quote__inner`. Sada se
  tačkice ne renderuju - sa jednim citatom prazan indikator izgleda čudno.
*/
export default function TestimonialQuote() {
  const quote = QUOTES[0];

  return (
    <section className="testimonial-quote">
      <Reveal className="testimonial-quote__inner">
        <div className="testimonial-quote__body">
          <p className="testimonial-quote__eyebrow">
            <span className="testimonial-quote__dash" aria-hidden="true" />
            Iskustva
          </p>

          <blockquote className="testimonial-quote__text">
            {`„${quote.text}“`}
          </blockquote>

          <div className="testimonial-quote__attribution">
            <span className="testimonial-quote__rule" aria-hidden="true" />
            <div className="testimonial-quote__person">
              {/* Na mobilnom avatar ulazi u red sa imenom, na desktopu je u desnoj koloni */}
              <div className="testimonial-quote__avatar testimonial-quote__avatar--inline">
                {quote.photo ? (
                  <Image
                    src={quote.photo}
                    alt={quote.name}
                    width={56}
                    height={56}
                    className="testimonial-quote__photo"
                  />
                ) : (
                  <span className="testimonial-quote__initials" aria-hidden="true">
                    {quote.initials}
                  </span>
                )}
              </div>
              <div>
                <p className="testimonial-quote__name">{quote.name}</p>
                <p className="testimonial-quote__practice">{quote.practice}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="testimonial-quote__media">
          {quote.photo ? (
            <Image
              src={quote.photo}
              alt={quote.name}
              width={240}
              height={240}
              className="testimonial-quote__photo testimonial-quote__photo--large"
            />
          ) : (
            <div className="testimonial-quote__avatar testimonial-quote__avatar--large">
              <span className="testimonial-quote__initials" aria-hidden="true">
                {quote.initials}
              </span>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
