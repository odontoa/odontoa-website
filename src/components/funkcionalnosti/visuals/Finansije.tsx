import { BellRing, Plus, Printer } from 'lucide-react';
import { AppFrame, Pill } from './AppFrame';
import { CLINIC_SHORT, INVOICE, INVOICE_DUE, INVOICE_PAID, INVOICE_TOTAL, fmt } from './data';

/** Pozadina: stranica predracuna u aplikaciji (stavke, stanje, uplate, podsetnik). */
export function FinansijeScreen() {
  return (
    <AppFrame active="fin" crumb="Finansije" current="Predračuni">
      <div className="pv-h">
        <div>
          <div className="pv-eb">Predračun</div>
          <div className="pv-title">
            {INVOICE.number}
            <small>Aleksandra Božić · izdat {INVOICE.issued} · plan terapije</small>
          </div>
        </div>
        <div className="pv-btns">
          <span className="pv-btn">
            <Printer size={14} />
            Štampaj
          </span>
          <span className="pv-btn pv-btn--p">
            <Plus size={14} strokeWidth={2} />
            Evidentiraj uplatu
          </span>
        </div>
      </div>
      <div className="pv-split">
        <div className="pv-card">
          <div className="pv-card-h">
            Stavke<small>{INVOICE.items.length}</small>
          </div>
          <table className="pv-table">
            <thead>
              <tr>
                <th>Usluga</th>
                <th>Zub</th>
                <th>Stanje</th>
                <th className="pv-r">Iznos</th>
              </tr>
            </thead>
            <tbody>
              {INVOICE.items.map((i) => (
                <tr key={i.service + i.tooth}>
                  <td>
                    <b>{i.service}</b>
                  </td>
                  <td>{i.tooth}</td>
                  <td className="pv-muted">{i.state}</td>
                  <td className="pv-r">
                    <b>{fmt(i.amount)}</b>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pv-sum">
            <span>Ukupno</span>
            <span>{fmt(INVOICE_TOTAL)} RSD</span>
          </div>
        </div>
        <div className="pv-stack">
          <div className="pv-card">
            <div className="pv-card-h">Stanje</div>
            <div className="pv-sum pv-sum--grid">
              <span>Ukupno</span>
              <span>{fmt(INVOICE_TOTAL)}</span>
              <span>Uplaćeno</span>
              <span>{fmt(INVOICE_PAID)}</span>
              <span>Preostalo</span>
              <span className="pv-due">{fmt(INVOICE_DUE)} RSD</span>
            </div>
          </div>
          <div className="pv-card">
            <div className="pv-card-h">
              Uplate<small>{INVOICE.payments.length}</small>
            </div>
            <div className="pv-list">
              {INVOICE.payments.map((p) => (
                <div key={p.date}>
                  <div>
                    <b>{fmt(p.amount)} RSD</b>
                    <small>{p.date}</small>
                  </div>
                  <span className="pv-ml">
                    <Pill tone="gray">{p.method}</Pill>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="pv-card">
            <div className="pv-card-h">
              Podsetnik za dug<Pill tone="violet">Zakazan</Pill>
            </div>
            <div className="pv-list">
              <div>
                <BellRing size={15} />
                <div>
                  <b>SMS · {INVOICE.reminder}</b>
                  <small>preostalo {fmt(INVOICE_DUE)} RSD</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

/** Prednji plan: uvecan deo iste stranice (stanje predracuna + podsetnik za dug), ne zaseban panel. */
export function FinansijeFocus() {
  return (
    <div className="pv-zoom pv-surface">
      <div className="pv-zoom-h">
        <div>
          <small>Predračun {INVOICE.number}</small>
          <b>Aleksandra Božić</b>
        </div>
        <Pill tone="red">Dug</Pill>
      </div>
      <div className="pv-sum pv-sum--grid pv-zoom-rows">
        <span>Ukupno po predračunu</span>
        <span>{fmt(INVOICE_TOTAL)} RSD</span>
        <span>Uplaćeno ({INVOICE.payments.length} uplate)</span>
        <span>{fmt(INVOICE_PAID)} RSD</span>
        <span>Preostalo</span>
        <span className="pv-due pv-due--lg">{fmt(INVOICE_DUE)} RSD</span>
      </div>
      <div className="pv-zoom-rem">
        <div className="pv-row pv-zoom-rem-h">
          <b className="pv-row pv-gap6">
            <BellRing size={14} />
            Podsetnik za dug
          </b>
          <span className="pv-toggle" />
        </div>
        <div className="pv-row pv-gap8 pv-muted pv-s12">
          <Pill tone="violet">SMS</Pill>
          {INVOICE.reminder} · šalje se automatski
        </div>
        <div className="pv-bubble">
          Poštovana Aleksandra, podsećamo Vas na preostali iznos od {fmt(INVOICE_DUE)} RSD po predračunu{' '}
          {INVOICE.number}. {CLINIC_SHORT}
        </div>
      </div>
    </div>
  );
}
