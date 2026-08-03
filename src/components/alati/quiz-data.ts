export type CategoryId =
  | "kartoni"
  | "zakazivanje"
  | "zalihe"
  | "tim"
  | "analitika";

export type PracticeType = "solo" | "small" | "multi" | "specialist";

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "kartoni", label: "Kartoni pacijenata" },
  { id: "zakazivanje", label: "Zakazivanje termina" },
  { id: "zalihe", label: "Zalihe i materijal" },
  { id: "tim", label: "Tim i interna organizacija" },
  { id: "analitika", label: "Analitika i kontrola poslovanja" },
];

export interface AnswerOption {
  label: string;
  points: 0 | 1 | 2 | 3;
}

export interface QuizQuestionDef {
  id: string;
  category: CategoryId;
  question: string;
  options: AnswerOption[];
}

export const PRACTICE_OPTIONS: { value: PracticeType; label: string }[] = [
  { value: "solo", label: "Samostalna ordinacija" },
  { value: "small", label: "Ordinacija sa 2 do 4 stolice" },
  { value: "multi", label: "Ordinacija sa više lokacija ili većim timom" },
  {
    value: "specialist",
    label:
      "Specijalistička ordinacija (ortodoncija, implantologija, dečija stomatologija)",
  },
];

export const PROFILE_QUESTION = {
  id: "p0_profile",
  question: "Koji tip ordinacije najbolje opisuje vaš rad?",
  helper: "Ovo pitanje je opcionalno i ne utiče na rezultat.",
  skipLabel: "Preskoči",
};

