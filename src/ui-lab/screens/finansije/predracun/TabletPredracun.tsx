// Figma base: Invoices Tablet — node-id=345:18061
"use client";

import { useState } from "react";
import { Search, Settings, Bell, Plus, X, Pencil, FileText, AlertTriangle, Trash2, ChevronDown, Eye, Download } from "lucide-react";
import { FigmaTabletSidebar } from "../../figma-dashboard/sidebars";
import {
  useProformas, PredracunStatusBadge,
  calcMedjuzbir, calcPopustAmount, calcUkupno,
  formatDate, formatRSD, getInitials, newStavka, todayIso,
  inputStyle, labelStyle, ModalOverlay,
  type Predracun, type PredracunStavka, type PredracunPopust,
} from "../shared";

// ─── Form modal ──────────────────────────────────────────

function PredForm({ initial, onSave, onClose }: { initial?: Predracun | null; onSave: (d: Omit<Predracun, "id">) => void; onClose: () => void }) {
  const [pacijent, setPacijent] = useState(initial?.pacijent ?? "");
  const [datum, setDatum] = useState(initial?.datum ?? todayIso());
  const [stavke, setStavke] = useState<PredracunStavka[]>(initial?.stavke?.length ? initial.stavke : [newStavka()]);
  const [hasPopust, setHasPopust] = useState(!!initial?.popust);
  const [popustType, setPopustType] = useState<PredracunPopust["type"]>(initial?.popust?.type ?? "procenat");
  const [popustValue, setPopustValue] = useState(initial?.popust?.value?.toString() ?? "");
  const [err, setErr] = useState("");

  const popust: PredracunPopust | undefined = hasPopust && popustValue ? { type: popustType, value: Number(popustValue) } : undefined;
  const medjuzbir = calcMedjuzbir(stavke);
  const popustAmount = calcPopustAmount(medjuzbir, popust);
  const ukupno = Math.max(0, medjuzbir - popustAmount);

  const addStavka = () => setStavke(p => [...p, newStavka()]);
  const updStavka = (id: string, ch: Partial<PredracunStavka>) => setStavke(p => p.map(s => s.id === id ? { ...s, ...ch } : s));
  const remStavka = (id: string) => setStavke(p => p.filter(s => s.id !== id));

  const handleSave = () => {
    if (!pacijent.trim()) { setErr("Ime pacijenta je obavezno."); return; }
    const validStavke = stavke.filter(s => s.naziv.trim() && s.cena > 0);
    if (!validStavke.length) { setErr("Dodaj bar jednu stavku."); return; }
    onSave({ pacijent: pacijent.trim(), datum, status: initial?.status ?? "draft", stavke: validStavke, popust });
  };

  return (
    <ModalOverlay>
      <div className="flex flex-col gap-[16px] p-[24px] overflow-y-auto" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)", width: "480px", maxHeight: "88vh", boxShadow: "0 8px 32px rgba(0,0,0,0.16)" }}>
        <div className="flex items-center justify-between flex-shrink-0">
          <h2 className="font-semibold" style={{ fontSize: "15px", color: "var(--v2-text-heading)" }}>{initial ? "Izmeni predračun" : "Novi predračun"}</h2>
          <button onClick={onClose} style={{ color: "var(--v2-text-muted)" }}><X className="h-4 w-4" /></button>
        </div>
        {err && <p className="text-[12px] px-[10px] py-[7px] rounded-[8px]" style={{ background: "var(--v2-status-cancelled-bg)", color: "var(--v2-status-cancelled-fg)" }}>{err}</p>}
        <div>
          <label style={labelStyle}>Pacijent *</label>
          <input value={pacijent} onChange={e => setPacijent(e.target.value)} placeholder="Ime i prezime" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Datum</label>
          <input type="date" value={datum} onChange={e => setDatum(e.target.value)} style={inputStyle} />
        </div>
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center justify-between">
            <label className="text-[12px]" style={{ color: "var(--v2-text-muted)" }}>Stavke *</label>
            <button onClick={addStavka} className="flex items-center gap-[4px] text-[11px] font-medium" style={{ padding: "5px 10px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}>
              <Plus className="h-3 w-3" /> Dodaj
            </button>
          </div>
          {stavke.map(s => (
            <div key={s.id} className="flex flex-col gap-[8px] p-[10px]" style={{ background: "var(--v2-input-bg)", borderRadius: "10px" }}>
              <div className="flex gap-[8px]">
                <input value={s.naziv} onChange={e => updStavka(s.id, { naziv: e.target.value })} placeholder="Naziv" style={{ ...inputStyle, flex: 1 }} />
                <button onClick={() => remStavka(s.id)} style={{ color: "var(--v2-text-muted)" }}><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="grid grid-cols-2 gap-[8px]">
                <input type="number" min={0} value={s.cena || ""} onChange={e => updStavka(s.id, { cena: Number(e.target.value) })} placeholder="Cena RSD" style={{ ...inputStyle, fontSize: "13px", padding: "7px 10px" }} />
                <div className="flex items-center gap-[6px]">
                  <input type="checkbox" checked={!!s.poZubu} onChange={e => updStavka(s.id, { poZubu: e.target.checked, brojZuba: e.target.checked ? 1 : undefined })} />
                  <span className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>Po zubu</span>
                  {s.poZubu && (
                    <input type="number" min={1} value={s.brojZuba ?? 1} onChange={e => updStavka(s.id, { brojZuba: Number(e.target.value) })} style={{ ...inputStyle, width: "56px", fontSize: "12px", padding: "5px 8px" }} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <label className="flex items-center gap-[8px] cursor-pointer">
            <input type="checkbox" checked={hasPopust} onChange={e => setHasPopust(e.target.checked)} />
            <span className="text-[13px]" style={{ color: "var(--v2-text)" }}>Popust</span>
          </label>
          {hasPopust && (
            <div className="flex items-center gap-[8px] mt-[8px]">
              {(["procenat", "iznos"] as PredracunPopust["type"][]).map(t => (
                <button key={t} onClick={() => setPopustType(t)} className="text-[12px] font-medium" style={{ padding: "6px 12px", borderRadius: "var(--v2-radius-pill)", background: popustType === t ? "var(--v2-primary)" : "var(--v2-input-bg)", color: popustType === t ? "var(--v2-primary-fg)" : "var(--v2-text-muted)" }}>{t === "procenat" ? "%" : "RSD"}</button>
              ))}
              <input type="number" min={0} value={popustValue} onChange={e => setPopustValue(e.target.value)} placeholder="vrednost" style={{ ...inputStyle, width: "100px" }} />
            </div>
          )}
        </div>
        <div className="p-[12px] flex flex-col gap-[4px]" style={{ background: "var(--v2-input-bg)", borderRadius: "10px" }}>
          <div className="flex justify-between text-[12px]">
            <span style={{ color: "var(--v2-text-muted)" }}>Međuzbir</span><span>{formatRSD(medjuzbir)}</span>
          </div>
          {popust && popustAmount > 0 && (
            <div className="flex justify-between text-[12px]">
              <span style={{ color: "var(--v2-text-muted)" }}>Popust</span><span style={{ color: "var(--v2-status-cancelled-fg)" }}>−{formatRSD(popustAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold pt-[4px]" style={{ borderTop: "1px solid var(--v2-border)" }}>
            <span>Ukupno</span><span style={{ color: "var(--v2-primary-dark)" }}>{formatRSD(ukupno)}</span>
          </div>
        </div>
        <div className="flex justify-end gap-[10px]">
          <button onClick={onClose} className="text-[13px] font-medium" style={{ padding: "8px 16px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}>Otkaži</button>
          <button onClick={handleSave} className="text-[13px] font-medium" style={{ padding: "8px 16px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}>Sačuvaj</button>
        </div>
      </div>
    </ModalOverlay>
  );
}

// ─── Storno confirm ───────────────────────────────────────

function StornoConfirm({ pred, onConfirm, onClose }: { pred: Predracun; onConfirm: () => void; onClose: () => void }) {
  return (
    <ModalOverlay>
      <div className="flex flex-col gap-[16px] p-[24px]" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)", width: "380px", boxShadow: "0 8px 32px rgba(0,0,0,0.16)" }}>
        <div className="flex items-start gap-[10px]">
          <div className="p-[8px] flex-shrink-0" style={{ borderRadius: "10px", background: "var(--v2-status-cancelled-bg)" }}>
            <AlertTriangle className="h-4 w-4" style={{ color: "var(--v2-status-cancelled-fg)" }} />
          </div>
          <div>
            <h2 className="font-semibold mb-[4px]" style={{ fontSize: "15px", color: "var(--v2-text-heading)" }}>Storniranje predračuna</h2>
            <p style={{ fontSize: "12px", color: "var(--v2-text-muted)", lineHeight: "1.5" }}>Predračun za <strong style={{ color: "var(--v2-text)" }}>{pred.pacijent}</strong> biće storniran.</p>
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

// ─── Detail modal ─────────────────────────────────────────

function DetailModal({ pred, onClose, onEdit, onConfirmFinal, onStorno }: {
  pred: Predracun; onClose: () => void; onEdit: (p: Predracun) => void;
  onConfirmFinal: (p: Predracun) => void; onStorno: (p: Predracun) => void;
}) {
  const medjuzbir = calcMedjuzbir(pred.stavke);
  const popustAmount = calcPopustAmount(medjuzbir, pred.popust);
  const ukupno = calcUkupno(pred.stavke, pred.popust);

  return (
    <ModalOverlay z={40}>
      <div className="flex flex-col overflow-y-auto" style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)", width: "420px", maxHeight: "85vh", boxShadow: "0 8px 32px rgba(0,0,0,0.16)" }}>
        <div className="flex items-start justify-between gap-[10px] p-[16px] flex-shrink-0">
          <div className="flex items-center gap-[10px] min-w-0">
            <div className="flex items-center justify-center font-bold text-[13px] flex-shrink-0" style={{ height: "38px", width: "38px", borderRadius: "var(--v2-radius-avatar)", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}>
              {getInitials(pred.pacijent)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold truncate" style={{ fontSize: "14px", color: "var(--v2-text-heading)" }}>{pred.pacijent}</p>
              <div className="flex items-center gap-[6px] mt-[3px]"><PredracunStatusBadge status={pred.status} /></div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: "var(--v2-text-muted)" }}><X className="h-4 w-4" /></button>
        </div>

        <div className="h-px mx-[16px]" style={{ background: "var(--v2-border)" }} />
        <div className="p-[16px] flex flex-col gap-[6px]">
          <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: "var(--v2-text-muted)" }}>Detalji</p>
          <div className="flex gap-[8px]">
            <span className="text-[12px] w-[60px] flex-shrink-0" style={{ color: "var(--v2-text-muted)" }}>Datum</span>
            <span className="text-[12px]" style={{ color: "var(--v2-text)" }}>{formatDate(pred.datum)}</span>
          </div>
        </div>

        <div className="h-px mx-[16px]" style={{ background: "var(--v2-border)" }} />
        <div className="p-[16px] flex flex-col gap-[6px]">
          <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: "var(--v2-text-muted)" }}>Stavke</p>
          {pred.stavke.map(s => {
            const qty = s.poZubu && s.brojZuba ? s.brojZuba : s.kolicina;
            return (
              <div key={s.id} className="flex justify-between gap-[6px] p-[8px]" style={{ background: "var(--v2-input-bg)", borderRadius: "8px" }}>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium" style={{ color: "var(--v2-text)" }}>{s.naziv}</p>
                  <p className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>{qty > 1 ? `${qty} × ` : ""}{formatRSD(s.cena)}</p>
                </div>
                <span className="text-[12px] font-semibold flex-shrink-0" style={{ color: "var(--v2-primary-dark)" }}>{formatRSD(qty * s.cena)}</span>
              </div>
            );
          })}
        </div>

        <div className="h-px mx-[16px]" style={{ background: "var(--v2-border)" }} />
        <div className="p-[16px] flex flex-col gap-[4px]">
          <div className="flex justify-between text-[13px]">
            <span style={{ color: "var(--v2-text-muted)" }}>Međuzbir</span><span>{formatRSD(medjuzbir)}</span>
          </div>
          {pred.popust && popustAmount > 0 && (
            <div className="flex justify-between text-[13px]">
              <span style={{ color: "var(--v2-text-muted)" }}>Popust</span><span style={{ color: "var(--v2-status-cancelled-fg)" }}>−{formatRSD(popustAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold pt-[4px]" style={{ borderTop: "1px solid var(--v2-border)" }}>
            <span>Ukupno</span><span style={{ color: "var(--v2-primary-dark)" }}>{formatRSD(ukupno)}</span>
          </div>
        </div>

        <div className="h-px mx-[16px]" style={{ background: "var(--v2-border)" }} />
        <div className="p-[16px] flex flex-col gap-[8px] flex-shrink-0">
          {/* Print actions */}
          <div className="flex gap-[6px]">
            <button
              disabled={!pred.id}
              onClick={() => window.open(`/ui-lab/finansije/predracun/${pred.id}/print`, "_blank", "noopener,noreferrer")}
              className="flex-1 flex items-center justify-center gap-[5px] text-[12px] font-medium transition-opacity hover:opacity-80 disabled:opacity-40"
              style={{ padding: "8px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text)", border: "1px solid var(--v2-border)" }}
            >
              <Eye className="h-3.5 w-3.5" /> Pregled
            </button>
            <button
              disabled={!pred.id}
              onClick={() => window.open(`/ui-lab/finansije/predracun/${pred.id}/print?autoprint=1`, "_blank", "noopener,noreferrer")}
              className="flex-1 flex items-center justify-center gap-[5px] text-[12px] font-medium transition-opacity hover:opacity-80 disabled:opacity-40"
              style={{ padding: "8px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text)", border: "1px solid var(--v2-border)" }}
            >
              <Download className="h-3.5 w-3.5" /> Preuzmi PDF
            </button>
          </div>
          <div className="h-px" style={{ background: "var(--v2-border)" }} />
          {pred.status === "draft" && (
            <>
              <button onClick={() => onEdit(pred)} className="flex items-center justify-center gap-[6px] text-[13px] font-medium" style={{ padding: "9px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}>
                <Pencil className="h-3.5 w-3.5" /> Izmeni nacrt
              </button>
              <button onClick={() => onConfirmFinal(pred)} className="flex items-center justify-center gap-[6px] text-[13px] font-medium" style={{ padding: "9px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}>
                Potvrdi kao finalan
              </button>
            </>
          )}
          {pred.status !== "storniran" && (
            <button onClick={() => onStorno(pred)} className="flex items-center justify-center gap-[6px] text-[13px] font-medium" style={{ padding: "9px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-status-cancelled-bg)", color: "var(--v2-status-cancelled-fg)" }}>
              Storniraj
            </button>
          )}
        </div>
      </div>
    </ModalOverlay>
  );
}

// ─── Main tablet layout ───────────────────────────────────

export default function TabletPredracun({ className }: { className?: string }) {
  const { proformas, add, update, confirmFinal, storno } = useProformas();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Predracun | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Predracun | null>(null);
  const [stornoTarget, setStornoTarget] = useState<Predracun | null>(null);

  const filtered = proformas.filter(p => p.pacijent.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setEditTarget(null); setFormOpen(true); };
  const openEdit = (p: Predracun) => { setEditTarget(p); setSelected(null); setFormOpen(true); };
  const handleSave = (data: Omit<Predracun, "id">) => {
    if (editTarget) { update(editTarget.id, data); } else { add(data); }
    setFormOpen(false);
  };
  const handleStorno = () => {
    if (!stornoTarget) return;
    storno(stornoTarget.id);
    if (selected?.id === stornoTarget.id) setSelected(p => p ? { ...p, status: "storniran" } : null);
    setStornoTarget(null);
  };
  const handleConfirmFinal = (p: Predracun) => {
    confirmFinal(p.id);
    if (selected?.id === p.id) setSelected(prev => prev ? { ...prev, status: "final" } : null);
    setSelected(null);
  };

  return (
    <div className={`flex h-full overflow-hidden ${className ?? ""}`} style={{ background: "var(--v2-bg)" }}>
      <FigmaTabletSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden py-[16px] pr-[24px] gap-[16px]" style={{ background: "var(--v2-surface)" }}>
        <header className="flex items-center justify-between flex-shrink-0 pl-[4px]" style={{ height: "var(--v2-topbar-h)" }}>
          <h1 className="font-semibold" style={{ fontSize: "20px", color: "var(--v2-text)" }}>Predračun</h1>
          <div className="flex items-center gap-[10px]">
            <button onClick={openAdd} className="flex items-center gap-[6px] text-[12px] font-medium" style={{ padding: "8px 14px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}>
              <Plus className="h-3.5 w-3.5" /> Kreiraj
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
                    {["Pacijent", "Status", "Ukupno"].map((h, i) => (
                      <th key={i} className="pt-[10px] pb-[8px] px-[12px] text-left font-medium whitespace-nowrap first:rounded-l-[6px] last:rounded-r-[6px]" style={{ fontSize: "10px", color: "var(--v2-text-muted)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={3} className="py-[40px] text-center">
                      <FileText className="h-7 w-7 mx-auto mb-[6px]" style={{ color: "var(--v2-border)" }} />
                      <p className="text-[13px]" style={{ color: "var(--v2-text-muted)" }}>{search ? "Nema rezultata" : "Nema predračuna"}</p>
                    </td></tr>
                  ) : filtered.map(pred => (
                    <tr key={pred.id} onClick={() => setSelected(pred)} className="cursor-pointer" style={{ borderBottom: "1px solid var(--v2-border)", opacity: pred.status === "storniran" ? 0.55 : 1 }}>
                      <td className="py-[12px] px-[12px]">
                        <div className="flex items-center gap-[8px]">
                          <div className="flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ height: "28px", width: "28px", borderRadius: "14px", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}>{getInitials(pred.pacijent)}</div>
                          <span className="text-[13px] font-medium truncate" style={{ color: "var(--v2-text)" }}>{pred.pacijent}</span>
                        </div>
                      </td>
                      <td className="py-[12px] px-[12px]"><PredracunStatusBadge status={pred.status} /></td>
                      <td className="py-[12px] px-[12px]"><span className="text-[12px] font-semibold" style={{ color: "var(--v2-primary-dark)" }}>{formatRSD(calcUkupno(pred.stavke, pred.popust))}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <footer className="text-center py-2" style={{ fontSize: "12px", color: "var(--v2-text-muted)" }}>Copyright &copy; 2026 Odontoa</footer>
        </main>
      </div>

      {selected && (
        <DetailModal
          pred={selected} onClose={() => setSelected(null)}
          onEdit={openEdit} onConfirmFinal={handleConfirmFinal}
          onStorno={p => { setSelected(null); setStornoTarget(p); }}
        />
      )}
      {formOpen && <PredForm initial={editTarget} onSave={handleSave} onClose={() => setFormOpen(false)} />}
      {stornoTarget && <StornoConfirm pred={stornoTarget} onConfirm={handleStorno} onClose={() => setStornoTarget(null)} />}
    </div>
  );
}
