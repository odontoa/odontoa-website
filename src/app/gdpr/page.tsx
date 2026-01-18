'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern'
import { cn } from '@/lib/utils'

export default function GDPRPage() {
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
              GDPR izjava
            </h1>
            <p className="text-lg text-muted-foreground font-['Inter']">
              Informacije o obradi podataka u skladu sa Opštom uredbom EU o zaštiti podataka (GDPR) i Zakonom o zaštiti podataka o ličnosti Republike Srbije (ZZPL).
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
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">1. Uloge u obradi</h2>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                U kontekstu obrade podataka pacijenata:
              </p>
              <ul className="text-muted-foreground leading-relaxed font-['Inter'] space-y-2 list-disc ml-6">
                <li><strong className="text-foreground">Ordinacija (korisnik aplikacije)</strong> = rukovalac podataka (data controller).</li>
                <li><strong className="text-foreground">Odontoa</strong> = obrađivač podataka (data processor).</li>
              </ul>
            </motion.div>

            {/* Section 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">2. Obaveze Odontoa</h2>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                Odontoa se obavezuje da:
              </p>
              <ul className="text-muted-foreground leading-relaxed font-['Inter'] space-y-2 list-disc ml-6">
                <li>obrađuje podatke samo po instrukcijama ordinacije.</li>
                <li>obezbeđuje tehničke i organizacione mere zaštite (enkripcija, kontrola pristupa, backup).</li>
                <li>ne koristi podatke pacijenata u sopstvene svrhe.</li>
                <li>odmah obavesti korisnika u slučaju bezbednosnog incidenta ili curenja podataka.</li>
              </ul>
            </motion.div>

            {/* Section 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">3. Prava pacijenata</h2>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                Pacijenti imaju pravo da od svoje ordinacije zahtevaju:
              </p>
              <ul className="text-muted-foreground leading-relaxed font-['Inter'] space-y-2 list-disc ml-6">
                <li>brisanje podataka.</li>
                <li>prenos podataka drugom pružaocu usluge.</li>
                <li>informacije o svrsi obrade i periodu čuvanja.</li>
              </ul>
            </motion.div>

            {/* Section 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-3xl font-semibold text-foreground mb-4 font-['Poppins']">4. Lokacija i prenos podataka</h2>
              <p className="text-muted-foreground leading-relaxed font-['Inter'] mb-3">
                Podaci se čuvaju u EU i Srbiji. U slučaju prenosa podataka van EU, primenjuju se standardne ugovorne klauzule EU i ZZPL.
              </p>
            </motion.div>

            {/* Last updated */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
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

