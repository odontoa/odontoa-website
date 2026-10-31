/**
 * Analitika i pristanak.
 *
 * Dva rezima, bira ih NEXT_PUBLIC_COOKIE_CONSENT_ENABLED (podrazumevano iskljuceno):
 * - iskljuceno (trenutno): nema consent UI-ja; GA radi cookieless preko Consent Mode-a
 *   (analytics_storage i sve ad_* vrednosti "denied"), bez _ga kolacica.
 * - ukljuceno ("true"): strict opt-in. GA se ne ucitava dok korisnik ne klikne
 *   "Prihvati"; izbor se cuva u localStorage (ne u kolacicu) i moze da se promeni preko
 *   "Podesavanja kolacica" u footeru.
 */

export type ConsentStatus = 'accepted' | 'rejected';

type StoredConsent = { status: ConsentStatus; date: string };

const STORAGE_KEY = 'odontoa_consent';

/* Footer salje ovaj dogadjaj da ponovo otvori izbor (banner zivi u root layoutu). */
export const CONSENT_OPEN_EVENT = 'odontoa:consent-open';

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

/* Consent UI (banner, footer link, cuvanje izbora). Bez promenljive: iskljuceno. */
export const CONSENT_UI_ENABLED = process.env.NEXT_PUBLIC_COOKIE_CONSENT_ENABLED === 'true';

/** null = korisnik jos nije izabrao (ili storage nije dostupan). */
export function readConsent(): ConsentStatus | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    return parsed.status === 'accepted' || parsed.status === 'rejected' ? parsed.status : null;
  } catch {
    return null;
  }
}

export function writeConsent(status: ConsentStatus) {
  const value: StoredConsent = { status, date: new Date().toISOString() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* Privatni prozor ili blokiran storage: izbor vazi samo do kraja posete. */
  }
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

/**
 * Brise GA kolacice (_ga, _ga_*) koje mozemo da obrisemo sa naseg domena. GA ih postavlja
 * na najvisi domen (npr. .odontoa.com), pa se brisu na svakom nivou hostname-a.
 */
export function clearGaCookies() {
  const names = document.cookie
    .split(';')
    .map((part) => part.split('=')[0].trim())
    .filter((name) => name === '_ga' || name.startsWith('_ga_'));
  if (names.length === 0) return;

  const parts = window.location.hostname.split('.');
  const domains: (string | null)[] = [null];
  for (let i = 0; i < parts.length - 1; i++) {
    const domain = parts.slice(i).join('.');
    domains.push(domain, `.${domain}`);
  }

  for (const name of names) {
    for (const domain of domains) {
      document.cookie =
        `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/` + (domain ? `; domain=${domain}` : '');
    }
  }
}
