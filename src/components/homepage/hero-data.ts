/* Primer podataka za hero dashboard (jul 2026). Jedan izvor za jednacinu, grafikon i
   panel "Danas", da se brojke svuda poklope:
   - bruto 1.284.500 - tehnika 86.200 (16 naloga) = neto 1.198.300
   - jun 2026: bruto 1.146.900, tehnika 95.800, neto 1.051.100 (jul: +12% bruto, +14% neto)
   - danas (31. jul, petak) je do sada naplaceno 11.700 (jedan termin), isto kao dan 31 u grafikonu
   Brojke su izmisljene, ali matematika i skala su tacne. Grafikon se racuna iz dnevnih iznosa. */

export const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const GROSS = 1284500;
const LAB = 86200;
const GROSS_JUN = 1146900;
const LAB_JUN = 95800;
const TODAY_PAID = 11700;

/* Nedelja = 0 (ordinacija ne radi), subota pola dana. 1. jul 2026 je sreda, 1. jun ponedeljak.
   Jul ima 30 tezina: 31. jul je "danas" i nosi samo ono sto je do sada naplaceno. */
const W_JUL = [1.02, 0.94, 1.1, 0.52, 0, 0.88, 1.05, 0.97, 1.12, 1.18, 0.6, 0, 0.92, 1.08, 1.0, 1.15, 1.22, 0.58, 0, 0.95, 1.1, 1.04, 1.2, 1.25, 0.62, 0, 0.98, 1.12, 1.06, 1.19];
const W_JUN = [0.9, 1.02, 0.96, 1.08, 1.1, 0.55, 0, 0.94, 1.0, 0.98, 1.12, 1.15, 0.57, 0, 0.9, 1.06, 1.01, 1.1, 1.16, 0.6, 0, 0.93, 1.04, 0.99, 1.13, 1.2, 0.58, 0, 0.97, 1.08];

/* Raspodela na stotine dinara; ostatak zaokruzivanja ide na poslednji radni dan. */
function spread(total: number, weights: number[]) {
  const sum = weights.reduce((a, b) => a + b, 0);
  const vals = weights.map((w) => Math.round(((w / sum) * total) / 100) * 100);
  const diff = total - vals.reduce((a, b) => a + b, 0);
  let last = vals.length - 1;
  while (vals[last] === 0) last--;
  vals[last] += diff;
  return vals;
}

const cumulative = (arr: number[]) => {
  let run = 0;
  return arr.map((v) => (run += v));
};

const julDay = [...spread(GROSS - TODAY_PAID, W_JUL), TODAY_PAID];
const junDay = spread(GROSS_JUN, W_JUN);
const julCum = cumulative(julDay);
const junCum = cumulative(junDay);

const pct = (a: number, b: number) => Math.round((a / b - 1) * 100);

export const HERO_TOTALS = {
  gross: GROSS,
  lab: LAB,
  net: GROSS - LAB,
  labOrders: 16,
  /* 6,7% */
  labShare: ((LAB / GROSS) * 100).toFixed(1).replace('.', ','),
  grossVsJun: pct(GROSS, GROSS_JUN),
  netVsJun: pct(GROSS - LAB, GROSS_JUN - LAB_JUN),
};

/* ── Geometrija grafikona: viewBox 600x200, linearna Y skala 0-1,4M ── */
const VB_W = 600;
const VB_H = 200;
const Y_MAX = 1400000;
const DAYS = 31;
const x = (i: number) => (i / (DAYS - 1)) * VB_W;
const y = (v: number) => VB_H * (1 - v / Y_MAX);

/* Monotona kubna interpolacija (Fritsch-Carlson): kriva ne prebacuje preko podataka,
   pa kumulativna linija nikad ne "pada". */
