"use client";

// ─── Clinic store (localStorage-backed) ──────────────────────────────────────
// Therapies and Technicians are clinic-level data stored in localStorage.
// Keys are stable across refreshes so the front desk can configure them once.

import type { Therapy, TherapyCategory, Technician } from "./types";

const THERAPIES_KEY    = "odontoa_v2_therapies";
const TECHNICIANS_KEY  = "odontoa_v2_technicians";

// ─── Seed data — full therapy list from Ordinacija spec ──────────────────────

function stablePriceFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return Math.round((1000 + (h % 4001)) / 100) * 100;
}

function makeTherapy(
  id: string,
  category: TherapyCategory,
  name: string,
  defaultPrice = stablePriceFromId(id),
): Therapy {
  return { id, category, name, defaultPrice, isActive: true };
}

export const DEFAULT_THERAPIES: Therapy[] = [
  // 1) Pregledi
  makeTherapy("t-001", "Pregledi", "Stomatološki pregled"),
  makeTherapy("t-002", "Pregledi", "Specijalistički stomatološki pregled"),
  makeTherapy("t-003", "Pregledi", "Ortodontski pregled (inicijalni)"),
  makeTherapy("t-004", "Pregledi", "Ortodontska kontrola"),
  makeTherapy("t-005", "Pregledi", "Konsultacija / drugo mišljenje"),

  // 2) Preventiva i parodontologija
  makeTherapy("t-101", "Preventiva i parodontologija", "Uklanjanje zubnog kamenca"),
  makeTherapy("t-102", "Preventiva i parodontologija", "Uklanjanje mekih naslaga (poliranje)"),
  makeTherapy("t-103", "Preventiva i parodontologija", "Zalivanje fisura (po zubu)"),
  makeTherapy("t-104", "Preventiva i parodontologija", "Kiretaža parodontalnog džepa (po zubu)"),

  // 3) Konzervativa
  makeTherapy("t-201", "Konzervativa", "Ispun I klase"),
  makeTherapy("t-202", "Konzervativa", "Ispun II klase"),
  makeTherapy("t-203", "Konzervativa", "Ispun III klase"),
  makeTherapy("t-204", "Konzervativa", "Ispun IV klase"),
  makeTherapy("t-205", "Konzervativa", "Ispun V klase"),
  makeTherapy("t-206", "Konzervativa", "MOD ispun"),
  makeTherapy("t-207", "Konzervativa", "Ispun na mlečnom zubu"),
  makeTherapy("t-208", "Konzervativa", "Kompozitna nadogradnja"),

  // 4) Endodoncija
  makeTherapy("t-301", "Endodoncija", "Vitalna ekstripacija"),
  makeTherapy("t-302", "Endodoncija", "Mortalna ekstripacija"),
  makeTherapy("t-303", "Endodoncija", "Drenaža"),
  makeTherapy("t-304", "Endodoncija", "Aplikacija leka"),
  makeTherapy("t-305", "Endodoncija", "Privremeno punjenje kanala"),
  makeTherapy("t-306", "Endodoncija", "Definitivno punjenje 1 kanala"),
  makeTherapy("t-307", "Endodoncija", "Definitivno punjenje 2 kanala"),
  makeTherapy("t-308", "Endodoncija", "Definitivno punjenje 3 kanala"),
  makeTherapy("t-309", "Endodoncija", "Revizija punjenja"),

  // 5) Oralna hirurgija
  makeTherapy("t-401", "Oralna hirurgija", "Vađenje mlečnog zuba"),
  makeTherapy("t-402", "Oralna hirurgija", "Vađenje zuba"),
  makeTherapy("t-403", "Oralna hirurgija", "Vađenje umnjaka"),
  makeTherapy("t-404", "Oralna hirurgija", "Komplikovano vađenje zuba"),
  makeTherapy("t-405", "Oralna hirurgija", "Ušivanje rane"),
  makeTherapy("t-406", "Oralna hirurgija", "Hirurško vađenje zuba"),
  makeTherapy("t-407", "Oralna hirurgija", "Vađenje impaktiranog zuba"),
  makeTherapy("t-408", "Oralna hirurgija", "Apikotomija"),
  makeTherapy("t-409", "Oralna hirurgija", "Cistektomija"),
  makeTherapy("t-410", "Oralna hirurgija", "Incizija apscesa"),
  makeTherapy("t-411", "Oralna hirurgija", "Frenektomija"),
  makeTherapy("t-412", "Oralna hirurgija", "Gingivektomija (po zubu)"),
  makeTherapy("t-413", "Oralna hirurgija", "Režanj operacija (po zubu)"),
  makeTherapy("t-414", "Oralna hirurgija", "Nivelacija grebena (kvadrant)"),
  makeTherapy("t-415", "Oralna hirurgija", "Zatvaranje OA komunikacije"),
  makeTherapy("t-416", "Oralna hirurgija", "Kliničko produženje krune"),
  makeTherapy("t-417", "Oralna hirurgija", "Terapija recesija gingive"),
  makeTherapy("t-418", "Oralna hirurgija", "Uklanjanje fibroma / mukokela"),

  // 6) Implantologija
  makeTherapy("t-501", "Implantologija", "Sinus LIFT"),
  makeTherapy("t-502", "Implantologija", "Ugradnja implantata 1"),
  makeTherapy("t-503", "Implantologija", "Ugradnja implantata 2"),
  makeTherapy("t-504", "Implantologija", "Ugradnja implantata 3"),
  makeTherapy("t-505", "Implantologija", "Ugradnja mini implantata"),
  makeTherapy("t-506", "Implantologija", "Metalokeramička kruna na implantu"),
  makeTherapy("t-507", "Implantologija", "Akrilatna proteza na mini implantima"),
  makeTherapy("t-508", "Implantologija", "Atecmeni - klizači / kugle"),
  makeTherapy("t-509", "Implantologija", "Atecmeni CK"),
  makeTherapy("t-510", "Implantologija", "Retenciona prečka"),
  makeTherapy("t-511", "Implantologija", "Nobel implantat"),
  makeTherapy("t-512", "Implantologija", "Nobel PK"),
  makeTherapy("t-513", "Implantologija", "Nobel MK"),

  // 7) Protetika
  makeTherapy("t-601", "Protetika", "Livna nadogradnja"),
  makeTherapy("t-602", "Protetika", "Kompozitna nadogradnja sa kočićem"),
  makeTherapy("t-603", "Protetika", "Metalokeramička kruna"),
  makeTherapy("t-604", "Protetika", "Solo kruna"),
  makeTherapy("t-605", "Protetika", "Bezmetalna kruna"),
  makeTherapy("t-606", "Protetika", "Solo BM kruna"),
  makeTherapy("t-607", "Protetika", "Frezovana MK kruna"),
  makeTherapy("t-608", "Protetika", "Privremena kruna"),
  makeTherapy("t-609", "Protetika", "Skidanje kruna (po kruni)"),
  makeTherapy("t-610", "Protetika", "Akrilatna proteza"),
  makeTherapy("t-611", "Protetika", "Akrilatna proteza sa ojačanjem"),
  makeTherapy("t-612", "Protetika", "Skeletirana proteza"),
  makeTherapy("t-613", "Protetika", "Skeletirana proteza (BELA)"),
  makeTherapy("t-614", "Protetika", "Direktno podlaganje proteze"),
  makeTherapy("t-615", "Protetika", "Indirektno podlaganje proteze"),
  makeTherapy("t-616", "Protetika", "Reparatura proteze"),
  makeTherapy("t-617", "Protetika", "Dodatak jednog zuba u protezu"),
  makeTherapy("t-618", "Protetika", "Dodatak više zuba"),
  makeTherapy("t-619", "Protetika", "Recementiranje MK krune"),
  makeTherapy("t-620", "Protetika", "Recementiranje MK mosta (po kruni)"),
  makeTherapy("t-621", "Protetika", `Proteza "Žabica"`),

  // 8) Estetska stomatologija
  makeTherapy("t-701", "Estetska stomatologija", "Beljenje jednog zuba"),
  makeTherapy("t-702", "Estetska stomatologija", "Beljenje zuba - ordinacijsko (vilica)"),
  makeTherapy("t-703", "Estetska stomatologija", "Beljenje zuba - kućno"),
  makeTherapy("t-704", "Estetska stomatologija", "Beljenje zuba - kućno + folija"),
  makeTherapy("t-705", "Estetska stomatologija", "Splint / folija"),
  makeTherapy("t-706", "Estetska stomatologija", "Kompozitna faseta"),

  // 9) Ortodoncija
  makeTherapy("t-801", "Ortodoncija", "Ortodontski pregled (inicijalni)"),
  makeTherapy("t-802", "Ortodoncija", "Ortodontska kontrola"),
  makeTherapy("t-803", "Ortodoncija", "Plan terapije (ortodoncija)"),
  makeTherapy("t-804", "Ortodoncija", "Uzimanje otisaka / digitalni scan"),
  makeTherapy("t-805", "Ortodoncija", "Fotodokumentacija (intra/extra)"),
  makeTherapy("t-806", "Ortodoncija", "Kefalometrijska analiza"),
  makeTherapy("t-807", "Ortodoncija", "Fiksni aparat (metalni) - postavljanje (po vilici)"),
  makeTherapy("t-808", "Ortodoncija", "Fiksni aparat (metalni) - postavljanje (obe vilice)"),
  makeTherapy("t-809", "Ortodoncija", "Keramički/safirni fiksni aparat - postavljanje (po vilici)"),
  makeTherapy("t-810", "Ortodoncija", "Samoligirajući aparat - postavljanje (po vilici)"),
  makeTherapy("t-811", "Ortodoncija", "Kontrola/aktivacija fiksnog aparata"),
  makeTherapy("t-812", "Ortodoncija", "Zamena bravice (po komadu)"),
  makeTherapy("t-813", "Ortodoncija", "Zamena žice"),
  makeTherapy("t-814", "Ortodoncija", "Skidanje fiksnog aparata (po vilici)"),
  makeTherapy("t-815", "Ortodoncija", "Skidanje fiksnog aparata (obe vilice)"),
  makeTherapy("t-816", "Ortodoncija", "Mobilni aparat - izrada"),
  makeTherapy("t-817", "Ortodoncija", "Aktivator/funkcionalni aparat - izrada"),
  makeTherapy("t-818", "Ortodoncija", "Kontrola mobilnog aparata"),
  makeTherapy("t-819", "Ortodoncija", "Ekspander (Hyrax) - izrada/postavljanje"),
  makeTherapy("t-820", "Ortodoncija", "Retainer (žičani) - postavljanje (po vilici)"),
  makeTherapy("t-821", "Ortodoncija", "Retenciona folija (Essix) - izrada (po vilici)"),
  makeTherapy("t-822", "Ortodoncija", "Kontrola retencije"),

  // 10) Vanstandardne usluge
  makeTherapy("t-901", "Vanstandardne usluge", "SMAT"),
  makeTherapy("t-902", "Vanstandardne usluge", "Hitna intervencija van radnog vremena"),
  makeTherapy("t-903", "Vanstandardne usluge", "Kućna poseta"),
];

