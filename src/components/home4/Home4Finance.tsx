import Reveal from './Reveal';

const ICON_LAB = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const ICON_FLASK = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M10 2v7.31M14 9.3V1.99M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0M5.58 16.5h12.85" />
  </svg>
);

const ICON_NET = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 10h12M4 14h9M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2" />
  </svg>
);

const PILLARS = [
  {
    icon: ICON_LAB,
    title: 'Trošak po svakom nalogu',
    desc: 'Koliko košta svaki rad poslat laboratoriji, vezano za pacijenta i termin.',
  },
  {
    icon: ICON_FLASK,
    title: 'Dugovanja po laboratoriji',
    desc: 'Ko od tehničara je plaćen, a kome i koliko još duguješ, uvek sabrano.',
  },
  {
    icon: ICON_NET,
    title: 'Ulazi u tvoj neto',
    desc: 'Trošak tehnike se automatski oduzima od prihoda, pa vidiš pravu zaradu.',
  },
];

/* Inicijali su u podacima, ne izvedeni iz naziva - "CAD/CAM studio" ne daje "CC" splitom.
   DentalTeh je isti dobavljač koji se pominje u AI asistent sekciji. */
const LAB_ROWS = [
  { name: 'DentalTeh', initials: 'DT', orders: '8 naloga', done: '42.300', paid: '39.800', owed: '2.500' },
  { name: 'Lab Dentalux', initials: 'LD', orders: '5 naloga', done: '28.100', paid: '28.100', owed: null },
  { name: 'CAD/CAM studio', initials: 'CC', orders: '3 naloga', done: '15.800', paid: '12.000', owed: '3.800' },
];

export default function Home4Finance() {
  return (
    <section className="home4-fin">
      <div className="home4-fin__inner">
        <div className="home4-fin__split">
          <div className="home4-fin__text">
            <Reveal>
            <p className="home4-fin__eyebrow">Kontrola nad novcem</p>
            <h2 className="home4-h2">Znaš li koliko te tehnika košta svakog meseca?</h2>
            <p className="home4-fin__lead">
              Odontoa ti pokazuje tačno: šta je urađeno, šta plaćeno i šta još duguješ svakoj
              laboratoriji. Bez Excela i nagađanja na kraju meseca.
            </p>

            <div className="home4-fin__pillars">
              {PILLARS.map((pillar) => (
                <div key={pillar.title} className="home4-fin__pillar">
                  <span className="home4-fin__pillar-icon">{pillar.icon}</span>
                  <div>
                    <h5>{pillar.title}</h5>
                    <p>{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            </Reveal>
          </div>

          <div className="home4-fin__visual">
            <Reveal delay={0.12}>
            <div className="home4-fin__card">
              <div className="home4-fin__card-head">
                <span className="home4-fin__card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </span>
                <div>
                  <h4>Trošak tehnike</h4>
                  <div className="home4-fin__card-sub">jul 2026 · po laboratoriji</div>
                </div>
              </div>
              <div className="home4-fin__card-body">
                <table className="home4-fin__table">
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
                          <div className="home4-fin__lab">
                            <span className="home4-fin__avatar">{row.initials}</span>
                            <div>
                              <div className="home4-fin__table-name">{row.name}</div>
                              <div className="home4-fin__table-sub">{row.orders}</div>
                            </div>
                          </div>
                        </td>
                        <td className="is-right home4-fin__num">{row.done}</td>
                        <td className="is-right home4-fin__num home4-fin__paid">{row.paid}</td>
                        {row.owed ? (
                          <td className="is-right home4-fin__num home4-fin__owe">{row.owed}</td>
                        ) : (
                          <td className="is-right home4-fin__ok">izmireno</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Traka na sivoj podlozi, van tela kartice - isti obrazac kao asistent prompt. */}
              <div className="home4-fin__foot">
                <span className="home4-fin__foot-label">Ukupno dugovanje tehnici</span>
                <span className="home4-fin__foot-value">6.300 RSD</span>
              </div>
            </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
