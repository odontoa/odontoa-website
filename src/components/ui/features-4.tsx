'use client';

import {
  ClipboardList,
  CreditCard,
  Factory,
  LockKeyhole,
  UsersRound,
  Waypoints,
} from 'lucide-react';

export function Features() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
          <h2 className="text-balance text-4xl font-medium lg:text-5xl">
            Vaša ordinacija pod kontrolom
          </h2>
          <p>
            Jedan sistem za raspored, karton, dokumentaciju i naplatu.
          </p>
        </div>

        <div className="relative mx-auto grid max-w-4xl lg:max-w-5xl divide-y sm:divide-x divide-y border *:p-6 sm:*:p-8 lg:*:p-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Waypoints className="size-4 text-foreground" />
              <h3 className="text-lg font-semibold">Jedan tok rada</h3>
            </div>
            <p className="text-base leading-relaxed text-slate-600">
              Karton, termini, terapije i dokumenti povezani su kroz isti proces, bez preskakanja
              između alata.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <UsersRound className="size-4 text-foreground" />
              <h3 className="text-lg font-semibold">Timski rad</h3>
            </div>
            <p className="text-base leading-relaxed text-slate-600">
              Asistenti, doktori i recepcija rade u istom sistemu, sa jasnom evidencijom promena i
              statusa.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CreditCard className="size-4 text-foreground" />
              <h3 className="text-lg font-semibold tracking-tight">
                Finansije pod kontrolom
              </h3>
            </div>
            <p className="text-base leading-relaxed text-slate-600">
              Računi, predračuni, naplate i dugovanja u realnom vremenu, uz pregled po doktoru,
              stolici i periodu.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Factory className="size-4 text-foreground" />
              <h3 className="text-lg font-semibold tracking-tight">
                Saradnja sa tehnikom
              </h3>
            </div>
            <p className="text-base leading-relaxed text-slate-600">
              Jednostavna razmena informacija i zahteva sa zubnom tehnikom, sa istorijom i vezom ka
              pacijentu.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ClipboardList className="size-4 text-foreground" />
              <h3 className="text-lg font-semibold tracking-tight">
                Klinička dokumentacija
              </h3>
            </div>
            <p className="text-base leading-relaxed text-slate-600">
              Sve što je važno tokom pregleda ostaje uz pacijenta: terapije, beleške, fotografije i
              RTG/DICOM.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <LockKeyhole className="size-4 text-foreground" />
              <h3 className="text-lg font-semibold tracking-tight">
                Usklađenost i bezbednost
              </h3>
            </div>
            <p className="text-base leading-relaxed text-slate-600">
              Podaci su uredni, pregledni i spremni za kontrolu, uz pouzdano čuvanje i jasna pravila
              pristupa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
