import LegalPage from '@/components/legal/LegalPage'

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      path="/politika-privatnosti"
      eyebrow="Pravni dokumenti"
      title="Politika privatnosti"
      lead="Ova politika privatnosti objašnjava kako Odontoa prikuplja, čuva i obrađuje podatke o korisnicima i pacijentima, u skladu sa važećim propisima i GDPR regulativom."
    >
      {/* Section 1 */}
      <section>
        <h2>1. Uvod</h2>
        <p>
          Odontoa („mi", „nas", „naš") poštuje vašu privatnost i posvećena je zaštiti podataka koje obrađuje u ime stomatoloških ordinacija. Ova Politika privatnosti objašnjava koje podatke prikupljamo, u koje svrhe ih koristimo, na kojoj pravnoj osnovi, sa kim ih delimo i koja prava imate u vezi sa obradom podataka.
        </p>
      </section>

      {/* Section 2 */}
      <section>
        <h2>2. Ko smo mi</h2>
        {/* ZA DOPUNU POSLE REGISTRACIJE FIRME: firma je u registraciji. Naziv, pravni oblik, PIB, maticni broj i
            adresa sedista se upisuju kada registracija bude gotova; do tada bez imena vlasnika
            i bez pravnog oblika koji nije potvrdjen. */}
        <p>
          Odontoa je softverska platforma za upravljanje stomatološkim ordinacijama, sa sedištem u Beogradu, Srbija.
        </p>
        <p>
          U odnosu na podatke o ordinacijama (korisnicima sistema), nastupamo kao rukovalac podataka.
        </p>
        <p>
          U odnosu na medicinske podatke pacijenata koje ordinacije unose u sistem, nastupamo kao obrađivač podataka u ime te ordinacije.
        </p>
      </section>

      {/* Section 3 */}
      <section>
        <h2>3. Koje podatke prikupljamo</h2>
        <p>
          <strong>Podaci o korisnicima ordinacije:</strong> ime i prezime, e-mail, broj telefona, naziv ordinacije, adresa, podaci o broju stolica, podaci za naplatu.
        </p>
        <p>
          <strong>Podaci o pacijentima (posebne kategorije podataka):</strong> lični podaci (ime, prezime, datum rođenja, kontakt podaci), anamneza, stomatološki karton, terapijski plan, RTG/OPG snimci, fotografije, medicinska dokumentacija.
        </p>
        <p>
          <strong>Tehnički i analitički podaci:</strong> IP adresa, tip uređaja, pregledač, logovi pristupa, osnovna analitika korišćenja aplikacije.
        </p>
      </section>

      {/* Section 4 */}
      <section>
        <h2>4. Svrha obrade</h2>
        <ul>
          <li>pružanje usluge digitalne kartoteke i upravljanja ordinacijom</li>
          {/* ZA PRAVNI REVIEW: uklonjeno "online zakazivanje"; pacijenti trenutno ne zakazuju sami. */}
          <li>vođenje termina i zakazivanja</li>
          <li>slanje SMS i email podsetnika pacijentima</li>
          <li>finansijsko praćenje rada ordinacije</li>
          <li>tehnička podrška i unapređenje sistema</li>
          <li>ispunjavanje zakonskih obaveza ordinacije</li>
        </ul>
      </section>

      {/* Section 5 */}
      <section>
        <h2>5. Pravna osnova obrade (GDPR)</h2>
        <p>
          Obradu podataka vršimo na osnovu:
        </p>
        <ul>
          <li>izvršenje ugovora sa ordinacijom,</li>
          <li>ispunjavanje zakonskih obaveza,</li>
          <li>legitimni interes (bezbednost sistema, sprečavanje zloupotreba),</li>
          <li>izričita saglasnost pacijenata za obradu zdravstvenih podataka, u meri u kojoj je to potrebno prema važećim propisima.</li>
        </ul>
      </section>

      {/* Section 6 */}
      <section>
        <h2>6. Backup i bezbednost podataka</h2>
        <p>
          Odontoa vrši automatski backup podataka dva puta dnevno.
        </p>
        {/* ZA PRAVNI REVIEW / INFRASTRUCTURE VERIFICATION: fizicka lokacija baze i backupa nije
            potvrdjena (ranije su stajale kontradiktorne tvrdnje "EU" i "EU i Srbija"). Upisati
            region tek kad se potvrdi kod provajdera. */}
        <p>
          Podaci se čuvaju kod pružalaca usluga hostinga u oblaku, enkriptovani u tranzitu i u mirovanju.
        </p>
        <p>
          Pristup podacima je strogo ograničen i logovan, a pristup imaju samo ovlašćena lica u svrhu održavanja sistema i podrške.
        </p>
      </section>

      {/* Section 7 */}
      <section>
        <h2>7. Deljenje podataka</h2>
        <p>
          Podatke delimo sa:
        </p>
        <ul>
          <li>hosting provajderima i pružaocima IT usluga,</li>
          {/* ZA PRAVNI REVIEW: uklonjene integracije sa RTG uredjajima, laboratorijama i
              racunovodstvenim softverom jer trenutno nisu aktivne. Proveriti listu stvarnih
              podobradjivaca (hosting, slanje emaila i SMS-a). */}
          <li>nadležnim organima kada je to zakonski obavezno.</li>
        </ul>
        <p>
          Ne prodajemo podatke trećim licima.
        </p>
      </section>

      {/* Section 8 */}
      <section>
        <h2>8. Vaša prava</h2>
        <p>
          Imate sledeća prava u vezi sa obradom podataka:
        </p>
        <ul>
          <li>pravo na uvid</li>
          <li>pravo na ispravku</li>
          <li>pravo na brisanje</li>
          <li>pravo na ograničenje obrade</li>
          <li>pravo na prenosivost</li>
          <li>pravo na prigovor</li>
        </ul>
        <p>
          Zahtev možete poslati na: <a href="mailto:info@odontoa.com">info@odontoa.com</a>.
        </p>
      </section>

      {/* Section 9 */}
      <section>
        <h2>9. Rok čuvanja podataka</h2>
        <p>
          Korisnički podaci se čuvaju do deaktivacije naloga.
        </p>
        <p>
          Medicinski podaci se čuvaju do zahteva ordinacije ili u skladu sa zakonskim rokovima.
        </p>
        <p>
          Backup kopije se čuvaju do 30 dana.
        </p>
      </section>

      {/* Section 10 */}
      <section>
        <h2>10. Kolačići i analitika</h2>
        <p>
          Koristimo kolačiće za login, sigurnost sesije i osnovnu analitiku, bez prodaje ili targetiranog oglašavanja.
        </p>
      </section>

      {/* Section 11 */}
      <section>
        <h2>11. Izmene ove politike</h2>
        <p>
          Ova politika se povremeno ažurira. Poslednja verzija će biti objavljena na ovoj stranici sa datumom ažuriranja.
        </p>
      </section>

      {/* Section 12 */}
      <section>
        <h2>12. Kontakt</h2>
        <p>
          Za sva pitanja u vezi privatnosti, možete nas kontaktirati na:
        </p>
        <p>
          <a href="mailto:info@odontoa.com">info@odontoa.com</a>
        </p>
      </section>

      {/* Last updated */}
      <section className="legal__meta">
        <p>
          Važi od: oktobar 2026.
        </p>
        <p>
          Poslednje ažuriranje: oktobar 2026.
        </p>
      </section>
    </LegalPage>
  )
}
