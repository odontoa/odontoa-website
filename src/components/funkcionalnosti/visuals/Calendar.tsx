import type { CSSProperties } from 'react';
import { AlertTriangle, BellRing, CalendarDays, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock, Download, Plus } from 'lucide-react';
import { AppFrame, Pill } from './AppFrame';
import { CAL_DAYS, CAL_EVENTS, CAL_MOVED, CAL_NOW, CAL_TODAY, hhmm, type CalEvent, type CalStatus } from './data';

const STATUS: Record<CalStatus, { label: string; tone: 'green' | 'amber' | 'violet' | 'red'; Icon: typeof Clock }> = {
  done: { label: 'Završeno', tone: 'green', Icon: CheckCircle2 },
  ongoing: { label: 'U toku', tone: 'amber', Icon: Clock },
  booked: { label: 'Zakazano', tone: 'violet', Icon: Clock },
  urgent: { label: 'Hitno', tone: 'red', Icon: AlertTriangle },
};

function Event({ e, from, hour, className = '', style }: { e: CalEvent; from: number; hour: number; className?: string; style?: CSSProperties }) {
  const s = STATUS[e.status];
  return (
    <div
      className={`pv-ev pv-ev--${e.status} ${className}`}
      style={{ top: (e.start - from) * hour + 2, height: e.dur * hour - 4, ...style }}
    >
      <div className="pv-ev-t">
        {hhmm(e.start)}
        <Pill tone={s.tone}>{s.label}</Pill>
      </div>
      {e.label ? <span className="pv-ev-l">{e.label}</span> : null}
      <b>{e.name}</b>
    </div>
  );
}

function Grid({ days, from, to, hour, moved }: { days: number[]; from: number; to: number; hour: number; moved?: boolean }) {
  const cols = `56px repeat(${days.length}, 1fr)`;
  return (
    <div className="pv-cal">
      <div className="pv-cal-head" style={{ gridTemplateColumns: cols }}>
        <div>VREME</div>
        {days.map((d) => (
          <div key={d} className={d === CAL_TODAY ? 'is-today' : undefined}>
            {CAL_DAYS[d][0]}
            <small>
              {CAL_DAYS[d][1]}
              {d === CAL_TODAY && moved ? ' · danas' : ''}
            </small>
          </div>
        ))}
      </div>
      <div className="pv-cal-body" style={{ gridTemplateColumns: cols }}>
        <div className="pv-cal-times">
          {/* Sat koji bi se sudario sa oznakom trenutnog vremena se ne ispisuje (kao u kalendarima). */}
          {Array.from({ length: to - from }, (_, i) => (
            <div key={i} style={{ height: hour }}>
              {Math.abs(from + i - CAL_NOW) < 0.4 ? null : hhmm(from + i)}
            </div>
          ))}
        </div>
        {days.map((d) => (
          <div key={d} className="pv-cal-col" style={{ backgroundSize: `100% ${hour}px` }}>
            {CAL_EVENTS.filter((e) => e.day === d && e.start >= from && e.start < to)
              .filter((e) => !(moved && e.day === CAL_TODAY && e.name === CAL_MOVED.name))
              .map((e) => (
                <Event key={e.name + e.start} e={e} from={from} hour={hour} />
              ))}
            {moved && d === CAL_TODAY ? (
              <>
                <div className="pv-ev pv-ev--ghost" style={{ top: (CAL_MOVED.from - from) * hour + 2, height: CAL_MOVED.dur * hour - 4 }}>
                  <div className="pv-ev-t">{hhmm(CAL_MOVED.from)}</div>
                  <b>{CAL_MOVED.name}</b>
                </div>
                <Event
                  e={{ day: d, start: CAL_MOVED.to, dur: CAL_MOVED.dur, name: CAL_MOVED.name, status: 'booked' }}
                  from={from}
                  hour={hour}
                  className="pv-ev--lift"
                />
              </>
            ) : null}
          </div>
        ))}
        {CAL_NOW >= from && CAL_NOW < to ? (
          <div className="pv-now" style={{ top: (CAL_NOW - from) * hour }}>
            <i>{hhmm(CAL_NOW)}</i>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Pozadina: cela nedelja u aplikaciji. */
export function CalendarScreen({ days = [0, 1, 2, 3, 4], from = 8, to = 16, hour = 66 }: { days?: number[]; from?: number; to?: number; hour?: number }) {
  return (
    <AppFrame active="cal" crumb="Kalendar" current="Nedelja">
      <div className="pv-h">
        <div className="pv-row">
          <span className="pv-tile">
            <CalendarDays size={19} strokeWidth={1.75} />
          </span>
          <div className="pv-title">
            Kalendar termina
            <small>Pregled rasporeda i upravljanje terminima</small>
          </div>
        </div>
        <div className="pv-btns">
          <span className="pv-btn">
            <Download size={14} />
            Izvezi
          </span>
          <span className="pv-btn pv-btn--p">
            <Plus size={14} strokeWidth={2} />
            Novi termin
          </span>
        </div>
      </div>
      <div className="pv-row pv-toolbar">
        <div className="pv-seg">
          <span>Dan</span>
          <span className="is-on">Nedelja</span>
          <span>Mesec</span>
        </div>
        <ChevronLeft size={15} className="pv-muted" />
        <b className="pv-ink">27.07 – 31.07. jul 2026</b>
        <ChevronRight size={15} className="pv-muted" />
        <span className="pv-btn pv-btn--sm pv-accent">Danas</span>
        <span className="pv-btn pv-btn--sm">
          Svi doktori <ChevronDown size={13} />
        </span>
        <span className="pv-legend">
          <span><i className="pv-dot pv-dot--amber" />U toku</span>
          <span><i className="pv-dot pv-dot--violet" />Zakazano</span>
          <span><i className="pv-dot pv-dot--green" />Završeno</span>
          <span><i className="pv-dot pv-dot--red" />Hitno</span>
        </span>
      </div>
      <Grid days={days} from={from} to={to} hour={hour} />
    </AppFrame>
  );
}

/** Prednji plan: cetvrtak i petak, termin se prevlaci na 13:15, pacijent dobija obavestenje. */
export function CalendarDetail() {
  return (
    <div className="pv-surface pv-cal-detail">
      <Grid days={[3, 4]} from={11} to={16} hour={76} moved />
      <div className="pv-toast">
        <BellRing size={14} />
        Termin pomeren na {hhmm(CAL_MOVED.to)} · pacijent dobija obaveštenje
      </div>
    </div>
  );
}
