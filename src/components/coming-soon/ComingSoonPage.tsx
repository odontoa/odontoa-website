'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export default function ComingSoonPage() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState('loading');
    setErrorMessage('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'coming_soon' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState('error');
        setErrorMessage(data.message || 'Nešto nije u redu. Pokušajte ponovo.');
        return;
      }
      setState('success');
      setEmail('');
    } catch {
      setState('error');
      setErrorMessage('Greška u mreži. Pokušajte ponovo.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      <div
        className={cn(
          'absolute inset-0 pointer-events-none',
          'bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.08),transparent)]'
        )}
      />
      <main className="relative z-10 w-full max-w-lg text-center">
        <h1 className="font-manrope text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Odontoa stiže uskoro.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-md mx-auto">
          CRM i platforma za upravljanje stomatološkom ordinacijom. Manje administracije, više
          vremena za pacijente.
        </p>

        <ul className="mt-8 space-y-2 text-left max-w-sm mx-auto text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5" aria-hidden>•</span>
            <span>Sve ključne informacije na jednom mestu.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5" aria-hidden>•</span>
            <span>Brža organizacija tima i termina.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5" aria-hidden>•</span>
            <span>Jasniji uvid u rad i rezultate ordinacije.</span>
          </li>
        </ul>

        <div className="mt-10 p-6 rounded-xl border border-border bg-card shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Unesite email (dobijate prvi pristup)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={state === 'loading' || state === 'success'}
              required
              className="w-full"
              autoComplete="email"
            />
            <p className="text-xs text-muted-foreground text-left">
              Bez spama. Javljamo se samo kada krenu prve ordinacije.
            </p>
            <Button
              type="submit"
              disabled={state === 'loading' || state === 'success'}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {state === 'loading' ? 'Šaljem...' : state === 'success' ? 'Poslato' : 'Prijavite interesovanje'}
            </Button>
            {state === 'success' && (
              <p className="text-sm text-green-600 dark:text-green-400">Hvala! Javićemo vam se.</p>
            )}
            {state === 'error' && errorMessage && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            Želim demo čim bude spremno — pišite na{' '}
            <a href="mailto:kontakt@odontoa.com" className="text-primary underline underline-offset-2">
              kontakt@odontoa.com
            </a>
          </p>
        </div>

        <footer className="mt-14 text-sm text-muted-foreground space-y-1">
          <p>
            Kontakt:{' '}
            <a href="mailto:kontakt@odontoa.com" className="text-foreground underline underline-offset-2">
              kontakt@odontoa.com
            </a>
          </p>
          <p className="max-w-md mx-auto">
            Gradimo Odontoa za ordinacije u Srbiji. Prva verzija je u završnoj pripremi.
          </p>
        </footer>
      </main>
    </div>
  );
}
