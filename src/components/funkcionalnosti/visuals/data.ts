/**
 * Jedan dummy svet za sve prikaze proizvoda na stranicama funkcionalnosti.
 *
 * Ustanova: Centar dentalne medicine Videnta (kratko: Videnta), dr Jelena Savić.
 * Danas je petak 31.07.2026, sada 12:10 (isto kao "Danas" u heroju pocetne).
 * Aleksandra Božić (P021) je ista pacijentkinja u kartonu, predracunu i odgovoru
 * asistenta; njen dug je svuda 98.800 RSD. Laboratorije su izmisljene, iste kao na
 * pocetnoj. Brojke su izmisljene, ali se medjusobno slazu.
 */

export const CLINIC = 'Centar dentalne medicine Videnta';
export const CLINIC_SHORT = 'Videnta';
export const DOCTOR = 'dr Jelena Savić';
/* Izmisljeni podaci ustanove za zaglavlje dokumenata (nisu podaci postojece firme). */
export const CLINIC_INFO = { address: 'Njegoševa 18, 11000 Beograd', mb: '21734589', pib: '112458736' };

export const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/* ── Kalendar: nedelja 27–31. jul 2026 ── */
export type CalStatus = 'done' | 'ongoing' | 'booked' | 'urgent';
export type CalEvent = { day: number; start: number; dur: number; name: string; status: CalStatus; label?: string };
export const CAL_DAYS = [
  ['Ponedeljak', '27.07'],
  ['Utorak', '28.07'],
  ['Sreda', '29.07'],
  ['Četvrtak', '30.07'],
  ['Petak', '31.07'],
] as const;
export const CAL_TODAY = 4;
export const CAL_NOW = 12 + 10 / 60;
export const CAL_EVENTS: CalEvent[] = [
  { day: 0, start: 8.75, dur: 0.75, name: 'Jelena Petrović', status: 'done' },
  { day: 0, start: 10.25, dur: 0.75, name: 'Vladimir Perić', status: 'done' },
  { day: 0, start: 12, dur: 0.75, name: 'Nikola Marković', status: 'done' },
  { day: 0, start: 13.5, dur: 1, name: 'Uroš Mitrović', status: 'done' },
  { day: 1, start: 9.5, dur: 0.75, name: 'Marko Jovanović', status: 'done' },
  { day: 1, start: 11, dur: 0.75, name: 'Ana Tasić', status: 'done' },
  { day: 1, start: 13, dur: 1, name: 'Aleksandra Božić', status: 'done' },
  { day: 2, start: 9, dur: 0.75, name: 'Ivan Radić', status: 'done' },
  { day: 2, start: 11.25, dur: 0.75, name: 'Jovana Janković', status: 'done' },
  { day: 2, start: 12.5, dur: 0.75, name: 'Sara Ilić', status: 'done' },
  { day: 2, start: 14.5, dur: 0.75, name: 'Petar Kostić', status: 'done' },
  { day: 3, start: 9, dur: 1, name: 'Miloš Starčević', status: 'urgent', label: 'Hitan pregled' },
  { day: 3, start: 11.25, dur: 0.75, name: 'Petar Petrović', status: 'done' },
  { day: 3, start: 12.75, dur: 0.75, name: 'Lana Kovač', status: 'done' },
  { day: 4, start: 9, dur: 1, name: 'Marko Pavlović', status: 'done' },
  { day: 4, start: 11.25, dur: 0.75, name: 'Nikola Tomić', status: 'done' },
  /* U toku: linija trenutnog vremena (12:10) prolazi kroz ovaj termin */
  { day: 4, start: 12, dur: 1, name: 'Ivana Ristić', status: 'ongoing' },
  { day: 4, start: 14, dur: 0.75, name: 'Stefan Ilić', status: 'booked' },
];
/* Termin koji se u detalju prevlaci sa 14:00 na 13:15 */
export const CAL_MOVED = { name: 'Stefan Ilić', from: 14, to: 13.25, dur: 0.75 };
export const hhmm = (h: number) =>
  `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;

/* ── Karton: Aleksandra Božić ── */
export const PATIENT = {
  name: 'Aleksandra Božić',
  initials: 'AB',
  id: 'P021',
  age: '36 godina',
  born: '08.11.1989.',
  phone: '+381 64 218 3370',
};
/* Statusi i nazivi kao u legendi odontograma u aplikaciji. */
export type ToothState = 'caries' | 'filling' | 'crown' | 'endo' | 'missing';
export const TOOTH_STATE: Record<number, ToothState> = { 16: 'caries', 14: 'filling', 25: 'crown', 36: 'endo', 46: 'filling', 48: 'missing' };
/* Zateceno stanje: zatecen pri prvom pregledu, nije radjeno u ovoj ordinaciji. */
export const TOOTH_FOUND = [46, 48];
export const TEETH_UPPER = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
export const TEETH_LOWER = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
export const DIAGNOSES = [
  { code: 'K02.1', name: 'Karijes dentina', where: 'Zub 16 · aktivna', tone: 'red' },
  { code: 'K04.0', name: 'Pulpitis', where: 'Zub 36 · lečeno 16.07.', tone: 'violet' },
  { code: 'K03.6', name: 'Naslage na zubima', where: 'Obe vilice · 16.07.', tone: 'violet' },
] as const;
export const HISTORY = [
  ['Kompozitna plomba', '17.07.2026. · Zub 14'],
  ['Endodontsko lečenje, 2 kanala', '16.07.2026. · Zub 36'],
  ['Uklanjanje zubnog kamenca', '16.07.2026. · Obe vilice'],
  ['Keramička krunica', '01.04.2026. · Zub 25'],
] as const;

/* ── RTG: galerija snimaka u kartonu (Jovana Janković, P034) ──
   Cetiri reprezentativna klinicka snimka za prikaz. Namerno bez datuma, napomena i
   oznake zuba: ne tvrdimo da su istog pacijenta, pre/posle, ni za koji zub su.
   Nazivi su samo vrsta snimka; drugi panoramski je "snimak" da se dva naziva ne ponove.
   position = kadar slike u kartici (object-position). */
export type MediaImage = { src?: string; alt: string; width?: number; height?: number; position?: string };
export type MediaKind = 'Rendgen' | 'Fotografija';
export const RTG_PATIENT = { name: 'Jovana Janković', initials: 'JJ', id: 'P034', age: '34 godine', born: '12.05.1992.', phone: '+381 63 507 2219' };
export const RTG_MEDIA: { title: string; kind: MediaKind; image: MediaImage }[] = [
  { title: 'Panoramski RTG', kind: 'Rendgen', image: { src: '/images/funkcionalnosti/rtg/panoramski-1.jpg', alt: 'Panoramski rendgen snimak', width: 1017, height: 489 } },
  { title: 'Panoramski snimak', kind: 'Rendgen', image: { src: '/images/funkcionalnosti/rtg/panoramski-2.jpg', alt: 'Panoramski rendgen snimak sa ispunima, krunicama i implantom', width: 914, height: 456 } },
  { title: 'Periapikalni RTG', kind: 'Rendgen', image: { src: '/images/funkcionalnosti/rtg/periapikalni.jpg', alt: 'Periapikalni rendgen snimak jednog regiona', width: 592, height: 418, position: 'center 60%' } },
  { title: 'Intraoralna, frontalno', kind: 'Fotografija', image: { src: '/images/funkcionalnosti/rtg/intraoralna-frontalno.jpg', alt: 'Intraoralna fotografija spreda, sa retraktorima', width: 619, height: 429, position: 'center 55%' } },
];
/* Pregled u heroju: glavni snimak i traka sa svim snimcima (indeksi iz RTG_MEDIA). */
export const RTG_VIEW = { main: 0, strip: [0, 1, 2, 3] };

/* ── Zubna tehnika: statusi samo oni koji postoje u aplikaciji ── */
export type OrderStatus = 'draft' | 'done' | 'cancelled';
export const ORDERS: { initials: string; patient: string; lab: string; work: string; due: string; price: number; status: OrderStatus }[] = [
  { initials: 'UM', patient: 'Uroš Mitrović', lab: 'DentalTeh', work: 'Privremena krunica, 21', due: '04.08.', price: 1800, status: 'draft' },
  { initials: 'AB', patient: 'Aleksandra Božić', lab: 'Lab Dentalux', work: 'Bezmetalna krunica (cirkon), 16', due: '06.08.', price: 6900, status: 'draft' },
  { initials: 'SJ', patient: 'Stefan Jovanović', lab: 'DentalTeh', work: 'Krunica na implantu, 46', due: '29.07.', price: 9500, status: 'cancelled' },
  { initials: 'JP', patient: 'Jelena Petrović', lab: 'CAD/CAM studio', work: 'Keramička faseta, 11', due: '24.07.', price: 7400, status: 'done' },
  { initials: 'VP', patient: 'Vladimir Perić', lab: 'Lab Dentalux', work: 'Reparatura proteze', due: '22.07.', price: 2400, status: 'done' },
];
export const ORDER_LABEL: Record<OrderStatus, string> = { draft: 'Nacrt', done: 'Završeno', cancelled: 'Otkazano' };

/* ── Dokumentacija ── */
export const TEMPLATES = [
  ['Saglasnost za vađenje zuba', 'Saglasnosti'],
  ['Saglasnost za endodontsko lečenje', 'Saglasnosti'],
  ['Opravdanje za izostanak iz škole', 'Opravdanja'],
  ['Potvrda o dolasku (škola)', 'Potvrde'],
  ['Uput za specijalistu', 'Uputi'],
] as const;

/* ── Finansije: predracun Aleksandre Bozic; 104.800 - 6.000 = 98.800 ── */
export const INVOICE = {
  number: 'PR-2026-0187',
  issued: '31.03.2026.',
  items: [
    { service: 'Keramička krunica', tooth: '16', state: 'planirano 07.08.', amount: 38000 },
    { service: 'Keramička krunica', tooth: '25', state: 'urađeno 01.04.', amount: 38000 },
    { service: 'Endodontsko lečenje, 2 kanala', tooth: '36', state: 'urađeno 16.07.', amount: 14500 },
    { service: 'Kompozitna plomba', tooth: '14', state: 'urađeno 17.07.', amount: 6800 },
    { service: 'Uklanjanje zubnog kamenca', tooth: 'obe vilice', state: 'urađeno 16.07.', amount: 4500 },
    { service: 'Kontrolni pregled i poliranje', tooth: '12', state: 'urađeno 31.03.', amount: 3000 },
  ],
  payments: [
    { date: '31.03.2026.', method: 'Gotovina', amount: 3000 },
    { date: '18.07.2026.', method: 'Kartica', amount: 3000 },
  ],
  reminder: '03.08.2026. u 10:00',
};
export const INVOICE_TOTAL = INVOICE.items.reduce((s, i) => s + i.amount, 0);
export const INVOICE_PAID = INVOICE.payments.reduce((s, p) => s + p.amount, 0);
export const INVOICE_DUE = INVOICE_TOTAL - INVOICE_PAID;

/* ── Asistent: dugovi iznad 20.000 (98.800 + 30.100) ── */
export const DEBTORS = [
  { name: 'Aleksandra Božić', amount: INVOICE_DUE },
  { name: 'Vladimir Perić', amount: 30100 },
];
export const DEBTORS_TOTAL = DEBTORS.reduce((s, d) => s + d.amount, 0);
