'use client';

import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Clock, Stethoscope, UserRound, X } from "lucide-react";

const APP_URL = "https://app.odontoa.com";

/* "Prijavi se" iz navigacije: izbor uloge. Doktor ide u aplikaciju (kao ranije direktan
   link), pacijent dobija poruku da je portal za pacijente u izradi. Ostatak sajta se
   zamucuje preko overlay-a. */
const LoginChoiceDialog = ({ trigger }: { trigger: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'choice' | 'patient'>('choice');

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setView('choice');
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          style={{ background: 'rgba(6,11,19,0.32)' }}
        />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-32px)] max-w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-3xl border p-6 shadow-2xl duration-200 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:p-7"
          style={{ background: '#ffffff', borderColor: '#e9ebf1', color: '#363d4f' }}
        >
          <DialogPrimitive.Close
            aria-label="Zatvori"
            className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full opacity-60 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2"
          >
            <X className="size-4" />
          </DialogPrimitive.Close>

          {view === 'choice' ? (
            <>
              <DialogPrimitive.Title className="text-xl font-semibold tracking-tight" style={{ color: '#0f1729' }}>
                Prijavi se
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-1.5 text-sm" style={{ color: '#6b7280' }}>
                Izaberi kako pristupaš Odontoi.
              </DialogPrimitive.Description>

              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleOpenChange(false)}
                  className="group flex items-center gap-4 rounded-2xl border p-4 transition-colors hover:border-[#6e51e0] focus:outline-none focus-visible:border-[#6e51e0]"
                  style={{ borderColor: '#e9ebf1', textDecoration: 'none', color: 'inherit' }}
                >
                  <OptionIcon><Stethoscope className="size-5" /></OptionIcon>
                  <span className="flex-1">
                    <span className="block text-[15px] font-semibold" style={{ color: '#0f1729' }}>Doktor</span>
                    <span className="block text-[13px]" style={{ color: '#6b7280' }}>Prijava u aplikaciju za ordinaciju</span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: '#6e51e0' }} />
                </a>

                <button
                  type="button"
                  onClick={() => setView('patient')}
                  className="group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors hover:border-[#6e51e0] focus:outline-none focus-visible:border-[#6e51e0]"
                  style={{ borderColor: '#e9ebf1' }}
                >
                  <OptionIcon><UserRound className="size-5" /></OptionIcon>
                  <span className="flex-1">
                    <span className="flex items-center gap-2 text-[15px] font-semibold" style={{ color: '#0f1729' }}>
                      Pacijent
                      <SoonBadge />
                    </span>
                    <span className="block text-[13px]" style={{ color: '#6b7280' }}>Portal za pacijente</span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: '#6e51e0' }} />
                </button>
              </div>
            </>
          ) : (
            <>
              <OptionIcon><Clock className="size-5" /></OptionIcon>
              <DialogPrimitive.Title className="mt-4 text-xl font-semibold tracking-tight" style={{ color: '#0f1729' }}>
                Portal za pacijente stiže uskoro
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-2 text-sm leading-relaxed" style={{ color: '#6b7280' }}>
                Radimo na portalu za pacijente i online zakazivanju. Do tada, za termine i
                pitanja obrati se direktno svojoj ordinaciji.
              </DialogPrimitive.Description>

              <button
                type="button"
                onClick={() => setView('choice')}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium"
                style={{ color: '#6e51e0' }}
              >
                <ArrowLeft className="size-4" />
                Nazad
              </button>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

const OptionIcon = ({ children }: { children: React.ReactNode }) => (
  <span
    className="flex size-11 shrink-0 items-center justify-center rounded-xl"
    style={{ background: 'rgba(110,81,224,0.08)', color: '#6e51e0' }}
  >
    {children}
  </span>
);

const SoonBadge = () => (
  <span
    className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
    style={{ background: 'rgba(110,81,224,0.08)', color: '#6e51e0' }}
  >
    Uskoro
  </span>
);

export default LoginChoiceDialog;
