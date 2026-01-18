'use client'

import * as React from 'react'

import { Card } from '@/components/ui/card'

import { Button } from '@/components/ui/button'

import {

  ArrowUp,

  CalendarCheck,

  Globe,

  Play,

  Plus,

  Signature,

  Clock,

  Users,

  BarChart3,

  Receipt,

  HeadphonesIcon,

  Stethoscope,

  FileText,

} from 'lucide-react'

import Image from 'next/image'

const MESCHAC_AVATAR =

  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop'

const BERNARD_AVATAR =

  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop'

const THEO_AVATAR =

  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop'

const GLODIE_AVATAR =

  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop'

const featureCardBase =

  'group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#F1F3F5] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md'

const illustrationCardBase =

  'mt-6 aspect-video translate-y-3 rounded-xl border border-[#EEF2F7] bg-gradient-to-br from-[#F5F8FF] to-[#FBFDFF] p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-transform duration-200 group-hover:translate-y-0'

export default function FeaturesSection() {

  return (

    <section className="w-full bg-white py-20">

      <div className="mx-auto w-full max-w-[1240px] px-[10px]">

        {/* Header */}

        <div className="mb-12 text-center">

          <div className="mb-4">

            <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#3267FF]">

              Odontoa moduli

            </div>

          </div>

          <h2 
            className="mb-6 text-4xl tracking-tight text-[#000A2D] md:text-5xl"
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 800
            }}
          >

            Sve što vam treba na jednom mestu

          </h2>

          <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#636571] mb-8">

            Od digitalnih kartona do analitike – Odontoa povezuje sve ključne

            procese u ordinaciji tako da tim radi brže, a pacijenti dobijaju

            bolje iskustvo.

          </p>

        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

          {/* Digitalni kartoni */}

          <Card variant="soft" className={featureCardBase}>

            <div className="flex flex-col gap-3 min-h-[140px]">

              <div className="flex size-9 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#3267FF]">

                <Stethoscope className="size-4" />

              </div>

              <h3 className="text-xl font-semibold text-[#000A2D] md:text-[22px]">

                Digitalni kartoni

              </h3>

              <p className="text-sm leading-relaxed text-[#636571]">

                Kompletan medicinski i finansijski karton pacijenta, uvek

                dostupan za ceo tim.

              </p>

            </div>

            <AppointmentIllustration />

          </Card>

          {/* Automatsko zakazivanje */}

          <Card variant="soft" className={featureCardBase}>

            <div className="flex flex-col gap-3 min-h-[140px]">

              <div className="flex size-9 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#3267FF]">

                <CalendarCheck className="size-4" />

              </div>

              <h3 className="text-xl font-semibold text-[#000A2D] md:text-[22px]">

                Automatsko zakazivanje

              </h3>

              <p className="text-sm leading-relaxed text-[#636571]">

                Automatski SMS i email podsetnici – manje propuštenih termina,

                manje poziva i manje stresa za osoblje.

              </p>

            </div>

            <ScheduleIllustration />

          </Card>

          {/* Radni nalozi */}

          <Card variant="soft" className={featureCardBase}>

            <div className="flex flex-col gap-3 min-h-[140px]">

              <div className="flex size-9 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#3267FF]">

                <FileText className="size-4" />

              </div>

              <h3 className="text-xl font-semibold text-[#000A2D] md:text-[22px]">

                Radni nalozi

              </h3>

              <p className="text-sm leading-relaxed text-[#636571]">

                Kreirajte i pratite radne naloge po pacijentu, tretmanu ili

                laboratoriji – sve je jasno i pregledno.

              </p>

            </div>

            <div className="mask-b-from-50 -mx-2 -mt-1 px-2 pt-1">

              <WorkOrderIllustration />

            </div>

          </Card>

          {/* Analitika */}

          <Card variant="soft" className={featureCardBase}>

            <div className="flex flex-col gap-3 min-h-[140px]">

              <div className="flex size-9 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#3267FF]">

                <BarChart3 className="size-4" />

              </div>

              <h3 className="text-xl font-semibold text-[#000A2D] md:text-[22px]">Analitika</h3>

              <p className="text-sm leading-relaxed text-[#636571]">

                Ključni pokazatelji po doktoru, stolici i tretmanu, sa jasnim

                grafikonima i izveštajima za donošenje boljih odluka.

              </p>

            </div>

            <AnalyticsIllustration />

          </Card>

          {/* Fakturisanje */}

          <Card variant="soft" className={featureCardBase}>

            <div className="flex flex-col gap-3 min-h-[140px]">

              <div className="flex size-9 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#3267FF]">

                <Receipt className="size-4" />

              </div>

              <h3 className="text-xl font-semibold text-[#000A2D] md:text-[22px]">Fakturisanje</h3>

              <p className="text-sm leading-relaxed text-[#636571]">

                Praćenje profitabilnosti po tretmanima i automatsko generisanje

                faktura bez dodatnog rada u Excelu.

              </p>

            </div>

            <InvoiceIllustration />

          </Card>

          {/* Podrška */}

          <Card variant="soft" className={featureCardBase}>

            <div className="flex flex-col gap-3 min-h-[140px]">

              <div className="flex size-9 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#3267FF]">

                <HeadphonesIcon className="size-4" />

              </div>

              <h3 className="text-xl font-semibold text-[#000A2D] md:text-[22px]">Podrška</h3>

              <p className="text-sm leading-relaxed text-[#636571]">

                Brza podrška na srpskom jeziku – pomoć pri migraciji, obuci i

                svakodnevnom radu sa Odontoa platformom.

              </p>

            </div>

            <div className="mask-b-from-50 -mx-2 -mt-1 px-2 pt-1">

              <SupportIllustration />

            </div>

          </Card>

        </div>

      </div>

    </section>

  )

}

