/* Sekcije sajta koje su privremeno sakrivene do content launcha.
   Jedno mesto za ukljucivanje: izbaci putanju iz liste i sekcija se vraca u navigaciju,
   footer, sitemap i llms.txt, a middleware prestaje da je vraca kao 404 u produkciji.
   Kod, sadrzaj i rute se ne brisu.
   /pomoc-i-pravno je sakrivena jer duplira pravne stranice i nije pravi help centar;
   "Pomoc" u footeru za sada vodi na /kontakt.
   /recnik se ukljucuje tek kad postoji objavljen, validiran dataset (src/lib/content/recnik). */
export const HIDDEN_SECTIONS = ['/blogovi', '/recnik', '/o-nama', '/alati', '/pomoc-i-pravno'] as const;

/* Interne i test rute: nikad javne u produkciji (404 + noindex iz middleware-a).
   Na preview deploy-u se ukljucuju sa ENABLE_INTERNAL_ROUTES=true. */
export const INTERNAL_ROUTES = [
  '/ui-lab',
  '/dashboard-capture',
  '/demo-hero',
  '/studio',
  '/animated-grid-demo',
  '/test-email',
] as const;

function matches(path: string, prefixes: readonly string[]): boolean {
  return prefixes.some((p) => path === p || path.startsWith(`${p}/`));
}

export function isSectionHidden(path: string): boolean {
  return matches(path, HIDDEN_SECTIONS);
}

export function isInternalRoute(path: string): boolean {
  return matches(path, INTERNAL_ROUTES);
}
