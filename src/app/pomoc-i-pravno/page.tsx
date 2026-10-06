import { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';
import { pageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'Podrška i uslovi - Odontoa',
  description: 'Pomoć, politika privatnosti, uslovi korišćenja i GDPR informacije za Odontoa aplikaciju.',
  keywords: 'pomoć, podrška, politika privatnosti, uslovi korišćenja, GDPR, odontoa',
  path: '/pomoc-i-pravno',
});

export default function PomocIPravnoPage() {
  return (
    <LegalPage
      path="/pomoc-i-pravno"
      eyebrow="Podrška"
      title="Podrška i uslovi"
      lead={
        <>
          Sve informacije koje vam trebaju o korišćenju Odontoa aplikacije,
          vašim pravima i našim obavezama.
        </>
      }
    >
        {/* Pomoć Section */}
        <section id="pomoc" className="legal__doc">
          <h3>Pomoć</h3>
          <p>
            Ako imate pitanja u vezi sa korišćenjem aplikacije Odontoa, možete nas kontaktirati:
          </p>

          <dl className="legal__details">
            <div className="legal__detail">
              <dt>Email</dt>
              <dd><a href="mailto:info@odontoa.com">info@odontoa.com</a></dd>
            </div>
            <div className="legal__detail">
              <dt>Adresa</dt>
              <dd>Krunska, Beograd 11000, Srbija</dd>
            </div>
          </dl>

          <p>
            Takođe, u sekciji Dokumentacija unutar aplikacije dostupni su vodiči i često postavljana pitanja (FAQ).
          </p>
        </section>

        {/* Politika privatnosti Section */}
        <section id="privatnost" className="legal__doc">
          <h3>Politika privatnosti</h3>
            <div>
              <h3>1. Uvod</h3>
              <p>
                Ova Politika privatnosti opisuje način na koji Odontoa („mi") prikuplja, koristi, 
                obrađuje i štiti vaše lične podatke. Naš cilj je da obezbedimo da se svi podaci obrađuju zakonito, 
                pošteno i transparentno, u skladu sa Zakonom o zaštiti podataka o ličnosti Republike Srbije („ZZPL") 
                i relevantnim standardima Opšte uredbe EU o zaštiti podataka („GDPR").
              </p>
            </div>

            <div>
              <h3>2. Podaci koje prikupljamo</h3>
              <p>Prikupljamo sledeće kategorije podataka:</p>
              <ul>
                <li><strong>Podaci korisnika aplikacije:</strong> ime, prezime, email adresa, broj telefona, lozinka, IP adresa i tehnički podaci o uređaju.</li>
                <li><strong>Podaci o pacijentima koje unose ordinacije:</strong> ime i prezime, datum rođenja, kontakt podaci, medicinska istorija, stomatološki karton, rendgenski snimci, fotografije, plan terapije.</li>
                <li><strong>Podaci o plaćanjima:</strong> ako se koriste plaćene funkcionalnosti, prikupljaju se podaci o transakcijama (putem trećih lica – procesora plaćanja).</li>
              </ul>
            </div>

            <div>
              <h3>3. Svrha obrade</h3>
              <p>Podatke koristimo isključivo u sledeće svrhe:</p>
              <ul>
                <li>Pružanje usluge upravljanja stomatološkom ordinacijom (evidencija pacijenata, zakazivanje, komunikacija).</li>
                <li>Tehnička podrška korisnicima i rešavanje problema.</li>
                <li>Slanje obaveštenja o izmenama sistema, bezbednosnim ažuriranjima i važnim informacijama.</li>
                <li>Unapređenje funkcionalnosti aplikacije (analitika korišćenja, UX testiranje).</li>
              </ul>
            </div>

            <div>
              <h3>4. Pravna osnova obrade</h3>
              <p>Obrada podataka vrši se na osnovu:</p>
              <ul>
                <li>Izvršenja ugovora između Odontoa i korisnika (član 12. ZZPL).</li>
                <li>Zakonske obaveze (npr. čuvanje medicinske dokumentacije).</li>
                <li>Legitimnog interesa (unapređenje bezbednosti i funkcionalnosti sistema).</li>
                <li>Saglasnosti (za marketinške poruke i newsletter – opciono).</li>
              </ul>
            </div>

            <div>
              <h3>5. Prava korisnika</h3>
              <p>
                U skladu sa ZZPL i GDPR imate pravo na pristup svojim podacima, ispravku netačnih podataka, 
                brisanje podataka („pravo na zaborav"), ograničenje obrade, pravo na prenosivost podataka, 
                prigovor na obradu i podnošenje pritužbe Povereniku za informacije od javnog značaja i zaštitu 
                podataka o ličnosti RS.
              </p>
              <p>
                Zahteve možete uputiti putem emaila: <strong>info@odontoa.com</strong>
              </p>
            </div>

            <div>
              <h3>6. Čuvanje podataka</h3>
              <p>
                {/* ZA PRAVNI REVIEW / INFRASTRUCTURE VERIFICATION: lokacija nije potvrdjena. */}
                Podaci se čuvaju kod pružalaca usluga hostinga u oblaku, sa primenom najviših standarda bezbednosti 
                (enkripcija, kontrola pristupa). Podaci pacijenata čuvaju se sve dok ordinacija koristi uslugu. 
                Nakon raskida ugovora, podaci se brišu ili anonimizuju, osim ako postoji zakonska obaveza arhiviranja.
              </p>
            </div>

            <div>
              <h3>7. Deljenje podataka</h3>
              <p>Podaci se ne dele sa trećim licima, osim:</p>
              <ul>
                <li>Kada je to neophodno za pružanje usluge (npr. hosting provajderi, procesori plaćanja).</li>
                <li>Kada to nalaže zakon ili sudski nalog.</li>
              </ul>
            </div>

            <div>
              <h3>8. Kontakt</h3>
              <div className="legal__box">
                <p>Odontoa</p>
                <p>Krunska, Beograd 11000, Srbija</p>
                <p>info@odontoa.com</p>
              </div>
            </div>
        </section>

        {/* Uslovi korišćenja Section */}
        <section id="uslovi" className="legal__doc">
          <h3>Uslovi korišćenja</h3>
            <div>
              <h3>1. Prihvatanje uslova</h3>
              <p>
                Korišćenjem aplikacije Odontoa prihvatate ove Uslove korišćenja. 
                Ako se ne slažete, molimo vas da ne koristite aplikaciju.
              </p>
            </div>

            <div>
              <h3>2. Predmet usluge</h3>
              {/* ZA PRAVNI REVIEW: predmet usluge uskladjen sa trenutnim modulima (bez upravljanja zalihama). */}
              <p>
                Odontoa je softver za upravljanje stomatološkom ordinacijom koji omogućava: zakazivanje termina,
                digitalni karton i odontogram, RTG snimke i fotografije, radne naloge za zubnu tehniku, dokumentaciju
                i saglasnosti, predračune i uplate, kao i obaveštenja i podsetnike pacijentima.
              </p>
            </div>

            <div>
              <h3>3. Odgovornosti korisnika</h3>
              <ul>
                <li>Korisnik je odgovoran za tačnost unetih podataka.</li>
                <li>Korisnik ne sme deliti svoje pristupne podatke sa trećim licima.</li>
                <li>Zabranjena je zloupotreba sistema (hakovanje, neovlašćeni pristup, kopiranje koda).</li>
              </ul>
            </div>

            <div>
              <h3>4. Ograničenje odgovornosti</h3>
              <p>
                Odontoa ne garantuje neprekidan rad aplikacije i ne snosi odgovornost za gubitak podataka 
                izazvan tehničkim kvarovima van naše kontrole.
              </p>
            </div>

            <div>
              <h3>5. Izmene uslova</h3>
              <p>
                Odontoa zadržava pravo da menja Uslove korišćenja i funkcionalnosti sistema. 
                O izmenama ćete biti obavešteni putem emaila ili unutar aplikacije.
              </p>
            </div>

            <div>
              <h3>6. Nadležnost</h3>
              <p>
                Za sve sporove nadležan je sud u Beogradu, a primenjuje se pravo Republike Srbije.
              </p>
            </div>
        </section>

        {/* GDPR Section */}
        <section id="gdpr" className="legal__doc">
          <h3>GDPR izjava</h3>
            <div>
              <h3>1. Uloge u obradi</h3>
              <ul>
                <li><strong>Ordinacija (korisnik aplikacije)</strong> = rukovalac podataka (data controller).</li>
                <li><strong>Odontoa</strong> = obrađivač podataka (data processor).</li>
              </ul>
            </div>

            <div>
              <h3>2. Obaveze Odontoa</h3>
              <p>Odontoa se obavezuje da:</p>
              <ul>
                <li>Obradjuje podatke samo po instrukcijama ordinacije.</li>
                <li>Obezbeđuje tehničke i organizacione mere zaštite (enkripcija, kontrola pristupa, backup).</li>
                <li>Ne koristi podatke pacijenata u sopstvene svrhe.</li>
                <li>Odmah obavesti korisnika u slučaju bezbednosnog incidenta ili curenja podataka.</li>
              </ul>
            </div>

            <div>
              <h3>3. Prava pacijenata</h3>
              <p>Pacijenti imaju pravo da od svoje ordinacije zahtevaju:</p>
              <ul>
                <li>Brisanje podataka.</li>
                <li>Prenos podataka drugom pružaocu usluge.</li>
                <li>Informacije o svrsi obrade i periodu čuvanja.</li>
              </ul>
            </div>

            <div>
              <h3>4. Lokacija i prenos podataka</h3>
              <p>
                Podaci se čuvaju kod pružalaca usluga hostinga u oblaku. U slučaju prenosa podataka van EU, 
                primenjuju se standardne ugovorne klauzule EU i ZZPL.
              </p>
            </div>
        </section>

        {/* Contact Section */}
        <section className="legal__doc">
          <h3>Pomoć i podrška</h3>
          <p>
            Za sve informacije ili zahteve:
          </p>
          <div className="legal__box">
            <p>info@odontoa.com</p>
            <p>Krunska, Beograd 11000, Srbija</p>
          </div>
          <p className="legal__meta">
            Ova dokumenta čine integralni deo aplikacije Odontoa i dostupna su svim korisnicima putem linkova u footeru.
          </p>
        </section>
    </LegalPage>
  );
}
