# **Odontoa standard: SEO, GEO i AI launch checklista**

## **Svrha**

Ova checklista je standard koji koristimo da svaki sajt bude spreman za:

* Google SEO i Rich Results  
* AI crawlers i LLM discoverability (GEO)  
* Programmatic SEO skaliranje  
* Stabilno merenje konverzija

## **Kako se koristi**

1. Prođi sekcije redom. Ne preskači „Launch Gate".  
2. Radi prvo **Pre-launch** (kod i konfiguracija), pa **Post-launch** (Google alati i produkcija).  
3. Svaku stavku označi kao **TODO** ili **DONE**.  
4. Ako nešto nije primenljivo, označi **DONE** i dodaj kratku napomenu.

## **Non-negotiables (must-pass)**

* Canonical domen je jedinstven i redirecti rade ispravno.  
* **/robots.txt**, **/sitemap.xml** i **/llms.txt** rade na produkciji i vraćaju **200**.  
* Na stranici nema duplih **JSON-LD** blokova.  
* Ako postoji **FAQ schema**, FAQ mora postojati i u vidljivom sadržaju (1:1).  
* **GA4** radi i ključni eventi se vide u **Realtime**.

## **1\) Domen i canonical**

### **1.1 Jedan canonical domen (Pre-launch)**

**Šta radimo:** Biramo jednu verziju domena (https \+ www ili non-www) kao canonical.

**Zašto je bitno:** Sprečava duplirani sadržaj i rasipanje SEO autoriteta.

**Kako proverimo:** Otvori više varijanti domena i proveri da sve završavaju na canonical verziji.

**Status:** ☐ TODO ☐ DONE

### **1.2 Redirecti na canonical (Pre-launch)**

**Šta radimo:** Sve varijante domena preusmeravamo na canonical (www, non-www, http).

**Zašto je bitno:** Google i AI crawleri dobijaju jednu istinu o URL-ovima.

**Kako proverimo:** Testiraj više varijanti domena i potvrdi da finalni URL uvek bude isti. Proveri i HTTP status kôd za redirect, treba da bude 301\.

**Status:** ☐ TODO ☐ DONE

### **1.3 Canonical URL na svim indexabilnim stranicama (Pre-launch)**

**Šta radimo:** Svaka stranica koja treba da se indeksira ima canonical URL.

**Zašto je bitno:** Pomaže Google-u da izabere pravu verziju strane i spreči duplikate.

**Kako proverimo:** Proveri canonical na statičkim i dinamičkim stranicama (posebno blog postovi i termini u rečniku), i potvrdi da canonical pokazuje na tačan URL.

**Status:** ☐ TODO ☐ DONE

## **2\) Crawl i indexing osnova**

### **2.1 robots.txt (Pre-launch)**

**Šta radimo:** Postavljamo robots.txt koji ne blokira bitne stranice i sadrži link ka sitemap-u.

**Zašto je bitno:** Bez toga Google i AI crawleri mogu pogrešno da crawluju ili propuste sadržaj.

**Kako proverimo:** Otvori /robots.txt i proveri da postoji Sitemap link. Proveri i da robots.txt ne blokira važne sekcije kao što su /blogovi, /recnik i druge ključne rute.

**Status:** ☐ TODO ☐ DONE

### **2.2 sitemap.xml (Pre-launch)**

**Šta radimo:** Generišemo sitemap.xml koji pokriva sve važne javne stranice i automatski se osvežava.

**Zašto je bitno:** Ubrzava indeksiranje i daje Google-u mapu sajta.

**Kako proverimo:** Otvori /sitemap.xml i proveri da su URL-ovi kompletni i bez test/privatnih ruta.

**Status:** ☐ TODO ☐ DONE

### **2.3 llms.txt (Pre-launch)**

**Šta radimo:** Objavljujemo llms.txt koji jasno objašnjava ko smo, šta radimo, za koga i ključne linkove.

**Zašto je bitno:** Pomaže AI sistemima da tačno razumeju proizvod i sadržaj sajta.

**Kako proverimo:** Otvori /llms.txt i proveri da opis odgovara proizvodu i da linkovi vode na prave stranice.

**Status:** ☐ TODO ☐ DONE

### **2.4 Status 200 na produkciji (Post-launch)**

**Šta radimo:** Potvrđujemo da robots, sitemap i llms rade na produkciji bez grešaka.

**Zašto je bitno:** Sve iznad je beskorisno ako endpointi ne rade u realnom okruženju.

**Kako proverimo:** Otvori /robots.txt, /sitemap.xml i /llms.txt na produkciji i potvrdi 200\.

**Status:** ☐ TODO ☐ DONE

