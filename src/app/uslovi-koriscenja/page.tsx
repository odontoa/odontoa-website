import LegalPage from '@/components/legal/LegalPage'

export default function TermsOfServicePage() {
  return (
    <LegalPage
      path="/uslovi-koriscenja"
      eyebrow="Pravni dokumenti"
      title="Uslovi korišćenja"
      lead="Ovi uslovi korišćenja uređuju odnos između Odontoa platforme i stomatoloških ordinacija koje koriste naš softver za upravljanje svojim poslovanjem."
    >
      {/* Section 1 */}
      <section>
        <h2>1. Opšte odredbe</h2>
        {/* ZA DOPUNU POSLE REGISTRACIJE FIRME: firma je u registraciji. Naziv, pravni oblik, PIB, maticni broj i
            adresa sedista ugovorne strane se upisuju kada registracija bude gotova; do tada bez imena vlasnika
            i bez pravnog oblika koji nije potvrdjen. */}
        <p>
          Odontoa je softverska platforma za upravljanje stomatološkim ordinacijama, sa sedištem u Beogradu, Srbija. Korišćenjem Odontoa aplikacije, korisnik prihvata ove uslove korišćenja i obavezuje se da ih poštuje.
        </p>
      </section>

      {/* Section 2 */}
      <section>
        <h2>2. Prava korišćenja i licenca</h2>
        <p>
          Korisnik dobija neekskluzivnu, neprenosivu licencu za korišćenje Odontoa softvera u svojoj ordinaciji. U okviru licence uključeni su svi moduli platforme:
        </p>
        <ul>
          {/* ZA PRAVNI REVIEW: lista uskladjena sa trenutnim funkcionalnostima (/funkcionalnosti).
              Uklonjeni su portal za pacijente i ortodoncija, protetika i hirurgija kao posebni moduli. */}
          <li>kalendar i zakazivanje termina</li>
          <li>digitalni karton i odontogram</li>
          <li>RTG snimci i fotografije</li>
          <li>radni nalozi za zubnu tehniku</li>
          <li>dokumentacija i saglasnosti</li>
          <li>finansijsko praćenje, predračuni i uplate</li>
          <li>obaveštenja i podsetnici pacijentima</li>
          <li>AI asistent</li>
          <li>i svi ostali dostupni moduli</li>
        </ul>
        <p>
          Korisnik nema pravo na izvorni kod, reverse-engineering ili bilo kakvu modifikaciju softvera.
        </p>
      </section>

      {/* Section 3 */}
      <section>
        <h2>3. Kreiranje naloga i odgovornost</h2>
        <p>
          Prilikom kreiranja naloga, korisnik se obavezuje da:
        </p>
        <ul>
          <li>unese tačne i ažurne podatke o ordinaciji</li>
          <li>čuva lozinku u tajnosti i ne deli je sa neovlašćenim licima</li>
          <li>odgovara za sve aktivnosti koje se dešavaju na njegovom nalogu</li>
          <li>prijavi neovlašćeni pristup ili zloupotrebu naloga odmah nakon što to primeti</li>
        </ul>
      </section>

      {/* Section 4 */}
      <section>
        {/* ZA PRAVNI REVIEW PRE/ODMAH POSLE LAUNCHA: ceo §4 je nova formulacija.
            - Cena za rani pristup, bez naplate po stolici; cena namerno nije upisana brojem.
            - Probni period 30 dana bez automatske naplate: trenutno nema billing sistema,
              registracija je lead forma i ne trazi platnu karticu.
            - Automatsko obnavljanje uklonjeno: ne postoji sistem koji ga sprovodi.
            - Tvrdnja "nalog prelazi u read-only ili basic rezim" uklonjena: takav rezim
              ne postoji u aplikaciji. */}
        <h2>4. Pretplate, cene i obnavljanje</h2>
        <p>
          Odontoa se naplaćuje kao jedinstvena pretplata koja uključuje sve funkcionalnosti dostupne u trenutku korišćenja, bez obzira na broj stolica, doktora ili pacijenata, i bez doplate za pojedinačne module. Pretplata se plaća godišnje, unapred, po ceni objavljenoj na sajtu odontoa.com u trenutku zaključenja pretplate.
        </p>
        <p>
          Novi korisnici mogu da koriste Odontou besplatno tokom probnog perioda od 30 dana. Za probni period nije potrebna platna kartica i po njegovom isteku se ne vrši automatska naplata. Pretplata počinje tek kada je korisnik izričito zaključi.
        </p>
        <p>
          Pretplata traje godinu dana od dana uplate i ne produžava se automatski. O produženju pretplate korisnik se dogovara sa Odontoa timom pre isteka tekućeg perioda. Korisnik može otkazati pretplatu u bilo kom trenutku.
        </p>
        <p>
          Po otkazivanju pretplate, podaci ordinacije se čuvaju i obrađuju u skladu sa Politikom privatnosti.
        </p>
      </section>

      {/* Section 5 */}
      <section>
        <h2>5. Zabrane korišćenja</h2>
        <p>
          Zabranjeno je:
        </p>
        <ul>
          <li>reverse-engineering ili dekompilacija softvera</li>
          <li>neovlašćena distribucija ili kopiranje softvera</li>
          <li>deljenje pristupa trećim licima bez dozvole</li>
          <li>upotreba softvera u svrhe suprotne zakonu ili medicinskoj etici</li>
          <li>pokušaj hakovanja ili narušavanja bezbednosti sistema</li>
          <li>unošenje malicioznog koda ili virusa</li>
        </ul>
      </section>

      {/* Section 6 */}
      <section>
        <h2>6. Integracije i AI funkcionalnosti</h2>
        <p>
          Odontoa koristi AI tehnologije i integracije sa trećim stranama u svrhu poboljšanja korisničkog iskustva i funkcionalnosti platforme.
        </p>
        <p>
          AI predlozi i sugestije su informativnog karaktera i ne predstavljaju medicinsku dijagnozu ili profesionalni medicinski savet.
        </p>
        <p>
          Krajnju odluku o dijagnozi i tretmanu uvek donosi licencirani doktor. Odontoa ne snosi odgovornost za posledice koje proističu iz korišćenja AI predloga bez profesionalne procene.
        </p>
      </section>

      {/* Section 7 */}
      <section>
        <h2>7. Backup i sigurnost</h2>
        <p>
          Odontoa vrši automatski backup podataka dva puta dnevno.
        </p>
        {/* ZA PRAVNI REVIEW / INFRASTRUCTURE VERIFICATION: fizicka lokacija baze i backupa nije
            potvrdjena (ranije su stajale kontradiktorne tvrdnje "EU" i "EU i Srbija"). Upisati
            region tek kad se potvrdi kod provajdera. */}
        <p>
          Podaci se čuvaju u skladu sa GDPR regulativom, kod pružalaca usluga hostinga u oblaku, sa enkripcijom u tranzitu i u mirovanju.
        </p>
        <p>
          Preduzimamo tehničke i organizacione mere bezbednosti kako bismo zaštitili podatke od neovlašćenog pristupa, gubitka ili uništenja.
        </p>
      </section>

      {/* Section 8 */}
      <section>
        <h2>8. Prekid korišćenja i suspenzija naloga</h2>
        <p>
          Odontoa zadržava pravo da suspenduje ili raskine ugovor sa korisnikom u slučaju:
        </p>
        <ul>
          <li>zloupotrebe platforme ili kršenja ovih uslova</li>
          <li>neplaćanja pretplate</li>
          <li>kršenja zakona ili medicinske etike</li>
          <li>pokušaja narušavanja bezbednosti sistema</li>
        </ul>
        <p>
          U slučaju raskida ugovora, podaci korisnika se čuvaju u skladu sa politikom privatnosti i zakonskim obavezama. Korisnik može zatražiti izvoz podataka pre raskida.
        </p>
      </section>

      {/* Section 9 */}
      <section>
        <h2>9. Ograničenje odgovornosti</h2>
        <p>
          Softver se pruža „takav kakav jeste" (as-is), bez garancije neprekinutog rada ili odsustva grešaka.
        </p>
        <p>
          Odontoa nije odgovorna za štetu nastalu:
        </p>
        <ul>
          <li>pogrešnim unosom podataka od strane korisnika</li>
          <li>gubitkom lozinke ili neovlašćenim pristupom nalogu</li>
          <li>nepoštovanjem zakona ili medicinske etike od strane korisnika</li>
          <li>prekidom internetske veze ili tehničkim problemima na strani korisnika</li>
        </ul>
        <p>
          Ukupna odgovornost Odontoa ograničena je na maksimalno zbir uplata korisnika u poslednjih 6 meseci.
        </p>
      </section>

      {/* Section 10 */}
      <section>
        <h2>10. Izmene uslova</h2>
        <p>
          Odontoa zadržava pravo da menja ove uslove korišćenja.
        </p>
        <p>
          Ažurirana verzija uslova će biti objavljena na ovoj stranici sa datumom poslednje izmene.
        </p>
        <p>
          Dalje korišćenje platforme nakon objave izmenjenih uslova predstavlja prihvatanje novih uslova.
        </p>
      </section>

      {/* Section 11 */}
      <section>
        <h2>11. Važeće pravo i rešavanje sporova</h2>
        <p>
          Ovi uslovi korišćenja se tumače i primenjuju u skladu sa pravom Republike Srbije.
        </p>
        <p>
          Za rešavanje svih sporova koji proističu iz ovih uslova, nadležni su sudovi u Beogradu, Republika Srbija.
        </p>
      </section>

      {/* Section 12 */}
      <section>
        <h2>12. Kontakt</h2>
        <p>
          Za sva pitanja u vezi uslova korišćenja, možete nas kontaktirati na:
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
