import Image from 'next/image';
import { SendHorizontal, X } from 'lucide-react';
import { CalendarScreen } from './Calendar';
import { DEBTORS, DEBTORS_TOTAL, DOCTOR, fmt } from './data';

/** Pozadina: kalendar u aplikaciji (asistent se otvara iz aplikacije, ne kao zaseban chat). */
export function AsistentScreen() {
  return <CalendarScreen days={[1, 2, 3, 4]} from={9} to={15} hour={62} />;
}

const Mark = ({ size = 18 }: { size?: number }) => (
  <Image src="/images/Odontoa-New-logo-pack-2026/favicon_color.png" alt="" width={size} height={size} />
);

const Arrow = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M3 8h10m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Prednji plan: panel asistenta, isti vizuelni jezik kao asistent na pocetnoj
 * (tihi baloni za pitanja, odgovor kao tekst pored Odontoa znaka). Odmah se vidi ko pita
 * (doktor) i da odgovor dolazi iz podataka ordinacije: imena i iznosi su isti kao u
 * kartonu i predracunu. Akcije su samo prelazi na postojece ekrane (karton, dugovanja, kalendar).
 */
export function AsistentPanel() {
  return (
    <div className="pv-ai">
      <div className="pv-ai-h">
        <Mark />
        <div>
          <b>Odontoa asistent</b>
          <small>Odgovara iz podataka ordinacije</small>
        </div>
        <X size={16} className="pv-ai-x pv-ml" />
      </div>
      <div className="pv-ai-b">
        <div className="pv-ai-q">
          <small>
            <i>JS</i>
            {DOCTOR}
          </small>
          <div>Koji pacijenti duguju više od 20.000 RSD?</div>
        </div>
        <div className="pv-ai-a">
          <Mark size={20} />
          <div>
            <p>Dva pacijenta:</p>
            <div className="pv-ai-rows">
              {DEBTORS.map((d) => (
                <div key={d.name} className="pv-ai-ln">
                  <span>{d.name}</span>
                  <b>{fmt(d.amount)} RSD</b>
                </div>
              ))}
              <div className="pv-ai-ln pv-ai-ln--sum">
                <span>Ukupno</span>
                <b>{fmt(DEBTORS_TOTAL)} RSD</b>
              </div>
            </div>
            <div className="pv-ai-acts">
              <span>
                Otvori dugovanja
                <Arrow />
              </span>
              <span>
                Otvori karton
                <Arrow />
              </span>
            </div>
          </div>
        </div>
        <div className="pv-ai-q">
          <div>Ko dolazi sutra pre podne?</div>
        </div>
        <div className="pv-ai-a">
          <Mark size={20} />
          <div>
            <p>Subota, 1. avgust:</p>
            <div className="pv-ai-rows">
              <div className="pv-ai-ln">
                <span>09:00 · Sanja Ilić</span>
                <span className="pv-ai-sub">kontrola</span>
              </div>
              <div className="pv-ai-ln">
                <span>10:30 · Marko Nikolić</span>
                <span className="pv-ai-sub">kompozitna plomba</span>
              </div>
            </div>
            <div className="pv-ai-acts">
              <span>
                Otvori kalendar
                <Arrow />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="pv-ai-in">
        <span>Pitaj o pacijentima, terminima ili naplati…</span>
        <i>
          <SendHorizontal size={14} />
        </i>
      </div>
    </div>
  );
}
