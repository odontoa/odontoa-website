/* Javna cena (rani pristup). Jedino mesto gde se cena upisuje: pricing sekcija na pocetnoj,
   llms.txt i SoftwareApplication schema citaju odavde, da se ne raziđu. */
export const pricing = {
  currency: 'EUR',
  currencySymbol: '€',
  /** Mesecni iznos koji se prikazuje; naplata je godisnja. */
  monthly: 12,
  /** Godisnja naplata (jednom godisnje). */
  yearly: 144,
  trialDays: 30,
} as const;