## **3\) SEO metadata standard**

### **3.1 Title i meta description po strani (Pre-launch)**

**Šta radimo:** Svaka stranica ima jedinstven title i meta description.

**Zašto je bitno:** Direktno utiče na CTR i kvalitet indeksiranja.

**Kako proverimo:** Proveri ključne strane da title i opis nisu prazni ili duplirani. Proveri i dužinu: title do oko 60 karaktera, meta description do oko 160 karaktera.

**Status:** ☐ TODO ☐ DONE

### **3.2 OpenGraph i Twitter meta (Pre-launch)**

**Šta radimo:** Postavljamo OG i Twitter meta za deljenje linkova.

**Zašto je bitno:** Poboljšava preview i CTR pri deljenju.

**Kako proverimo:** Proveri da strana ima OG naslov, opis i sliku.

**Status:** ☐ TODO ☐ DONE

### **3.3 noindex pravilo (Pre-launch)**

**Šta radimo:** noindex koristimo samo za test, duplikate ili privremene stranice.

**Zašto je bitno:** Sprečava slučajno izbacivanje važnih strana iz indeksa.

**Kako proverimo:** Proveri da ključne strane nisu noindex.

**Status:** ☐ TODO ☐ DONE

## **4\) Structured data i Google Rich Results**

### **4.1 Jedna centralna schema po strani (Pre-launch)**

**Šta radimo:** Renderujemo jednu JSON-LD celinu po strani i sprečavamo duplikate.

**Zašto je bitno:** Duplikati prave greške u Rich Results i zbunjuju crawlere.

**Kako proverimo:** Proveri da se schema pojavljuje samo jednom.

**Status:** ☐ TODO ☐ DONE

### **4.2 Obavezni blokovi u schema-i (Pre-launch)**

**Šta radimo:** Standard blokovi su WebPage, BreadcrumbList, Article (za sadržaj), FAQPage (ako postoji FAQ).

**Zašto je bitno:** Povećava šanse za Rich Results i olakšava AI ekstrakciju.

**Kako proverimo:** Na blog postu postoji Article. Na stranama sa FAQ postoji FAQPage. BreadcrumbList ima minimum 3 breadcrumb-a (Početna → Sekcija → Stranica). Article mora imati: headline, author.url (apsolutni URL), image (apsolutni URL), datePublished (ISO 8601), inLanguage.

Napomena: Svi datumi u schema-i (datePublished, dateModified) moraju biti u ISO 8601 formatu sa timezone.

**Status:** ☐ TODO ☐ DONE

### **4.3 FAQ hard rule (Pre-launch)**

**Šta radimo:** FAQ schema koristimo samo ako je FAQ vidljiv na strani i sadržaj je 1:1.

**Zašto je bitno:** Google može odbiti FAQ rich snippet ako FAQ nije vidljiv ili ne odgovara schema-i.

**Kako proverimo:** Uporedi vidljiv FAQ i FAQ u schema-i, moraju biti identični.

**⚠️ VAŽNA NAPOMENA:** Sanity validacija osigurava da FAQ postoji u CMS-u (minimum 3 pitanja), ali **ne može da garantuje** da su FAQ Q/A vidljivi 1:1 na frontendu. To je obaveza UI implementacije – frontend mora renderovati FAQ iz Sanity podataka tako da odgovara JSON-LD schema-i.

**Status:** ☐ TODO ☐ DONE

### **4.4 Breadcrumb hard rule (Pre-launch)**

**Šta radimo:** Breadcrumb schema mora odgovarati realnoj navigaciji i URL strukturi.

**Zašto je bitno:** Pogrešni breadcrumbs prave Rich Results greške i pogrešne signale.

**Kako proverimo:** Breadcrumb put je realan i linkovi vode na prave stranice. Breadcrumb labels u schema-i tačno odgovaraju onome što je vidljivo na stranici (1:1).

**Status:** ☐ TODO ☐ DONE

### **4.5 Rich Results test (Post-launch)**

**Šta radimo:** Testiramo reprezentativne stranice (homepage, blog post, rečnik).

**Zašto je bitno:** Hvata greške pre nego što utiču na vidljivost.

**Kako proverimo:** Rich Results test nema kritičnih grešaka.

**Status:** ☐ TODO ☐ DONE

## **5\) Google Search Console (GSC)**

### **5.1 Verifikacija domena (Post-launch)**

**Šta radimo:** Verifikujemo vlasništvo domena u Google Search Console.

**Zašto je bitno:** Bez GSC nema kontrole nad indeksiranjem i upozorenjima.

**Kako proverimo:** Property je Verified i odgovara canonical domeni.

