/* Datum za prikaz u recniku: dd.mm.yyyy po beogradskom vremenu (isto na serveru i u build-u,
   bez obzira na vremensku zonu masine). */
const formatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'Europe/Belgrade',
});

export function formatDateSr(iso: string): string {
  const parts = formatter.formatToParts(new Date(iso));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('day')}.${get('month')}.${get('year')}`;
}
