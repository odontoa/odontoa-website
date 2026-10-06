import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Banknote,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  FlaskConical,
  LayoutDashboard,
  Settings,
  Stethoscope,
  Users,
} from 'lucide-react';
import {
  fmt,
  HERO_CHART,
  HERO_TODAY,
  HERO_TOTALS,
  TODAY_STATUS_LABEL,
} from './hero-data';

/* Rail: uprosceni glavni moduli aplikacije (bez podmenija), aktivne su Finansije.
   Ikonice prate aplikaciju; Banknote umesto DollarSign jer se sve vodi u RSD. */
const RAIL = [
  { Icon: LayoutDashboard, key: 'dashboard' },
  { Icon: CalendarDays, key: 'kalendar' },
  { Icon: Users, key: 'pacijenti' },
  { Icon: Stethoscope, key: 'doktori' },
  { Icon: Banknote, key: 'finansije', active: true },
  { Icon: Building2, key: 'ordinacija' },
  { Icon: FlaskConical, key: 'tehnika' },
  { Icon: BookOpen, key: 'mkb' },
];

const TABS = ['Ovaj mesec', 'Prošli mesec', 'Ova godina', 'Period'];

/* T2: samo proverive tvrdnje, kao mikrokopija ispod CTA. */
const MICRO = ['30 dana besplatno', 'Uvoz pacijenata'];