**Status:** ☐ TODO ☐ DONE

### **5.2 Sitemap submit (Post-launch)**

**Šta radimo:** Dodajemo sitemap u GSC.

**Zašto je bitno:** Ubrzava indeksiranje i otkriva greške u sitemap-u.

**Kako proverimo:** Status je Success i broj URL-ova ima smisla.

**Status:** ☐ TODO ☐ DONE

### **5.3 Monitoring: Coverage i Enhancements (Post-launch)**

**Šta radimo:** Pratimo Coverage i Enhancements za greške i rich results upozorenja.

**Zašto je bitno:** Rano otkrivanje grešaka sprečava dugoročni gubitak vidljivosti.

**Kako proverimo:** Nema nagomilanih Error stavki i Enhancements nema kritičnih grešaka.

**Status:** ☐ TODO ☐ DONE

### **5.4 Request indexing za ključne stranice (Post-launch)**

**Šta radimo:** Tražimo indeksiranje za najvažnije stranice nakon launcha ili velike izmene.

**Zašto je bitno:** Ubrzava ulazak u indeks kada je najbitnije.

**Kako proverimo:** U GSC koristi URL Inspection tool i opciju Request Indexing za homepage, glavne landing stranice i novi sadržaj. Potvrdi da je zahtev poslat.

**Status:** ☐ TODO ☐ DONE

## **6\) Analytics i konverzije (GA4)**

### **6.1 GA4 radi na produkciji (Pre-launch)**

**Šta radimo:** Postavljamo GA4 tako da meri posete na produkciji.

**Zašto je bitno:** Bez merljivosti nema upravljanja rastom ni dokazivanja efekta SEO.

**Kako proverimo:** U GA4 Realtime vidiš posetu kada otvoriš sajt.

**Status:** ☐ TODO ☐ DONE

### **6.2 Ključni eventi (Pre-launch)**

**Šta radimo:** Pratimo minimalni set događaja koji mapira biznis cilj (CTA klik, kontakt, demo, view).

**Zašto je bitno:** Omogućava optimizaciju konverzija i razumevanje ponašanja korisnika.

**Kako proverimo:** U Realtime ili Debug vidiš event kad klikneš CTA ili pošalješ formu.

**Status:** ☐ TODO ☐ DONE

### **6.3 Conversions u GA4 (Post-launch)**

**Šta radimo:** Označavamo najvažnije evente kao conversions u GA4.

**Zašto je bitno:** Konverzije su osnova za KPI i izveštavanje.

**Kako proverimo:** U GA4 conversions vidiš označene evente i brojanje.

**Status:** ☐ TODO ☐ DONE

## **7\) CMS standard (Sanity) za blog i rečnik**

### **7.1 Sanity kao input, sajt kao generator (Pre-launch)**

**Šta radimo:** U CMS unosimo sadržaj i SEO inpute, a sajt automatski generiše metadata, schema i sitemap.

**Zašto je bitno:** Smanjuje ručni rad, greške i tehnički dug.

**Kako proverimo:** Objavi test post i proveri da se pojavi na sajtu, u sitemap-u i da ima schema.

**Status:** ☐ TODO ☐ DONE

### **7.2 Obavezna polja za blog post (Pre-launch)**

**Šta radimo:** Obavezno su: naslov, slug, excerpt, cover slika i alt, datum, FAQ minimum 3\.

**Zašto je bitno:** Obezbeđuje dosledan kvalitet i Rich Results spremnost.

**Kako proverimo:** Pokušaj publish bez ovih polja i potvrdi da validacija blokira objavu. Proveri i da FAQ pitanja postoje u vidljivom HTML sadržaju stranice, ne samo u schema-i.

**Status:** ☐ TODO ☐ DONE

### **7.3 SEO override polja (Pre-launch)**

**Šta radimo:** Po potrebi koristimo seoTitle, metaDescription, canonical override i noindex.

**Zašto je bitno:** Daje kontrolu bez menjanja koda.

**Kako proverimo:** Podesi override na jednom postu i proveri da se odrazilo na strani.

**Status:** ☐ TODO ☐ DONE

### **7.4 Author URL pravilo (Pre-launch)**

**Šta radimo:** Author URL držimo u Author dokumentu, a fallback na postu je izuzetak.

**Zašto je bitno:** Sprečava dupliranje i čuva konzistentnost autora.

**Kako proverimo:** Proveri da se author link generiše iz Author dokumenta kada postoji.

**Status:** ☐ TODO ☐ DONE

### **7.5 Schema override kao izuzetak (Pre-launch)**

**Šta radimo:** Schema override koristimo retko, samo kada standardna schema ne pokriva specifičan slučaj.

