// Figma base: Invoices Mobile — node-id=345:18086
"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Plus, X, FileText, AlertTriangle, Trash2, Pencil, Eye, Download } from "lucide-react";
import {
  useProformas, PredracunStatusBadge,
  calcMedjuzbir, calcPopustAmount, calcUkupno,
  formatDate, formatRSD, newStavka, todayIso,
  inputStyle, BottomSheetOverlay,
  type Predracun, type PredracunStavka, type PredracunPopust,
} from "../shared";

// ─── Mobile form (bottom sheet) ───────────────────────────

function PredForm({ initial, onSave, onClose }: { initial?: Predracun | null; onSave: (d: Omit<Predracun, "id">) => void; onClose: () => void }) {
  const [pacijent, setPacijent] = useState(initial?.pacijent ?? "");
  const [datum, setDatum] = useState(initial?.datum ?? todayIso());
  const [stavke, setStavke] = useState<PredracunStavka[]>(initial?.stavke?.length ? initial.stavke : [newStavka()]);
  const [hasPopust, setHasPopust] = useState(!!initial?.popust);
  const [popustType, setPopustType] = useState<PredracunPopust["type"]>(initial?.popust?.type ?? "procenat");
  const [popustValue, setPopustValue] = useState(initial?.popust?.value?.toString() ?? "");
  const [err, setErr] = useState("");

  const popust: PredracunPopust | undefined = hasPopust && popustValue ? { type: popustType, value: Number(popustValue) } : undefined;
  const ukupno = Math.max(0, calcMedjuzbir(stavke) - calcPopustAmount(calcMedjuzbir(stavke), popust));

  const addStavka = () => setStavke(p => [...p, newStavka()]);
  const updStavka = (id: string, ch: Partial<PredracunStavka>) => setStavke(p => p.map(s => s.id === id ? { ...s, ...ch } : s));
  const remStavka = (id: string) => setStavke(p => p.filter(s => s.id !== id));

  const handleSave = () => {
    if (!pacijent.trim()) { setErr("Ime pacijenta je obavezno."); return; }
    const valid = stavke.filter(s => s.naziv.trim() && s.cena > 0);
    if (!valid.length) { setErr("Dodaj bar jednu stavku."); return; }
    onSave({ pacijent: pacijent.trim(), datum, status: initial?.status ?? "draft", stavke: valid, popust });
  };

  return (
    <BottomSheetOverlay>
      <div className="flex items-center justify-between px-[20px] pt-[8px] pb-[12px] flex-shrink-0">
        <h2 className="font-semibold" style={{ fontSize: "16px", color: "var(--v2-text-heading)" }}>{initial ? "Izmeni predračun" : "Novi predračun"}</h2>
        <button onClick={onClose} style={{ color: "var(--v2-text-muted)" }}><X className="h-5 w-5" /></button>
      </div>
      <div className="px-[20px] pb-[28px] flex flex-col gap-[14px] overflow-y-auto">
        {err && <p className="text-[12px] px-[10px] py-[7px] rounded-[8px]" style={{ background: "var(--v2-status-cancelled-bg)", color: "var(--v2-status-cancelled-fg)" }}>{err}</p>}
        <div>
          <label className="block text-[12px] mb-[6px]" style={{ color: "var(--v2-text-muted)" }}>Pacijent *</label>
          <input value={pacijent} onChange={e => setPacijent(e.target.value)} placeholder="Ime i prezime" style={inputStyle} />
        </div>
        <div>
          <label className="block text-[12px] mb-[6px]" style={{ color: "var(--v2-text-muted)" }}>Datum</label>
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
                <input value={s.naziv} onChange={e => updStavka(s.id, { naziv: e.target.value })} placeholder="Naziv usluge" style={{ ...inputStyle, flex: 1 }} />
                <button onClick={() => remStavka(s.id)} style={{ color: "var(--v2-text-muted)" }}><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="grid grid-cols-2 gap-[8px]">
                <input type="number" min={0} value={s.cena || ""} onChange={e => updStavka(s.id, { cena: Number(e.target.value) })} placeholder="Cena RSD" style={{ ...inputStyle, padding: "8px 10px" }} />
                <div className="flex items-center gap-[6px]">
                  <input type="checkbox" checked={!!s.poZubu} onChange={e => updStavka(s.id, { poZubu: e.target.checked, brojZuba: e.target.checked ? 1 : undefined })} />
                  <span className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>Po zubu</span>
                  {s.poZubu && <input type="number" min={1} value={s.brojZuba ?? 1} onChange={e => updStavka(s.id, { brojZuba: Number(e.target.value) })} style={{ ...inputStyle, width: "56px", padding: "6px 8px" }} />}
                </div>
              </div>
            </div>
          ))}
        </div>
        <label className="flex items-center gap-[8px] cursor-pointer">
          <input type="checkbox" checked={hasPopust} onChange={e => setHasPopust(e.target.checked)} />
          <span className="text-[13px]" style={{ color: "var(--v2-text)" }}>Dodaj popust</span>
        </label>
        {hasPopust && (
          <div className="flex items-center gap-[8px]">
            {(["procenat", "iznos"] as PredracunPopust["type"][]).map(t => (
              <button key={t} onClick={() => setPopustType(t)} className="text-[12px] font-medium" style={{ padding: "6px 12px", borderRadius: "var(--v2-radius-pill)", background: popustType === t ? "var(--v2-primary)" : "var(--v2-input-bg)", color: popustType === t ? "var(--v2-primary-fg)" : "var(--v2-text-muted)" }}>{t === "procenat" ? "%" : "RSD"}</button>
            ))}
            <input type="number" min={0} value={popustValue} onChange={e => setPopustValue(e.target.value)} placeholder="vrednost" style={{ ...inputStyle, flex: 1 }} />
          </div>
        )}
        <div className="p-[10px]" style={{ background: "var(--v2-input-bg)", borderRadius: "10px" }}>
          <div className="flex justify-between font-semibold text-[14px]">
            <span>Ukupno</span><span style={{ color: "var(--v2-primary-dark)" }}>{formatRSD(ukupno)}</span>
          </div>
        </div>
        <div className="flex gap-[10px]">
          <button onClick={onClose} className="flex-1 text-[14px] font-medium" style={{ padding: "12px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}>Otkaži</button>
          <button onClick={handleSave} className="flex-1 text-[14px] font-medium" style={{ padding: "12px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}>Sačuvaj</button>
        </div>
      </div>
    </BottomSheetOverlay>
  );
}

// ─── Storno confirm (bottom sheet) ───────────────────────

function StornoSheet({ pred, onConfirm, onClose }: { pred: Predracun; onConfirm: () => void; onClose: () => void }) {
  return (
    <BottomSheetOverlay onBackdrop={onClose}>
      <div className="flex flex-col gap-[16px] px-[20px] pb-[28px] pt-[12px]">
        <div className="flex items-start gap-[10px]">
          <div className="p-[8px] flex-shrink-0" style={{ borderRadius: "10px", background: "var(--v2-status-cancelled-bg)" }}>
            <AlertTriangle className="h-4 w-4" style={{ color: "var(--v2-status-cancelled-fg)" }} />
          </div>
          <div>
            <h2 className="font-semibold mb-[4px]" style={{ fontSize: "15px", color: "var(--v2-text-heading)" }}>Storniranje predračuna</h2>
            <p style={{ fontSize: "12px", color: "var(--v2-text-muted)", lineHeight: "1.5" }}>Predračun za <strong style={{ color: "var(--v2-text)" }}>{pred.pacijent}</strong> biće storniran.</p>
          </div>
        </div>
        <div className="flex gap-[10px]">
          <button onClick={onClose} className="flex-1 text-[14px] font-medium" style={{ padding: "12px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text-muted)" }}>Otkaži</button>
          <button onClick={onConfirm} className="flex-1 text-[14px] font-medium" style={{ padding: "12px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-status-cancelled-bg)", color: "var(--v2-status-cancelled-fg)" }}>Storniraj</button>
        </div>
      </div>
    </BottomSheetOverlay>
  );
}

// ─── Detail bottom sheet ─────────────────────────────────

function DetailSheet({ pred, onClose, onEdit, onConfirmFinal, onStorno }: {
  pred: Predracun; onClose: () => void; onEdit: (p: Predracun) => void;
  onConfirmFinal: (p: Predracun) => void; onStorno: (p: Predracun) => void;
}) {
  const medjuzbir = calcMedjuzbir(pred.stavke);
  const popustAmount = calcPopustAmount(medjuzbir, pred.popust);
  const ukupno = calcUkupno(pred.stavke, pred.popust);

  return (
    <BottomSheetOverlay onBackdrop={onClose}>
      <div className="flex items-center justify-between px-[20px] pt-[8px] pb-[12px] flex-shrink-0">
        <div>
          <p className="font-semibold" style={{ fontSize: "14px", color: "var(--v2-text-heading)" }}>{pred.pacijent}</p>
          <div className="mt-[3px]"><PredracunStatusBadge status={pred.status} /></div>
        </div>
        <button onClick={onClose} style={{ color: "var(--v2-text-muted)" }}><X className="h-5 w-5" /></button>
      </div>
      <div className="h-px mx-[20px]" style={{ background: "var(--v2-border)" }} />
      <div className="px-[20px] py-[14px] flex flex-col gap-[6px]">
        <p className="text-[11px] font-medium uppercase tracking-wide mb-[4px]" style={{ color: "var(--v2-text-muted)" }}>Datum</p>
        <span className="text-[13px]" style={{ color: "var(--v2-text)" }}>{formatDate(pred.datum)}</span>
      </div>
      <div className="h-px mx-[20px]" style={{ background: "var(--v2-border)" }} />
      <div className="px-[20px] py-[14px] flex flex-col gap-[6px]">
        <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "var(--v2-text-muted)" }}>Stavke</p>
        {pred.stavke.map(s => {
          const qty = s.poZubu && s.brojZuba ? s.brojZuba : s.kolicina;
          return (
            <div key={s.id} className="flex justify-between p-[10px]" style={{ background: "var(--v2-input-bg)", borderRadius: "10px" }}>
              <div>
                <p className="text-[12px] font-medium" style={{ color: "var(--v2-text)" }}>{s.naziv}</p>
                <p className="text-[11px]" style={{ color: "var(--v2-text-muted)" }}>{qty > 1 ? `${qty} ×` : ""} {formatRSD(s.cena)}</p>
              </div>
              <span className="text-[12px] font-semibold" style={{ color: "var(--v2-primary-dark)" }}>{formatRSD(qty * s.cena)}</span>
            </div>
          );
        })}
        <div className="flex justify-between font-semibold mt-[4px] pt-[4px]" style={{ borderTop: "1px solid var(--v2-border)" }}>
          <span style={{ color: "var(--v2-text)" }}>Ukupno</span>
          <span style={{ color: "var(--v2-primary-dark)" }}>{formatRSD(ukupno)}</span>
        </div>
      </div>
      <div className="px-[20px] pb-[28px] pt-[4px] flex flex-col gap-[10px] flex-shrink-0" style={{ borderTop: "1px solid var(--v2-border)" }}>
        {/* Print actions */}
        <div className="flex gap-[8px]">
          <button
            disabled={!pred.id}
            onClick={() => window.open(`/ui-lab/finansije/predracun/${pred.id}/print`, "_blank", "noopener,noreferrer")}
            className="flex-1 flex items-center justify-center gap-[6px] text-[13px] font-medium transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{ padding: "11px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text)", border: "1px solid var(--v2-border)" }}
          >
            <Eye className="h-4 w-4" /> Pregled
          </button>
          <button
            disabled={!pred.id}
            onClick={() => window.open(`/ui-lab/finansije/predracun/${pred.id}/print?autoprint=1`, "_blank", "noopener,noreferrer")}
            className="flex-1 flex items-center justify-center gap-[6px] text-[13px] font-medium transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{ padding: "11px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-input-bg)", color: "var(--v2-text)", border: "1px solid var(--v2-border)" }}
          >
            <Download className="h-4 w-4" /> Preuzmi PDF
          </button>
        </div>
        <div className="h-px" style={{ background: "var(--v2-border)" }} />
        {pred.status === "draft" && (
          <>
            <button onClick={() => onEdit(pred)} className="flex items-center justify-center gap-[6px] text-[14px] font-medium" style={{ padding: "12px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}>
              <Pencil className="h-4 w-4" /> Izmeni nacrt
            </button>
            <button onClick={() => onConfirmFinal(pred)} className="flex items-center justify-center gap-[6px] text-[14px] font-medium" style={{ padding: "12px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}>
              Potvrdi kao finalan
            </button>
          </>
        )}
        {pred.status !== "storniran" && (
          <button onClick={() => onStorno(pred)} className="flex items-center justify-center gap-[6px] text-[14px] font-medium" style={{ padding: "12px", borderRadius: "var(--v2-radius-pill)", background: "var(--v2-status-cancelled-bg)", color: "var(--v2-status-cancelled-fg)" }}>
            Storniraj
          </button>
        )}
      </div>
    </BottomSheetOverlay>
  );
}

// ─── Main mobile layout ───────────────────────────────────

export default function MobilePredracun({ className }: { className?: string }) {
  const { proformas, add, update, confirmFinal, storno } = useProformas();
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
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
  const handleConfirmFinal = (p: Predracun) => {
    confirmFinal(p.id);
    setSelected(null);
  };
  const handleStorno = () => {
    if (!stornoTarget) return;
    storno(stornoTarget.id);
    setStornoTarget(null);
    setSelected(null);
  };

  return (
    <div className={`flex flex-col h-full overflow-hidden ${className ?? ""}`} style={{ background: "var(--v2-bg)" }}>
      <header className="flex items-center justify-between flex-shrink-0 px-[16px] py-[12px]" style={{ background: "var(--v2-surface)" }}>
        <div className="flex items-center gap-[8px]">
          <Image src="/images/Odontoa-New-logo-pack-2026/favicon_color.png" alt="Odontoa" width={32} height={32} className="h-[32px] w-[32px] object-contain" />
          <h1 className="font-semibold" style={{ fontSize: "18px", color: "var(--v2-text)" }}>Predračun</h1>
        </div>
        <div className="flex items-center gap-[8px]">
          <button onClick={() => setSearchOpen(v => !v)} className="flex items-center justify-center" style={{ padding: "8px", borderRadius: "20px", background: "var(--v2-primary-bg)" }}>
            <Search className="h-[18px] w-[18px]" style={{ color: "var(--v2-primary-dark)" }} />
          </button>
          <div className="flex items-center justify-center font-semibold text-[11px]" style={{ height: "32px", width: "32px", borderRadius: "var(--v2-radius-avatar)", background: "var(--v2-primary)", color: "var(--v2-primary-fg)" }}>MM</div>
        </div>
      </header>
      {searchOpen && (
        <div className="px-[16px] pb-[10px] flex-shrink-0" style={{ background: "var(--v2-surface)" }}>
          <div className="relative">
            <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--v2-text-muted)" }} />
            <input autoFocus type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Pretraži predračune..." className="w-full pl-[36px] pr-[12px] py-[10px] text-[14px] focus:outline-none" style={{ background: "var(--v2-input-bg)", borderRadius: "var(--v2-radius-pill)", border: "none", color: "var(--v2-text)" }} />
          </div>
        </div>
      )}
      <main className="flex-1 overflow-y-auto p-[16px] flex flex-col gap-[12px] rounded-t-[24px]" style={{ background: "var(--v2-bg)" }}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-[10px] py-[60px]">
            <FileText className="h-10 w-10" style={{ color: "var(--v2-border)" }} />
            <p className="font-medium text-center" style={{ fontSize: "14px", color: "var(--v2-text)" }}>{search ? "Nema rezultata" : "Nema predračuna"}</p>
          </div>
        ) : filtered.map(pred => (
          <button
            key={pred.id}
            onClick={() => setSelected(pred)}
            className="w-full text-left flex items-start gap-[12px] px-[14px] py-[12px]"
            style={{ background: "var(--v2-surface)", borderRadius: "var(--v2-radius-card)", opacity: pred.status === "storniran" ? 0.6 : 1 }}
          >
            <div className="flex items-center justify-center font-bold text-[12px] flex-shrink-0" style={{ height: "40px", width: "40px", borderRadius: "var(--v2-radius-avatar)", background: "var(--v2-primary-bg)", color: "var(--v2-primary-dark)" }}>
              {pred.pacijent.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-[8px]">
                <span className="text-[14px] font-medium truncate" style={{ color: "var(--v2-text)" }}>{pred.pacijent}</span>
                <PredracunStatusBadge status={pred.status} />
              </div>
              <div className="flex items-center justify-between mt-[4px]">
                <span className="text-[12px]" style={{ color: "var(--v2-text-muted)" }}>{formatDate(pred.datum)}</span>
                <span className="text-[13px] font-semibold" style={{ color: "var(--v2-primary-dark)" }}>{formatRSD(calcUkupno(pred.stavke, pred.popust))}</span>
              </div>
            </div>
          </button>
        ))}
      </main>
      <button onClick={openAdd} className="fixed bottom-[24px] right-[20px] flex items-center justify-center z-30" style={{ height: "52px", width: "52px", borderRadius: "26px", background: "var(--v2-primary)", color: "var(--v2-primary-fg)", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
        <Plus className="h-6 w-6" />
      </button>

      {selected && (
        <DetailSheet
          pred={selected} onClose={() => setSelected(null)}
          onEdit={openEdit} onConfirmFinal={handleConfirmFinal}
          onStorno={p => { setSelected(null); setStornoTarget(p); }}
        />
      )}
      {formOpen && <PredForm initial={editTarget} onSave={handleSave} onClose={() => setFormOpen(false)} />}
      {stornoTarget && <StornoSheet pred={stornoTarget} onConfirm={handleStorno} onClose={() => setStornoTarget(null)} />}
    </div>
  );
}
