import Image from 'next/image';
import type { ReactNode } from 'react';
import {
  Banknote,
  BookOpen,
  Building2,
  CalendarDays,
  FlaskConical,
  LayoutDashboard,
  Settings,
  Stethoscope,
  Users,
} from 'lucide-react';
import { CLINIC_SHORT } from './data';

/* Uproscena glavna navigacija aplikacije, ista kao u heroju pocetne. */
const RAIL = [
  { key: 'dash', Icon: LayoutDashboard },
  { key: 'cal', Icon: CalendarDays },
  { key: 'pac', Icon: Users },
  { key: 'dok', Icon: Stethoscope },
  { key: 'fin', Icon: Banknote },
  { key: 'ord', Icon: Building2 },
  { key: 'teh', Icon: FlaskConical },
  { key: 'mkb', Icon: BookOpen },
] as const;
export type RailKey = (typeof RAIL)[number]['key'];

/** Okvir aplikacije sirine 1080px: rail, breadcrumb, telo. Bez lazne trake pregledaca. */
export function AppFrame({
  active,
  crumb,
  current,
  children,
  overlay,
}: {
  active: RailKey;
  crumb: string;
  current: string;
  children: ReactNode;
  overlay?: ReactNode;
}) {
  return (
    <div className="pv-app">
      <div className="pv-rail">
        <Image src="/images/Odontoa-New-logo-pack-2026/favicon_color.png" alt="" width={24} height={24} />
        {RAIL.map(({ key, Icon }) => (
          <span key={key} className={key === active ? 'is-on' : undefined}>
            <Icon size={17} strokeWidth={1.75} />
          </span>
        ))}
        <span className="pv-rail-sp" />
        <span>
          <Settings size={17} strokeWidth={1.75} />
        </span>
        <span className="pv-rail-av">JS</span>
      </div>
      <div className="pv-main">
        <div className="pv-top">
          <div className="pv-crumb">
            {crumb}
            <span>/</span>
            <b>{current}</b>
          </div>
          <div className="pv-org">
            <i />
            {CLINIC_SHORT}
          </div>
        </div>
        <div className="pv-body">{children}</div>
      </div>
      {overlay}
    </div>
  );
}

export function Pill({ tone, children }: { tone: 'violet' | 'green' | 'red' | 'amber' | 'draft' | 'cancel' | 'gray'; children: ReactNode }) {
  return <span className={`pv-pill pv-pill--${tone}`}>{children}</span>;
}
