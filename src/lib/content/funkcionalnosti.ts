/**
 * Sadrzaj stranica funkcionalnosti.
 *
 * Jedan izvor istine za sve tri povrsine na kojima se funkcionalnosti pojavljuju:
 *   - /funkcionalnosti/[slug]  stranica po funkcionalnosti
 *   - /funkcionalnosti         index, ceo katalog (svih 7)
 *   - "Jedan sistem" grid na pocetnoj (samo inSystemGrid: true, dakle 6 bez AI-a)
 *
 * Zato naslov kartice i H1 stranice ne mogu da se raziju.
 *
 * Copy: forma "ti", ekavica, puna dijakritika. Slugovi su namerno BEZ dijakritike,
 * jer idu u URL.
 */

export type FeatureBlock =
  | { type: 'benefits'; title: string; items: { title: string; desc: string }[] }
  | { type: 'steps'; title: string; items: string[] }
  | { type: 'prose'; title: string; paragraphs: string[] }
  | { type: 'faq'; title: string; items: { q: string; a: string }[] };

export type FeaturePageData = {
  /** URL segment. Bez dijakritike, namerno. */
  slug: string;
  /** Kratko ime za kartice i "srodne funkcionalnosti". */
  navTitle: string;
  /**
   * Jedan red opisa za kartice u gridu na pocetnoj i na index katalogu.
   * Za sest iz grida ovo je doslovno tekst koji je vec stajao na pocetnoj,
   * da se pocetna ne promeni pri prelasku na ovaj izvor podataka.
   */
  shortDesc: string;
  /** H1 stranice. Sme da bude duzi i opisniji od navTitle. */
  title: string;
  /** Uvodni pasus ispod H1. */
  lead: string;
  /**
   * Screenshot funkcionalnosti. Izostavljeno = placeholder okvir u template-u.
   * width/height su stvarne dimenzije fajla, da nema pomeranja layouta.
   *
   * fit:
   *   'cover' (podrazumevano) - slika popuni okvir i sece se odozdo. Za snimke
   *     visе od okvira, dakle odnos stranica do otprilike 1.6.
   *   'contain' - slika se uklopi po sirini i poravna uz vrh, a ostatak okvira
   *     popuni `bg`. Za jako siroke snimke koji su nizi od okvira, gde bi
   *     'cover' morao da ih uveca i odsece sa strana.
   * bg: boja pozadine okvira uz 'contain'. Uzeti boju ivice same slike, da se
   *     spoj ne vidi.
   */
  visual?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    fit?: 'cover' | 'contain';
    bg?: string;
  };
  body: FeatureBlock[];
  seo: { title: string; description: string };
  /**
   * Da li se pojavljuje u "Jedan sistem" gridu na pocetnoj.
   * AI asistent je false: do njega se stize iz AI sekcije i sa index stranice.
   */
  inSystemGrid: boolean;
  /** Redni broj u gridu (/01 do /06). Samo za zapise sa inSystemGrid: true. */
  gridNum?: string;
};

