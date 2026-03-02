// Figma base: Invoices Tablet — node-id=345:18061
"use client";

import { useState } from "react";
import { Search, Bell, Plus, X, Pencil, CreditCard, AlertTriangle, ChevronDown } from "lucide-react";
import { FigmaTabletSidebar } from "../../figma-dashboard/sidebars";
import {
  usePayments, UplataStatusBadge, NacinPlacanjaBadge,
  formatDate, formatRSD, getInitials, todayIso,
  inputStyle, labelStyle, ModalOverlay,
  type Uplata,
} from "../shared";

function UplataForm({ initial, onSave, onClose }: { initial?: Uplata | null; onSave: (d: Omit<Uplata, "id">) => void; onClose: () => void }) {
  const [pacijent, setPacijent] = useState(initial?.pacijent ?? "");
  const [datum, setDatum] = useState(initial?.datum ?? todayIso());
  const [iznos, setIznos] = useState(initial?.iznos?.toString() ?? "");
  const [nacin, setNacin] = useState<Uplata["nacinPlacanja"]>(initial?.nacinPlacanja);
  const [napomena, setNapomena] = useState(initial?.napomena ?? "");
  const [err, setErr] = useState("");

  const handleSave = () => {
    if (!pacijent.trim()) { setErr("Ime pacijenta je obavezno."); return; }
    if (!iznos || Number(iznos) <= 0) { setErr("Iznos mora biti veći od 0."); return; }
    onSave({ pacijent: pacijent.trim(), datum, iznos: Number(iznos), nacinPlacanja: nacin, napomena: napomena || undefined, status: initial?.status ?? "evidentirana" });
  };

  return (
    <ModalOverlay>
      <div className="flex flex-col gap-[16px] p-[24px]" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)", width: "420px", boxShadow: "0 8px 32px rgba(0,0,0,0.16)" }}>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold" style={{ fontSize: "15px", color: "var(--v2-text-heading)" }}>{initial ? "Izmeni uplatu" : "Nova uplata"}</h2>
          <button onClick={onClose} style={{ color: "var(--v2-text-muted)" }}><X className="h-4 w-4" /></button>
        </div>
        {err && <p className="text-[12px] px-[10px] py-[7px] rounded-[8px]" style={{ background: "var(--v2-status-cancelled-bg)", color: "var(--v2-status-cancelled-fg)" }}>{err}</p>}
        <div className="flex flex-col gap-[12px]">
          <div><label style={labelStyle}>Pacijent *</label><input value={pacijent} onChange={e => setPacijent(e.target.value)} placeholder="Ime i prezime" style={inputStyle} /></div>
          <div className="grid grid-cols-2 gap-[10px]">
            <div><label style={labelStyle}>Datum</label><input type="date" value={datum} onChange={e => setDatum(e.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>Iznos (RSD) *</label><input type="number" min={0} value={iznos} onChange={e => setIznos(e.target.value)} placeholder="npr. 15000" style={inputStyle} /></div>
          </div>
          <div>
            <label style={labelStyle}>Način plaćanja</label>
            <div className="flex flex-wrap gap-[6px]">
              {(["gotovina", "kartica", "racun", "ostalo"] as Uplata["nacinPlacanja"][]).map(opt => (
                <button key={opt} onClick={() => setNacin(nacin === opt ? undefined : opt)} className="text-[12px] font-medium" style={{ padding: "6px 12px", borderRadius: "var(--v2-radius-pill)", background: nacin === opt ? "var(--v2-primary)" : "var(--v2-input-bg)", color: nacin === opt ? "var(--v2-primary-fg)" : "var(--v2-text-muted)" }}>
                  {opt === "gotovina" ? "Gotovina" : opt === "kartica" ? "Kartica" : opt === "racun" ? "Račun" : "Ostalo"}
                </button>
              ))}
            </div>
          </div>
          <div><label style={labelStyle}>Napomena (opciono)</label><textarea value={napomena} onChange={e => setNapomena(e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical" }} /></div>
        </div>
        <div className="flex justify-end gap-[10px]">
          <button onClick={onClose} className="text-[13px] font-medium" style={{ padding: "8px 16px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}>Otkaži</button>
          <button onClick={handleSave} className="text-[13px] font-medium" style={{ padding: "8px 16px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}>Sačuvaj</button>
        </div>
      </div>
    </ModalOverlay>
  );
}

function StornoConfirm({ uplata, onConfirm, onClose }: { uplata: Uplata; onConfirm: () => void; onClose: () => void }) {
  return (
    <ModalOverlay>
      <div className="flex flex-col gap-[16px] p-[24px]" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)", width: "380px", boxShadow: "0 8px 32px rgba(0,0,0,0.16)" }}>
        <div className="flex items-start gap-[10px]">
          <div className="p-[8px] flex-shrink-0" style={{ borderRadius: "10px", background: "var(--v2-status-cancelled-bg)" }}>
            <AlertTriangle className="h-4 w-4" style={{ color: "var(--v2-status-cancelled-fg)" }} />
          </div>
          <div>
            <h2 className="font-semibold mb-[4px]" style={{ fontSize: "15px", color: "var(--v2-text-heading)" }}>Storniranje uplate</h2>
            <p style={{ fontSize: "12px", color: "var(--v2-text-muted)", lineHeight: "1.5" }}>Uplata od <strong style={{ color: "var(--v2-text)" }}>{formatRSD(uplata.iznos)}</strong> biće stornirana.</p>
          </div>
        </div>
        <div className="flex justify-end gap-[10px]">
          <button onClick={onClose} className="text-[13px] font-medium" style={{ padding: "8px 14px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}>Otkaži</button>
          <button onClick={onConfirm} className="text-[13px] font-medium" style={{ padding: "8px 14px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-status-cancelled-bg)", color: "var(--v2-status-cancelled-fg)" }}>Storniraj</button>
        </div>
      </div>
    </ModalOverlay>
  );
}

function DetailModal({ uplata, onClose, onEdit, onStorno }: { uplata: Uplata; onClose: () => void; onEdit: (u: Uplata) => void; onStorno: (u: Uplata) => void }) {
  return (
    <ModalOverlay z={40}>
      <div className="flex flex-col overflow-y-auto" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)", width: "400px", maxHeight: "85vh", boxShadow: "0 8px 32px rgba(0,0,0,0.16)" }}>
        <div className="flex items-start justify-between gap-[10px] p-[16px] flex-shrink-0">
          <div className="flex items-center gap-[10px] min-w-0">
            <div className="flex items-center justify-center font-bold text-[13px] flex-shrink-0" style={{ height: "38px", width: "38px", borderRadius: "var(--v2-radius-avatar)", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}>{getInitials(uplata.pacijent)}</div>
            <div className="min-w-0">
              <p className="font-semibold truncate" style={{ fontSize: "14px", color: "var(--v2-text-heading)" }}>{uplata.pacijent}</p>
              <div className="mt-[3px]"><UplataStatusBadge status={uplata.status} /></div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: "var(--v2-text-muted)" }}><X className="h-4 w-4" /></button>
        </div>
        <div className="h-px mx-[16px]" style={{ background: "var(--v2-border)" }} />
        <div className="p-[16px] flex flex-col gap-[8px]">
          <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: "var(--v2-text-muted)" }}>Detalji</p>
          {[
            { label: "Datum", value: formatDate(uplata.datum) },
            { label: "Iznos", value: formatRSD(uplata.iznos) },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-[8px]">
              <span className="text-[12px] w-[64px] flex-shrink-0" style={{ color: "var(--v2-text-muted)" }}>{label}</span>
              <span className="text-[12px] font-semibold" style={{ color: "var(--v2-primary-dark)" }}>{value}</span>
            </div>
          ))}
          <div className="flex gap-[8px]">
            <span className="text-[12px] w-[64px] flex-shrink-0" style={{ color: "var(--v2-text-muted)" }}>Plaćanje</span>
            <NacinPlacanjaBadge nacin={uplata.nacinPlacanja} />
          </div>
          {uplata.napomena && (
            <div className="flex gap-[8px]">
              <span className="text-[12px] w-[64px] flex-shrink-0" style={{ color: "var(--v2-text-muted)" }}>Napomena</span>
              <span className="text-[12px]" style={{ color: "var(--v2-text)" }}>{uplata.napomena}</span>
            </div>
          )}
        </div>
        <div className="h-px mx-[16px]" style={{ background: "var(--v2-border)" }} />
        <div className="p-[16px] flex flex-col gap-[8px] flex-shrink-0">
          {uplata.status === "evidentirana" && (
            <button onClick={() => onEdit(uplata)} className="flex items-center justify-center gap-[6px] text-[13px] font-medium" style={{ padding: "9px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}>
              <Pencil className="h-3.5 w-3.5" /> Izmeni
            </button>
          )}
          {uplata.status !== "stornirana" && (
            <button onClick={() => onStorno(uplata)} className="flex items-center justify-center gap-[6px] text-[13px] font-medium" style={{ padding: "9px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-status-cancelled-bg)", color: "var(--v2-status-cancelled-fg)" }}>
              Storniraj uplatu
            </button>
          )}
        </div>
      </div>
    </ModalOverlay>
  );
}

export default function TabletUplate({ className }: { className?: string }) {
  const { payments, add, update, storno } = usePayments();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Uplata | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Uplata | null>(null);
  const [stornoTarget, setStornoTarget] = useState<Uplata | null>(null);

  const filtered = payments.filter(p => p.pacijent.toLowerCase().includes(search.toLowerCase()));
  const openAdd = () => { setEditTarget(null); setFormOpen(true); };
  const openEdit = (u: Uplata) => { setEditTarget(u); setSelected(null); setFormOpen(true); };
  const handleSave = (data: Omit<Uplata, "id">) => {
    if (editTarget) { update(editTarget.id, data); } else { add(data); }
    setFormOpen(false);
  };
  const handleStorno = () => {
    if (!stornoTarget) return;
    storno(stornoTarget.id);
    if (selected?.id === stornoTarget.id) setSelected(p => p ? { ...p, status: "stornirana" } : null);
    setStornoTarget(null);
  };

  return (
    <div className={`flex h-full overflow-hidden ${className ?? ""}`} style={{ background: "var(--v2-bg)" }}>
      <FigmaTabletSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden py-[16px] pr-[24px] gap-[16px]" style={{ background: "var(--v2-surface)" }}>
        <header className="flex items-center justify-between flex-shrink-0 pl-[4px]" style={{ height: "var(--v2-topbar-h)" }}>
          <div className="flex flex-col justify-center">
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--v2-primary)" }}>Finansije</p>
            <h1 className="font-semibold leading-[1.2]" style={{ fontSize: "20px", color: "var(--v2-text)" }}>Uplate</h1>
          </div>
          <div className="flex items-center gap-[10px]">
            <button onClick={openAdd} className="flex items-center gap-[6px] text-[12px] font-medium" style={{ padding: "8px 14px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}>
              <Plus className="h-3.5 w-3.5" /> Dodaj
            </button>
            <button className="flex items-center justify-center" style={{ padding: "10px", borderRadius: "20px", background: "var(--v2-primary-bg)" }}>
              <Bell className="h-5 w-5" style={{ color: "var(--v2-primary-dark)" }} />
            </button>
            <div className="flex items-center justify-center font-semibold text-[12px]" style={{ height: "40px", width: "40px", borderRadius: "var(--v2-radius-avatar)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}>MM</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-[20px] flex flex-col gap-[20px] rounded-[24px]" style={{ background: "var(--v2-bg)" }}>
          <div className="flex flex-col" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)" }}>
            <div className="flex items-center justify-between gap-[10px] p-[14px]">
              <div className="relative flex-1">
                <Search className="absolute left-[10px] top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "var(--v2-text-muted)" }} />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Pretraži..." className="pl-8 pr-[10px] py-[7px] text-[12px] focus:outline-none w-full" style={{ background: "var(--v2-input-bg)", borderRadius: "16px", border: "none", color: "var(--v2-text)" }} />
              </div>
              <button className="flex items-center gap-[4px] text-[11px] font-medium flex-shrink-0" style={{ padding: "7px 12px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}>
                Status <ChevronDown className="h-3 w-3" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "var(--v2-input-bg)" }}>
                    {["Pacijent", "Iznos", "Status"].map((h, i) => (
                      <th key={i} className="pt-[10px] pb-[8px] px-[12px] text-left font-medium whitespace-nowrap first:rounded-l-[6px] last:rounded-r-[6px]" style={{ fontSize: "10px", color: "var(--v2-text-muted)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={3} className="py-[40px] text-center">
                      <CreditCard className="h-7 w-7 mx-auto mb-[6px]" style={{ color: "var(--v2-border)" }} />
                      <p className="text-[13px]" style={{ color: "var(--v2-text-muted)" }}>{search ? "Nema rezultata" : "Nema uplata"}</p>
                    </td></tr>
                  ) : filtered.map(u => (
                    <tr key={u.id} onClick={() => setSelected(u)} className="cursor-pointer" style={{ borderBottom: "1px solid var(--v2-border)", opacity: u.status === "stornirana" ? 0.55 : 1 }}>
                      <td className="py-[12px] px-[12px]">
                        <div className="flex items-center gap-[8px]">
                          <div className="flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ height: "28px", width: "28px", borderRadius: "14px", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}>{getInitials(u.pacijent)}</div>
                          <span className="text-[13px] font-medium truncate" style={{ color: "var(--v2-text)" }}>{u.pacijent}</span>
                        </div>
                      </td>
                      <td className="py-[12px] px-[12px]"><span className="text-[12px] font-semibold" style={{ color: "var(--v2-primary-dark)" }}>{formatRSD(u.iznos)}</span></td>
                      <td className="py-[12px] px-[12px]"><UplataStatusBadge status={u.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <footer className="text-center py-2" style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}>Copyright &copy; 2026 Odontoa</footer>
        </main>
      </div>
      {selected && <DetailModal uplata={selected} onClose={() => setSelected(null)} onEdit={openEdit} onStorno={u => { setSelected(null); setStornoTarget(u); }} />}
      {formOpen && <UplataForm initial={editTarget} onSave={handleSave} onClose={() => setFormOpen(false)} />}
      {stornoTarget && <StornoConfirm uplata={stornoTarget} onConfirm={handleStorno} onClose={() => setStornoTarget(null)} />}
    </div>
  );
}
