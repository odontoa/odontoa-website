// Figma base: Invoices — node-id=63:12897
"use client";

import { useState } from "react";
import {
  Search, Plus, X, Pencil, MoreHorizontal,
  ChevronDown, CreditCard, AlertTriangle,
} from "lucide-react";
import { FigmaDesktopSidebar } from "../../figma-dashboard/sidebars";
import { V2PageHeader } from "@/ui-lab/components/ui/V2PageHeader";
import {
  usePayments, UplataStatusBadge, NacinPlacanjaBadge,
  formatDate, formatRSD, getInitials, todayIso,
  inputStyle, labelStyle, ModalOverlay,
  type Uplata,
} from "../shared";

// ─── Uplata form ──────────────────────────────────────────

function UplataForm({ initial, onSave, onClose }: {
  initial?: Uplata | null;
  onSave: (d: Omit<Uplata, "id">) => void;
  onClose: () => void;
}) {
  const [pacijent, setPacijent] = useState(initial?.pacijent ?? "");
  const [datum, setDatum] = useState(initial?.datum ?? todayIso());
  const [iznos, setIznos] = useState(initial?.iznos?.toString() ?? "");
  const [nacin, setNacin] = useState<Uplata["nacinPlacanja"]>(initial?.nacinPlacanja);
  const [napomena, setNapomena] = useState(initial?.napomena ?? "");
  const [predracunId, setPredracunId] = useState(initial?.povezanoSa?.predracunId ?? "");
  const [err, setErr] = useState("");

  const handleSave = () => {
    if (!pacijent.trim()) { setErr("Ime pacijenta je obavezno."); return; }
    if (!iznos || Number(iznos) <= 0) { setErr("Iznos mora biti veći od 0."); return; }
    onSave({
      pacijent: pacijent.trim(), datum, iznos: Number(iznos), nacinPlacanja: nacin,
      napomena: napomena.trim() || undefined,
      povezanoSa: predracunId ? { predracunId } : undefined,
      status: initial?.status ?? "evidentirana",
    });
  };

  const nacinOptions: { value: Uplata["nacinPlacanja"]; label: string }[] = [
    { value: "gotovina", label: "Gotovina" },
    { value: "kartica", label: "Kartica" },
    { value: "racun", label: "Račun" },
    { value: "ostalo", label: "Ostalo" },
  ];

  return (
    <ModalOverlay>
      <div className="flex flex-col gap-[20px] p-[28px]" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)", width: "480px", boxShadow: "0 8px 32px rgba(0,0,0,0.16)" }}>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold" style={{ fontSize: "16px", color: "var(--v2-text-heading)" }}>{initial ? "Izmeni uplatu" : "Nova uplata"}</h2>
          <button onClick={onClose} style={{ color: "var(--v2-text-muted)" }}><X className="h-5 w-5" /></button>
        </div>
        {err && <p className="text-[12px] px-[12px] py-[8px] rounded-[8px]" style={{ background: "var(--v2-status-cancelled-bg)", color: "var(--v2-status-cancelled-fg)" }}>{err}</p>}
        <div className="flex flex-col gap-[14px]">
          <div>
            <label style={labelStyle}>Pacijent *</label>
            <input value={pacijent} onChange={e => setPacijent(e.target.value)} placeholder="Ime i prezime pacijenta" style={inputStyle} />
          </div>
          <div className="grid grid-cols-2 gap-[12px]">
            <div>
              <label style={labelStyle}>Datum</label>
              <input type="date" value={datum} onChange={e => setDatum(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Iznos (RSD) *</label>
              <input type="number" min={0} value={iznos} onChange={e => setIznos(e.target.value)} placeholder="npr. 15000" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Način plaćanja</label>
            <div className="flex flex-wrap gap-[8px]">
              {nacinOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setNacin(nacin === opt.value ? undefined : opt.value)}
                  className="text-[12px] font-medium"
                  style={{ padding: "7px 14px", borderRadius: "var(--v2-radius-pill)", background: nacin === opt.value ? "var(--v2-primary)" : "var(--v2-input-bg)", color: nacin === opt.value ? "var(--v2-primary-fg)" : "var(--v2-text-muted)" }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={labelStyle}>Napomena (opciono)</label>
            <textarea value={napomena} onChange={e => setNapomena(e.target.value)} placeholder="Beleška uz uplatu..." rows={2} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <div>
            <label style={labelStyle}>Predračun ID (opciono)</label>
            <input value={predracunId} onChange={e => setPredracunId(e.target.value)} placeholder="npr. p1" style={inputStyle} />
          </div>
        </div>
        <div className="flex items-center justify-end gap-[10px]">
          <button onClick={onClose} className="text-[13px] font-medium" style={{ padding: "9px 18px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}>Otkaži</button>
          <button onClick={handleSave} className="text-[13px] font-medium transition-opacity hover:opacity-90" style={{ padding: "9px 18px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}>Sačuvaj</button>
        </div>
      </div>
    </ModalOverlay>
  );
}

// ─── Storno confirm ───────────────────────────────────────

function StornoConfirm({ uplata, onConfirm, onClose }: { uplata: Uplata; onConfirm: () => void; onClose: () => void }) {
  return (
    <ModalOverlay>
      <div className="flex flex-col gap-[20px] p-[28px]" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)", width: "420px", boxShadow: "0 8px 32px rgba(0,0,0,0.16)" }}>
        <div className="flex items-start gap-[12px]">
          <div className="flex items-center justify-center flex-shrink-0 p-[10px]" style={{ borderRadius: "12px", background: "var(--v2-status-cancelled-bg)" }}>
            <AlertTriangle className="h-5 w-5" style={{ color: "var(--v2-status-cancelled-fg)" }} />
          </div>
          <div>
            <h2 className="font-semibold mb-[6px]" style={{ fontSize: "16px", color: "var(--v2-text-heading)" }}>Storniranje uplate</h2>
            <p style={{ fontSize: "13px", color: "var(--v2-text-muted)", lineHeight: "1.5" }}>
              Uplata pacijenta <strong style={{ color: "var(--v2-text)" }}>{uplata.pacijent}</strong> od <strong style={{ color: "var(--v2-text)" }}>{formatRSD(uplata.iznos)}</strong> biće stornirana.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-[10px]">
          <button onClick={onClose} className="text-[13px] font-medium" style={{ padding: "9px 18px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}>Otkaži</button>
          <button onClick={onConfirm} className="text-[13px] font-medium" style={{ padding: "9px 18px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-status-cancelled-bg)", color: "var(--v2-status-cancelled-fg)" }}>Storniraj</button>
        </div>
      </div>
    </ModalOverlay>
  );
}

// ─── Detail panel ─────────────────────────────────────────

function DetailPanel({ uplata, onClose, onEdit, onStorno }: {
  uplata: Uplata; onClose: () => void; onEdit: (u: Uplata) => void; onStorno: (u: Uplata) => void;
}) {
  return (
    <div className="flex-shrink-0 flex flex-col overflow-y-auto" style={{ width: "340px", background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)" }}>
      <div className="flex items-start justify-between gap-[12px] p-[16px] flex-shrink-0">
        <div className="flex items-center gap-[10px] min-w-0">
          <div className="flex items-center justify-center font-bold text-[14px] flex-shrink-0" style={{ height: "40px", width: "40px", borderRadius: "var(--v2-radius-avatar)", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}>
            {getInitials(uplata.pacijent)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold truncate" style={{ fontSize: "14px", color: "var(--v2-text-heading)" }}>{uplata.pacijent}</p>
            <div className="mt-[4px]"><UplataStatusBadge status={uplata.status} /></div>
          </div>
        </div>
        <button onClick={onClose} className="flex-shrink-0 transition-opacity hover:opacity-60" style={{ color: "var(--v2-text-muted)", marginTop: "2px" }}><X className="h-4 w-4" /></button>
      </div>

      <div className="h-px mx-[16px]" style={{ background: "var(--v2-border)" }} />

      <div className="p-[16px] flex flex-col gap-[10px]">
        <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "var(--v2-text-muted)" }}>Detalji uplate</p>
        {[
          { label: "Datum", value: formatDate(uplata.datum) },
          { label: "Iznos", value: formatRSD(uplata.iznos) },
        ].map(({ label, value }) => (
          <div key={label} className="flex gap-[8px]">
            <span className="text-[12px] w-[72px] flex-shrink-0" style={{ color: "var(--v2-text-muted)" }}>{label}</span>
            <span className="text-[12px] font-semibold" style={{ color: "var(--v2-primary-dark)" }}>{value}</span>
          </div>
        ))}
        <div className="flex gap-[8px]">
          <span className="text-[12px] w-[72px] flex-shrink-0" style={{ color: "var(--v2-text-muted)" }}>Plaćanje</span>
          <NacinPlacanjaBadge nacin={uplata.nacinPlacanja} />
        </div>
        {uplata.napomena && (
          <div className="flex gap-[8px]">
            <span className="text-[12px] w-[72px] flex-shrink-0" style={{ color: "var(--v2-text-muted)" }}>Napomena</span>
            <span className="text-[12px]" style={{ color: "var(--v2-text)" }}>{uplata.napomena}</span>
          </div>
        )}
        {uplata.povezanoSa?.predracunId && (
          <div className="flex gap-[8px]">
            <span className="text-[12px] w-[72px] flex-shrink-0" style={{ color: "var(--v2-text-muted)" }}>Predračun</span>
            <span className="text-[12px] font-mono" style={{ color: "var(--v2-primary-dark)" }}>#{uplata.povezanoSa.predracunId}</span>
          </div>
        )}
      </div>

      <div className="h-px mx-[16px]" style={{ background: "var(--v2-border)" }} />

      <div className="p-[16px] flex flex-col gap-[8px] flex-shrink-0">
        {uplata.status === "evidentirana" && (
          <button onClick={() => onEdit(uplata)} className="w-full flex items-center justify-center gap-[6px] text-[13px] font-medium" style={{ padding: "9px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}>
            <Pencil className="h-3.5 w-3.5" /> Izmeni
          </button>
        )}
        {uplata.status !== "stornirana" && (
          <button onClick={() => onStorno(uplata)} className="w-full flex items-center justify-center gap-[6px] text-[13px] font-medium" style={{ padding: "9px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-status-cancelled-bg)", color: "var(--v2-status-cancelled-fg)" }}>
            Storniraj uplatu
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main desktop layout ──────────────────────────────────

export default function DesktopUplate({ className }: { className?: string }) {
  const { payments, add, update, storno } = usePayments();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Uplata | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Uplata | null>(null);
  const [stornoTarget, setStornoTarget] = useState<Uplata | null>(null);

  const filtered = payments.filter(p => p.pacijent.toLowerCase().includes(search.toLowerCase()));
  const totalEvidentirano = payments.filter(p => p.status === "evidentirana").reduce((s, p) => s + p.iznos, 0);

  const openAdd = () => { setEditTarget(null); setFormOpen(true); };
  const openEdit = (u: Uplata) => { setEditTarget(u); setFormOpen(true); };
  const handleSave = (data: Omit<Uplata, "id">) => {
    if (editTarget) { update(editTarget.id, data); setSelected(prev => prev?.id === editTarget.id ? { ...prev, ...data } : prev); }
    else { add(data); }
    setFormOpen(false);
  };
  const handleStorno = () => {
    if (!stornoTarget) return;
    storno(stornoTarget.id);
    setSelected(prev => prev?.id === stornoTarget.id ? { ...prev, status: "stornirana" } : prev);
    setStornoTarget(null);
  };

  return (
    <div className={`flex h-full overflow-hidden ${className ?? ""}`} style={{ background: "var(--v2-bg)" }}>
      <FigmaDesktopSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden py-[16px] pr-[24px] gap-[16px]" style={{ background: "var(--v2-surface)" }}>
        <V2PageHeader
          section="Finansije"
          title="Uplate"
          extraActions={
            <button
              onClick={openAdd}
              className="flex items-center gap-[6px] text-[13px] font-medium transition-opacity hover:opacity-90"
              style={{ padding: "9px 16px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}
            >
              <Plus className="h-4 w-4" /> Dodaj uplatu
            </button>
          }
        />
        <div className="flex-1 overflow-hidden p-[20px] flex gap-[20px] rounded-[24px]" style={{ background: "var(--v2-bg)" }}>
          <div className="flex-1 flex flex-col gap-[20px] overflow-y-auto min-w-0">

            {/* Stats */}
            <div className="grid grid-cols-3 gap-[20px]">
              {[
                { label: "Ukupno uplata", value: payments.length, sub: null, icon: <CreditCard className="h-5 w-5" style={{ color: "var(--v2-primary-fg)" }} /> },
                { label: "Evidentirane", value: payments.filter(p => p.status === "evidentirana").length, sub: null, icon: <div className="h-[10px] w-[10px] rounded-full" style={{ background: "var(--v2-primary-fg)" }} /> },
                { label: "Ukupan promet", value: null, sub: formatRSD(totalEvidentirano), icon: <div className="h-[10px] w-[10px] rounded-full border-2" style={{ borderColor: "var(--v2-primary-fg)" }} /> },
              ].map(({ label, value, sub, icon }) => (
                <div key={label} className="flex items-center gap-[12px] px-[14px] py-[16px]" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)" }}>
                  <div className="flex items-center justify-center p-[10px]" style={{ borderRadius: "var(--v2-radius-icon)", background: "var(--v2-primary)" }}>{icon}</div>
                  <div className="flex flex-col gap-[4px]">
                    <span className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>{label}</span>
                    {value !== null ? (
                      <span className="font-bold" style={{ fontSize: "24px", color: "var(--v2-primary-dark)" }}>{value}</span>
                    ) : (
                      <span className="font-bold" style={{ fontSize: "16px", color: "var(--v2-primary-dark)" }}>{sub}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="flex flex-col" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)" }}>
              <div className="flex items-center justify-between gap-[12px] p-[16px]">
                <div className="relative">
                  <Search className="absolute left-[10px] top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "var(--v2-text-muted)" }} />
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Pretraži uplate..." className="pl-8 pr-[10px] py-[7px] text-[12px] focus:outline-none" style={{ width: "224px", background: "var(--v2-input-bg)", borderRadius: "18px", border: "none", color: "var(--v2-text)" }} />
                </div>
                <button className="flex items-center gap-[4px] text-[11px] font-medium" style={{ padding: "7px 12px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}>
                  Status <ChevronDown className="h-3 w-3" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: "var(--v2-input-bg)" }}>
                      {["Pacijent", "Datum", "Iznos", "Plaćanje", "Status", ""].map((h, i) => (
                        <th key={i} className="pt-[10px] pb-[8px] px-[12px] text-left font-medium whitespace-nowrap first:rounded-l-[6px] last:rounded-r-[6px]" style={{ fontSize: "10px", color: "var(--v2-text-muted)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={6} className="py-[48px] text-center">
                        <CreditCard className="h-8 w-8 mx-auto mb-[8px]" style={{ color: "var(--v2-border)" }} />
                        <p className="font-medium" style={{ fontSize: "14px", color: "var(--v2-text)" }}>{search ? "Nema rezultata" : "Nema uplata"}</p>
                      </td></tr>
                    ) : filtered.map(u => {
                      const isSelected = selected?.id === u.id;
                      return (
                        <tr key={u.id} onClick={() => setSelected(isSelected ? null : u)} className="cursor-pointer" style={{ borderBottom: "1px solid var(--v2-border)", background: isSelected ? "var(--v2-primary-bg)" : "transparent", opacity: u.status === "stornirana" ? 0.55 : 1 }}>
                          <td className="py-[12px] px-[12px]">
                            <div className="flex items-center gap-[8px]">
                              <div className="flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ height: "28px", width: "28px", borderRadius: "14px", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}>{getInitials(u.pacijent)}</div>
                              <span className="text-[13px] font-medium" style={{ color: "var(--v2-text)" }}>{u.pacijent}</span>
                            </div>
                          </td>
                          <td className="py-[12px] px-[12px]"><span className="text-[12px]" style={{ color: "var(--v2-text-muted)" }}>{formatDate(u.datum)}</span></td>
                          <td className="py-[12px] px-[12px]"><span className="text-[12px] font-semibold" style={{ color: "var(--v2-primary-dark)" }}>{formatRSD(u.iznos)}</span></td>
                          <td className="py-[12px] px-[12px]"><NacinPlacanjaBadge nacin={u.nacinPlacanja} /></td>
                          <td className="py-[12px] px-[12px]"><UplataStatusBadge status={u.status} /></td>
                          <td className="py-[12px] px-[12px]">
                            <button onClick={e => { e.stopPropagation(); openEdit(u); }} disabled={u.status !== "evidentirana"} style={{ color: "var(--v2-text-muted)", opacity: u.status !== "evidentirana" ? 0.3 : 1 }}>
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filtered.length > 0 && (
                <div className="flex items-center justify-between px-[16px] py-[10px]" style={{ borderTop: "1px solid var(--v2-border)" }}>
                  <span className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>{filtered.length} uplat{filtered.length === 1 ? "a" : "a"}</span>
                  <button className="flex items-center gap-[4px] text-[10px] font-medium" style={{ color: "var(--v2-text-muted)" }}>10 <ChevronDown className="h-3 w-3" /></button>
                </div>
              )}
            </div>
            <footer className="text-center py-2" style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}>Copyright &copy; 2026 Odontoa</footer>
          </div>

          {selected && (
            <DetailPanel uplata={selected} onClose={() => setSelected(null)} onEdit={openEdit} onStorno={u => setStornoTarget(u)} />
          )}
        </div>
      </div>

      {formOpen && <UplataForm initial={editTarget} onSave={handleSave} onClose={() => setFormOpen(false)} />}
      {stornoTarget && <StornoConfirm uplata={stornoTarget} onConfirm={handleStorno} onClose={() => setStornoTarget(null)} />}
    </div>
  );
}