function monotonePath(values: number[]) {
  const pts = values.map((v, i) => [x(i), y(v)] as const);
  const n = pts.length;
  const m: number[] = [];
  const t: number[] = [];
  for (let i = 0; i < n - 1; i++) m[i] = (pts[i + 1][1] - pts[i][1]) / (pts[i + 1][0] - pts[i][0]);
  t[0] = m[0];
  t[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      t[i] = 0;
      t[i + 1] = 0;
      continue;
    }
    const a = t[i] / m[i];
    const b = t[i + 1] / m[i];
    const h = a * a + b * b;
    if (h > 9) {
      const s = 3 / Math.sqrt(h);
      t[i] = s * a * m[i];
      t[i + 1] = s * b * m[i];
    }
  }
  const r = (v: number) => v.toFixed(1);
  let d = `M${r(pts[0][0])},${r(pts[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const h = (x1 - x0) / 3;
    d += ` C${r(x0 + h)},${r(y0 + t[i] * h)} ${r(x1 - h)},${r(y1 - t[i + 1] * h)} ${r(x1)},${r(y1)}`;
  }
  return d;
}

const FOCUS = 21; // 22. u mesecu
const julLine = monotonePath(julCum);

export const HERO_CHART = {
  viewBox: `0 0 ${VB_W} ${VB_H}`,
  julLine,
  julArea: `${julLine} L${VB_W},${VB_H} L0,${VB_H} Z`,
  /* Jun ima 30 dana, pa linija staje na 30. u mesecu (96,7% sirine). */
  junLine: monotonePath(junCum),
  grid: [0, 400000, 800000, 1200000].map((v) => ({
    y: y(v),
    top: `${((y(v) / VB_H) * 100).toFixed(2)}%`,
    label: v === 0 ? '0' : v >= 1e6 ? `${(v / 1e6).toFixed(1).replace('.', ',')}M` : `${v / 1000}k`,
  })),
  xLabels: [
    { i: 0, label: '1. jul' },
    { i: 7, label: '8.' },
    { i: 14, label: '15.' },
    { i: 21, label: '22.' },
    { i: 30, label: '31. jul' },
  ].map((l) => ({ ...l, left: `${((l.i / (DAYS - 1)) * 100).toFixed(2)}%` })),
  focus: {
    x: x(FOCUS),
    left: `${((FOCUS / (DAYS - 1)) * 100).toFixed(2)}%`,
    julTop: `${((y(julCum[FOCUS]) / VB_H) * 100).toFixed(2)}%`,
    junTop: `${((y(junCum[FOCUS]) / VB_H) * 100).toFixed(2)}%`,
    day: FOCUS + 1,
    jul: julCum[FOCUS],
    jun: junCum[FOCUS],
    diff: ((julCum[FOCUS] / junCum[FOCUS] - 1) * 100).toFixed(1).replace('.', ','),
  },
};

/* ── Panel "Danas": statusi prate naslov (zakazano / uradjeno / naplaceno) ── */
export type TodayStatus = 'paid' | 'done' | 'now' | 'booked';

export const HERO_TODAY: {
  time: string;
  patient: string;
  treatment: string;
  status: TodayStatus;
  amount?: number;
  /* Na mobilnom ostaju tri reda: po jedan za naplaceno, uradjeno i zakazano. */
  mobile: boolean;
}[] = [
  { time: '09:00', patient: 'Marko P.', treatment: 'Kompozitne plombe, 36 i 37', status: 'paid', amount: 11700, mobile: true },
  { time: '11:15', patient: 'Nikola T.', treatment: 'Uklanjanje kamenca', status: 'done', amount: 3800, mobile: true },
  { time: '12:00', patient: 'Ivana R.', treatment: 'Vađenje, 48', status: 'now', mobile: false },
  { time: '14:00', patient: 'Stefan I.', treatment: 'Konsultacija, implant', status: 'booked', mobile: true },
  /* Poslednji red na desktopu namerno ulazi u rez dna; status "Zakazano" ostaje vidljiv iznad. */
  { time: '15:30', patient: 'Milica S.', treatment: 'Kontrola', status: 'booked', mobile: false },
];

export const TODAY_STATUS_LABEL: Record<TodayStatus, string> = {
  paid: 'Naplaćeno',
  done: 'Urađeno',
  now: 'U toku',
  booked: 'Zakazano',
};

/* Interna provera: naplaceno danas u panelu = dan 31 u grafikonu. */
export const HERO_TODAY_PAID = HERO_TODAY.filter((r) => r.status === 'paid').reduce((s, r) => s + (r.amount ?? 0), 0);
export const HERO_CHECK = {
  todayMatchesChart: HERO_TODAY_PAID === julDay[DAYS - 1],
  julSum: julCum[DAYS - 1],
  junSum: junCum[29],
};
