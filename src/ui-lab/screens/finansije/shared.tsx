"use client";

import { useState, useEffect } from "react";

// ─── Types — Predračun ────────────────────────────────────

export interface PredracunStavka {
  id: string;
  naziv: string;
  kolicina: number;
  cena: number;
  poZubu?: boolean;
  brojZuba?: number;
}

export interface PredracunPopust {
  type: "iznos" | "procenat";
  value: number;
}

export interface Predracun {
  id: string;
  pacijent: string;
  datum: string;
  status: "draft" | "final" | "storniran";
  stavke: PredracunStavka[];
  popust?: PredracunPopust;
  brojPredracuna?: string;
  napomena?: string;
}

// ─── Types — Uplata ───────────────────────────────────────

export interface Uplata {
  id: string;
  pacijent: string;
  datum: string;
  iznos: number;
  nacinPlacanja?: "gotovina" | "kartica" | "racun" | "ostalo";
  napomena?: string;
  povezanoSa?: { terminId?: string; predracunId?: string };
  status: "evidentirana" | "stornirana";
}

// ─── Calculations ─────────────────────────────────────────

export function calcMedjuzbir(stavke: PredracunStavka[]): number {
  return stavke.reduce((sum, s) => {
    const qty = s.poZubu && s.brojZuba ? s.brojZuba : s.kolicina;
    return sum + qty * s.cena;
  }, 0);
}

export function calcPopustAmount(medjuzbir: number, popust?: PredracunPopust): number {
  if (!popust || !popust.value) return 0;
  if (popust.type === "iznos") return Math.min(popust.value, medjuzbir);
  return Math.round((medjuzbir * popust.value) / 100);
}

export function calcUkupno(stavke: PredracunStavka[], popust?: PredracunPopust): number {
  const med = calcMedjuzbir(stavke);
  return Math.max(0, med - calcPopustAmount(med, popust));
}

// ─── Helpers ─────────────────────────────────────────────

