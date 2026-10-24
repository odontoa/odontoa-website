/* Javna standardna cena. Jedino mesto gde se cena upisuje: pricing sekcija na pocetnoj,
   FAQ na /kontakt, llms.txt i SoftwareApplication schema citaju odavde, da se ne raziđu.
   Pretplata je godisnja, uz mogucnost placanja u vise rata; javno se prikazuje samo
   mesecni iznos (godisnji zbir se namerno ne istice).
   Promo/partner cene ne idu ovde: imaju svoje landing stranice. */
export const pricing = {
  currency: 'EUR',
  currencySymbol: '€',
  /** Mesecni iznos koji se prikazuje kao cena. */
  monthly: 49,
  trialDays: 30,
} as const;
