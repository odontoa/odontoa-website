import Link from 'next/link';
import { ArrowRight, CalendarCheck, Import, Lock, LockKeyhole, ShieldCheck } from 'lucide-react';

/* Grafikon "Promet po periodu" - putanje prepisane 1:1 iz odobrenog dizajna, viewBox 600x170.
   SVG se razvlaci samo po X osi (preserveAspectRatio="none") da grafikon drzi istu visinu na
   svakoj sirini, pa sve linije nose vector-effect="non-scaling-stroke": bez toga bi debljina
   linije rasla po Y i na mobilnom bi grafikon izgledao spljosteno. */
const CHART_GROSS_LINE =
  'M40,120 C90,112 108,116 140,100 C186,78 214,104 250,92 C296,76 322,66 360,72 C404,79 432,48 470,44 C516,39 542,50 580,30';
const CHART_GROSS_AREA = `${CHART_GROSS_LINE} L580,150 L40,150 Z`;
const CHART_NET_LINE =
  'M40,142 C90,138 108,140 140,134 C186,126 214,136 250,130 C296,122 322,118 360,120 C404,123 432,106 470,104 C516,99 542,105 580,96';

/* Grid linije na 500k/300k/100k; baseline (0) je posebno, malo tamniji. */
const CHART_GRID_Y = [8, 62, 116];
const CHART_Y_LABELS = ['500k', '300k', '100k', '0'];
const CHART_X_LABELS = ['01.07', '05.07', '09.07', '13.07', '18.07'];

/* Donut: obim kruga r=46 je ~289 jedinica, pa je 68% -> 196.5 a 32% -> 92.4.
   Offset -200 ostavlja tanak razmak izmedju dva luka. */
const DONUT_C = 289;
const DONUT_CASH = 196.5;
const DONUT_CARD = 92.4;

const KPIS = [
  { label: 'Bruto naplata', value: '1.284.500', delta: '↑ 12%' },
  { label: 'Trošak tehnike', value: '86.200' },
  { label: 'Neto prihod', value: '1.198.300', delta: '↑ 14%', isNet: true },
];

const DEBTS = [
  { initials: 'AB', name: 'Aleksandra B.', last: '18.07.', amount: '98.800 RSD' },
  { initials: 'VP', name: 'Vladimir P.', last: '17.07.', amount: '30.100 RSD' },
  { initials: 'IR', name: 'Ivana R.', last: '17.07.', amount: '14.500 RSD' },
];

/* Trust traka: samo proverive tvrdnje, bez brojeva korisnika. */
const TRUST = [
  { Icon: CalendarCheck, label: '30 dana besplatno' },
  /* Import, ne Upload: poruka je da mi prebacujemo bazu, a ne da korisnik salje fajl. */
  { Icon: Import, label: 'Uvoz pacijenata' },
  { Icon: ShieldCheck, label: 'GDPR usklađeno' },
  /* LockKeyhole, ne Lock: Lock je vec u URL baru mockupa. */
  { Icon: LockKeyhole, label: 'Sigurno na Microsoft Azure' },
];

