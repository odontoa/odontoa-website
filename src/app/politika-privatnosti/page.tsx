'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern'
import { cn } from '@/lib/utils'

export default function PrivacyPolicyPage() {
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
              Politika privatnosti
            </h1>
            <p className="text-lg text-muted-foreground font-['Inter']">
              Ova politika privatnosti objašnjava kako Odontoa prikuplja, čuva i obrađuje podatke o korisnicima i pacijentima, u skladu sa važećim propisima i GDPR regulativom.
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
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">1. Uvod</h2>
              <p className="text-muted-foreground leading-relaxed font-['Inter']">
                Odontoa („mi", „nas", „naš") poštuje vašu privatnost i posvećena je zaštiti podataka koje obrađuje u ime stomatoloških ordinacija. Ova Politika privatnosti objašnjava koje podatke prikupljamo, u koje svrhe ih koristimo, na kojoj pravnoj osnovi, sa kim ih delimo i koja prava imate u vezi sa obradom podataka.
              </p>
            </motion.div>

            {/* Section 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">2. Ko smo mi</h2>
              <p className="text-muted-foreground leading-relaxed font-['Inter']">
                Odontoa je softverska platforma za upravljanje stomatološkim ordinacijama, u vlasništvu preduzetnika OGI I BOKI PR, sa sedištem u Beogradu, Srbija.
              </p>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mt-4">
                U odnosu na podatke o ordinacijama (korisnicima sistema), nastupamo kao rukovalac podataka.
              </p>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mt-4">
                U odnosu na medicinske podatke pacijenata koje ordinacije unose u sistem, nastupamo kao obrađivač podataka u ime te ordinacije.
              </p>
            </motion.div>

            {/* Section 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">3. Koje podatke prikupljamo</h2>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                <strong className="text-foreground">Podaci o korisnicima ordinacije:</strong> ime i prezime, e-mail, broj telefona, naziv ordinacije, adresa, podaci o broju stolica, podaci za naplatu.
              </p>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                <strong className="text-foreground">Podaci o pacijentima (posebne kategorije podataka):</strong> lični podaci (ime, prezime, datum rođenja, kontakt podaci), anamneza, stomatološki karton, terapijski plan, RTG/OPG snimci, fotografije, medicinska dokumentacija.
              </p>
              <p className="text-muted-foreground leading-relaxed font-['Inter']">
                <strong className="text-foreground">Tehnički i analitički podaci:</strong> IP adresa, tip uređaja, pregledač, logovi pristupa, osnovna analitika korišćenja aplikacije.
              </p>
            </motion.div>

            {/* Section 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">4. Svrha obrade</h2>
              <ul className="text-muted-foreground leading-relaxed font-['Inter'] space-y-2 list-disc ml-6">
                <li>pružanje usluge digitalne kartoteke i upravljanja ordinacijom</li>
                <li>vođenje termina i online zakazivanja</li>
                <li>slanje SMS i email podsetnika pacijentima</li>
                <li>finansijsko praćenje rada ordinacije</li>
                <li>tehnička podrška i unapređenje sistema</li>
                <li>ispunjavanje zakonskih obaveza ordinacije</li>
              </ul>
            </motion.div>

            {/* Section 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">5. Pravna osnova obrade (GDPR)</h2>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                Obradu podataka vršimo na osnovu:
              </p>
              <ul className="text-muted-foreground leading-relaxed font-['Inter'] space-y-2 list-disc ml-6">
                <li>izvršenje ugovora sa ordinacijom,</li>
                <li>ispunjavanje zakonskih obaveza,</li>
                <li>legitimni interes (bezbednost sistema, sprečavanje zloupotreba),</li>
                <li>izričita saglasnost pacijenata za obradu zdravstvenih podataka, u meri u kojoj je to potrebno prema važećim propisima.</li>
              </ul>
            </motion.div>

            {/* Section 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">6. Backup i bezbednost podataka</h2>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                Odontoa vrši automatski backup podataka dva puta dnevno.
              </p>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                Podaci se čuvaju na serverima u EU, enkriptovani u tranzitu i u mirovanju.
              </p>
              <p className="text-muted-foreground leading-relaxed font-['Inter']">
                Pristup podacima je strogo ograničen i logovan, a pristup imaju samo ovlašćena lica u svrhu održavanja sistema i podrške.
              </p>
            </motion.div>

            {/* Section 7 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">7. Deljenje podataka</h2>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                Podatke delimo sa:
              </p>
              <ul className="text-muted-foreground leading-relaxed font-['Inter'] space-y-2 list-disc list-inside mb-4">
                <li>hosting provajderima i pružaocima IT usluga,</li>
                <li>integracijama (RTG uređaji, laboratorije, računovodstveni softver),</li>
                <li>nadležnim organima kada je to zakonski obavezno.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed font-['Inter']">
                Ne prodajemo podatke trećim licima.
              </p>
            </motion.div>

            {/* Section 8 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">8. Vaša prava</h2>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                Imate sledeća prava u vezi sa obradom podataka:
              </p>
              <ul className="text-muted-foreground leading-relaxed font-['Inter'] space-y-2 list-disc list-inside mb-4">
                <li>pravo na uvid</li>
                <li>pravo na ispravku</li>
                <li>pravo na brisanje</li>
                <li>pravo na ograničenje obrade</li>
                <li>pravo na prenosivost</li>
                <li>pravo na prigovor</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed font-['Inter']">
                Zahtev možete poslati na: <a href="mailto:support@odontoa.com" className="text-[#3267FF] hover:underline">support@odontoa.com</a>.
              </p>
            </motion.div>

            {/* Section 9 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">9. Rok čuvanja podataka</h2>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                Korisnički podaci se čuvaju do deaktivacije naloga.
              </p>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                Medicinski podaci se čuvaju do zahteva ordinacije ili u skladu sa zakonskim rokovima.
              </p>
              <p className="text-muted-foreground leading-relaxed font-['Inter']">
                Backup kopije se čuvaju do 30 dana.
              </p>
            </motion.div>

            {/* Section 10 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">10. Kolačići i analitika</h2>
              <p className="text-muted-foreground leading-relaxed font-['Inter']">
                Koristimo kolačiće za login, sigurnost sesije i osnovnu analitiku, bez prodaje ili targetiranog oglašavanja.
              </p>
            </motion.div>

            {/* Section 11 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">11. Izmene ove politike</h2>
              <p className="text-muted-foreground leading-relaxed font-['Inter']">
                Ova politika se povremeno ažurira. Poslednja verzija će biti objavljena na ovoj stranici sa datumom ažuriranja.
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
                Za sva pitanja u vezi privatnosti, možete nas kontaktirati na:
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

