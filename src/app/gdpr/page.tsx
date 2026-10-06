import LegalPage from '@/components/legal/LegalPage'

export default function GDPRPage() {
  return (
    <LegalPage
      path="/gdpr"
      eyebrow="Pravni dokumenti"
      title="GDPR izjava"
      lead="Informacije o obradi podataka u skladu sa Opštom uredbom EU o zaštiti podataka (GDPR) i Zakonom o zaštiti podataka o ličnosti Republike Srbije (ZZPL)."
    >
      {/* Section 1 */}
      <section>
        <h2>1. Uloge u obradi</h2>
        <p>
          U kontekstu obrade podataka pacijenata:
        </p>
        <ul>
          <li><strong>Ordinacija (korisnik aplikacije)</strong> = rukovalac podataka (data controller).</li>
          <li><strong>Odontoa</strong> = obrađivač podataka (data processor).</li>
        </ul>
      </section>

      {/* Section 2 */}
      <section>
        <h2>2. Obaveze Odontoa</h2>
        <p>
          Odontoa se obavezuje da:
        </p>
        <ul>
          <li>obrađuje podatke samo po instrukcijama ordinacije.</li>
          <li>obezbeđuje tehničke i organizacione mere zaštite (enkripcija, kontrola pristupa, backup).</li>
          <li>ne koristi podatke pacijenata u sopstvene svrhe.</li>
          <li>odmah obavesti korisnika u slučaju bezbednosnog incidenta ili curenja podataka.</li>
        </ul>
      </section>

      {/* Section 3 */}
      <section>
        <h2>3. Prava pacijenata</h2>
        <p>
          Pacijenti imaju pravo da od svoje ordinacije zahtevaju:
        </p>
        <ul>
          <li>brisanje podataka.</li>
          <li>prenos podataka drugom pružaocu usluge.</li>
          <li>informacije o svrsi obrade i periodu čuvanja.</li>
        </ul>
      </section>

      {/* Section 4 */}
      <section>
        <h2>4. Lokacija i prenos podataka</h2>
        {/* ZA PRAVNI REVIEW / INFRASTRUCTURE VERIFICATION: fizicka lokacija baze i backupa nije
            potvrdjena (ranije su stajale kontradiktorne tvrdnje "EU" i "EU i Srbija"). Upisati
            region tek kad se potvrdi kod provajdera. */}
        <p>
          Podaci se čuvaju kod pružalaca usluga hostinga u oblaku. U slučaju prenosa podataka van EU, primenjuju se standardne ugovorne klauzule EU i ZZPL.
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