export const FEATURE_PAGES: FeaturePageData[] = [
  {
    slug: 'zakazivac-termina',
    navTitle: 'Zakazivač termina',
    shortDesc: 'Kalendar po doktorima i stolicama, drag-and-drop izmene.',
    gridNum: '/01',
    inSystemGrid: true,
    title: 'Zakazivanje koje ordinacija stvarno koristi',
    lead: 'Kalendar po doktorima i stolicama, izmene prevlačenjem i automatski podsetnici. Termin zakažeš za nekoliko sekundi, a pacijent dobije potvrdu bez ijednog telefonskog poziva.',
    visual: {
      src: '/images/funkcionalnosti/zakazivac-termina2.png',
      alt: 'Kalendar termina u Odontoi, nedeljni prikaz sa terminima po danima i statusima',
      width: 1530,
      height: 1028,
    },
    body: [
      {
        type: 'benefits',
        title: 'Šta dobijaš',
        items: [
          {
            title: 'Manje praznih termina',
            desc: 'Automatski podsetnik dan ranije smanjuje broj pacijenata koji se ne pojave, bez dodatnog posla za sestru.',
          },
          {
            title: 'Pregled cele ordinacije',
            desc: 'Svi doktori i sve stolice na jednom ekranu. Odmah vidiš gde ima mesta, a gde je gusto.',
          },
          {
            title: 'Izmene bez prekucavanja',
            desc: 'Termin pomeriš prevlačenjem, a pacijent automatski dobije obaveštenje o novom vremenu.',
          },
        ],
      },
      {
        type: 'steps',
        title: 'Kako radi',
        items: [
          'Izabereš doktora, stolicu i vreme u kalendaru.',
          'Sistem sam pošalje potvrdu pacijentu i upiše termin u karton.',
          'Dan pre termina odlazi podsetnik, a ti vidiš ko je potvrdio dolazak.',
        ],
      },
      {
        type: 'prose',
        title: 'Zašto je ovo važnije nego što deluje',
        paragraphs: [
          'Prazan termin nije samo izgubljen sat. To je stolica koja stoji, doktor koji čeka i pacijent sa liste čekanja koji je mogao da dođe tog dana.',
          'Ordinacije koje uvedu automatske podsetnike najčešće prvo primete da telefon zvoni znatno ređe. Zakazivanje, pomeranje i potvrde prestaju da budu posao koji neko mora ručno da odradi između dva pacijenta.',
        ],
      },
      {
        type: 'faq',
        title: 'Česta pitanja',
        items: [
          {
            q: 'Mogu li da zakazujem termine za više doktora istovremeno?',
            a: 'Da. Kalendar prikazuje sve doktore i sve stolice uporedo, a prikaz suziš na jednog doktora kada ti treba fokus.',
          },
          {
            q: 'Kako pacijent dobija podsetnik?',
            a: 'Podsetnik odlazi automatski, u vreme koje sam podesiš. Tekst poruke prilagodiš svojoj ordinaciji.',
          },
          {
            q: 'Šta se dešava kada pacijent otkaže termin?',
            a: 'Termin se oslobodi u kalendaru i odmah je vidljiv kao slobodan, pa ga ponudiš nekom sa liste čekanja.',
          },
        ],
      },
    ],
    seo: {
      title: 'Zakazivanje termina za stomatološke ordinacije | Odontoa',
      description:
        'Kalendar po doktorima i stolicama, izmene prevlačenjem i automatski SMS podsetnici. Manje praznih termina i manje telefonskih poziva.',
    },
  },

  {
    slug: 'karton-i-odontogram',
    navTitle: 'Karton i odontogram',
    shortDesc: 'Anamneza, terapije, dijagnoze (MKB-10) i istorija poseta, uvek pri ruci.',
    gridNum: '/02',
    inSystemGrid: true,
    title: 'Digitalni karton i odontogram na jednom mestu',
    lead: 'Anamneza, terapije, dijagnoze po MKB-10 i cela istorija poseta. Sve što ti treba o pacijentu otvara se sa jednog ekrana, dok pacijent sedi u stolici.',
    visual: {
      src: '/images/funkcionalnosti/digitalni-karton.png',
      alt: 'Karton pacijenta u Odontoi, sa planiranim intervencijama i istorijom tretmana',
      width: 1491,
      height: 1055,
    },
    body: [
      {
        type: 'benefits',
        title: 'Šta dobijaš',
        items: [
          {
            title: 'Istorija koja se ne gubi',
            desc: 'Svaka intervencija ostaje zapisana uz datum, doktora i zub na kom je rađena.',
          },
          {
            title: 'Odontogram koji se čita',
            desc: 'Stanje zuba vidiš na prvi pogled, bez listanja papirnog kartona unazad.',
          },
          {
            title: 'Dijagnoze po standardu',
            desc: 'MKB-10 šifre su ugrađene, pa izveštaji i dokumentacija izlaze u očekivanom obliku.',
          },
        ],
      },
      {
        type: 'steps',
        title: 'Kako radi',
        items: [
          'Otvoriš karton pacijenta iz kalendara, jednim klikom sa termina.',
          'Upišeš nalaz i terapiju na odgovarajućem zubu u odontogramu.',
          'Zapis odmah ulazi u istoriju poseta i vidljiv je svakom doktoru u ordinaciji.',
        ],
      },
      {
        type: 'prose',
        title: 'Kraj traganja za papirom',
        paragraphs: [
          'Papirni karton ima jednu manu koju digitalni nema: nalazi se na tačno jednom mestu, i to obično nije mesto gde ti treba.',
          'Kada pacijent dođe posle dve godine, istorija je tu, čitljiva, sa svim intervencijama i dijagnozama. Ne zavisi od toga ko je tog dana radio i kako je pisao.',
        ],
      },
      {
        type: 'faq',
        title: 'Česta pitanja',
        items: [
          /* Migracija je prvo pitanje namerno: najveca prepreka pri prelasku,
             pa nosi najvise za konverziju. */
          {
            q: 'Mogu li da prebacim postojeće kartone iz onoga što sada koristim?',
            a: 'Da. Podatke pacijenata prebacujemo iz starog softvera, a pomažemo i kod prelaska sa papirne kartoteke, da ne kreneš od nule.',
          },
          {
            q: 'Mogu li da vidim celu istoriju pacijenta na jednom mestu?',
            a: 'Da. Sve posete, terapije i dijagnoze stoje hronološki u kartonu, pa kod svakog pacijenta odmah vidiš šta je rađeno i kada.',
          },
          {
            q: 'Da li više doktora može da vodi isti karton?',
            a: 'Da. Svaki doktor u ordinaciji vidi karton i upisuje svoje nalaze, a uz svaki zapis ostaje ko ga je i kada uneo.',
          },
        ],
      },
    ],
    seo: {
      title: 'Digitalni karton i odontogram za stomatologe | Odontoa',
      description:
        'Anamneza, terapije, MKB-10 dijagnoze i istorija poseta u jednom digitalnom kartonu. Odontogram koji se čita na prvi pogled.',
    },
  },

  {
    slug: 'rtg-i-fotografije',
    navTitle: 'RTG i fotografije',
    shortDesc: 'Slike u kartonu, bez traženja po folderima.',
    gridNum: '/03',
    inSystemGrid: true,
    title: 'Snimci i fotografije uz karton, ne po folderima',
    lead: 'RTG snimci i intraoralne fotografije stoje uz pacijenta kom pripadaju. Bez pretrage po diskovima i bez fajlova nazvanih skeniranje-final-2.',
    visual: {
      src: '/images/funkcionalnosti/RTG-snimci.png',
      alt: 'Snimci u kartonu pacijenta u Odontoi, panoramski rendgen snimak uz karton',
      width: 1704,
      height: 923,
    },
    body: [
      {
        type: 'benefits',
        title: 'Šta dobijaš',
        items: [
          {
            title: 'Sve uz pacijenta',
            desc: 'Snimak se otvara iz kartona, na istom mestu gde je i terapija zbog koje je snimljen.',
          },
          {
            title: 'Poređenje kroz vreme',
            desc: 'Stariji i noviji snimak jedan pored drugog, da se napredak terapije vidi odmah.',
          },
          {
            title: 'Pacijent koji razume',
            desc: 'Snimak na ekranu okrenut ka pacijentu objasni plan terapije bolje od svakog opisa.',
          },
        ],
      },
      {
        type: 'steps',
        title: 'Kako radi',
        items: [
          'Ubaciš snimak u karton pacijenta, prevlačenjem ili iz uređaja.',
          'Snimak dobije datum i veže se za terapiju na koju se odnosi.',
          'Otvara se iz istorije poseta, kad god zatreba.',
        ],
      },
      {
        type: 'faq',
        title: 'Česta pitanja',
        items: [
          {
            q: 'Koje formate snimaka mogu da čuvam?',
            a: 'Najčešće rendgen snimke i intraoralne fotografije u formatima kao što su JPG i PNG, a podržani su i drugi formati koje ordinacija koristi.',
          },
          {
            q: 'Mogu li da uporedim stariji i noviji snimak?',
            a: 'Da. Snimci stoje hronološki uz pacijenta, pa stanje pre i posle terapije vidiš jedno pored drugog.',
          },
          /* Pitanje je "kako da pokazem", ne "da li pacijent ima pristup":
             pacijentskog naloga nema, pa bi drugo pitanje vodilo u odricanje. */
          {
            q: 'Kako da pacijentu pokažem snimak?',
            a: 'Snimak okreneš ka pacijentu na ekranu i kroz njega mu objasniš plan terapije, jasnije nego rečima.',
          },
        ],
      },
    ],
    seo: {
      title: 'RTG snimci i fotografije u kartonu pacijenta | Odontoa',
      description:
        'Intraoralne fotografije i RTG snimci vezani za karton pacijenta i terapiju. Poređenje kroz vreme, bez traganja po folderima.',
    },
  },

  {
    slug: 'zubna-tehnika',
    navTitle: 'Zubna tehnika',
    shortDesc: 'Radni nalozi za laboratoriju, status i trošak po svakom nalogu.',
    gridNum: '/04',
    inSystemGrid: true,
    title: 'Radni nalozi za laboratoriju, sa statusom i troškom',
    lead: 'Svaki nalog ka zubnoj tehnici ima status, rok i cenu. U svakom trenutku znaš šta je poslato, šta je stiglo i koliko je taj rad koštao.',
    visual: {
      src: '/images/funkcionalnosti/zubna-tehnika.png',
      alt: 'Radni nalozi za zubnu tehniku u Odontoi, sa statusima i detaljima naloga',
      width: 1672,
      height: 941,
    },
    body: [
      {
        type: 'benefits',
        title: 'Šta dobijaš',
        items: [
          {
            title: 'Ništa se ne zaboravlja',
            desc: 'Nalog ima rok i status, pa odmah vidiš šta kasni i šta treba da stigne do sledećeg termina.',
          },
          {
            title: 'Trošak po radu',
            desc: 'Cena laboratorije stoji uz nalog, pa je trošak tehnike po intervenciji jasan, ne procenjen.',
          },
          {
            title: 'Jasna komunikacija',
            desc: 'Specifikacija rada, boja i rok stoje na jednom mestu, isto za tebe i za laboratoriju.',
          },
        ],
      },
      {
        type: 'steps',
        title: 'Kako radi',
        items: [
          'Napraviš radni nalog iz kartona pacijenta.',
          'Uneseš laboratoriju, rok i cenu rada.',
          'Pratiš status od slanja do preuzimanja, uz podsetnik pred rok.',
        ],
      },
      {
        type: 'prose',
        title: 'Zašto trošak laboratorije mora da se prati',
        paragraphs: [
          'Cena rada zubne tehnike je najčešće najveći pojedinačni trošak po protetskoj intervenciji, a istovremeno onaj koji se najređe uredno evidentira.',
          'Kada trošak stoji uz nalog, znaš koliko te tehnika stvarno košta, po laboratoriji i po mesecu. To je broj koji pogledaš, ne pretpostaviš.',
        ],
      },
      /* FAQ drzan na nivou ishoda, kao i prose blok iznad: bez opisa kako se
         tacno racuna trosak. Osetljive stranice (dokumentacija, finansije)
         namerno ostaju bez FAQ-a. */
      {
        type: 'faq',
        title: 'Česta pitanja',
        items: [
          {
            q: 'Mogu li da pratim više laboratorija odjednom?',
            a: 'Da. Svaki nalog nosi svoju laboratoriju, rok i cenu, pa u svakom trenutku vidiš šta je kod koga i dokle je stiglo.',
          },
          {
            q: 'Šta se dešava kada nalog kasni?',
            a: 'Nalog ima rok i status, pa ono što kasni odmah vidiš i stigneš da reaguješ pre pacijentovog termina.',
          },
          {
            q: 'Da li vidim ukupan trošak tehnike?',
            a: 'Cena stoji uz svaki nalog, pa znaš koliko te tehnika košta, bez ručnog sabiranja računa.',
          },
        ],
      },
    ],
    seo: {
      title: 'Radni nalozi za zubnu tehniku i laboratoriju | Odontoa',
      description:
        'Nalozi ka zubnoj laboratoriji sa statusom, rokom i troškom po radu. Pratiš šta je poslato, šta kasni i koliko rad košta.',
    },
  },

  /* Osetljiva stranica: namerno bez FAQ i bez opisa kako se sabloni popunjavaju.
     Detalji ostaju za demo. */
  {
    slug: 'dokumentacija-i-saglasnosti',
    navTitle: 'Dokumentacija i saglasnosti',
    shortDesc: 'Šabloni, digitalni potpis, e-arhiva.',
    gridNum: '/05',
    inSystemGrid: true,
    title: 'Saglasnosti i dokumentacija, potpisane digitalno',
    lead: 'Šabloni saglasnosti, digitalni potpis i elektronska arhiva. Ono što pacijent treba da potpiše spremno je za nekoliko sekundi, bez štampe i bez prekucavanja.',
    visual: {
      src: '/images/funkcionalnosti/saglasnost-sabloni.png',
      alt: 'Šabloni dokumenata u Odontoi, potvrde, opravdanja i uputi spremni za korišćenje',
      width: 1672,
      height: 941,
    },
    body: [
      {
        type: 'benefits',
        title: 'Šta dobijaš',
        items: [
          {
            title: 'Manje papira',
            desc: 'Saglasnosti i obrasci stoje digitalno, na jednom mestu, umesto po fasciklama i fiokama.',
          },
          {
            title: 'Potpis na ekranu',
            desc: 'Pacijent potpisuje na tabletu, a dokument ostaje uz njegov karton.',
          },
          {
            title: 'Arhiva koja se pretražuje',
            desc: 'Svaki potpisan dokument nađeš kasnije za nekoliko sekundi, po imenu i datumu.',
          },
        ],
      },
      {
        type: 'steps',
        title: 'Kako radi',
        items: [
          'Izabereš saglasnost za intervenciju koja sledi.',
          'Pacijent je pregleda i potpiše na ekranu.',
          'Dokument ostaje u elektronskoj arhivi ordinacije.',
        ],
      },
      {
        type: 'prose',
        title: 'Manje papira, mirniji rad',
        paragraphs: [
          'Papirologija u ordinaciji raste neprimetno: saglasnosti, obrasci, potvrde, arhiva. Kada se sve to vodi na papiru, dokument koji ti treba retko je tu kada treba, a arhiviranje uzima vreme koje bi radije proveo sa pacijentom.',
          'Kada dokumentacija stoji uredno i pretraživo, priprema pred intervenciju je kraća, a ono što ti kasnije zatreba lako se nađe.',
        ],
      },
    ],
    seo: {
      title: 'Digitalne saglasnosti i dokumentacija za ordinacije | Odontoa',
      description:
        'Šabloni saglasnosti, digitalni potpis na tabletu i elektronska arhiva. Dokumentacija bez štampe i bez prekucavanja.',
    },
  },

  /* Osetljiva stranica: glavni diferencijator. Namerno bez opisa kako se predracun
     generise i kako teku podaci. Brani se izvrsenjem i demom, ne opisom. */
  {
    slug: 'finansije-i-podsetnici',
    navTitle: 'Finansije i podsetnici',
    shortDesc: 'Predračuni, uplate, automatski SMS podsetnici.',
    gridNum: '/06',
    inSystemGrid: true,
    title: 'Finansije ordinacije, jasne u svakom trenutku',
    lead: 'Naplate, dugovanja pacijenata i troškovi na jednom mestu, uz automatske podsetnike. U svakom trenutku znaš kako ordinacija posluje, bez čekanja knjigovođe i bez ručnih tabela.',
    visual: {
      src: '/images/funkcionalnosti/finansije.png',
      alt: 'Finansijski izveštaji u Odontoi, promet, uplate i način plaćanja po mesecu',
      width: 1616,
      height: 973,
    },
    body: [
      {
        type: 'benefits',
        title: 'Šta dobijaš',
        items: [
          {
            title: 'Dugovanja na jednom ekranu',
            desc: 'Ko duguje, koliko i od kada, bez sabiranja po sveskama.',
          },
          {
            title: 'Pregled poslovanja',
            desc: 'Naplate i troškovi na jednom mestu, pa znaš gde stojiš pre nego što mesec prođe.',
          },
          {
            title: 'Podsetnici koji rade sami',
            desc: 'Podsetnik za termin i za neplaćen račun odlazi automatski, u vreme koje ti odrediš.',
          },
        ],
      },
      {
        type: 'steps',
        title: 'Kako radi',
        items: [
          'Terapija i cena vode se uz karton pacijenta.',
          'Naplate i dugovanja pratiš na jednom mestu.',
          'Podsetnik za dug odlazi sam, bez ručnog pozivanja.',
        ],
      },
      {
        type: 'prose',
        title: 'Novac koji se ne prati, ne naplati se',
        paragraphs: [
          'Najveći deo nenaplaćenih računa u ordinaciji nije sporan. Jednostavno se zaboravi, jer nema mesta na kom bi bio vidljiv svaki dan.',
          'Kada dugovanje stoji uz karton, a podsetnik odlazi sam, naplata prestaje da zavisi od toga da li se neko setio. A kada ti je finansijska slika sveža, odluke o ordinaciji donosiš na vreme i na osnovu brojki, ne osećaja.',
        ],
      },
    ],
    seo: {
      title: 'Finansije, naplata i podsetnici za ordinacije | Odontoa',
      description:
        'Pregled naplata, dugovanja i troškova ordinacije uz automatske podsetnike. Uvek znaš ko je platio i koliko je ostalo.',
    },
  },

  /**
   * AI asistent: inSystemGrid je false.
   * Stranica postoji, ima svoj SEO i ide u sitemap i na index katalog, ali se
   * NE pojavljuje u "Jedan sistem" gridu na pocetnoj. Do nje se stize preko
   * "Saznaj vise" u AI sekciji na pocetnoj i sa index stranice.
   */
  {
    slug: 'ai-asistent',
    navTitle: 'AI asistent',
    /* Jedini shortDesc koji ne dolazi sa postojece pocetne (AI nikad nije bio u gridu).
       Ako se menja tekst kartice za AI, menja se ovde. */
    shortDesc: 'Pitaj bilo šta o pacijentima, terminima i finansijama, odgovor stiže odmah.',
    inSystemGrid: false,
    title: 'Pomoćnik koji radi u sistemu, ne pored njega',
    lead: 'Pitaš bilo šta o pacijentima, terminima i finansijama. Asistent zna tvoju bazu i odgovara odmah, bez traženja po menijima i bez izveštaja koje neko mora da sastavi.',
    body: [
      {
        type: 'benefits',
        title: 'Šta dobijaš',
        items: [
          {
            title: 'Odgovor umesto pretrage',
            desc: 'Pitanje postavljeno običnim rečima daje odgovor iz tvojih podataka, odmah.',
          },
          {
            title: 'Zna kontekst ordinacije',
            desc: 'Asistent radi nad tvojom bazom pacijenata, termina i naplate, ne nad opštim znanjem.',
          },
          {
            title: 'Bez učenja novog alata',
            desc: 'Nema novih ekrana ni menija koje treba zapamtiti. Pitaš isto kao što bi pitao kolegu.',
          },
        ],
      },
      {
        type: 'steps',
        title: 'Kako radi',
        items: [
          'Postaviš pitanje običnim jezikom, na primer koliko je pacijenata došlo ovog meseca.',
          'Asistent pročita podatke tvoje ordinacije i sastavi odgovor.',
          'Iz odgovora odeš pravo na karton, termin ili račun koji te zanima.',
        ],
      },
      {
        type: 'prose',
        title: 'Zašto asistent unutar sistema, a ne pored njega',
        paragraphs: [
          'Alat koji ne vidi tvoje podatke može da ti objasni kako se nešto radi, ali ne može da ti kaže koliko ti pacijenata duguje.',
          'Zato asistent stoji unutar sistema, nad istom bazom iz koje rade kalendar i karton. Odgovor koji dobiješ je stanje tvoje ordinacije, ne opšti savet.',
        ],
      },
      {
        type: 'faq',
        title: 'Česta pitanja',
        items: [
          {
            q: 'Da li asistent vidi podatke mojih pacijenata?',
            a: 'Asistent radi isključivo nad bazom tvoje ordinacije i odgovara samo tebi. Podaci ne izlaze iz tvog naloga.',
          },
          {
            q: 'Šta mogu da ga pitam?',
            a: 'Pitanja o terminima, pacijentima, terapijama i naplati. Na primer koliko je slobodnih termina ove nedelje ili koji pacijenti imaju neplaćene račune.',
          },
        ],
      },
    ],
    seo: {
      title: 'AI asistent za stomatološku ordinaciju | Odontoa',
      description:
        'Asistent koji radi nad bazom tvoje ordinacije. Pitaš o pacijentima, terminima i finansijama i dobiješ odgovor odmah.',
    },
  },
];

/**
 * Sest funkcionalnosti za "Jedan sistem" grid na pocetnoj, u zadatom redosledu.
 * Filtrira se po zastavici, ne po slugu, da bi se buduca stranica van grida
 * dodavala bez izmene ove logike.
 */
export const SYSTEM_GRID_PAGES = FEATURE_PAGES.filter((p) => p.inSystemGrid);

export function getFeaturePage(slug: string): FeaturePageData | undefined {
  return FEATURE_PAGES.find((p) => p.slug === slug);
}

/** Ostale funkcionalnosti, za "srodne funkcionalnosti" blok na dnu stranice. */
export function getRelatedFeaturePages(slug: string): FeaturePageData[] {
  return FEATURE_PAGES.filter((p) => p.slug !== slug);
}
