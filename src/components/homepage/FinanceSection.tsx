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

/* Izmisljeni znakovi laboratorija, jedan sistem: pun oblik u accent boji, podeljen na
   delove razlicitog tona. Rez izmedju lica kocke je potez u boji tile-a (.finance__cut). */
const LOGO_DENTALTEH = (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
    <path fill="currentColor" d="M4 9C4 5.5 5.7 3.5 8 3.5c1.7 0 2.5 2.1 4 2.1s2.3-2.1 4-2.1c2.3 0 4 2 4 5.5V13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
    <rect fill="currentColor" fillOpacity=".4" x="6" y="17" width="12" height="3.6" rx="1.6" />
  </svg>
);

const LOGO_DENTALUX = (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
    <path fill="currentColor" d="M11 3.6C8 5.8 5 9.2 5 13.6v4.2C5 19.6 6.4 21 8.2 21H11Z" />
    <path fill="currentColor" fillOpacity=".4" d="M13 3.6c3 2.2 6 5.6 6 10v4.2c0 1.8-1.4 3.2-3.2 3.2H13Z" />
  </svg>
);

const LOGO_CADCAM = (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
    <polygon className="finance__cut" fill="currentColor" fillOpacity=".35" strokeWidth="1.7" points="12,2.6 20.1,7.3 12,12 3.9,7.3" />
    <polygon className="finance__cut" fill="currentColor" strokeWidth="1.7" points="3.9,7.3 12,12 12,21.4 3.9,16.7" />
    <polygon className="finance__cut" fill="currentColor" fillOpacity=".65" strokeWidth="1.7" points="12,12 20.1,7.3 20.1,16.7 12,21.4" />
  </svg>
);

/* DentalTeh je isti dobavljač koji se pominje u AI asistent sekciji. */
const LAB_ROWS = [
  { name: 'DentalTeh', logo: LOGO_DENTALTEH, orders: '8 naloga', done: '42.300', paid: '39.800', owed: '2.500' },
  { name: 'Lab Dentalux', logo: LOGO_DENTALUX, orders: '5 naloga', done: '28.100', paid: '28.100', owed: null },
  { name: 'CAD/CAM studio', logo: LOGO_CADCAM, orders: '3 naloga', done: '15.800', paid: '12.000', owed: '3.800' },
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
              <span className="section-title__line section-title__line--muted">Odontoa to sabira umesto tebe.</span>
            </h2>
            <p className="finance__lead">
              Šta je urađeno, šta plaćeno i šta još duguješ svakoj laboratoriji, za svaki mesec.
              Bez Excela i nagađanja.
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
              <div className="finance__card-head">
                <div>
                  <h4>Trošak tehnike</h4>
                  <div className="finance__card-sub">po laboratoriji</div>
                </div>
                {/* Period kao u aplikaciji; na sajtu je samo prikaz, ne kontrola. */}
                <span className="finance__period">
                  jul 2026
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </div>
              <div className="finance__card-body">
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
                      <tr key={row.name}>
                        <td>
                          <div className="finance__lab">
                            <span className="finance__avatar">{row.logo}</span>
                            <div>
                              <div className="finance__table-name">{row.name}</div>
                              <div className="finance__table-sub">{row.orders}</div>
                            </div>
                          </div>
                        </td>
                        <td className="is-right finance__num">{row.done}</td>
                        <td className="is-right finance__num finance__paid">{row.paid}</td>
                        {row.owed ? (
                          <td className="is-right finance__num finance__owe">{row.owed}</td>
                        ) : (
                          <td className="is-right">
                            <span className="finance__ok">
                              <span className="finance__ok-icon">
                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                  <path d="M20 6 9 17l-5-5" />
                                </svg>
                              </span>
                              izmireno
                            </span>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Zbirna traka na okviru kartice, ispod tonalne ploce sa tabelom. */}
              <div className="finance__foot">
                <span className="finance__foot-label">Ukupno dugovanje tehnici</span>
                <span className="finance__foot-value">
                  6.300 <span className="finance__foot-unit">RSD</span>
                </span>
              </div>
            </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
