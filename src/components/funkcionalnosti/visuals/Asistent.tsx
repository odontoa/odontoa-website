import Image from 'next/image';
import { SendHorizontal, X } from 'lucide-react';
import { CalendarScreen } from './Calendar';
import { CLINIC, DEBTORS, DEBTORS_TOTAL, DOCTOR, fmt } from './data';

/** Pozadina: kalendar u aplikaciji (asistent se otvara iz aplikacije, ne kao zaseban chat). */
export function AsistentScreen() {
  return <CalendarScreen days={[1, 2, 3, 4]} from={9} to={15} hour={62} />;
}

const Mark = () => <Image src="/images/Odontoa-New-logo-pack-2026/favicon_color.png" alt="" width={18} height={18} />;

/**
 * Prednji plan: panel asistenta. Odmah se vidi ko pita (doktor) i da odgovor dolazi
 * iz podataka ordinacije: imena i iznosi su isti kao u kartonu i predracunu.
 * Akcije su samo prelazi na postojece ekrane (karton, dugovanja, kalendar).
 */
export function AsistentPanel() {
  return (
    <div className="pv-ai pv-surface">
      <div className="pv-ai-h">
        <span className="pv-ai-mark">
          <Mark />
        </span>
        <div>
          <b>Odontoa asistent</b>
          <small>odgovara iz podataka: {CLINIC}</small>
        </div>
        <X size={16} className="pv-muted pv-ml" />
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
          <small>
            <Mark />
            Odontoa asistent
          </small>
          <div>
            Dva pacijenta:
            {DEBTORS.map((d) => (
              <div key={d.name} className="pv-ai-ln">
                <span>{d.name}</span>
                <b>{fmt(d.amount)} RSD</b>
              </div>
            ))}
            <div className="pv-ai-ln">
              <span className="pv-muted">Ukupno</span>
              <b>{fmt(DEBTORS_TOTAL)} RSD</b>
            </div>
            <div className="pv-ai-acts">
              <span>Otvori dugovanja</span>
              <span>Otvori karton</span>
            </div>
          </div>
        </div>
        <div className="pv-ai-q">
          <small>
            <i>JS</i>
            {DOCTOR}
          </small>
          <div>Ko dolazi sutra pre podne?</div>
        </div>
        <div className="pv-ai-a">
          <small>
            <Mark />
            Odontoa asistent
          </small>
          <div>
            Subota, 1. avgust:
            <div className="pv-ai-ln">
              <span>09:00 · Sanja Ilić</span>
              <span className="pv-muted">kontrola</span>
            </div>
            <div className="pv-ai-ln">
              <span>10:30 · Marko Nikolić</span>
              <span className="pv-muted">kompozitna plomba</span>
            </div>
            <div className="pv-ai-acts">
              <span>Otvori kalendar</span>
            </div>
          </div>
        </div>
      </div>
      <div className="pv-ai-in">
        Pitaj o pacijentima, terminima ili naplati…
        <i>
          <SendHorizontal size={14} />
        </i>
      </div>
    </div>
  );
}
