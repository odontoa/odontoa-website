import Image from 'next/image';
import Reveal from './Reveal';

interface Quote {
  text: string;
  name: string;
  practice: string;
  /* null = nema fotografije, prikazuju se inicijali u accent tintu */
  photo: string | null;
  initials: string;
}

/* PLACEHOLDER - zameniti pravim citatom Dr Željka pre launcha */
const QUOTES: Quote[] = [
  {
    text: 'Prvi put tačno znam koliko me tehnika košta i koliko mi pacijenti duguju, sve na jednom mestu. Prelazak sa papira su odradili oni, bazu su uneli za nas.',
    name: 'Dr Željko [prezime]',
    practice: '[naziv ordinacije], [grad]',
    photo: null,
    /* Jedno slovo dok ne znamo prezime */
    initials: 'Ž',
  },
];

/*
  Jedan istaknut citat (pilot ordinacija). Kada bude više citata: mapirati QUOTES
  i dodati `.home4-quote__dots` indikator ispod `.home4-quote__inner`. Sada se
  tačkice ne renderuju - sa jednim citatom prazan indikator izgleda čudno.
*/
export default function Home4Quote() {
  const quote = QUOTES[0];

  return (
    <section className="home4-quote">
      <Reveal className="home4-quote__inner">
        <div className="home4-quote__body">
          <p className="home4-quote__eyebrow">
            <span className="home4-quote__dash" aria-hidden="true" />
            Iskustva
          </p>

          <blockquote className="home4-quote__text">
            {`„${quote.text}“`}
          </blockquote>

          <div className="home4-quote__attribution">
            <span className="home4-quote__rule" aria-hidden="true" />
            <div className="home4-quote__person">
              {/* Na mobilnom avatar ulazi u red sa imenom, na desktopu je u desnoj koloni */}
              <div className="home4-quote__avatar home4-quote__avatar--inline">
                {quote.photo ? (
                  <Image
                    src={quote.photo}
                    alt={quote.name}
                    width={56}
                    height={56}
                    className="home4-quote__photo"
                  />
                ) : (
                  <span className="home4-quote__initials" aria-hidden="true">
                    {quote.initials}
                  </span>
                )}
              </div>
              <div>
                <p className="home4-quote__name">{quote.name}</p>
                <p className="home4-quote__practice">{quote.practice}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="home4-quote__media">
          {quote.photo ? (
            <Image
              src={quote.photo}
              alt={quote.name}
              width={200}
              height={260}
              className="home4-quote__photo home4-quote__photo--large"
            />
          ) : (
            <div className="home4-quote__avatar home4-quote__avatar--large">
              <span className="home4-quote__initials" aria-hidden="true">
                {quote.initials}
              </span>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
