import Reveal from './Reveal';

const ICON_LAB = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const ICON_PATIENTS = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
  </svg>
);

const ICON_NET = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const PILLARS = [
  {
    icon: ICON_LAB,
    title: 'Trošak tehnike i dugovanja tehničarima',
    desc: 'Koliko košta svaki rad i kolika su dugovanja prema laboratoriji, vidljivo po nalogu.',
  },
  {
    icon: ICON_PATIENTS,
    title: 'Dugovanja pacijenata',
    desc: 'Ko duguje, koliko i od kada, po osobi, uvek na jednom mestu.',
  },
  {
    icon: ICON_NET,
    title: 'Neto prihod i način plaćanja',
    desc: 'Bruto minus trošak tehnike, plus pregled gotovine i kartica.',
  },
];

const LAB_ROWS = [
  { name: 'Zubna tehnika Petrović', done: '42.300', paid: '39.800', owed: '2.500' },
  { name: 'Lab Dentalux', done: '28.100', paid: '28.100', owed: null },
  { name: 'CAD/CAM studio', done: '15.800', paid: '12.000', owed: '3.800' },
];

export default function Home4Finance() {
  return (
    <section className="home4-fin">
      <div className="home4-fin__inner">
        <div className="home4-fin__split">
          <div className="home4-fin__text">
            <Reveal>
            <p className="home4-fin__eyebrow">Kontrola nad novcem</p>
            <h2 className="home4-h2">Znaj tačno kako ordinacija posluje.</h2>
            <p className="home4-fin__lead">
              Svaki završen termin, svaka uplata i svaki rad poslat tehnici automatski se slivaju
              u jedan pregled, bez Excela i nagađanja na kraju meseca.
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </span>
                <div>
                  <h4>Trošak tehnike</h4>
                  <div className="home4-fin__card-sub">jul 2026 - po laboratoriji</div>
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
                        <td className="home4-fin__table-name">{row.name}</td>
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
                <div className="home4-fin__foot">
                  <span className="home4-fin__foot-label">Ukupno dugovanje tehnici</span>
                  <span className="home4-fin__foot-value">6.300 RSD</span>
                </div>
              </div>
            </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