export const DEFAULT_TECHNICIANS: Technician[] = [
  { id: "tech-001", name: "Dental Lab Beograd",  phone: "+381 11 123 4567", note: "Metalokeramika, krunice" },
  { id: "tech-002", name: "ProDent Tehnika",      phone: "+381 21 987 6543", note: "Skeletirane proteze" },
  { id: "tech-003", name: "ZubTech Studio",       phone: "+381 63 555 0001", note: "Digitalni otisci, CAD/CAM" },
];

// ─── localStorage helpers ─────────────────────────────────────────────────────

export function loadTherapies(): Therapy[] {
  if (typeof window === "undefined") return DEFAULT_THERAPIES;
  try {
    const raw = localStorage.getItem(THERAPIES_KEY);
    if (!raw) return DEFAULT_THERAPIES;
    const parsed = JSON.parse(raw) as Therapy[];
    // Merge: add any new DEFAULT_THERAPIES that aren't in localStorage yet
    const existingIds = new Set(parsed.map((t) => t.id));
    const merged = [...parsed];
    for (const t of DEFAULT_THERAPIES) {
      if (!existingIds.has(t.id)) merged.push(t);
    }
    return merged;
  } catch {
    return DEFAULT_THERAPIES;
  }
}

export function saveTherapies(therapies: Therapy[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(THERAPIES_KEY, JSON.stringify(therapies));
}

export function loadTechnicians(): Technician[] {
  if (typeof window === "undefined") return DEFAULT_TECHNICIANS;
  try {
    const raw = localStorage.getItem(TECHNICIANS_KEY);
    if (!raw) return DEFAULT_TECHNICIANS;
    return JSON.parse(raw) as Technician[];
  } catch {
    return DEFAULT_TECHNICIANS;
  }
}

export function saveTechnicians(technicians: Technician[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TECHNICIANS_KEY, JSON.stringify(technicians));
}
