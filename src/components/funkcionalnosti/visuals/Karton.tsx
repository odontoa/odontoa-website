import { Calendar, Camera, Copy, FileText, HeartPulse, LayoutGrid, PenLine, Printer, type LucideIcon } from 'lucide-react';
import { AppFrame, Pill } from './AppFrame';
import { DIAGNOSES, DOCTOR, HISTORY, PATIENT, TEETH_LOWER, TEETH_UPPER, TOOTH_FOUND, TOOTH_STATE, type ToothState } from './data';

/** Zaglavlje kartona pacijenta (isto za Karton i Snimke). */
export function PatientHead({ p }: { p: { name: string; initials: string; id: string; age: string; born: string; phone: string } }) {
  return (
    <div className="pv-card pv-patient">
      <span className="pv-av pv-av--lg">{p.initials}</span>
      <div>
        <div className="pv-row pv-gap10">
          <b className="pv-patient-name">{p.name}</b>
          <span className="pv-muted pv-s12">ID · {p.id}</span>
          <Pill tone="violet">{p.age}</Pill>
        </div>
        <div className="pv-row pv-patient-meta">
          <span>
            Rođena <b>{p.born}</b>
          </span>
          <span>
            Telefon <b>{p.phone}</b>
          </span>
        </div>
      </div>
      <div className="pv-btns pv-ml">
        <span className="pv-btn">
          <Printer size={14} />
          Štampaj
        </span>
        <span className="pv-btn pv-btn--p">
          <PenLine size={13} />
          Izmeni
        </span>
      </div>
    </div>
  );
}

const TABS: [string, LucideIcon][] = [
  ['Pregled', LayoutGrid],
  ['Karton', FileText],
  ['Terapije i termini', Calendar],
  ['Dokumenti', Copy],
];
const SUBTABS: [string, LucideIcon][] = [
  ['Zubni status', HeartPulse],
  ['Zdravstveni profil', HeartPulse],
  ['Snimci', Camera],
];
export function PatientTabs({ sub }: { sub: string }) {
  return (
    <>
      <div className="pv-tabs">
        {TABS.map(([t, I]) => (
          <span key={t} className={t === 'Karton' ? 'is-on' : undefined}>
            <I size={14} />
            {t}
          </span>
        ))}
      </div>
      <div className="pv-tabs pv-tabs--sub">
        {SUBTABS.map(([t, I]) => (
          <span key={t} className={t === sub ? 'is-on' : undefined}>
            <I size={14} />
            {t}
          </span>
        ))}
      </div>
    </>
  );
}

const TOOTH_TONE: Record<ToothState | 'healthy', { label: string; stroke: string; fill: string }> = {
  healthy: { label: 'Zdrav', stroke: '#c3c8d4', fill: '#fff' },
  caries: { label: 'Karijes', stroke: '#d23f3f', fill: '#fff' },
  filling: { label: 'Ispun', stroke: '#2f6bdc', fill: '#fff' },
  crown: { label: 'Krunica', stroke: '#7a55e0', fill: '#ebe5fd' },
  endo: { label: 'Endodoncija', stroke: '#e2742a', fill: '#fff' },
  missing: { label: 'Nedostaje', stroke: '#a3a9b8', fill: 'none' },
};
const LEGEND_TONES: (ToothState | 'healthy')[] = ['healthy', 'caries', 'filling', 'crown', 'endo', 'missing'];

/* Konturni zub kao u aplikaciji: korenovi gore, krunica dole (donji zubi su preslikani). */
function toothShape(pos: number) {
  if (pos >= 6)
    return {
      roots: ['M5,26 L6,10 Q8,5 10,10 L11,24', 'M13,24 L14,10 Q16,5 18,10 L19,26'],
      crown: 'M3,26 H21 V36 Q21,41 18,41 Q16.5,38.5 15,41 Q13.5,38.5 12,41 Q10.5,38.5 9,41 Q7.5,38.5 6,41 Q3,41 3,36 Z',
      canals: ['M8,25 L8,12', 'M16,25 L16,12'],
    };
  if (pos >= 4)
    return { roots: ['M8,26 L9.5,8 Q12,2 14.5,8 L16,26'], crown: 'M6,26 H18 V36 Q18,41 12,41 Q6,41 6,36 Z', canals: ['M12,25 L12,9'] };
  if (pos === 3)
    return { roots: ['M8.5,26 L10,5 Q12,-0.5 14,5 L15.5,26'], crown: 'M7,26 H17 V35 L12,42 L7,35 Z', canals: ['M12,25 L12,6'] };
  return { roots: ['M8,26 L9.5,8 Q12,2.5 14.5,8 L16,26'], crown: 'M7,26 H17 V38 Q17,42 12,42 Q7,42 7,38 Z', canals: ['M12,25 L12,9'] };
}

