/**
 * Centralized business configuration for Odontoa
 * This file contains all primary business constants used across the website.
 * Update values here to change them site-wide.
 */
export const businessConfig = {
  name: 'Odontoa',
  email: 'info@odontoa.com',
  /* Javni poslovni broj jos ne postoji. Dok je null, telefon se ne prikazuje nigde
     (kontakt, llms.txt); kad dobijemo pravi broj, upisuje se samo ovde. */
  phone: null as string | null,
  address: {
    street: 'Krunska',
    city: 'Beograd',
    postalCode: '11000',
    country: 'Srbija',
  },
  workingHours: {
    weekdays: 'Ponedeljak - Petak: 9:00 - 17:00',
    saturday: 'Subota: 9:00 - 13:00',
    sunday: 'Nedelja: Zatvoreno',
  },
  social: {
    linkedin: 'https://www.linkedin.com/company/odontoa/',
    facebook: 'https://www.facebook.com/profile.php?id=61580254345083',
    instagram: 'https://www.instagram.com/odontoa.app/',
  },
} as const;