export function formatDate(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}.`;
}

export function formatRSD(amount: number): string {
  return new Intl.NumberFormat("sr-RS").format(amount) + " RSD";
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function newStavka(): PredracunStavka {
  return {
    id: typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : String(Date.now() + Math.random()),
    naziv: "",
    kolicina: 1,
    cena: 0,
    poZubu: false,
    brojZuba: undefined,
  };
}

export function todayIso(): string {
  return new Date().toISOString().split("T")[0];
}

// ─── Seed data — Predračuni ───────────────────────────────

export const SEED_PROFORMAS: Predracun[] = [
  {
    id: "p1",
    pacijent: "Milena Đorđević",
    datum: "2026-02-20",
    status: "final",
    stavke: [
      { id: "s1", naziv: "Keramička krunica", kolicina: 1, cena: 12000 },
      { id: "s2", naziv: "Konzultacija", kolicina: 1, cena: 2000 },
    ],
    popust: { type: "procenat", value: 10 },
  },
  {
    id: "p2",
    pacijent: "Stefan Nikolić",
    datum: "2026-02-18",
    status: "draft",
    stavke: [
      { id: "s3", naziv: "Most (3 člana)", kolicina: 1, cena: 9500, poZubu: true, brojZuba: 3 },
    ],
  },
  {
    id: "p3",
    pacijent: "Ana Popović",
    datum: "2026-01-15",
    status: "storniran",
    stavke: [
      { id: "s4", naziv: "Totalna proteza", kolicina: 1, cena: 35000 },
    ],
  },
  {
    id: "p4",
    pacijent: "Marko Lazović",
    datum: "2026-02-25",
    status: "draft",
    stavke: [
      { id: "s5", naziv: "Faceta", kolicina: 4, cena: 9500 },
    ],
    popust: { type: "iznos", value: 5000 },
  },
  {
    id: "p5",
    pacijent: "Jelena Vasić",
    datum: "2026-02-10",
    status: "final",
    stavke: [
      { id: "s6", naziv: "Zirkonijumska krunica", kolicina: 1, cena: 14000 },
      { id: "s7", naziv: "RTG snimak", kolicina: 2, cena: 800 },
    ],
  },
  {
    id: "p6",
    pacijent: "Dragan Todorović",
    datum: "2026-02-28",
    status: "draft",
    stavke: [
      { id: "s8", naziv: "Implant", kolicina: 1, cena: 45000 },
      { id: "s9", naziv: "Krunica na implantu", kolicina: 1, cena: 18000 },
    ],
    popust: { type: "procenat", value: 5 },
  },
  {
    id: "p7",
    pacijent: "Ivana Kovač",
    datum: "2026-01-28",
    status: "final",
    stavke: [
      { id: "s10", naziv: "Inlay (×2)", kolicina: 2, cena: 7500 },
    ],
  },
];

// ─── Seed data — Uplate ───────────────────────────────────

const SEED_PAYMENTS: Uplata[] = [
  { id: "u1", pacijent: "Milena Đorđević", datum: "2026-02-20", iznos: 12600, nacinPlacanja: "kartica", status: "evidentirana", povezanoSa: { predracunId: "p1" }, napomena: "Plaćeno kreditnom karticom" },
  { id: "u2", pacijent: "Jelena Vasić", datum: "2026-02-12", iznos: 15600, nacinPlacanja: "gotovina", status: "evidentirana" },
  { id: "u3", pacijent: "Stefan Nikolić", datum: "2026-02-05", iznos: 10000, nacinPlacanja: "racun", status: "evidentirana", napomena: "Avans za most" },
  { id: "u4", pacijent: "Ana Popović", datum: "2026-01-10", iznos: 5000, nacinPlacanja: "gotovina", status: "stornirana", napomena: "Stornirano zbog povrata" },
  { id: "u5", pacijent: "Dragan Todorović", datum: "2026-02-28", iznos: 20000, nacinPlacanja: "kartica", status: "evidentirana", povezanoSa: { predracunId: "p6" } },
  { id: "u6", pacijent: "Ivana Kovač", datum: "2026-02-15", iznos: 8500, nacinPlacanja: "gotovina", status: "evidentirana" },
  { id: "u7", pacijent: "Nikola Stanić", datum: "2026-01-28", iznos: 3000, nacinPlacanja: "ostalo", status: "evidentirana", napomena: "Plaćeno čekom" },
  { id: "u8", pacijent: "Marko Lazović", datum: "2026-02-26", iznos: 15000, nacinPlacanja: "kartica", status: "evidentirana" },
];

// ─── Tehnika finance seed (read-only, derived from technika module) ──

// ─── Technician payment model (MVP) ──────────────────────────────────────────

export interface TechnicianPayment {
  id: string;
  technicianId: string;
  amount: number;
  paidAt: string;
}

export interface TehFinRow {
  id: string;
  naziv: string;
  brojRadova: number;
  dug: number;
  placeno: number;
  placenoDo: string;
  status: "aktivan" | "neaktivan";
  poslednjiRadovi: TehFinWork[];
  payments: TechnicianPayment[];
}

export interface TehFinWork {
  id: string;
  datum: string;
  pacijent: string;
  vrstaRada: string;
  iznos: number;
  statusNaplate: "placeno" | "nijeplaceno";
}

export const SEED_TEHNIKA_FIN: TehFinRow[] = [
  {
    id: "t1", naziv: "Dental Lab Pro d.o.o.", brojRadova: 47, dug: 145000, placeno: 289000, placenoDo: "2026-01-31", status: "aktivan", payments: [],
    poslednjiRadovi: [
      { id: "tw1", datum: "2026-02-14", pacijent: "Milena Đorđević", vrstaRada: "Keramička krunica", iznos: 12000, statusNaplate: "placeno" },
      { id: "tw2", datum: "2026-02-08", pacijent: "Stefan Nikolić", vrstaRada: "Most (3 člana)", iznos: 28000, statusNaplate: "placeno" },
      { id: "tw3", datum: "2026-01-22", pacijent: "Ana Popović", vrstaRada: "Totalna proteza", iznos: 35000, statusNaplate: "nijeplaceno" },
      { id: "tw4", datum: "2026-01-10", pacijent: "Marko Lazović", vrstaRada: "Faceta (×4)", iznos: 38000, statusNaplate: "nijeplaceno" },
      { id: "tw5", datum: "2025-12-28", pacijent: "Jelena Vasić", vrstaRada: "Zirkonijumska krunica", iznos: 14000, statusNaplate: "placeno" },
    ],
  },
  {
    id: "t2", naziv: "Miroslav Petrović", brojRadova: 23, dug: 68000, placeno: 185000, placenoDo: "2026-02-28", status: "aktivan", payments: [],
    poslednjiRadovi: [
      { id: "tw6", datum: "2026-02-25", pacijent: "Dragan Todorović", vrstaRada: "Implant krunica", iznos: 22000, statusNaplate: "placeno" },
      { id: "tw7", datum: "2026-02-18", pacijent: "Ivana Kovač", vrstaRada: "Inlay (×2)", iznos: 15000, statusNaplate: "placeno" },
      { id: "tw8", datum: "2026-01-30", pacijent: "Nikola Stanić", vrstaRada: "Parcijalna proteza", iznos: 18000, statusNaplate: "nijeplaceno" },
    ],
  },
  {
    id: "t3", naziv: "Zlatozub d.o.o.", brojRadova: 91, dug: 312000, placeno: 640000, placenoDo: "2025-12-31", status: "aktivan", payments: [],
    poslednjiRadovi: [
      { id: "tw9", datum: "2026-02-20", pacijent: "Petar Simić", vrstaRada: "Metalna krunica", iznos: 8000, statusNaplate: "placeno" },
      { id: "tw10", datum: "2026-02-12", pacijent: "Marina Obradović", vrstaRada: "Parcijalna proteza", iznos: 24000, statusNaplate: "nijeplaceno" },
      { id: "tw11", datum: "2026-01-28", pacijent: "Zoran Đokić", vrstaRada: "Most (4 člana)", iznos: 36000, statusNaplate: "nijeplaceno" },
    ],
  },
  {
    id: "t4", naziv: "Ana Jovanović", brojRadova: 12, dug: 0, placeno: 30500, placenoDo: "2026-02-01", status: "aktivan", payments: [],
    poslednjiRadovi: [
      { id: "tw12", datum: "2026-02-01", pacijent: "Tijana Ilić", vrstaRada: "Faseta (×2)", iznos: 19000, statusNaplate: "placeno" },
      { id: "tw13", datum: "2026-01-15", pacijent: "Bojan Perić", vrstaRada: "Keramička krunica", iznos: 11500, statusNaplate: "placeno" },
    ],
  },
  {
    id: "t5", naziv: "Stara laboratorija", brojRadova: 134, dug: 0, placeno: 520000, placenoDo: "2023-06-30", status: "neaktivan", payments: [],
    poslednjiRadovi: [
      { id: "tw14", datum: "2023-06-15", pacijent: "Arhivski pacijent", vrstaRada: "Proteza", iznos: 15000, statusNaplate: "placeno" },
    ],
  },
];

// ─── localStorage hooks — Predračuni ─────────────────────

const LS_KEY_PROFORMAS = "uiLabProformas";
const LS_KEY_COUNTER  = "uiLabPredracunCounter";

function parseBrojCounter(broj?: string): number {
  if (!broj) return 0;
  const n = parseInt(broj.split("/")[0], 10);
  return isNaN(n) ? 0 : n;
}

function nextBrojPredracuna(existing: Predracun[]): string {
  const year = new Date().getFullYear();
  let storedCounter = 0;
  try {
    storedCounter = parseInt(localStorage.getItem(LS_KEY_COUNTER) ?? "0", 10) || 0;
  } catch { /* noop */ }
  const maxFromExisting = existing.reduce((max, p) => Math.max(max, parseBrojCounter(p.brojPredracuna)), 0);
  const next = Math.max(storedCounter, maxFromExisting) + 1;
  try { localStorage.setItem(LS_KEY_COUNTER, String(next)); } catch { /* noop */ }
  return `${next}/${year}`;
}

function assignMissingBrojevi(list: Predracun[]): Predracun[] {
  const sorted = [...list].sort((a, b) => a.datum.localeCompare(b.datum));
  let seq = 28170;
  const year = 2026;
  return sorted.map(p => {
    if (p.brojPredracuna) return p;
    const assigned = { ...p, brojPredracuna: `${seq}/${year}` };
    seq++;
    return assigned;
  });
}

function loadProformas(): Predracun[] {
  if (typeof window === "undefined") return SEED_PROFORMAS;
  try {
    const raw = localStorage.getItem(LS_KEY_PROFORMAS);
    if (!raw) {
      const seeded = assignMissingBrojevi(SEED_PROFORMAS);
      saveProformas(seeded);
      return seeded;
    }
    const parsed = JSON.parse(raw) as Predracun[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const seeded = assignMissingBrojevi(SEED_PROFORMAS);
      saveProformas(seeded);
      return seeded;
    }
    const withBrojevi = assignMissingBrojevi(parsed);
    const changed = withBrojevi.some((p, i) => p.brojPredracuna !== parsed[i]?.brojPredracuna);
    if (changed) saveProformas(withBrojevi);
    return withBrojevi;
  } catch { return assignMissingBrojevi(SEED_PROFORMAS); }
}

function saveProformas(list: Predracun[]) {
  try { localStorage.setItem(LS_KEY_PROFORMAS, JSON.stringify(list)); } catch { /* noop */ }
}

export function loadPredracunById(id: string): Predracun | null {
  const all = loadProformas();
  return all.find(p => p.id === id) ?? null;
}

export function useProformas() {
  const [proformas, setProformas] = useState<Predracun[]>(SEED_PROFORMAS);

  useEffect(() => { setProformas(loadProformas()); }, []);

  const persist = (next: Predracun[]) => { setProformas(next); saveProformas(next); };

  const add = (data: Omit<Predracun, "id">) => {
    const brojPredracuna = nextBrojPredracuna(proformas);
    persist([...proformas, { ...data, id: Date.now().toString(), brojPredracuna }]);
  };

  const update = (id: string, data: Partial<Omit<Predracun, "id">>) => {
    persist(proformas.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const confirmFinal = (id: string) => {
    persist(proformas.map(p => p.id === id ? { ...p, status: "final" as const } : p));
  };

  const storno = (id: string) => {
    persist(proformas.map(p => p.id === id ? { ...p, status: "storniran" as const } : p));
  };

  // TODO: replace with API call (only drafts should be deletable)
  const remove = (id: string) => {
    persist(proformas.filter(p => p.id !== id));
  };

  return { proformas, add, update, confirmFinal, storno, remove };
}

// ─── localStorage hooks — Uplate ─────────────────────────

const LS_KEY_PAYMENTS = "uiLabPayments";

function loadPayments(): Uplata[] {
  if (typeof window === "undefined") return SEED_PAYMENTS;
  try {
    const raw = localStorage.getItem(LS_KEY_PAYMENTS);
    if (!raw) return SEED_PAYMENTS;
    const parsed = JSON.parse(raw) as Uplata[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_PAYMENTS;
  } catch { return SEED_PAYMENTS; }
}

function savePayments(list: Uplata[]) {
  try { localStorage.setItem(LS_KEY_PAYMENTS, JSON.stringify(list)); } catch { /* noop */ }
}

export function usePayments() {
  const [payments, setPayments] = useState<Uplata[]>(SEED_PAYMENTS);

  useEffect(() => { setPayments(loadPayments()); }, []);

  const persist = (next: Uplata[]) => { setPayments(next); savePayments(next); };

  const add = (data: Omit<Uplata, "id">) => {
    persist([...payments, { ...data, id: Date.now().toString() }]);
  };

  const update = (id: string, data: Partial<Omit<Uplata, "id">>) => {
    persist(payments.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const storno = (id: string) => {
    persist(payments.map(p => p.id === id ? { ...p, status: "stornirana" as const } : p));
  };

  return { payments, add, update, storno };
}

// ─── Badge components ────────────────────────────────────

export function PredracunStatusBadge({ status }: { status: Predracun["status"] }) {
  const map = {
    draft:     { bg: "var(--v2-status-pending-bg)",   fg: "var(--v2-status-pending-fg)",   label: "Nacrt" },
    final:     { bg: "var(--v2-status-confirmed-bg)", fg: "var(--v2-status-confirmed-fg)", label: "Finalan" },
    storniran: { bg: "var(--v2-status-cancelled-bg)", fg: "var(--v2-status-cancelled-fg)", label: "Storniran" },
  };
  const { bg, fg, label } = map[status];
  return (
    <span
      className="text-[10px] font-normal whitespace-nowrap px-[8px] py-[4px]"
      style={{ borderRadius: "var(--v2-radius-badge)", background: bg, color: fg }}
    >
      {label}
    </span>
  );
}

export function UplataStatusBadge({ status }: { status: Uplata["status"] }) {
  const isActive = status === "evidentirana";
  return (
    <span
      className="text-[10px] font-normal whitespace-nowrap px-[8px] py-[4px]"
      style={{
        borderRadius: "var(--v2-radius-badge)",
        background: isActive ? "var(--v2-status-confirmed-bg)" : "var(--v2-status-cancelled-bg)",
        color: isActive ? "var(--v2-status-confirmed-fg)" : "var(--v2-status-cancelled-fg)",
      }}
    >
      {isActive ? "Evidentirana" : "Stornirana"}
    </span>
  );
}

export function NacinPlacanjaBadge({ nacin }: { nacin?: Uplata["nacinPlacanja"] }) {
  if (!nacin) return <span style={{ color: "var(--v2-text-muted)", fontSize: "12px" }}>—</span>;
  const labels: Record<string, string> = { gotovina: "Gotovina", kartica: "Kartica", racun: "Račun", ostalo: "Ostalo" };
  return (
    <span
      className="text-[10px] font-normal whitespace-nowrap px-[8px] py-[4px]"
      style={{ borderRadius: "var(--v2-radius-badge)", background: "var(--v2-primary-bg)", color: "var(--v2-text)" }}
    >
      {labels[nacin] ?? nacin}
    </span>
  );
}

export function WorkStatusBadge({ status }: { status: "placeno" | "nijeplaceno" }) {
  const isPaid = status === "placeno";
  return (
    <span
      className="text-[10px] font-normal whitespace-nowrap px-[6px] py-[3px]"
      style={{
        borderRadius: "var(--v2-radius-badge)",
        background: isPaid ? "var(--v2-status-confirmed-bg)" : "var(--v2-status-pending-bg)",
        color: isPaid ? "var(--v2-status-confirmed-fg)" : "var(--v2-status-pending-fg)",
      }}
    >
      {isPaid ? "Plaćeno" : "Nije plaćeno"}
    </span>
  );
}

// ─── Reusable shared UI ───────────────────────────────────

export const inputStyle: React.CSSProperties = {
  background: "var(--v2-input-bg)",
  border: "1px solid var(--v2-border)",
  borderRadius: "10px",
  color: "var(--v2-text)",
  fontSize: "14px",
  padding: "9px 13px",
  width: "100%",
  outline: "none",
};

export const labelStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "var(--v2-text-muted)",
  marginBottom: "6px",
  display: "block",
};

export function ModalOverlay({ children, z = 50 }: { children: React.ReactNode; z?: number }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "rgba(11,11,19,0.42)", zIndex: z }}
    >
      {children}
    </div>
  );
}

export function BottomSheetOverlay({ children, onBackdrop }: { children: React.ReactNode; onBackdrop?: () => void }) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-end"
      style={{ background: "rgba(11,11,19,0.45)" }}
      onClick={onBackdrop}
    >
      <div
        className="w-full flex flex-col overflow-y-auto"
        style={{ background: "var(--v2-surface)", borderRadius: "20px 20px 0 0", maxHeight: "90vh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-[12px] pb-[4px] flex-shrink-0">
          <div className="rounded-full" style={{ width: "40px", height: "4px", background: "var(--v2-border)" }} />
        </div>
        {children}
      </div>
    </div>
  );
}
