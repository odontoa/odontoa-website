"use client";

import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────

export interface Technician {
  id: string;
  naziv: string;
  telefon?: string;
  email?: string;
  napomena?: string;
  status: "aktivan" | "neaktivan";
}

export interface TechWork {
  id: string;
  datum: string;      // ISO "YYYY-MM-DD"
  pacijent: string;
  vrstaRada: string;
  iznos: number;
  statusNaplate: "placeno" | "nijeplaceno";
}

export interface TechStats {
  brojRadova: number;
  ukupanDug: number;       // RSD
  placenoDo: string;       // ISO date
  poslednjiRad: string;    // ISO date
  poslednjiRadovi: TechWork[];
}

// ─── Seed data ───────────────────────────────────────────

const SEED_TECHNICIANS: Technician[] = [
  {
    id: "1",
    naziv: "Dental Lab Pro d.o.o.",
    telefon: "+381 11 123 4567",
    email: "kontakt@dentallabpro.rs",
    napomena: "Specijalizovani za keramiku i zirkonijum.",
    status: "aktivan",
  },
  {
    id: "2",
    naziv: "Miroslav Petrović",
    telefon: "+381 63 987 6543",
    email: "m.petrovic@lab.rs",
    napomena: "",
    status: "aktivan",
  },
  {
    id: "3",
    naziv: "Zlatozub d.o.o.",
    telefon: "+381 11 456 7890",
    email: "info@zlatozub.rs",
    napomena: "Metalno-keramički radovi, proteze.",
    status: "aktivan",
  },
  {
    id: "4",
    naziv: "Ana Jovanović",
    telefon: "+381 64 555 0123",
    email: "",
    napomena: "Freelance tehničar za facete.",
    status: "aktivan",
  },
  {
    id: "5",
    naziv: "Stara laboratorija",
    telefon: "",
    email: "",
    napomena: "Više se ne koristi.",
    status: "neaktivan",
  },
];

export const SEED_STATS: Record<string, TechStats> = {
  "1": {
    brojRadova: 47,
    ukupanDug: 145000,
    placenoDo: "2026-01-31",
    poslednjiRad: "2026-02-14",
    poslednjiRadovi: [
      { id: "w1", datum: "2026-02-14", pacijent: "Milena Đorđević",  vrstaRada: "Keramička krunica",     iznos: 12000, statusNaplate: "placeno"    },
      { id: "w2", datum: "2026-02-08", pacijent: "Stefan Nikolić",   vrstaRada: "Most (3 člana)",         iznos: 28000, statusNaplate: "placeno"    },
      { id: "w3", datum: "2026-01-22", pacijent: "Ana Popović",      vrstaRada: "Totalna proteza",        iznos: 35000, statusNaplate: "nijeplaceno" },
      { id: "w4", datum: "2026-01-10", pacijent: "Marko Lazović",    vrstaRada: "Faceta (×4)",            iznos: 38000, statusNaplate: "nijeplaceno" },
      { id: "w5", datum: "2025-12-28", pacijent: "Jelena Vasić",     vrstaRada: "Zirkonijumska krunica",  iznos: 14000, statusNaplate: "placeno"    },
    ],
  },
  "2": {
    brojRadova: 23,
    ukupanDug: 68000,
    placenoDo: "2026-02-28",
    poslednjiRad: "2026-02-25",
    poslednjiRadovi: [
      { id: "w6", datum: "2026-02-25", pacijent: "Dragan Todorović", vrstaRada: "Implant krunica",       iznos: 22000, statusNaplate: "placeno"    },
      { id: "w7", datum: "2026-02-18", pacijent: "Ivana Kovač",      vrstaRada: "Inlay (×2)",            iznos: 15000, statusNaplate: "placeno"    },
      { id: "w8", datum: "2026-01-30", pacijent: "Nikola Stanić",    vrstaRada: "Parcijalna proteza",    iznos: 18000, statusNaplate: "nijeplaceno" },
    ],
  },
  "3": {
    brojRadova: 91,
    ukupanDug: 312000,
    placenoDo: "2025-12-31",
    poslednjiRad: "2026-02-20",
    poslednjiRadovi: [
      { id: "w9",  datum: "2026-02-20", pacijent: "Petar Simić",       vrstaRada: "Metalna krunica",     iznos: 8000,  statusNaplate: "placeno"    },
      { id: "w10", datum: "2026-02-12", pacijent: "Marina Obradović",  vrstaRada: "Parcijalna proteza",  iznos: 24000, statusNaplate: "nijeplaceno" },
      { id: "w11", datum: "2026-01-28", pacijent: "Zoran Đokić",       vrstaRada: "Most (4 člana)",      iznos: 36000, statusNaplate: "nijeplaceno" },
    ],
  },
  "4": {
    brojRadova: 12,
    ukupanDug: 0,
    placenoDo: "2026-02-01",
    poslednjiRad: "2026-02-01",
    poslednjiRadovi: [
      { id: "w12", datum: "2026-02-01", pacijent: "Tijana Ilić",  vrstaRada: "Faseta (×2)",      iznos: 19000, statusNaplate: "placeno" },
      { id: "w13", datum: "2026-01-15", pacijent: "Bojan Perić",  vrstaRada: "Keramička krunica", iznos: 11500, statusNaplate: "placeno" },
    ],
  },
  "5": {
    brojRadova: 134,
    ukupanDug: 0,
    placenoDo: "2023-06-30",
    poslednjiRad: "2023-06-15",
    poslednjiRadovi: [
      { id: "w14", datum: "2023-06-15", pacijent: "Arhivski pacijent", vrstaRada: "Proteza", iznos: 15000, statusNaplate: "placeno" },
    ],
  },
};

