import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Shield, FileText, HelpCircle, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Podrška i uslovi - Odontoa',
  description: 'Pomoć, politika privatnosti, uslovi korišćenja i GDPR informacije za Odontoa aplikaciju.',
  keywords: 'pomoć, podrška, politika privatnosti, uslovi korišćenja, GDPR, odontoa',
};

export default function PomocIPravnoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16 pt-20">
          <h1 className="text-4xl md:text-6xl font-normal text-foreground mb-6 leading-tight">
            Podrška i uslovi
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Sve informacije koje vam trebaju o korišćenju Odontoa aplikacije, 
            vašim pravima i našim obavezama.
          </p>
        </div>

        {/* Pomoć Section */}
        <Card id="pomoc" className="mb-8 scroll-mt-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-normal text-foreground">
              <HelpCircle className="h-8 w-8 text-primary" />
              Pomoć
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Ako imate pitanja u vezi sa korišćenjem aplikacije Odontoa, možete nas kontaktirati:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">info@odontoa.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Adresa</p>
                  <p className="text-sm text-muted-foreground">Krunska, Beograd 11000, Srbija</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Telefon</p>
                  <p className="text-sm text-muted-foreground">+381 XX XXX XXXX</p>
                </div>
              </div>
            </div>
            
            <p className="text-muted-foreground">
              Takođe, u sekciji Dokumentacija unutar aplikacije dostupni su vodiči i često postavljana pitanja (FAQ).
            </p>
          </CardContent>
        </Card>

        {/* Politika privatnosti Section */}
        <Card id="privatnost" className="mb-8 scroll-mt-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-normal text-foreground">
              <Shield className="h-8 w-8 text-primary" />
              Politika privatnosti
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-normal text-foreground mb-3">1. Uvod</h3>
              <p className="text-muted-foreground mb-4">
                Ova Politika privatnosti opisuje način na koji Odontoa d.o.o. („Odontoa", „mi") prikuplja, koristi, 
                obrađuje i štiti vaše lične podatke. Naš cilj je da obezbedimo da se svi podaci obrađuju zakonito, 
                pošteno i transparentno, u skladu sa Zakonom o zaštiti podataka o ličnosti Republike Srbije („ZZPL") 
                i relevantnim standardima Opšte uredbe EU o zaštiti podataka („GDPR").
              </p>
            </div>

            <div>
              <h3 className="text-xl font-normal text-foreground mb-3">2. Podaci koje prikupljamo</h3>
              <p className="text-muted-foreground mb-3">Prikupljamo sledeće kategorije podataka:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Podaci korisnika aplikacije:</strong> ime, prezime, email adresa, broj telefona, lozinka, IP adresa i tehnički podaci o uređaju.</li>
                <li><strong>Podaci o pacijentima koje unose ordinacije:</strong> ime i prezime, datum rođenja, kontakt podaci, medicinska istorija, stomatološki karton, rendgenski snimci, fotografije, plan terapije.</li>
                <li><strong>Podaci o plaćanjima:</strong> ako se koriste plaćene funkcionalnosti, prikupljaju se podaci o transakcijama (putem trećih lica – procesora plaćanja).</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-normal text-foreground mb-3">3. Svrha obrade</h3>
              <p className="text-muted-foreground mb-3">Podatke koristimo isključivo u sledeće svrhe:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Pružanje usluge upravljanja stomatološkom ordinacijom (evidencija pacijenata, zakazivanje, komunikacija).</li>
                <li>Tehnička podrška korisnicima i rešavanje problema.</li>
                <li>Slanje obaveštenja o izmenama sistema, bezbednosnim ažuriranjima i važnim informacijama.</li>
                <li>Unapređenje funkcionalnosti aplikacije (analitika korišćenja, UX testiranje).</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-normal text-foreground mb-3">4. Pravna osnova obrade</h3>
              <p className="text-muted-foreground mb-3">Obrada podataka vrši se na osnovu:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Izvršenja ugovora između Odontoa i korisnika (član 12. ZZPL).</li>
                <li>Zakonske obaveze (npr. čuvanje medicinske dokumentacije).</li>
                <li>Legitimnog interesa (unapređenje bezbednosti i funkcionalnosti sistema).</li>
                <li>Saglasnosti (za marketinške poruke i newsletter – opciono).</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-normal text-foreground mb-3">5. Prava korisnika</h3>
              <p className="text-muted-foreground mb-3">
                U skladu sa ZZPL i GDPR imate pravo na pristup svojim podacima, ispravku netačnih podataka, 
                brisanje podataka („pravo na zaborav"), ograničenje obrade, pravo na prenosivost podataka, 
                prigovor na obradu i podnošenje pritužbe Povereniku za informacije od javnog značaja i zaštitu 
                podataka o ličnosti RS.
              </p>
              <p className="text-muted-foreground">
                Zahteve možete uputiti putem emaila: <strong>info@odontoa.com</strong>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-normal text-foreground mb-3">6. Čuvanje podataka</h3>
              <p className="text-muted-foreground mb-3">
                Podaci se čuvaju na serverima u EU i Srbiji, sa primenom najviših standarda bezbednosti 
                (enkripcija, kontrola pristupa). Podaci pacijenata čuvaju se sve dok ordinacija koristi uslugu. 
                Nakon raskida ugovora, podaci se brišu ili anonimziju, osim ako postoji zakonska obaveza arhiviranja.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-normal text-foreground mb-3">7. Deljenje podataka</h3>
              <p className="text-muted-foreground mb-3">Podaci se ne dele sa trećim licima, osim:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Kada je to neophodno za pružanje usluge (npr. hosting provajderi, procesori plaćanja).</li>
                <li>Kada to nalaže zakon ili sudski nalog.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-normal text-foreground mb-3">8. Kontakt</h3>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="font-medium mb-2">Odontoa d.o.o.</p>
                <p className="text-muted-foreground">📍 Krunska, Beograd 11000, Srbija</p>
                <p className="text-muted-foreground">📧 info@odontoa.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Uslovi korišćenja Section */}
        <Card id="uslovi" className="mb-8 scroll-mt-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-normal text-foreground">
              <FileText className="h-8 w-8 text-primary" />
              Uslovi korišćenja
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-normal text-foreground mb-3">1. Prihvatanje uslova</h3>
              <p className="text-muted-foreground">
                Korišćenjem aplikacije Odontoa prihvatate ove Uslove korišćenja. 
                Ako se ne slažete, molimo vas da ne koristite aplikaciju.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-normal text-foreground mb-3">2. Predmet usluge</h3>
              <p className="text-muted-foreground">
                Odontoa je softver za upravljanje stomatološkom ordinacijom koji omogućava: evidenciju pacijenata, 
                zakazivanje termina, upravljanje zalihama, komunikaciju sa pacijentima i analitiku poslovanja.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-normal text-foreground mb-3">3. Odgovornosti korisnika</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Korisnik je odgovoran za tačnost unetih podataka.</li>
                <li>Korisnik ne sme deliti svoje pristupne podatke sa trećim licima.</li>
                <li>Zabranjena je zloupotreba sistema (hakovanje, neovlašćeni pristup, kopiranje koda).</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-normal text-foreground mb-3">4. Ograničenje odgovornosti</h3>
              <p className="text-muted-foreground">
                Odontoa ne garantuje neprekidan rad aplikacije i ne snosi odgovornost za gubitak podataka 
                izazvan tehničkim kvarovima van naše kontrole.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-normal text-foreground mb-3">5. Izmene uslova</h3>
              <p className="text-muted-foreground">
                Odontoa zadržava pravo da menja Uslove korišćenja i funkcionalnosti sistema. 
                O izmenama ćete biti obavešteni putem emaila ili unutar aplikacije.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-normal text-foreground mb-3">6. Nadležnost</h3>
              <p className="text-muted-foreground">
                Za sve sporove nadležan je sud u Beogradu, a primenjuje se pravo Republike Srbije.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* GDPR Section */}
        <Card id="gdpr" className="mb-8 scroll-mt-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-normal text-foreground">
              <Lock className="h-8 w-8 text-primary" />
              GDPR izjava
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-normal text-foreground mb-3">1. Uloge u obradi</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Ordinacija (korisnik aplikacije)</strong> = rukovalac podataka (data controller).</li>
                <li><strong>Odontoa</strong> = obrađivač podataka (data processor).</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-normal text-foreground mb-3">2. Obaveze Odontoa</h3>
              <p className="text-muted-foreground mb-3">Odontoa se obavezuje da:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Obradjuje podatke samo po instrukcijama ordinacije.</li>
                <li>Obezbeđuje tehničke i organizacione mere zaštite (enkripcija, kontrola pristupa, backup).</li>
                <li>Ne koristi podatke pacijenata u sopstvene svrhe.</li>
                <li>Odmah obavesti korisnika u slučaju bezbednosnog incidenta ili curenja podataka.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-normal text-foreground mb-3">3. Prava pacijenata</h3>
              <p className="text-muted-foreground mb-3">Pacijenti imaju pravo da od svoje ordinacije zahtevaju:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Brisanje podataka.</li>
                <li>Prenos podataka drugom pružaocu usluge.</li>
                <li>Informacije o svrsi obrade i periodu čuvanja.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-normal text-foreground mb-3">4. Lokacija i prenos podataka</h3>
              <p className="text-muted-foreground">
                Podaci se čuvaju u EU i Srbiji. U slučaju prenosa podataka van EU, 
                primenjuju se standardne ugovorne klauzule EU i ZZPL.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-normal text-foreground">Pomoć i podrška</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Za sve informacije ili zahteve:
            </p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-muted-foreground">📧 info@odontoa.com</p>
              <p className="text-muted-foreground">📍 Krunska, Beograd 11000, Srbija</p>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Ova dokumenta čine integralni deo aplikacije Odontoa i dostupna su svim korisnicima putem linkova u footeru.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