const AppointmentIllustration = () => {

  return (

    <Card

      aria-hidden

      className="mt-6 aspect-video translate-y-3 rounded-xl border border-[#EEF2F7] bg-gradient-to-br from-[#F5F8FF] to-[#FBFDFF] p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-transform duration-200 group-hover:translate-y-0"

    >

      <div className="mb-1 text-[11px] font-medium text-[#94A3B8]">

        Pregled pacijenta

      </div>



      <div className="mb-3 flex items-center justify-between text-[11px] text-[#A1AECF]">

        <span>Kontrolni pregled</span>

        <span>14:30 – 15:45</span>

      </div>



      <div className="mb-3 flex -space-x-1.5">

        {[

          { src: MESCHAC_AVATAR, alt: 'Pacijent 1' },

          { src: BERNARD_AVATAR, alt: 'Pacijent 2' },

          { src: THEO_AVATAR, alt: 'Pacijent 3' },

          { src: GLODIE_AVATAR, alt: 'Pacijent 4' },

        ].map((avatar, index) => (

          <div

            key={index}

            className="size-7 rounded-full border bg-background p-0.5 shadow shadow-zinc-950/5"

          >

            <img

              className="aspect-square rounded-full object-cover"

              src={avatar.src}

              alt={avatar.alt}

              height={28}

              width={28}

            />

          </div>

        ))}

      </div>



      <div className="h-2 w-1/3 rounded-full bg-[#D5E4FF]" />

    </Card>

  )

}