export const QUESTIONS: QuizQuestionDef[] = [
  {
    id: "q1_kartoni_vodjenje",
    category: "kartoni",
    question: "Kako vodite kartone pacijenata?",
    options: [
      { label: "Isključivo papirno", points: 0 },
      { label: "Kombinacija papira i Excel ili Word fajlova", points: 1 },
      { label: "U digitalnom programu, ali bez svih informacija", points: 2 },
      { label: "U digitalnom CRM-u, sve na jednom mestu", points: 3 },
    ],
  },
  {
    id: "q2_kartoni_brzina",
    category: "kartoni",
    question: "Koliko brzo možete da pronađete istoriju lečenja pacijenta?",
    options: [
      { label: "Treba mi više od 5 minuta ili moram da pitam kolegu", points: 0 },
      { label: "Pronađem za 2 do 5 minuta", points: 1 },
      { label: "Pronađem za manje od minuta", points: 2 },
      { label: "Imam ga na ekranu čim pacijent uđe", points: 3 },
    ],
  },
  {
    id: "q3_zakazivanje_kanal",
    category: "zakazivanje",
    question: "Kako pacijenti zakazuju termin kod vas?",
    options: [
      { label: "Samo telefonski, ručno upisujemo u knjigu", points: 0 },
      { label: "Telefonski i preko Vibera ili WhatsAppa", points: 1 },
      { label: "Imamo i online opciju, ali rastrkano po kanalima", points: 2 },
      {
        label: "Pacijenti mogu sami online, uvek imam jedinstven pregled",
        points: 3,
      },
    ],
  },
  {
    id: "q4_zakazivanje_rupe",
    category: "zakazivanje",
    question:
      'Koliko često imate "rupe" u rasporedu zbog otkazanih termina ili nedolazaka?',
    options: [
      { label: "Skoro svaki dan", points: 0 },
      { label: "Nekoliko puta nedeljno", points: 1 },
      { label: "Povremeno", points: 2 },
      { label: "Retko, jer šaljemo automatske podsetnike", points: 3 },
    ],
  },
  {
    id: "q5_zakazivanje_podsetnici",
    category: "zakazivanje",
    question: "Kako se pacijenti podsećaju na termin?",
    options: [
      { label: "Ne podsećamo ih", points: 0 },
      { label: "Mi ih zovemo telefonom dan ranije", points: 1 },
      { label: "Šaljemo poruke ručno (Viber, SMS)", points: 2 },
      { label: "Sistem automatski šalje podsetnik", points: 3 },
    ],
  },
  {
    id: "q6_zalihe_pracenje",
    category: "zalihe",
    question:
      "Kako pratite stanje materijala (anestetici, plombe, rukavice, igle)?",
    options: [
      { label: "Po sećanju, naručimo kad nestane", points: 0 },
      { label: "Pišemo na papir ili Excel ručno", points: 1 },
      { label: "Imamo digitalni sistem, ali ne ažuriramo redovno", points: 2 },
      { label: "Imamo digitalni sistem koji automatski upozorava", points: 3 },
    ],
  },
  {
    id: "q7_zalihe_troskovi",
    category: "zalihe",
    question: "Da li znate koliko vas mesečno tačno košta utrošen materijal?",
    options: [
      { label: "Nemam pojma", points: 0 },
      { label: "Otprilike, na osnovu računa", points: 1 },
      { label: "Imam okvirne brojke iz tabela", points: 2 },
      { label: "Imam precizan izveštaj po kategorijama", points: 3 },
    ],
  },
  {
    id: "q8_tim_info",
    category: "tim",
    question:
      "Kako se tim u ordinaciji informiše o promenama u rasporedu i napomenama o pacijentima?",
    options: [
      { label: "Razgovorom u toku dana ili po sećanju", points: 0 },
      { label: "Preko privatnog Vibera ili WhatsAppa", points: 1 },
      { label: "Imamo zajedničku poslovnu grupu, ali bez jasnih pravila", points: 2 },
      { label: "Imamo centralni sistem gde su sve napomene i obaveze", points: 3 },
    ],
  },
  {
    id: "q9_tim_koordinacija",
    category: "tim",
    question:
      "Koliko vremena nedeljno tim potroši na međusobnu koordinaciju (ko je šta uradio, ko je odgovorio pacijentu)?",
    options: [
      { label: "Više od 3 sata nedeljno", points: 0 },
      { label: "1 do 3 sata", points: 1 },
      { label: "Manje od sat vremena", points: 2 },
      { label: "Skoro ništa, sve teče samo", points: 3 },
    ],
  },
  {
    id: "q10_analitika_pacijenti",
    category: "analitika",
    question: "Da li znate koliko novih pacijenata mesečno dolazi i odakle?",
    options: [
      { label: "Ne pratim", points: 0 },
      { label: "Okvirno znam", points: 1 },
      { label: "Pratim kroz tabele", points: 2 },
      { label: "Imam precizne izveštaje sa izvorima", points: 3 },
    ],
  },
  {
    id: "q11_analitika_usluge",
    category: "analitika",
    question: "Da li znate koje su vaše najprofitabilnije usluge?",
    options: [
      { label: "Ne znam tačno", points: 0 },
      { label: "Naslućujem", points: 1 },
      { label: "Imam okvirnu sliku iz knjigovodstva", points: 2 },
      { label: "Imam pregled prihoda po usluzi i lekaru", points: 3 },
    ],
  },
  {
    id: "q12_analitika_finansije",
    category: "analitika",
    question: "Koliko često imate uvid u finansijske rezultate ordinacije?",
    options: [
      { label: "Jednom godišnje, kad radim porez", points: 0 },
      { label: "Mesečno, ali sa zakašnjenjem", points: 1 },
      { label: "Mesečno, sa približnom slikom", points: 2 },
      { label: "U realnom vremenu, kad god mi treba", points: 3 },
    ],
  },
];

export const BAND_COPY: Record<
  "low" | "lowMid" | "highMid" | "high",
  { label: string; range: string; description: string }
> = {
  low: {
    label: "Pretežno ručno",
    range: "0 do 30",
    description:
      "Vaša ordinacija trenutno radi pretežno na tradicionalan način. Mnogo procesa zavisi od papira, telefona i ličnog pamćenja. To ne znači da loše radite, ali znači da gubite vreme na poslove koji bi mogli da rade sami. Najveći potencijal vam je u tome da prvo digitalizujete jednu oblast, najčešće zakazivanje termina ili kartone pacijenata. Korak po korak.",
  },
  lowMid: {
    label: "Delimično digitalno",
    range: "31 do 60",
    description:
      "Vaša ordinacija je u tranziciji. Neki delovi rade odlično, drugi zaostaju za onim što je već moguće. To je tipičan momenat kada gubite vreme na prelazima između sistema, papira, tabela i razgovora u toku dana. Naredni korak je da te delove spojite, tako da informacije teku bez ručnog prebacivanja.",
  },
  highMid: {
    label: "Organizovano, ali rastrkano",
    range: "61 do 80",
    description:
      "Vaša ordinacija već radi prilično dobro, ali alati koje koristite verovatno ne razgovaraju među sobom. Imate kartone, imate raspored, imate neki sistem za zalihe, ali sve to živi na različitim mestima. Najveća dobit za vas je da te stvari objedinite u jedan tok, kako biste izvukli analitiku i smanjili dupli unos.",
  },
  high: {
    label: "Visoko digitalno",
    range: "81 do 100",
    description:
      "Vaša ordinacija je već u manjini koja radi po modernom standardu. Imate alate, procese i kontrolu nad podacima. Odavde se obično ide ka finijoj optimizaciji, dubljoj analitici i automatizaciji procesa koji se još uvek rade ručno. To nije hitan slučaj za vas, već prilika za dalji pomak.",
  },
};

