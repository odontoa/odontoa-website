import { Check, ChevronDown, Plus, X } from 'lucide-react';
import { AppFrame, Pill } from './AppFrame';
import { ORDER_LABEL, ORDERS, fmt, type OrderStatus } from './data';

const TONE: Record<OrderStatus, 'draft' | 'green' | 'cancel'> = { draft: 'draft', done: 'green', cancelled: 'cancel' };

/** Pozadina: lista radnih naloga sa laboratorijom, rokom, cenom i statusom. */
export function TehnikaScreen() {
  return (
    <AppFrame active="teh" crumb="Ordinacija" current="Tehnika">
      <div className="pv-h">
        <div>
          <div className="pv-eb">Ordinacija</div>
          <div className="pv-title">
            Tehnika<small>Radni nalozi i laboratorije</small>
          </div>
        </div>
        <span className="pv-btn pv-btn--p">
          <Plus size={14} strokeWidth={2} />
          Novi nalog
        </span>
      </div>
      <div className="pv-card">
        <div className="pv-card-h">
          Radni nalozi ({ORDERS.length})<small>jul–avgust 2026</small>
        </div>
        <table className="pv-table">
          <thead>
            <tr>
              <th>Pacijent</th>
              <th>Laboratorija</th>
              <th>Vrsta rada</th>
              <th>Rok</th>
              <th className="pv-r">Cena</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((o) => (
              <tr key={o.patient + o.work}>
                <td>
                  <span className="pv-row pv-gap8">
                    <span className="pv-av">{o.initials}</span>
                    <b>{o.patient}</b>
                  </span>
                </td>
                <td>{o.lab}</td>
                <td>{o.work}</td>
                <td className="pv-tnum">{o.due}</td>
                <td className="pv-r">
                  <b>{fmt(o.price)}</b> RSD
                </td>
                <td>
                  <Pill tone={TONE[o.status]}>{ORDER_LABEL[o.status]}</Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppFrame>
  );
}

/**
 * Prednji plan: nalog za tehnicara, kao u aplikaciji, ali rasterecen za prikaz:
 * samo izabrana vrsta rada i jedan izabran zub (bez cele vilice), boja i cena u istom redu.
 */
export function TehnikaOrder() {
  return (
    <div className="pv-drawer pv-surface">
      <div className="pv-row pv-drawer-h">
        <div>
          <h5>Nalog za tehničara</h5>
          <div className="pv-muted">NL-2026-0014 · Aleksandra Božić</div>
        </div>
        <Pill tone="draft">Nacrt</Pill>
        <X size={18} className="pv-muted" />
      </div>
      <div className="pv-fld">
        <label>Laboratorija</label>
        <div className="pv-in">
          Lab Dentalux
          <ChevronDown size={14} />
        </div>
      </div>
      <div className="pv-fld2">
        <div className="pv-fld">
          <label>Datum otvaranja</label>
          <div className="pv-in">27.07.2026.</div>
        </div>
        <div className="pv-fld">
          <label>Rok</label>
          <div className="pv-in pv-in--accent">
            06.08.2026.
            <Pill tone="violet">za 6 dana</Pill>
          </div>
        </div>
      </div>
      <div className="pv-fld">
        <label>Vrsta rada</label>
        <div className="pv-work">
          <span className="pv-chk is-on">
            <i>
              <Check size={10} strokeWidth={3} />
            </i>
            Bezmetalna krunica (cirkon)
          </span>
          <span className="pv-muted">Fiksna protetika</span>
        </div>
      </div>
      <div className="pv-fld3">
        <div className="pv-fld">
          <label>Zub</label>
          <div className="pv-tooth-pick">
            <b>16</b>
            <span>gornja desno</span>
          </div>
        </div>
        <div className="pv-fld">
          <label>Boja</label>
          <div className="pv-in">A2</div>
        </div>
        <div className="pv-fld">
          <label>Cena rada</label>
          <div className="pv-in pv-tnum">6.900 RSD</div>
        </div>
      </div>
    </div>
  );
}