// ─── localStorage hook ────────────────────────────────────

const LS_KEY = "uiLabTechnicians";

function loadFromStorage(): Technician[] {
  if (typeof window === "undefined") return SEED_TECHNICIANS;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return SEED_TECHNICIANS;
    const parsed = JSON.parse(raw) as Technician[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_TECHNICIANS;
  } catch {
    return SEED_TECHNICIANS;
  }
}

function saveToStorage(list: Technician[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch { /* noop */ }
}

export function useTechnicians() {
  const [technicians, setTechnicians] = useState<Technician[]>(SEED_TECHNICIANS);

  useEffect(() => {
    setTechnicians(loadFromStorage());
  }, []);

  const persist = (next: Technician[]) => {
    setTechnicians(next);
    saveToStorage(next);
  };

  const add = (data: Omit<Technician, "id" | "status">) => {
    persist([...technicians, { ...data, id: Date.now().toString(), status: "aktivan" }]);
  };

  const update = (id: string, data: Partial<Omit<Technician, "id">>) => {
    persist(technicians.map((t) => (t.id === id ? { ...t, ...data } : t)));
  };

  const deactivate = (id: string) => {
    persist(technicians.map((t) => (t.id === id ? { ...t, status: "neaktivan" } : t)));
  };

  const reactivate = (id: string) => {
    persist(technicians.map((t) => (t.id === id ? { ...t, status: "aktivan" } : t)));
  };

  return { technicians, add, update, deactivate, reactivate };
}

// ─── UI helpers ──────────────────────────────────────────

export function TechStatusBadge({ status }: { status: "aktivan" | "neaktivan" }) {
  const isActive = status === "aktivan";
  return (
    <span
      className="text-[10px] font-normal whitespace-nowrap px-[8px] py-[4px]"
      style={{
        borderRadius: "var(--v2-radius-badge)",
        background: isActive ? "var(--v2-status-confirmed-bg)" : "var(--v2-status-cancelled-bg)",
        color: isActive ? "var(--v2-status-confirmed-fg)" : "var(--v2-status-cancelled-fg)",
      }}
    >
      {isActive ? "Aktivan" : "Neaktivan"}
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

export function getInitials(naziv: string): string {
  const parts = naziv.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return naziv.slice(0, 2).toUpperCase();
}

export function formatDate(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}.`;
}

export function formatRSD(amount: number): string {
  return new Intl.NumberFormat("sr-RS").format(amount) + " RSD";
}