export default function Home4Hero() {
  return (
    <>
      <section className="home4-hero">
        <div className="home4-hero__inner">
          <h1 className="home4-hero__title">
            Tvoja digitalna ordinacija.
            <br />
            <span className="home4-hero__title-accent">Finansije vodi sistem.</span>
          </h1>

          <p className="home4-hero__sub">
            Zaboravi papire i propuštene termine. Cela ordinacija ti je na jednom mestu,
            pregledna i pod kontrolom.
          </p>

          {/* Jedna glavna akcija; demo je namerno slabiji tekstualni link, ne drugo dugme.
              Mikrokopija je izbacena - trust traka ispod mockupa nosi te tvrdnje. */}
          <div className="home4-hero__ctas">
            <Link href="/register" className="home4-hero__btn home4-hero__btn--primary">
              Započni besplatno
            </Link>
            <Link href="/demo" className="home4-hero__link">
              Zakaži demo
              <ArrowRight size={15} strokeWidth={2} aria-hidden />
            </Link>
          </div>

          {/* ── Panel: browser frame sa rekreiranim Izveštaji dashboardom ── */}
          <div className="home4-hero__panel-wrap">
            <div className="home4-hero__browser">
              <div className="home4-hero__browser-bar">
                <div className="home4-hero__browser-dots" aria-hidden>
                  <i />
                  <i />
                  <i />
                </div>
                <div className="home4-hero__browser-url">
                  <Lock size={11} strokeWidth={2} aria-hidden />
                  app.odontoa.com
                </div>
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
                  {KPIS.map(({ label, value, delta, isNet }) => (
                    <div
                      key={label}
                      className={
                        isNet ? 'home4-hero__kpi home4-hero__kpi--net' : 'home4-hero__kpi'
                      }
                    >
                      <label>{label}</label>
                      <strong>
                        {value}
                        <i className="home4-hero__kpi-cur">RSD</i>
                        {delta ? <span className="home4-hero__kpi-up">{delta}</span> : null}
                      </strong>
                    </div>
                  ))}
                </div>

                {/* Isti 3-kolonski grid kao KPI red: grafikon nosi 2 kolone, desna kartica 1. */}
                <div className="home4-hero__dash-grid">
                  <div className="home4-hero__card home4-hero__card--chart">
                    <h4>
                      Promet po periodu <em>jul 2026</em>
                    </h4>

                    <div className="home4-hero__chart-legend">
                      <div>
                        <i className="home4-hero__lgd home4-hero__lgd--gross" aria-hidden />
                        Bruto naplata
                      </div>
                      <div>
                        <i className="home4-hero__lgd home4-hero__lgd--net" aria-hidden />
                        Neto prihod
                      </div>
                    </div>

                    <div className="home4-hero__chart">
                      <div className="home4-hero__chart-y" aria-hidden>
                        {CHART_Y_LABELS.map((label) => (
                          <span key={label}>{label}</span>
                        ))}
                      </div>

                      <svg
                        className="home4-hero__chart-svg"
                        viewBox="0 0 600 170"
                        preserveAspectRatio="none"
                        aria-hidden
                      >
                        <defs>
                          <linearGradient id="home4HeroChartFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--stellar-accent)" stopOpacity="0.16" />
                            <stop offset="100%" stopColor="var(--stellar-accent)" stopOpacity="0" />
                          </linearGradient>
                        </defs>

                        {CHART_GRID_Y.map((y) => (
                          <line
                            key={y}
                            className="home4-hero__chart-grid"
                            x1="34"
                            y1={y}
                            x2="600"
                            y2={y}
                            vectorEffect="non-scaling-stroke"
                          />
                        ))}
                        <line
                          className="home4-hero__chart-base"
                          x1="34"
                          y1="150"
                          x2="600"
                          y2="150"
                          vectorEffect="non-scaling-stroke"
                        />
                        <line
                          className="home4-hero__chart-guide"
                          x1="580"
                          y1="30"
                          x2="580"
                          y2="150"
                          vectorEffect="non-scaling-stroke"
                        />

                        <path
                          className="home4-hero__chart-area"
                          d={CHART_GROSS_AREA}
                          fill="url(#home4HeroChartFill)"
                        />
                        <path
                          className="home4-hero__chart-line home4-hero__chart-line--gross"
                          d={CHART_GROSS_LINE}
                          vectorEffect="non-scaling-stroke"
                        />
                        <path
                          className="home4-hero__chart-line home4-hero__chart-line--net"
                          d={CHART_NET_LINE}
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>

                      {/* Krajnje tacke su HTML, ne SVG krugovi: uz razvlacenje po X bi krug
                          postao elipsa. Pozicije su iste kao krajevi putanja (580/600). */}
                      <span
                        className="home4-hero__chart-tip home4-hero__chart-tip--gross"
                        aria-hidden
                      />
                      <span
                        className="home4-hero__chart-tip home4-hero__chart-tip--net"
                        aria-hidden
                      />
                    </div>

                    <div className="home4-hero__chart-x" aria-hidden>
                      {CHART_X_LABELS.map((label) => (
                        <span key={label}>{label}</span>
                      ))}
                    </div>
                  </div>

                  {/* Desna kolona je jedna kartica (donut + dugovanja) da bi se desna ivica
                      poklopila sa KPI redom. */}
                  <div className="home4-hero__card">
                    <h4>Način plaćanja</h4>

                    <div className="home4-hero__donut-row">
                      <div className="home4-hero__donut-wrap">
                        <svg className="home4-hero__donut" viewBox="0 0 118 118" aria-hidden>
                          <circle className="home4-hero__donut-track" cx="59" cy="59" r="46" />
                          <circle
                            className="home4-hero__donut-arc home4-hero__donut-arc--cash"
                            cx="59"
                            cy="59"
                            r="46"
                            strokeDasharray={`${DONUT_CASH} ${DONUT_C}`}
                            transform="rotate(-90 59 59)"
                          />
                          <circle
                            className="home4-hero__donut-arc home4-hero__donut-arc--card"
                            cx="59"
                            cy="59"
                            r="46"
                            strokeDasharray={`${DONUT_CARD} ${DONUT_C}`}
                            strokeDashoffset="-200"
                            transform="rotate(-90 59 59)"
                          />
                        </svg>
                        <span className="home4-hero__donut-label">
                          1,28M
                          <small>RSD</small>
                        </span>
                      </div>

                      <div className="home4-hero__legend">
                        <div>
                          <i className="home4-hero__lgd home4-hero__lgd--cash" aria-hidden />
                          Gotovina
                          <strong>68%</strong>
                        </div>
                        <div>
                          <i className="home4-hero__lgd home4-hero__lgd--card" aria-hidden />
                          Kartica
                          <strong>32%</strong>
                        </div>
                      </div>
                    </div>

                    <div className="home4-hero__debt">
                      <div className="home4-hero__debt-head">
                        <span>Dugovanja pacijenata</span>
                        <em>ukupno 143.400 RSD</em>
                      </div>
                      {DEBTS.map((debt) => (
                        <div key={debt.initials} className="home4-hero__debt-row">
                          <span className="home4-hero__debt-av">{debt.initials}</span>
                          <div>
                            <div className="home4-hero__debt-who">{debt.name}</div>
                            <div className="home4-hero__debt-sub">
                              Poslednja aktivnost {debt.last}
                            </div>
                          </div>
                          <span className="home4-hero__debt-amt">{debt.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust traka: zamena za placeholder logo traku (TrustLogos) ── */}
      <div className="home4-hero-proof">
        <ul className="home4-hero-proof__list">
          {TRUST.map(({ Icon, label }) => (
            <li key={label}>
              <Icon size={18} strokeWidth={1.75} aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
