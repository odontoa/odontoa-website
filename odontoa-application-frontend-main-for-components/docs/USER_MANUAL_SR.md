# Korisnički priručnik
# Odontoa Sistem za upravljanje stomatološkom ordinacijom

## Sadržaj

1. [Početak rada](#početak-rada)
2. [Autentifikacija](#autentifikacija)
3. [Kontrolna tabla](#kontrolna-tabla)
4. [Upravljanje pacijentima](#upravljanje-pacijentima)
5. [Zakazivanje termina](#zakazivanje-termina)
6. [Rešavanje problema](#rešavanje-problema)

## Početak rada

### Prvo pokretanje

1. **Pristup aplikaciji**
   - Otvorite internet pregledač
   - Idite na URL vaše Odontoa aplikacije
   - Bićete preusmereni na stranicu za prijavu

2. **Prva prijava**
   - Unesite svoju email adresu
   - Unesite privremenu lozinku
   - Kliknite na "Prijavi se"
   - Bićete upitani da promenite lozinku pri prvoj prijavi

3. **Promena lozinke**
   - Unesite trenutnu lozinku
   - Kreirajte novu jaku lozinku (minimum 8 karaktera)
   - Potvrdite novu lozinku
   - Kliknite na "Ažuriraj lozinku"

### Sistemski zahtevi

- **Pregledač**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Internet**: Stabilna internet konekcija
- **Rezolucija ekrana**: Minimum 1024x768 (preporučeno 1920x1080)
- **JavaScript**: Mora biti omogućen

## Autentifikacija

### Proces prijave

1. Idite na stranicu za prijavu
2. Unesite email adresu
3. Unesite lozinku
4. Kliknite na "Prijavi se"
5. Ako su podaci ispravni, bićete preusmereni na kontrolnu tablu

### Upravljanje lozinkom

#### Promena lozinke
1. Kliknite na svoj profil u gornjem desnom uglu
2. Izaberite "Promeni lozinku"
3. Unesite trenutnu lozinku
4. Unesite novu lozinku (minimum 8 karaktera)
5. Potvrdite novu lozinku
6. Kliknite na "Ažuriraj"

#### Zaboravljena lozinka
1. Na stranici za prijavu kliknite na "Zaboravljena lozinka?"
2. Unesite email adresu
3. Kliknite na "Pošalji link za resetovanje"
4. Proverite email i pratite uputstva

### Odjava
1. Kliknite na svoj profil
2. Izaberite "Odjavi se"
3. Bićete vraćeni na stranicu za prijavu

## Kontrolna tabla

### Pregled

Kontrolna tabla daje pregled aktivnosti ordinacije:

- **Današnji termini**: Lista zakazanih termina za tekući dan
- **Nedavni pacijenti**: Skorašnje izmene i novi pacijenti
- **Brze akcije**: Prečice za najčešće radnje
- **Statistika ordinacije**: Ključni pokazatelji uspešnosti

### Navigacija

#### Glavni meni
- **Kontrolna tabla**: Opšti pregled
- **Pacijenti**: Upravljanje pacijentima
- **Termini**: Kalendar i zakazivanje
- **Doktori**: Upravljanje doktorima

#### Brze akcije
- **Dodaj pacijenta**: Kreiraj novi karton
- **Zakaži termin**: Novi termin za pacijenta
- **Otvori kalendar**: Prikaz svih termina

## Upravljanje pacijentima

### Dodavanje novog pacijenta

1. **Navigacija do pacijenata**
   - Kliknite na "Pacijenti" u meniju
   - Kliknite na "Dodaj pacijenta"

2. **Unos podataka**
   - **Lični podaci**:
     - Ime i prezime (obavezno)
     - Datum rođenja (obavezno)
     - Pol
     - Država
     - Grad
     - Email adresa
     - Broj telefona (obavezno)
     - Adresa

3. **Sačuvaj karton**
   - Kliknite na "Sačuvaj" da kreirate karton
   - Pacijent će biti dodat u listu

### Pretraga i filtriranje pacijenata

#### Opcije pretrage
- **Pretraga**: Unesite ime, broj telefona ili bilo koji podatak za pretragu pacijenta

### Profil pacijenta

#### Osnovni podaci
- Prikaz ličnih podataka

#### Medicinska istorija
- **Stomatološka istorija**: Prethodni zahvati i terapije
- **Medicinska stanja**: Trenutno zdravstveno stanje

#### Terapije i termini
- **Plan terapije**: Trenutne i završene terapije
- **Istorija termina**: Svi prethodni i budući termini
- **Kliničke procene**: Ortodontske i stomatološke procene

### Tabelarni prikaz u detaljima pacijenta

Kada otvorite detalje pacijenta, videćete šest glavnih tabova na vrhu:

1. **Pregled pacijenta**
   - Prikaz osnovnih informacija o pacijentu, godina, datum rođenja, kontakt podaci i sažetak kartona.
   - Brzi pregled statusa i poslednjih aktivnosti.

2. **Terapije i termini**
   - Prikaz svih zakazanih i prošlih termina za pacijenta.
   - Lista terapija i zahvata koje je pacijent imao ili su planirani.

3. **X-Ray snimci**
   - Pristup i pregled svih rendgenskih snimaka pacijenta.
   - Dodavanje novih snimaka i unos opisa.

4. **Fotografije**
   - Prikaz i upravljanje kliničkim fotografijama pacijenta (intraoralne, ekstraoralne itd.).
   - Dodavanje novih fotografija.
   - Praćenje napretka, dokumentovanje slučajeva i poređenje pre/posle.

5. **Ortodontski karton**
   - Pristup ortodontskom kartonu i evidenciji pacijenta.
   - Unos i pregled ortodontskih procena, studijskih modela i kefalometrijskih analiza.

6. **Stomatološki karton**
   - Prikaz stomatološkog kartona (odontograma) i istorije zahvata.
   - Unos nalaza za svaki zub, označavanje stanja i dodavanje napomena.
   - Praćenje svih stomatoloških zahvata i procedura.

## Zakazivanje termina

### Prikaz kalendara

#### Navigacija
- **Mesečni prikaz**: Pregled celog meseca
- **Nedeljni prikaz**: Detaljan prikaz po nedeljama
- **Dnevni prikaz**: Satnica za izabrani dan

#### Kontrole kalendara
- **Navigacija po datumima**: Strelice za pomeranje po datumima
- **Dugme "Danas"**: Brz povratak na današnji datum
- **Promena prikaza**: Izbor između mesečnog, nedeljnog i dnevnog prikaza

### Kreiranje termina

1. **Izbor datuma i vremena**
   - Kliknite na željeni datum u kalendaru
   - Kliknite na željeni termin
   - Ili koristite dugme "Novi termin"

2. **Unos detalja termina**
   - **Pacijent**: Izaberite iz liste ili pretražite
   - **Doktor**: Izaberite iz liste
   - **Datum**: Potvrdite datum termina
   - **Vreme**: Izaberite vreme
   - **Trajanje**: Izaberite trajanje (30, 60, 90, 120 minuta)
   - **Vrsta zahvata**:
     - Stomatološki
     - Ortodontski
   - **Tretman**:
     - Za stomatološki: Pregled, Vađenje, Plomba, Lečenje kanala, Čišćenje, Protetika, Ostalo
     - Za ortodontski: Ortodontski pregled, Postavljanje aparata, Kontrola, Promena žice, Retencija, Uzimanje otiska, Ostalo
   - **Napomena**: Unesite dodatne informacije po potrebi

3. **Sačuvaj termin**
   - Kliknite na "Sačuvaj" da kreirate termin
   - Termin će biti prikazan u kalendaru

### Upravljanje terminima

#### Izmena termina
1. Kliknite na termin u kalendaru
2. Kliknite na "Izmeni"
3. Izmenite podatke
4. Kliknite na "Sačuvaj izmene"

#### Status termina
- **Zakazan**: Termin je potvrđen
- **U toku**: Termin je u toku
- **Završen**: Termin je završen
- **Otkazan**: Termin je otkazan

### Notifikacije o terminima

#### Automatski podsetnici
- **Dan pre u 9h**: Email/SMS podsetnik se šalje u 9:00h dan pre termina

#### Ručne notifikacije
- Slanje poruka pacijentima
- Zakazivanje poziva za podsetnik
- Slanje potvrda o terminu

## Rešavanje problema

### Česti problemi

#### Problem sa prijavom
**Problem**: Ne možete da se prijavite
**Rešenje**:
1. Proverite email i lozinku
2. Očistite keš pregledača
3. Probajte drugi pregledač
4. Kontaktirajte administratora

#### Spora aplikacija
**Problem**: Aplikacija je spora
**Rešenje**:
1. Proverite internet konekciju
2. Zatvorite ostale tabove
3. Očistite keš pregledača
4. Restartujte pregledač

#### Termin nije sačuvan
**Problem**: Termin nestaje nakon čuvanja
**Rešenje**:
1. Proverite da li su sva polja popunjena
2. Proverite izabrani datum/vreme
3. Proverite da li je pacijent izabran
4. Osvježite stranicu

### Poruke o greškama

#### "Sesija istekla"
- Odjavite se i ponovo prijavite
- Proverite podešavanja vremena na računaru
- Kontaktirajte administratora ako se problem ponavlja

#### "Pristup odbijen"
- Kontaktirajte administratora za pristup
- Proverite dozvole korisničkog naloga
- Proverite podatke za prijavu

#### "Podaci nisu pronađeni"
- Osvježite stranicu
- Proverite kriterijume pretrage
- Proverite da li podaci postoje

### Podrška

#### Resursi za pomoć
- **Dokumentacija**: Ugrađeni sistem pomoći
- **Video uputstva**: Korak po korak vodiči
- **FAQ**: Najčešća pitanja i odgovori

#### Kontakt podrške
- **Email**: support@odontoa.com
- **Telefon**: 1-800-ODONTOA
- **Live chat**: Dostupan tokom radnog vremena

#### Obuka
- **Obuka za nove korisnike**: Pomoć pri inicijalnom podešavanju
- **Napredna obuka**: Specijalizovana obuka za funkcionalnosti
- **Grupna obuka**: Trening za timove

---

**Poslednje ažuriranje**: Januar 2024.
**Verzija**: 1.0.0

Za najnoviju verziju priručnika, posetite sekciju za pomoć u aplikaciji. 