export const CATEGORY_RECOMMENDATIONS: Record<CategoryId, string> = {
  kartoni:
    "Kartoni pacijenata su najčešće prva oblast koja se digitalizuje, jer od njih zavisi sve ostalo. Bez centralnog digitalnog kartona, sve druge optimizacije imaju ograničen efekat. Naredni korak: izaberite jedan sistem (poput Odontoe) i prenesite sve aktivne pacijente u njega tokom 2 do 3 nedelje.",
  zakazivanje:
    "Zakazivanje je oblast u kojoj se najbrže vide rezultati. Automatski podsetnici sami po sebi smanjuju propuštene termine. Naredni korak: ako još uvek koristite knjigu ili telefon kao primarni kanal, razmotrite digitalni raspored sa SMS ili Viber podsetnicima.",
  zalihe:
    "Zalihe se često zanemaruju dok ne nestane materijal pred zakazanim pacijentom. Naredni korak: napravite minimalnu listu materijala (rukavice, anestetik, igle, plombe) i pratite stanje digitalno, makar u tabeli sa pragom za narudžbu.",
  tim: "Komunikacija kroz privatne aplikacije ili razgovor u hodniku najčešće je razlog što se neka informacija izgubi. Naredni korak: definišite jedno mesto gde se vode sve napomene o pacijentima i zaduženja unutar tima, da se ne oslanjate na pamćenje.",
  analitika:
    "Bez redovne analitike teško je doneti odluku o tome u šta investirati, koju uslugu reklamirati ili koga zaposliti. Naredni korak: počnite sa minimalnim setom brojki koje gledate svake nedelje, kao broj novih pacijenata, prihod po lekaru i otkazani termini.",
};

export interface ResourceLink {
  label: string;
  href: string;
  kind: "blog" | "recnik" | "alati";
}

export const CATEGORY_RESOURCES: Record<CategoryId, ResourceLink[]> = {
  kartoni: [
    { label: "Rečnik: pojmovi o vođenju kartona", href: "/recnik", kind: "recnik" },
    { label: "Blog: digitalizacija ordinacije", href: "/blogovi", kind: "blog" },
  ],
  zakazivanje: [
    { label: "Rečnik: termini o zakazivanju", href: "/recnik", kind: "recnik" },
    { label: "Blog: organizacija termina", href: "/blogovi", kind: "blog" },
  ],
  zalihe: [
    { label: "Rečnik: pojmovi o zalihama", href: "/recnik", kind: "recnik" },
    { label: "Blog: praćenje materijala", href: "/blogovi", kind: "blog" },
  ],
  tim: [
    { label: "Rečnik: interna komunikacija", href: "/recnik", kind: "recnik" },
    { label: "Blog: rad u timu", href: "/blogovi", kind: "blog" },
  ],
  analitika: [
    { label: "Rečnik: pokazatelji poslovanja", href: "/recnik", kind: "recnik" },
    { label: "Blog: izveštaji i odluke", href: "/blogovi", kind: "blog" },
  ],
};

export type ProfileId =
  | "solo_manual"
  | "hybrid"
  | "multi_scattered"
  | "specialist";

export const PROFILE_COPY: Record<
  ProfileId,
  {
    label: string;
    description: string;
    ctaHeadline: string;
    ctaBody: string;
  }
