import Reveal from '@/components/shared/Reveal';

/* Stubovi su numerisani (01-03), ne ikonicama: isti monospace broj kao lista modula u
   Pregledu sistema (.system-overview__row-num). */
const PILLARS = [
  {
    title: 'Trošak po svakom nalogu',
    desc: 'Koliko košta svaki rad poslat laboratoriji, vezano za pacijenta i termin.',
  },
  {
    title: 'Dugovanja po laboratoriji',
    desc: 'Ko od tehničara je plaćen, a kome i koliko još duguješ, uvek sabrano.',
  },
  {
    title: 'Ulazi u tvoj neto',
    desc: 'Automatski se oduzima, pa vidiš šta ti ostaje nakon troška tehnike.',
  },
];

/* Laboratorije sa dugovanjem prve, izmirena poslednja (utisana). Zbir dugovanja je
   iznos "Za uplatu" u zaglavlju. */
const LAB_ROWS = [
  { name: 'DentalTeh', orders: '8 naloga', done: '42.300', paid: '39.800', owed: '2.500' },
  { name: 'CAD/CAM studio', orders: '3 naloga', done: '15.800', paid: '12.000', owed: '3.800' },
  { name: 'Lab Dentalux', orders: '5 naloga', done: '28.100', paid: '28.100', owed: null },
];

export default function FinanceSection() {
  return (
    <section className="finance">
      <div className="finance__inner">
        <div className="finance__split">
          <div className="finance__text">
            <Reveal>
            <p className="finance__eyebrow">Kontrola nad novcem</p>
            {/* Pitanje tamno, odgovor u drugom tonu; "svaki mesec" je preseljen u lead */}
            <h2 className="section-title section-title--split">
              <span className="section-title__line">Koliko te tehnika košta?</span>{' '}
              <span className="section-title__line section-title__line--muted">Odontoa sabira umesto tebe.</span>
            </h2>
            <p className="finance__lead">
              Šta je urađeno, šta plaćeno i koliki je dug svakoj laboratoriji, za svaki mesec.
              Bez Excela, dodatnih papira i nagađanja.
            </p>

            <div className="finance__pillars">
              {PILLARS.map((pillar, i) => (
                <div key={pillar.title} className="finance__pillar">
                  <span className="finance__pillar-num" aria-hidden>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h5>{pillar.title}</h5>
                    <p>{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            </Reveal>
          </div>

          <div className="finance__visual">
            <Reveal delay={0.12}>
            <div className="finance__card">
              <div className="finance__card-bar">
                <h4>Trošak tehnike</h4>
                <span className="finance__org">
                  <i aria-hidden />
                  Aura Dent
                </span>
              </div>
              <div className="finance__card-head">
                {/* Period kao u aplikaciji; na sajtu je samo prikaz, ne kontrola. */}
                <span className="finance__period">
                  Jul 2026
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
                <div className="finance__due">
                  <span className="finance__due-label">Za uplatu</span>
                  <span className="finance__due-value">
                    6.300 <span className="finance__due-unit">RSD</span>
                  </span>
                </div>
              </div>
              <table className="finance__table">
                <thead>
                  <tr>
                    <th>Laboratorija</th>
                    <th className="is-right">Urađeno</th>
                    <th className="is-right">Plaćeno</th>
                    <th className="is-right">Dugovanje</th>
                  </tr>
                </thead>
                <tbody>
                  {LAB_ROWS.map((row) => (
                    <tr key={row.name} className={row.owed ? undefined : 'finance__row--settled'}>
                      <td>
                        <div className="finance__table-name">{row.name}</div>
                        <div className="finance__table-sub">{row.orders}</div>
                      </td>
                      <td className="is-right">{row.done}</td>
                      <td className="is-right">{row.paid}</td>
                      {row.owed ? (
                        <td className="is-right finance__owe">{row.owed}</td>
                      ) : (
                        <td className="is-right finance__settled">izmireno</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
