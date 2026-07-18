import Link from 'next/link';

/* Visine barova (procenti) prepisane 1:1 iz odobrenog dizajna; poslednji petak je akcentovan. */
const CHART_BARS = [34, 52, 41, 63, 48, 22, 57, 71, 54, 66, 45, 78, 60, 84, 69, 74, 92, 58];
const CHART_HI_INDEX = 16;
const CHART_X_LABELS = ['01.07', '05.07', '09.07', '13.07', '18.07'];

const DEBTS = [
  { initials: 'AB', name: 'Aleksandra B.', amount: '98.800 RSD' },
  { initials: 'VP', name: 'Vladimir P.', amount: '30.100 RSD' },
  { initials: 'IR', name: 'Ivana R.', amount: '14.500 RSD' },
];

export default function Home4Hero() {
  return (
    <>
      <section className="home4-hero">
        <div className="home4-hero__inner">
          <h1 className="home4-hero__title">
            Cela ordinacija digitalno.
            <br />
            <span className="home4-hero__title-accent">Finansije pod kontrolom.</span>
          </h1>

          <p className="home4-hero__sub">
            Odontoa povezuje pacijente, kartone, termine i rad tima sa naplatama, troškovima
            i dugovanjima, tako da u svakom trenutku znate šta se dešava u ordinaciji i kako
            ona posluje.
          </p>

          <div className="home4-hero__ctas">
            <Link href="/demo" className="home4-hero__btn home4-hero__btn--primary">
              Zakaži demo
            </Link>
            <Link href="/home4#funkcionalnosti" className="home4-hero__btn home4-hero__btn--secondary">
              Probaj besplatno
            </Link>
          </div>
          <div className="home4-hero__micro">3 meseca besplatno · Bez kreditne kartice</div>

          {/* ── Panel: browser frame sa rekreiranim Izveštaji dashboardom ── */}
          <div className="home4-hero__panel-wrap">
            <div className="home4-hero__browser">
              <div className="home4-hero__browser-bar">
                <div className="home4-hero__browser-dots" aria-hidden>
                  <i />
                  <i />
                  <i />
                </div>
                <div className="home4-hero__browser-url">app.odontoa.com</div>
                <div className="home4-hero__browser-spacer" aria-hidden />
              </div>

              <div className="home4-hero__dash">
                <div className="home4-hero__dash-head">
                  <div className="home4-hero__dash-title">
                    Izveštaji
                    <small>Finansijski pregled ordinacije</small>
                  </div>
                  <div className="home4-hero__dash-tabs">
                    <span className="is-active">Ovaj mesec</span>
                    <span>Prošli mesec</span>
                    <span>Ova godina</span>
                  </div>
                </div>

                <div className="home4-hero__kpis">
                  <div className="home4-hero__kpi">
                    <label>Bruto naplata</label>
                    <strong>1.284.500 RSD</strong>
                    <span className="home4-hero__kpi-up">↑ 12%</span>
                  </div>
                  <div className="home4-hero__kpi">
                    <label>Trošak tehnike</label>
                    <strong>86.200 RSD</strong>
                  </div>
                  <div className="home4-hero__kpi home4-hero__kpi--net">
                    <label>Neto prihod</label>
                    <strong>1.198.300 RSD</strong>
                    <span className="home4-hero__kpi-up">↑ 14%</span>
                  </div>
                </div>

                <div className="home4-hero__dash-grid">
                  <div className="home4-hero__card">
                    <h4>
                      Promet po periodu <em>jul 2026</em>
                    </h4>
                    <div className="home4-hero__chart">
                      {CHART_BARS.map((height, i) => (
                        <span
                          key={i}
                          className={
                            i === CHART_HI_INDEX
                              ? 'home4-hero__bar home4-hero__bar--hi'
                              : 'home4-hero__bar'
                          }
                          style={{ height: `${height}%`, animationDelay: `${0.25 + i * 0.03}s` }}
                        />
                      ))}
                    </div>
                    <div className="home4-hero__chart-x">
                      {CHART_X_LABELS.map((label) => (
                        <span key={label}>{label}</span>
                      ))}
                    </div>
                  </div>

                  <div className="home4-hero__dash-col">
                    <div className="home4-hero__card">
                      <h4>Način plaćanja</h4>
                      <div className="home4-hero__donut-row">
                        <div className="home4-hero__donut-wrap">
                          <div className="home4-hero__donut" aria-hidden />
                          <span className="home4-hero__donut-label">
                            1,28M
                            <br />
                            RSD
                          </span>
                        </div>
                        <div className="home4-hero__legend">
                          <div>
                            <i style={{ background: 'var(--stellar-accent)' }} aria-hidden /> Gotovina{' '}
                            <strong>68%</strong>
                          </div>
                          <div>
                            <i style={{ background: 'var(--home4-hero-gold)' }} aria-hidden /> Kartica{' '}
                            <strong>32%</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="home4-hero__card">
                      <h4>
                        Dugovanja pacijenata <em>ukupno 146.300 RSD</em>
                      </h4>
                      <div className="home4-hero__debt">
                        {DEBTS.map((debt) => (
                          <div key={debt.initials}>
                            <span className="home4-hero__debt-av">{debt.initials}</span>
                            {debt.name}
                            <strong>{debt.amount}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Proof traka: zamena za placeholder logo traku (TrustLogos) ── */}
      <div className="home4-hero-proof">
        <p>U svakodnevnom radu stomatoloških ordinacija, sa preko 1.000 pacijenata.</p>
      </div>
    </>
  );
}