> = {
  solo_manual: {
    label: "Solo ordinacija sa ručnim procesima",
    description:
      "Vaša ordinacija je mala i mnogo procesa još uvek vodite sami ili na papiru. Najveću razliku ćete videti od trenutka kad zakazivanje i kartoni počnu da rade na jednom mestu, bez duplog unosa.",
    ctaHeadline:
      "Želite da vidite kako bi ovi procesi izgledali u jednom sistemu?",
    ctaBody:
      "Razumljiv demo, bez pritiska. Pokazaćemo vam tačno onaj deo koji je za vas najvažniji.",
  },
  hybrid: {
    label: "Delimično digitalizovana ordinacija",
    description:
      "Imate digitalne delove, ali oni ne razgovaraju među sobom. Ovo je trenutak kada se najviše vremena gubi između sistema. Naredni korak je objedinjavanje, ne kupovina još jednog alata.",
    ctaHeadline:
      "Želite da vidite kako bi ovi procesi izgledali u jednom sistemu?",
    ctaBody:
      "Razumljiv demo, bez pritiska. Pokazaćemo vam kako da spojite delove koje već koristite.",
  },
  multi_scattered: {
    label: "Ordinacija sa više stolica i rastrkanim sistemima",
    description:
      "Imate tim i više pacijenata istovremeno, što znači da je koordinacija najveći izvor gubitka vremena. Centralni pregled kartona, termina i napomena ovde pravi najveću razliku.",
    ctaHeadline:
      "Želite da vidite kako bi ovi procesi izgledali u jednom sistemu?",
    ctaBody:
      "Razumljiv demo, bez pritiska. Pokazaćemo vam kako tim radi u Odontoi kada se sve vidi na jednom mestu.",
  },
  specialist: {
    label:
      "Specijalistička ordinacija kojoj treba bolji pregled kartona i terapija",
    description:
      "Specijalistički rad zavisi od preciznog praćenja istorije terapija i plana lečenja. Sistem koji to drži uredno smanjuje grešku i ubrzava donošenje odluka.",
    ctaHeadline:
      "Želite da vidite kako bi ovi procesi izgledali u jednom sistemu?",
    ctaBody:
      "Razumljiv demo, bez pritiska. Pokazaćemo vam pregled kartona i toka terapije koji odgovara specijalističkom radu.",
  },
};

export const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: "Šta znači digitalna spremnost ordinacije?",
    answer:
      "Digitalna spremnost je nivo do kog vaši procesi u ordinaciji rade kroz digitalne alate umesto na papiru ili po sećanju. Obuhvata kartone, zakazivanje, podsetnike, zalihe, timsku komunikaciju i analitiku poslovanja.",
  },
  {
    question: "Da li je test besplatan?",
    answer:
      "Da. Test je u potpunosti besplatan, ne traži registraciju i možete ga koristiti onoliko puta koliko želite.",
  },
  {
    question: "Da li moram da ostavim email?",
    answer:
      "Ne. Rezultat dobijate odmah, bez slanja email adrese. Email možete ostaviti samo ako želite da rezultat sačuvate ili podelite sa timom.",
  },
  {
    question: "Koliko vremena traje test?",
    answer:
      "Test ima 12 kratkih pitanja i traje oko dva minuta. Postoji i jedno opcionalno pitanje na početku koje pomaže da rezultat bude personalizovan.",
  },
  {
    question: "Da li je test relevantan za malu ordinaciju?",
    answer:
      "Jeste. Test je napravljen tako da bude koristan i samostalnoj ordinaciji i većim ordinacijama sa više stolica. Profil ordinacije se prilagođava odgovorima.",
  },
  {
    question: "Da li je test namenjen ordinacijama u Srbiji?",
    answer:
      "Da. Pitanja i preporuke su prilagođeni načinu rada stomatoloških ordinacija u Srbiji, uključujući komunikaciju preko Vibera i SMS podsetnika.",
  },
  {
    question: "Kako se računa rezultat?",
    answer:
      "Svaki odgovor nosi od 0 do 3 boda. Zbir bodova se pretvara u rezultat od 0 do 100 i prikazuje se kao ukupna ocena i ocena po pet oblasti: kartoni, zakazivanje, zalihe, tim i analitika.",
  },
  {
    question: "Šta da radim ako je rezultat nizak?",
    answer:
      "Nizak rezultat ne znači da loše radite, već da postoji prostor za uštedu vremena. Krenite od jedne oblasti, najčešće zakazivanja ili kartona, i digitalizujte je korak po korak. Test vam pokazuje šta su konkretni naredni koraci.",
  },
  {
    question:
      "Da li Odontoa može pomoći samo u jednoj oblasti, na primer zakazivanju ili kartonima?",
    answer:
      "Može. Odontoa pokriva celokupan rad ordinacije, ali možete krenuti od jedne oblasti koja vam je najviše potrebna i postepeno proširivati korišćenje.",
  },
];