const ScheduleIllustration = () => {

  return (

    <Card

      aria-hidden

      className="mt-6 aspect-video w-4/5 translate-y-3 rounded-xl border border-[#EEF2F7] bg-gradient-to-br from-[#F5F8FF] to-[#FBFDFF] p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-transform duration-200 group-hover:translate-y-0"

    >

      {/* Doktor avatar + ime + vreme (neutralno) */}

      <div className="mb-3 flex items-center gap-2">

        <div className="size-6 rounded-full border bg-background p-0.5 shadow shadow-zinc-950/5">

          <img

            className="aspect-square rounded-full object-cover"

            src={MESCHAC_AVATAR}

            alt="Doktor"

            height={24}

            width={24}

          />

        </div>



        <span className="text-sm font-medium text-[#636571]">Dr. Milenković</span>



        <span className="text-xs text-[#94A3B8]">2m</span>

      </div>



      {/* Neutralne linije poruke */}

      <div className="ml-8 space-y-2">

        <div className="h-2 w-3/4 rounded-full bg-[#3267FF]/10" />

        <div className="h-2 w-1/2 rounded-full bg-[#3267FF]/10" />

        <div className="h-2 w-2/3 rounded-full bg-[#3267FF]/10" />

      </div>



      {/* Mala ikonica sata na dnu, vizuelni akcenat */}

      <div className="ml-8 mt-3 flex items-center gap-2">

        <Clock className="size-5 text-[#3267FF]/70" />

        <span className="text-xs text-[#636571]">zakazano</span>

      </div>

    </Card>

  )

}

const WorkOrderIllustration = () => {

  return (

    <Card

      aria-hidden

      className="mt-6 aspect-video translate-y-3 rounded-xl border border-[#EEF2F7] bg-gradient-to-br from-[#F5F8FF] to-[#FBFDFF] p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-transform duration-200 group-hover:translate-y-0"

    >

      {/* kratki neutralan tekst u vrhu */}

      <div className="mb-3 text-[11px] font-medium text-[#94A3B8]">

        Pregled naloga

      </div>



      {/* apstraktna lista naloga */}

      <div className="space-y-2">

        {[0, 1, 2].map((i) => (

          <div key={i} className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <span className="inline-block size-1.5 rounded-full bg-[#3267FF]/70" />

              <div className="h-2 w-24 rounded-full bg-white/60" />

            </div>

            <div className="h-2 w-12 rounded-full bg-[#D1E4FF]" />

          </div>

        ))}

      </div>



      {/* donji deo – dugmići koje već imaš u ovoj kartici */}

      <div className="mt-4 flex items-center justify-between">

        <div className="flex gap-2">

          <Button

            variant="outline"

            size="icon"

            className="size-7 rounded-2xl border-[#EEEEEE] bg-transparent shadow-none"

          >

            <Plus className="text-[#3267FF]" />

          </Button>

          <Button

            variant="outline"

            size="icon"

            className="size-7 rounded-2xl border-[#EEEEEE] bg-transparent shadow-none"

          >

            <Globe className="text-[#3267FF]" />

          </Button>

        </div>



        <Button

          size="icon"

          className="size-7 rounded-2xl bg-[#3267FF] hover:bg-[#3267FF]/90"

        >

          <ArrowUp strokeWidth={3} className="text-white" />

        </Button>

      </div>

    </Card>

  )

}

const AnalyticsIllustration = () => {

  // Podaci za bar chart - trend odzdo ka gore
  const barHeights = [35, 50, 65, 80, 95] // visine stubića u procentima

  return (

    <Card

      aria-hidden

      className="mt-6 aspect-video translate-y-3 rounded-xl border border-[#EEF2F7] bg-gradient-to-br from-[#F6F9FF] to-[#FBFDFF] p-4 shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-transform duration-200 group-hover:translate-y-0"

    >

      {/* mali label */}

      <div className="mb-3 text-[11px] font-medium text-[#94A3B8]">

        Pregled metrika

      </div>



      {/* okvir grafa sa bar chartom i linijom */}

      <div className="relative flex h-20 items-end rounded-lg bg-white/60 px-3 pb-2 pt-3">

        {/* baseline linija */}

        <div className="relative flex h-full w-full flex-col justify-end">

          <div className="mb-1 h-px w-full rounded-full bg-[#E2E8F0]" />



          {/* stubići odozdo naviše - koriste boje kao na kartici za fakturisanje */}

          <div className="relative flex items-end gap-2">

            {barHeights.map((height, index) => (

              <div

                key={index}

                className="relative flex-1 rounded-full bg-[#D5E4FF]"

                style={{ height: `${height}%` }}

              />

            ))}

          </div>



          {/* SVG linija koja ide preko stubića odozdo ka gore */}
          <svg
            className="absolute inset-0 h-full w-full"
            style={{ pointerEvents: 'none' }}
          >
            {/* Linija koja povezuje vrhove stubića */}
            <polyline
              points={barHeights.map((height, index) => {
                // Izračunaj x poziciju (centar svakog stubića)
                const totalBars = barHeights.length
                const barWidthPercent = 100 / totalBars
                const x = (index + 0.5) * barWidthPercent
                // Izračunaj y poziciju (vrh stubića)
                const y = 100 - height
                return `${x},${y}`
              }).join(' ')}
              fill="none"
              stroke="#3267FF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.7"
            />

            {/* Tačke na vrhovima stubića */}
            {barHeights.map((height, index) => {
              const totalBars = barHeights.length
              const barWidthPercent = 100 / totalBars
              const x = (index + 0.5) * barWidthPercent
              const y = 100 - height
              return (
                <circle
                  key={index}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="2.5"
                  fill="#3267FF"
                  opacity="0.9"
                />
              )
            })}
          </svg>

        </div>

      </div>

    </Card>

  )

}