**Zašto je bitno:** Smanjuje rizik dupliranja i grešaka.

**Kako proverimo:** Ako je override aktivan, proveri da nema duplirane schema-e.

**Status:** ☐ TODO ☐ DONE

## **8\) Sanity Integration Best Practices (Pre-launch)**

### **8.1 Centralni Sanity Client Setup**

**Šta radimo:** Koristimo jedan centralni Sanity client u `src/lib/sanity.client.ts` sa `@sanity/client`, `perspective: "published"`, bez tokena u runtime-u, i `useCdn` bazirano na NODE_ENV.

**Zašto je bitno:** Osigurava konzistentnost, sigurnost (bez tokena u runtime-u) i optimalne performanse (CDN u prod).

**Kako proverimo:** Proveri da `sanityClient` iz `@/lib/sanity.client` se koristi svuda (blog + glossary + sitemap), da nema inline client funkcija, i da nema tokena u runtime kodu.

**Status:** ☐ TODO ☐ DONE

### **8.2 Query Optimizacija za Performance**

**Šta radimo:** Kreiramo lightweight "directory" query za liste (samo potrebna polja), "full" query za detail stranice, i poseban "sitemap" query sa minimalnim poljima i GROQ filterima.

**Zašto je bitno:** Smanjuje payload i ubrzava učitavanje kada lista raste (500+ termina). Sitemap query sa GROQ filterima je efikasniji od JavaScript filtera.

**Kako proverimo:** Proveri da directory query vraća samo `term`, `slug`, `category`, `publishedAt`, `updatedAt` (bez `fullArticle`, `faqs`, `coverImage`). Proveri da sitemap query filtrira `coalesce(noindex, false) == false` direktno u GROQ-u.

**Status:** ☐ TODO ☐ DONE

### **8.3 Cache Kontrola za Brže Osvežavanje**

**Šta radimo:** List stranice imaju `revalidate: 300` (5 min) u prod za brže osvežavanje, detail stranice `revalidate: 3600` (1 sat) jer novi slug-ovi se renderuju odmah. Development koristi `revalidate: 0`.

**Zašto je bitno:** Novi termini/postovi se vide brže bez rebuild-a, a detail stranice koriste ISR caching za performanse.

**Kako proverimo:** Proveri da `/recnik` i `/blogovi` imaju `revalidate: 300` u prod, a `/recnik/[slug]` i `/blogovi/[slug]` imaju `revalidate: 3600`. Proveri da detail stranice nemaju `generateStaticParams` (dynamic rendering).

**Status:** ☐ TODO ☐ DONE

### **8.4 Token Security**

**Šta radimo:** `SANITY_WRITE_TOKEN` se koristi samo u scripts (nikad u runtime), nema `NEXT_PUBLIC_` prefiksa za token, import script ima jasnu error poruku, i README dokumentuje token rotaciju/brisanje posle importa.

**Zašto je bitno:** Tokeni u runtime kodu predstavljaju sigurnosni rizik. Token rotacija posle bulk importa je best practice.

**Kako proverimo:** Proveri da nijedan token nema `NEXT_PUBLIC_` prefiks. Proveri da `src/lib/sanity.client.ts` ne koristi token. Proveri da import script koristi samo `SANITY_WRITE_TOKEN` i ima jasnu error poruku.

**Status:** ☐ TODO ☐ DONE

### **8.5 Indexing Sigurnost**

**Šta radimo:** `generateMetadata` postavlja `robots: { index: false, follow: false }` kada je `noindex === true`, sitemap filtrira noindex termine, i JSON-LD schema poštuje noindex flag.

**Zašto je bitno:** Osigurava da noindex termini nisu u sitemap-u i da imaju ispravne robots meta tagove.

**Kako proverimo:** Proveri da termin sa `noindex: true` ima `robots: { index: false }` u metadata. Proveri da sitemap ne sadrži noindex termine. Proveri da JSON-LD schema ne generiše za noindex stranice ako je potrebno.

**Status:** ☐ TODO ☐ DONE

### **8.6 Performance Hardening za Velike Liste**

**Šta radimo:** Directory query vraća samo potrebna polja (bez `fullArticle`, `faqs`, `coverImage`, itd.), sitemap query vraća minimalna polja (`slug`, `_updatedAt`), i bulk import je podržan (batch processing po 100+).

**Zašto je bitno:** Kada lista raste na 500+ termina, optimizovani query-ji značajno smanjuju payload i ubrzavaju učitavanje.

**Kako proverimo:** Proveri da directory query ne vraća teška polja. Proveri da sitemap query vraća samo `slug` i `_updatedAt`. Testiraj bulk import sa 100+ termina i proveri performanse.

