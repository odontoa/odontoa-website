import { CheckCircle2, Copy, Lock, Plus, Printer, Search, Tablet } from 'lucide-react';
import { AppFrame, Pill } from './AppFrame';
import { CLINIC, CLINIC_INFO, DOCTOR, TEMPLATES } from './data';

/** Pozadina: sabloni dokumenata, kao u aplikaciji. */
export function DokumentacijaScreen() {
  return (
    <AppFrame active="ord" crumb="Ordinacija" current="Šabloni dokumenata">
      <div className="pv-h">
        <div>
          <div className="pv-eb">Ordinacija</div>
          <div className="pv-title">Šabloni dokumenata</div>
        </div>
        <span className="pv-btn pv-btn--p">
          <Plus size={14} strokeWidth={2} />
          Novi šablon
        </span>
      </div>
      <div className="pv-search">
        <Search size={15} />
        Pretraži šablone…
      </div>
      <div className="pv-card">
        <div className="pv-card-h">
          Podrazumevani šabloni<small>{TEMPLATES.length}</small>
        </div>
        <table className="pv-table">
          <thead>
            <tr>
              <th>Naziv</th>
              <th>Kategorija</th>
              <th>Tip</th>
              <th className="pv-r">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {TEMPLATES.map(([name, cat]) => (
              <tr key={name}>
                <td>
                  <span className="pv-row pv-gap8 pv-accent">
                    <Copy size={15} />
                    <b>{name}</b>
                  </span>
                </td>
                <td>
                  <Pill tone={cat === 'Saglasnosti' ? 'violet' : 'draft'}>{cat}</Pill>
                </td>
                <td>
                  <Pill tone="gray">
                    <Lock size={10} />
                    Sistemski
                  </Pill>
                </td>
                <td className="pv-r">
                  <span className="pv-btn pv-btn--sm">
                    <Copy size={13} />
                    Dupliraj kao klinički
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppFrame>
  );
}

/* Potpis pacijenta: rukopis "I. Ristić" sa nagibom; dvostruki trag za pritisak pera. */
const SIGN_D =
  'M14,44 C16,30 20,16 26,10 C29,7 31,10 29,16 C26,26 21,38 19,48 M30,38 C36,22 44,12 52,12 C59,12 58,22 50,27 C46,29 42,30 40,30 C47,32 53,40 58,46 C61,49 64,44 66,38 C67,35 68,32 69,31 C69,37 68,44 71,46 C74,47 77,40 79,35 C80,33 82,33 82,36 C81,40 76,43 79,45 C82,47 88,42 91,37 C93,33 95,26 97,18 C97,28 95,40 98,46 C101,49 105,42 108,36 C109,34 110,33 111,33 C111,38 110,44 113,46 C116,47 119,42 122,37 C123,35 125,33 127,33 C124,36 122,42 125,45 C129,48 135,42 140,36';
/* Crtice (t, i, c) i potez ispod potpisa pacijenta, kao u prethodnoj verziji. */
const SIGN_MARKS = 'M93,24 L104,22 M110,27 L111,25 M129,28 L134,24 M22,54 C64,58 118,57 176,47';

/* Potpis doktorke: "J. Savić", vezano pismo sa potezom ispod (isti nacin crtanja kao potpis pacijenta). */
const SIGN_DR =
  'M30,15 C38,11 48,10 55,13 M47,12 C47,26 45,40 39,49 C35,55 27,56 25,50 C23,45 29,42 35,44 M73,21 C67,14 58,18 61,25 C64,32 73,34 67,42 C63,48 55,46 55,41 M75,38 C71,32 64,36 66,42 C68,47 74,44 76,38 C76,43 78,47 82,44 C86,40 88,34 90,31 C90,37 92,45 96,40 C98,36 100,32 102,30 C102,36 102,44 106,44 C109,44 110,40 112,36 M120,34 C114,32 112,40 116,44 C120,47 125,42 127,39';
const SIGN_DR_MARKS = 'M104,25 L105.5,23.5 M119,27 L123,23 M28,55 C66,59 112,56 150,46';

function Signature({ d, marks, width = 2 }: { d: string; marks?: string; width?: number }) {
  return (
    <svg viewBox="0 0 200 60" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} stroke="#1b2140" strokeWidth={width} opacity=".92" />
      <path d={d} stroke="#1b2140" strokeWidth="1" transform="translate(.6 .4)" opacity=".5" />
      {marks ? <path d={marks} stroke="#1b2140" strokeWidth="1.6" /> : null}
    </svg>
  );
}

/** Izmisljen znak ustanove: zub sa osmehom i odsjajem, u boji aplikacije. */
export function ClinicLogo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="pv-clinic-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8466ef" />
          <stop offset="1" stopColor="#5a3ec7" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#pv-clinic-g)" />
      <path
        d="M8.4,12 C8.4,8.2 11.8,7 16,9.6 C20.2,7 23.6,8.2 23.6,12 C23.6,16.4 21.8,18.2 21.1,23.2 C20.7,26 18.8,26.2 18.3,23.6 L16,17.6 L13.7,23.6 C13.2,26.2 11.3,26 10.9,23.2 C10.2,18.2 8.4,16.4 8.4,12 Z"
        fill="#fff"
      />
      <path d="M12.4,13.6 C14.6,15.6 17.4,15.6 19.6,13.6" stroke="#7c5ce6" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M24.6,4.6 L25.3,6.7 L27.4,7.4 L25.3,8.1 L24.6,10.2 L23.9,8.1 L21.8,7.4 L23.9,6.7 Z" fill="#fff" opacity=".95" />
    </svg>
  );
}