export default function Hero() {
  const { gross, lab, net, labOrders, labShare, grossVsJun, netVsJun } = HERO_TOTALS;
  const { focus } = HERO_CHART;

  return (
    <section className="hero">
      <div className="hero__inner">
        <p className="hero__eyebrow">Softver za stomatološke ordinacije</p>

        <h1 className="hero__title">
          Znaš šta je zakazano.
          <br />
          Šta je urađeno.
          <br />
          {/* Akcenat samo na novcu; nowrap da "naplaćeno." ne ostane sam u redu */}
          <span className="hero__title-accent">I šta je naplaćeno.</span>
        </h1>

        <p className="hero__sub">
          Izbegni nepotrebnu administraciju posle termina. Završi termin jednom, bez
          naknadnog prepisivanja.
        </p>

        {/* Jedna glavna akcija; demo je namerno slabiji tekstualni link, ne drugo dugme. */}
        <div className="hero__ctas">
          <Link href="/register" className="hero__btn hero__btn--primary">
            Započni besplatno
          </Link>
          <Link href="/demo" className="hero__link">
            Zakaži demo
            <ArrowRight size={15} strokeWidth={2} aria-hidden />
          </Link>
        </div>

        <ul className="hero__micro">
          {MICRO.map((label) => (
            <li key={label}>
              <Check size={14} strokeWidth={2.25} aria-hidden />
              {label}
            </li>
          ))}
        </ul>

        {/* ── Panel: deo aplikacije (rail + Finansije / Izveštaji), ne izolovan widget ── */}
        <div className="hero__panel-wrap">
          <div className="hero__app">
            <div className="hero__rail" aria-hidden>
              <Image
                src="/images/Odontoa-New-logo-pack-2026/favicon_color.png"
                alt=""
                width={26}
                height={26}
                className="hero__rail-mark"
              />
              {RAIL.map(({ Icon, key, active }) => (
                <span key={key} className={active ? 'hero__rail-item is-active' : 'hero__rail-item'}>
                  <Icon size={18} strokeWidth={1.75} />
                </span>
              ))}
              <span className="hero__rail-spacer" />
              <span className="hero__rail-item">
                <Settings size={18} strokeWidth={1.75} />
              </span>
              <span className="hero__rail-avatar">JS</span>
            </div>

            <div className="hero__main">
              <div className="hero__top">
                <div className="hero__crumb">
                  Finansije <span aria-hidden>/</span> <b>Izveštaji</b>
                </div>
                <div className="hero__org">
                  <i aria-hidden />
                  Videnta
                </div>
              </div>

              <div className="hero__dash">
                <div className="hero__dash-head">
                  <div>
                    <div className="hero__dash-title">Finansijski pregled</div>
                    <div className="hero__dash-sub">1–31. jul 2026</div>
                  </div>
                  <div className="hero__tabs" aria-hidden>
                    {TABS.map((tab, i) => (
                      <span key={tab} className={i === 0 ? 'is-active' : undefined}>
                        {tab}
                      </span>
                    ))}
                  </div>
                </div>

                {/* K2: jednacina bez kartica. Znakovi izmedju kolona su dekorativni na
                    desktopu; na mobilnom se citaju kao racun u tri reda. */}
                <div className="hero__eq">
                  <div className="hero__eq-item">
                    <span className="hero__eq-label">Bruto naplata</span>
                    <strong className="hero__eq-num">
                      {fmt(gross)}
                      <i>RSD</i>
                    </strong>
                    <span className="hero__eq-note">
                      <b>↑ {grossVsJun}%</b> vs. jun
                    </span>
                  </div>
                  <span className="hero__eq-sign" aria-hidden>
                    −
                  </span>
                  <div className="hero__eq-item">
                    <span className="hero__eq-label">
                      <i className="hero__eq-op" aria-hidden>
                        −
                      </i>
                      Trošak tehnike
                    </span>
                    <strong className="hero__eq-num">
                      {fmt(lab)}
                      <i>RSD</i>
                    </strong>
                    <span className="hero__eq-note">
                      {labShare}% bruta · {labOrders} naloga
                    </span>
                  </div>
                  <span className="hero__eq-sign" aria-hidden>
                    =
                  </span>
                  <div className="hero__eq-item hero__eq-item--net">
                    <span className="hero__eq-label">
                      <i className="hero__eq-op" aria-hidden>
                        =
                      </i>
                      Neto prihod
                    </span>
                    <strong className="hero__eq-num">
                      {fmt(net)}
                      <i>RSD</i>
                    </strong>
                    <span className="hero__eq-note">
                      <b>↑ {netVsJun}%</b> vs. jun
                    </span>
                  </div>
                </div>

                <div className="hero__body">
                  {/* C2: kumulativna bruto naplata, jul naspram juna, linearna skala 0-1,4M */}
                  <div className="hero__chart-col">
                    <div className="hero__box-head">
                      <span className="hero__box-title">Bruto naplata, kumulativno</span>
                      <span className="hero__legend" aria-hidden>
                        <span>
                          <i className="hero__legend-jul" />
                          Jul 2026
                        </span>
                        <span>
                          <i className="hero__legend-jun" />
                          Jun 2026
                        </span>
                      </span>
                    </div>

                    <div className="hero__chart" aria-hidden>
                      <div className="hero__plot">
                        <svg viewBox={HERO_CHART.viewBox} preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="heroJulFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="var(--stellar-accent)" stopOpacity="0.1" />
                              <stop offset="100%" stopColor="var(--stellar-accent)" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          {HERO_CHART.grid.map((g) => (
                            <line
                              key={g.label}
                              className={g.label === '0' ? 'hero__grid hero__grid--base' : 'hero__grid'}
                              x1="0"
                              x2="600"
                              y1={g.y}
                              y2={g.y}
                              vectorEffect="non-scaling-stroke"
                            />
                          ))}
                          <line
                            className="hero__focus-line"
                            x1={focus.x}
                            x2={focus.x}
                            y1="0"
                            y2="200"
                            vectorEffect="non-scaling-stroke"
                          />
                          <path className="hero__line-jun" d={HERO_CHART.junLine} vectorEffect="non-scaling-stroke" />
                          <path d={HERO_CHART.julArea} fill="url(#heroJulFill)" />
                          <path className="hero__line-jul" d={HERO_CHART.julLine} vectorEffect="non-scaling-stroke" />
                        </svg>

                        {/* Tacke su HTML: SVG se razvlaci po X, pa bi krug postao elipsa. */}
                        <span
                          className="hero__dot hero__dot--jun"
                          style={{ left: focus.left, top: focus.junTop }}
                        />
                        <span
                          className="hero__dot hero__dot--jul"
                          style={{ left: focus.left, top: focus.julTop }}
                        />
                        <div className="hero__tip" style={{ left: focus.left, top: focus.julTop }}>
                          <span className="hero__tip-title">Do {focus.day}. u mesecu</span>
                          <span className="hero__tip-row">
                            <i className="hero__legend-jul" />
                            Jul<b>{fmt(focus.jul)}</b>
                          </span>
                          <span className="hero__tip-row">
                            <i className="hero__legend-jun" />
                            Jun<b>{fmt(focus.jun)}</b>
                          </span>
                          <span className="hero__tip-row hero__tip-row--diff">
                            Razlika<b>+{focus.diff}%</b>
                          </span>
                        </div>
                      </div>

                      <div className="hero__chart-y">
                        {HERO_CHART.grid.map((g) => (
                          <span key={g.label} style={{ top: g.top }}>
                            {g.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="hero__chart-x" aria-hidden>
                      {HERO_CHART.xLabels.map((l) => (
                        <span key={l.label} style={{ left: l.left }}>
                          {l.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* P5: operativni deo dana, statusi prate naslov */}
                  <div className="hero__today">
                    <div className="hero__box-head">
                      <span className="hero__box-title">Danas · petak, 31. jul</span>
                      <span className="hero__box-meta">{HERO_TODAY.length} termina</span>
                    </div>
                    <ul className="hero__agenda">
                      {HERO_TODAY.map((row) => (
                        <li
                          key={row.time}
                          className={row.mobile ? 'hero__ag' : 'hero__ag hero__ag--desktop'}
                        >
                          <span className="hero__ag-time">{row.time}</span>
                          <span className="hero__ag-who">
                            {row.patient}
                            <small>{row.treatment}</small>
                          </span>
                          <span className="hero__ag-status">
                            <span className={`hero__pill hero__pill--${row.status}`}>
                              {TODAY_STATUS_LABEL[row.status]}
                            </span>
                            {row.amount ? <small>{fmt(row.amount)} RSD</small> : null}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