**Status:** ☐ TODO ☐ DONE

### **8.7 Draft Filteri u GROQ Upitima**

**Šta radimo:** Svi GROQ upiti imaju `!(_id in path("drafts.**"))` i `defined(publishedAt)` filtere kao dodatnu sigurnost pored `perspective: "published"`.

**Zašto je bitno:** Dvostruka zaštita osigurava da draft dokumenti nikad ne završe na produkciji, čak i ako se perspective promeni.

**Kako proverimo:** Proveri da svi glossary i blog query-ji imaju oba filtera. Proveri da sitemap query takođe ima ove filtere.

**Status:** ☐ TODO ☐ DONE

## **9\) Programmatic SEO readiness**

### **8.1 Čista URL struktura (Pre-launch)**

**Šta radimo:** Držimo URL strukturu stabilnom i skalabilnom.

**Zašto je bitno:** Programmatic SEO traži doslednost i predvidljivost.

**Kako proverimo:** Proveri da nema duplih ruta za isti sadržaj i da stari URL-ovi rade kroz redirect.

**Status:** ☐ TODO ☐ DONE

### **8.2 Centralizovana SEO i schema logika (Pre-launch)**

**Šta radimo:** SEO metadata i schema pravila su centralizovani, ne razbacani po stranicama.

**Zašto je bitno:** Ubrzava skaliranje i smanjuje greške.

**Kako proverimo:** Promena pravila na jednom mestu utiče konzistentno na sve relevantne stranice.

**Status:** ☐ TODO ☐ DONE

### **4.6 GEO/Local SEO napomena (Pre-launch)**

**⚠️ VAŽNA NAPOMENA:** `geo.region` i `geo.placename` meta tagovi su **sekundarni** signali. Pravi local SEO boost dolazi od:
- **Organization/LocalBusiness schema** sa adresom i kontakt informacijama (ako postoji fizička lokacija)
- **Google Business Profile** (ako postoji lokacija za listing)
- Lokalni backlinkovi i NAP (Name, Address, Phone) konzistentnost

**Status:** ☐ TODO ☐ DONE

## **10\) Launch Gate (must-pass)**

### **10.1 Finalna provera (Post-launch)**

**Šta radimo:** Radimo završni krug provera pre i odmah posle launcha.

**Zašto je bitno:** Jedan propust može blokirati indeksiranje ili slomiti merenje.

**Kako proverimo:** Potvrdi Non-negotiables, uradi Rich Results test, proveri GA4 Realtime i GSC status.

**Status:** ☐ TODO ☐ DONE

Workflow: Objavljivanje blog posta (Sanity → sajt)

* Urednik popuni naslov, sadržaj, excerpt, cover sliku i alt, datum objave, i doda 3 do 8 FAQ.  
* Po potrebi popuni SEO override i tagove.  
* Klikne Publish.  
* Sajt automatski generiše metadata i schema za stranicu.  
* Sajt automatski ažurira sitemap i strana je spremna za indeksiranje.

Common pitfalls (12 najčešćih grešaka)

1. Više verzija domena bez canonical i redirecta  
2. robots.txt blokira važne stranice  
3. sitemap.xml propušta dinamičke stranice ili nije ažuran  
4. llms.txt opisuje pogrešan tip biznisa  
5. Dupliran JSON-LD na istoj strani  
6. FAQ schema postoji, a FAQ nije vidljiv ili nije identičan sadržaju  
7. Breadcrumb schema ne prati realnu navigaciju  
8. noindex slučajno uključen na važnim stranicama  
9. GA4 ne radi na produkciji ili eventi ne stižu  
10. GSC nije verifikovan ili sitemap nije uspešno dodat
11. Sanity client sa tokenom u runtime kodu (sigurnosni rizik)  
12. Query-ji bez draft filtera ili optimizacije za velike liste (performance problem)

---

## **📝 Dodatne napomene**

### **Generative SEO i AI Pretrage**

`llms.txt` i strukturirani podaci (JSON-LD) **pomažu** AI sistemima da razumeju sadržaj, ali rezultat u AI pretragama (ChatGPT, Perplexity, itd.) zavisi od:
- **Autoriteta domena** (backlinkovi, trust signals)
- **Kvaliteta sadržaja** (originalnost, dubina, korisnost)
- **Konzistentnog objavljivanja** (redovni, kvalitetni članci)
- **Internih linkova** (topic clusters, related content)

**Fokus treba biti na konzistentno objavljivanje kvalitetnog sadržaja + interne linkove, ne samo na tehničke optimizacije.**