/**
 * Prednji plan: saglasnost kao dokument iz aplikacije (zaglavlje ustanove, MB i PIB,
 * podaci pacijenta, pocetak teksta iz sablona koji se pretapa, potpisi pacijenta i stomatologa).
 * Gore su obe opcije koje aplikacija nudi: stampa ili potpis na tabletu.
 */
export function SaglasnostDoc() {
  return (
    <div className="pv-doc-wrap pv-surface">
      <div className="pv-doc-bar">
        <div>
          <b>Saglasnost</b>
          <span className="pv-muted"> · Ivana Ristić</span>
        </div>
        <div className="pv-btns">
          <span className="pv-btn pv-btn--sm">
            <Printer size={13} />
            Štampaj
          </span>
          <span className="pv-btn pv-btn--sm pv-btn--p">
            <Tablet size={13} />
            Potpiši na tabletu
          </span>
        </div>
      </div>
      <div className="pv-doc">
        <div className="pv-doc-head">
          <div className="pv-doc-brand">
            <ClinicLogo />
            <div>
              <b>VIDENTA</b>
              <small>Centar dentalne medicine</small>
            </div>
          </div>
          <dl className="pv-doc-ids">
            <dt>Adresa</dt>
            <dd>{CLINIC_INFO.address}</dd>
            <dt>Matični broj</dt>
            <dd>{CLINIC_INFO.mb}</dd>
            <dt>PIB</dt>
            <dd>{CLINIC_INFO.pib}</dd>
          </dl>
        </div>
        <h5>Saglasnost za vađenje zuba</h5>
        <div className="pv-doc-meta">
          <span>
            Pacijent: <b>Ivana Ristić</b>
          </span>
          <span>
            Datum: <b>31.07.2026.</b>
          </span>
          <span>
            Stomatolog: <b>{DOCTOR}</b>
          </span>
          <span>
            Zub: <b>48</b>
          </span>
        </div>
        {/* Vidi se samo pocetak teksta; ostatak se pretapa, da prikaz ne bude pretrpan. */}
        <div className="pv-doc-text">
          <h6>Vađenje zuba i hirurške intervencije</h6>
          <p>
            Razumem da moje stanje zahteva vađenje zuba 48. Ovlašćujem svog stomatologa da izvrši intervenciju i, ako
            se tokom zahvata pokaže potrebnim, dodatni hirurški postupak. Upoznata sam sa mogućim rizicima, uključujući
            bol, otok, krvarenje i infekciju.
          </p>
        </div>
        <div className="pv-doc-signs">
          <div>
            <span className="pv-doc-sign-l">Pacijent</span>
            <div className="pv-sign">
              <Signature d={SIGN_D} marks={SIGN_MARKS} width={2.1} />
            </div>
            <small>Ivana Ristić</small>
          </div>
          <div>
            <span className="pv-doc-sign-l">Stomatolog</span>
            <div className="pv-sign">
              <Signature d={SIGN_DR} marks={SIGN_DR_MARKS} width={1.9} />
            </div>
            <small>{DOCTOR}</small>
          </div>
        </div>
      </div>
      <div className="pv-stamp">
        <CheckCircle2 size={14} />
        Potpisano na tabletu 31.07.2026. u 12:06 · sačuvano u kartonu pacijenta
      </div>
    </div>
  );
}
