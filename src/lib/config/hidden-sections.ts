/* Sekcije sajta koje su privremeno sakrivene do content launcha.
   Jedno mesto za ukljucivanje: izbaci putanju iz liste i sekcija se vraca u navigaciju,
   footer, sitemap i llms.txt, a middleware prestaje da je vraca kao 404 u produkciji.
   Kod, sadrzaj i rute se ne brisu.
   /pomoc-i-pravno je sakrivena jer duplira pravne stranice i nije pravi help centar;
   "Pomoc" u footeru za sada vodi na /kontakt. */
export const HIDDEN_SECTIONS = ['/blogovi', '/recnik', '/o-nama', '/alati', '/pomoc-i-pravno'] as const;

export function isSectionHidden(path: string): boolean {
  return HIDDEN_SECTIONS.some((p) => path === p || path.startsWith(`${p}/`));
}