export function ToothGlyph({ pos, state = 'healthy', upper = true, selected }: { pos: number; state?: ToothState | 'healthy'; upper?: boolean; selected?: boolean }) {
  const t = TOOTH_TONE[state];
  const sh = toothShape(pos);
  const dash = state === 'missing' ? '2 1.6' : undefined;
  return (
    <svg viewBox="0 0 24 44">
      <g transform={upper ? undefined : 'translate(0 44) scale(1 -1)'} stroke={t.stroke} strokeWidth="1.1" strokeLinejoin="round">
        {sh.roots.map((d) => (
          <path key={d} d={d} fill={state === 'missing' ? 'none' : '#fff'} strokeDasharray={dash} />
        ))}
        <path d={sh.crown} fill={t.fill} strokeDasharray={dash} />
        {state === 'endo' ? sh.canals.map((d) => <path key={d} d={d} strokeWidth="1.6" strokeLinecap="round" />) : null}
        {state === 'filling' ? <rect x="9" y="30" width="6" height="5" rx="1.5" fill={t.stroke} stroke="none" /> : null}
        {state === 'caries' ? <circle cx="12" cy="33" r="2.4" fill={t.stroke} stroke="none" /> : null}
        {state === 'missing' ? <path d="M4,8 L20,40 M20,8 L4,40" strokeWidth="1.3" strokeLinecap="round" /> : null}
      </g>
      {selected ? <rect x="0.75" y="0.75" width="22.5" height="42.5" rx="5" fill="none" stroke="#6e51e0" strokeWidth="1.5" /> : null}
    </svg>
  );
}

function Arch({ teeth, upper, selected }: { teeth: number[]; upper: boolean; selected?: number }) {
  return (
    <div className="pv-odo-arch">
      {teeth.map((n, i) => {
        const st = TOOTH_STATE[n];
        return (
          <div key={n} className={`pv-tooth${i === 8 ? ' pv-tooth--mid' : ''}${n === selected ? ' is-sel' : ''}`}>
            <span className="pv-tooth-n">
              {n}
              {TOOTH_FOUND.includes(n) ? <i className="pv-found">Z</i> : null}
            </span>
            <ToothGlyph pos={n % 10} state={st} upper={upper} selected={n === selected} />
            <span className="pv-tooth-l" style={st ? { color: TOOTH_TONE[st].stroke } : undefined}>
              {st ? TOOTH_TONE[st].label : ''}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function Odontogram({ selected = 36 }: { selected?: number }) {
  return (
    <>
      <div className="pv-odo">
        <div className="pv-odo-jaw">▲ Gornja vilica</div>
        <Arch teeth={TEETH_UPPER} upper selected={selected} />
        <div className="pv-odo-gap">
          <span>Stalni zubi (FDI)</span>
        </div>
        <Arch teeth={TEETH_LOWER} upper={false} selected={selected} />
        <div className="pv-odo-jaw">▼ Donja vilica</div>
      </div>
      <div className="pv-odo-leg">
        {LEGEND_TONES.map((k) => (
          <span key={k}>
            <ToothGlyph pos={6} state={k} />
            {TOOTH_TONE[k].label}
          </span>
        ))}
        <span>
          <i className="pv-found">Z</i>
          Zatečeno stanje
        </span>
      </div>
    </>
  );
}

/** Pozadina: karton iste pacijentkinje (zubni status, dijagnoze, istorija). */
export function KartonScreen() {
  return (
    <AppFrame active="pac" crumb="Pacijenti" current={PATIENT.name}>
      <PatientHead p={PATIENT} />
      <PatientTabs sub="Zubni status" />
      <div className="pv-split">
        <div className="pv-card">
          <div className="pv-card-h">
            Zubni status<small>poslednja izmena 17.07.2026. · {DOCTOR}</small>
          </div>
          <Odontogram />
        </div>
        <div className="pv-stack">
          <div className="pv-card">
            <div className="pv-card-h">
              Dijagnoze · MKB-10<small>3</small>
            </div>
            <div className="pv-list">
              {DIAGNOSES.map((d) => (
                <div key={d.code}>
                  <Pill tone={d.tone === 'red' ? 'red' : 'draft'}>{d.code}</Pill>
                  <div>
                    <b>{d.name}</b>
                    <small>{d.where}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pv-card">
            <div className="pv-card-h">
              Istorija tretmana<small>11 poseta</small>
            </div>
            <div className="pv-list">
              {HISTORY.map(([t, s]) => (
                <div key={t + s}>
                  <div>
                    <b>{t}</b>
                    <small>{s}</small>
                  </div>
                  <span className="pv-ml">
                    <Pill tone="green">Završeno</Pill>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

/** Prednji plan: odontogram sa otvorenim zubom 36. */
export function OdontogramDetail() {
  return (
    <div className="pv-odo-detail">
      <div className="pv-card pv-surface">
        <div className="pv-card-h">
          Zubni status · {PATIENT.name}
          <small>FDI numeracija</small>
        </div>
        <Odontogram selected={36} />
      </div>
      <div className="pv-pop">
        <h5>Zub 36 · Endodoncija</h5>
        <div className="pv-kv">Datum<b>16.07.2026. · 11:45</b></div>
        <div className="pv-kv">Dijagnoza<b>K04.0 Pulpitis</b></div>
        <div className="pv-kv">Kanali<b>2, obturisani</b></div>
        <div className="pv-kv">Doktor<b>{DOCTOR}</b></div>
      </div>
    </div>
  );
}
