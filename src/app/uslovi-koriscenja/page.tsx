'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern'
import { cn } from '@/lib/utils'

export default function TermsOfServicePage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background relative overflow-hidden">
        {/* Radial gradient backgrounds */}
        <div
          aria-hidden
          className="z-[2] absolute inset-0 pointer-events-none isolate opacity-30 contain-strict"
        >
          <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(220,100%,60%,.05)_0,hsla(220,100%,50%,.02)_50%,hsla(220,100%,45%,0)_80%)]" />
          <div className="h-[80rem] absolute right-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(220,100%,60%,.04)_0,hsla(220,100%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <AnimatedGridPattern
            numSquares={30}
            maxOpacity={0.02}
            duration={6}
            repeatDelay={2}
            width={60}
            height={60}
            className={cn(
              "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
              "opacity-30",
            )}
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-32 pb-20">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 font-['Poppins']">
              Uslovi korišćenja
            </h1>
            <p className="text-lg text-muted-foreground font-['Inter']">
              Ovi uslovi korišćenja uređuju odnos između Odontoa platforme i stomatoloških ordinacija koje koriste naš softver za upravljanje svojim poslovanjem.
            </p>
          </motion.div>

          {/* Content */}
          <div className="prose max-w-none space-y-8">
            {/* Section 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">1. Opšte odredbe</h2>
              <p className="text-muted-foreground leading-relaxed font-['Inter']">
                Odontoa je softverska platforma za upravljanje stomatološkim ordinacijama, u vlasništvu preduzetnika OGI I BOKI PR, sa sedištem u Beogradu, Srbija. Korišćenjem Odontoa aplikacije, korisnik prihvata ove uslove korišćenja i obavezuje se da ih poštuje.
              </p>
            </motion.div>

            {/* Section 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">2. Prava korišćenja i licenca</h2>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                Korisnik dobija neekskluzivnu, neprenosivu licencu za korišćenje Odontoa softvera u svojoj ordinaciji. U okviru licence uključeni su svi moduli platforme:
              </p>
              <ul className="text-muted-foreground leading-relaxed font-['Inter'] space-y-2 list-disc list-inside mb-3">
                <li>stomatologija, ortodoncija, protetika, hirurgija</li>
                <li>digitalni kartoni pacijenata</li>
                <li>terapijski planovi</li>
                <li>kalendar i zakazivanje termina</li>
                <li>finansijsko praćenje</li>
                <li>portal za pacijente</li>
                <li>i svi ostali dostupni moduli</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed font-['Inter']">
                Korisnik nema pravo na izvorni kod, reverse-engineering ili bilo kakvu modifikaciju softvera.
              </p>
            </motion.div>

            {/* Section 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">3. Kreiranje naloga i odgovornost</h2>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                Prilikom kreiranja naloga, korisnik se obavezuje da:
              </p>
              <ul className="text-muted-foreground leading-relaxed font-['Inter'] space-y-2 list-disc list-inside mb-3">
                <li>unese tačne i ažurne podatke o ordinaciji</li>
                <li>čuva lozinku u tajnosti i ne deli je sa neovlašćenim licima</li>
                <li>odgovara za sve aktivnosti koje se dešavaju na njegovom nalogu</li>
                <li>prijavi neovlašćeni pristup ili zloupotrebu naloga odmah nakon što to primeti</li>
              </ul>
            </motion.div>

            {/* Section 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">4. Pretplate, cene i obnavljanje</h2>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                Naplata Odontoa usluge vrši se po broju stolica, mesečno ili godišnje, prema cenama objavljenim na stranici „Cenovnik".
              </p>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                Pretplata se automatski obnavlja dok je korisnik ne otkaže. Korisnik može otkazati pretplatu u bilo kom trenutku.
              </p>
              <p className="text-muted-foreground leading-relaxed font-['Inter']">
                Po otkazivanju pretplate, nalog prelazi u read-only ili basic režim bez brisanja podataka. Podaci se čuvaju u skladu sa politikom privatnosti.
              </p>
            </motion.div>

            {/* Section 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">5. Zabrane korišćenja</h2>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                Zabranjeno je:
              </p>
              <ul className="text-muted-foreground leading-relaxed font-['Inter'] space-y-2 list-disc ml-6">
                <li>reverse-engineering ili dekompilacija softvera</li>
                <li>neovlašćena distribucija ili kopiranje softvera</li>
                <li>deljenje pristupa trećim licima bez dozvole</li>
                <li>upotreba softvera u svrhe suprotne zakonu ili medicinskoj etici</li>
                <li>pokušaj hakovanja ili narušavanja bezbednosti sistema</li>
                <li>unošenje malicioznog koda ili virusa</li>
              </ul>
            </motion.div>

            {/* Section 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">6. Integracije i AI funkcionalnosti</h2>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                Odontoa koristi AI tehnologije i integracije sa trećim stranama u svrhu poboljšanja korisničkog iskustva i funkcionalnosti platforme.
              </p>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                AI predlozi i sugestije su informativnog karaktera i ne predstavljaju medicinsku dijagnozu ili profesionalni medicinski savet.
              </p>
              <p className="text-muted-foreground leading-relaxed font-['Inter']">
                Krajnju odluku o dijagnozi i tretmanu uvek donosi licencirani doktor. Odontoa ne snosi odgovornost za posledice koje proističu iz korišćenja AI predloga bez profesionalne procene.
              </p>
            </motion.div>

            {/* Section 7 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">7. Backup i sigurnost</h2>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                Odontoa vrši automatski backup podataka dva puta dnevno.
              </p>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                Podaci se čuvaju u skladu sa GDPR regulativom, na serverima u EU, sa enkripcijom u tranzitu i u mirovanju.
              </p>
              <p className="text-muted-foreground leading-relaxed font-['Inter']">
                Preduzimamo tehničke i organizacione mere bezbednosti kako bismo zaštitili podatke od neovlašćenog pristupa, gubitka ili uništenja.
              </p>
            </motion.div>

            {/* Section 8 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">8. Prekid korišćenja i suspenzija naloga</h2>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                Odontoa zadržava pravo da suspenduje ili raskine ugovor sa korisnikom u slučaju:
              </p>
              <ul className="text-muted-foreground leading-relaxed font-['Inter'] space-y-2 list-disc list-inside mb-3">
                <li>zloupotrebe platforme ili kršenja ovih uslova</li>
                <li>neplćanja pretplate</li>
                <li>kršenja zakona ili medicinske etike</li>
                <li>pokušaja narušavanja bezbednosti sistema</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed font-['Inter']">
                U slučaju raskida ugovora, podaci korisnika se čuvaju u skladu sa politikom privatnosti i zakonskim obavezama. Korisnik može zatražiti izvoz podataka pre raskida.
              </p>
            </motion.div>

            {/* Section 9 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">9. Ograničenje odgovornosti</h2>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                Softver se pruža „takav kakav jeste" (as-is), bez garancije neprekinutog rada ili odsustva grešaka.
              </p>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                Odontoa nije odgovorna za štetu nastalu:
              </p>
              <ul className="text-muted-foreground leading-relaxed font-['Inter'] space-y-2 list-disc list-inside mb-3">
                <li>pogrešnim unosom podataka od strane korisnika</li>
                <li>gubitkom lozinke ili neovlašćenim pristupom nalogu</li>
                <li>nepoštovanjem zakona ili medicinske etike od strane korisnika</li>
                <li>prekidom internetske veze ili tehničkim problemima na strani korisnika</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed font-['Inter']">
                Ukupna odgovornost Odontoa ograničena je na maksimalno zbir uplata korisnika u poslednjih 6 meseci.
              </p>
            </motion.div>

            {/* Section 10 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">10. Izmene uslova</h2>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                Odontoa zadržava pravo da menja ove uslove korišćenja.
              </p>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                Ažurirana verzija uslova će biti objavljena na ovoj stranici sa datumom poslednje izmene.
              </p>
              <p className="text-muted-foreground leading-relaxed font-['Inter']">
                Dalje korišćenje platforme nakon objave izmenjenih uslova predstavlja prihvatanje novih uslova.
              </p>
            </motion.div>

            {/* Section 11 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">11. Važeće pravo i rešavanje sporova</h2>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                Ovi uslovi korišćenja se tumače i primenjuju u skladu sa pravom Republike Srbije.
              </p>
              <p className="text-muted-foreground leading-relaxed font-['Inter']">
                Za rešavanje svih sporova koji proističu iz ovih uslova, nadležni su sudovi u Beogradu, Republika Srbija.
              </p>
            </motion.div>

            {/* Section 12 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">12. Kontakt</h2>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                Za sva pitanja u vezi uslova korišćenja, možete nas kontaktirati na:
              </p>
              <p className="text-muted-foreground leading-relaxed font-['Inter']">
                <a href="mailto:support@odontoa.com" className="text-[#3267FF] hover:underline">support@odontoa.com</a>
              </p>
            </motion.div>

            {/* Last updated */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="pt-8 mt-12 border-t border-border"
            >
              <p className="text-sm text-muted-foreground font-['Inter']">
                Važi od: 2025
              </p>
              <p className="text-sm text-muted-foreground font-['Inter'] mt-2">
                Poslednje ažuriranje: novembar 2025.
              </p>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