const InvoiceIllustration = () => {

  return (

    <Card

      aria-hidden

      className="mt-6 aspect-video translate-y-3 rounded-xl border border-[#EEF2F7] bg-gradient-to-br from-[#F5F8FF] to-[#FBFDFF] p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-transform duration-200 group-hover:translate-y-0"

    >

      {/* header fakturnog pregleda – ikonica + tekst */}

      <div className="mb-3 flex items-center gap-2">

        <div className="flex size-7 items-center justify-center rounded-full bg-white/70">

          <Receipt className="size-3 text-[#3267FF]/80" />

        </div>

        <div className="flex-1">

          <span className="text-sm font-medium text-[#636571]">

            Faktura #1234

          </span>

        </div>

      </div>



      {/* srednji deo – par redova kao stavke fakture */}

      <div className="space-y-2.5">

        <div className="flex items-center justify-between">

          <div className="h-2 w-1/2 rounded-full bg-white/70" />

          <div className="h-2 w-12 rounded-full bg-[#D5E4FF]" />

        </div>

        <div className="flex items-center justify-between">

          <div className="h-2 w-2/3 rounded-full bg-white/65" />

          <div className="h-2 w-10 rounded-full bg-[#D5E4FF]" />

        </div>

        <div className="flex items-center justify-between">

          <div className="h-2 w-1/3 rounded-full bg-white/60" />

          <div className="h-2 w-9 rounded-full bg-[#D5E4FF]" />

        </div>

      </div>



      {/* donji deo – naglašena "total" linija bez teksta */}

      <div className="mt-4 h-2.5 w-2/3 rounded-full bg-[#3267FF]/25" />

    </Card>

  )

}

const SupportIllustration = () => {

  return (

    <Card

      aria-hidden

      className="mt-6 aspect-video translate-y-3 rounded-xl border border-[#EEF2F7] bg-gradient-to-br from-[#F5F8FF] to-[#FBFDFF] p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-transform duration-200 group-hover:translate-y-0"

    >

      {/* kratak tekst da poveže sa podrškom */}

      <div className="mb-2 text-[11px] font-medium text-[#94A3B8]">

        Poruka za podršku

      </div>



      {/* header reda – ikonica + kratka linija */}

      <div className="mb-3 flex items-center gap-2">

        <div className="flex size-7 items-center justify-center rounded-full bg-white/70">

          <HeadphonesIcon className="size-3 text-[#3267FF]/80" />

        </div>

        <div className="h-2.5 flex-1 rounded-full bg-[#3267FF]/16" />

      </div>



      {/* dve–tri linije kao poruka/odgovor */}

      <div className="space-y-2">

        <div className="h-2 w-4/5 rounded-full bg-white/75" />

        <div className="h-2 w-2/3 rounded-full bg-white/70" />

        <div className="h-2 w-1/2 rounded-full bg-white/65" />

      </div>

    </Card>

  )

}
