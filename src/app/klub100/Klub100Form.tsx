'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { trackEvent } from '@/lib/analytics/events';

/* Lead za Klub 100: samo email. Izvor "klub100" postavlja ruta na serveru
   (src/app/api/klub100/route.ts); ovde sluzi samo za GA. Uspeh se prikazuje tek
   kad ruta potvrdi da je interni mejl poslat. */
const ENDPOINT = '/api/klub100';
const SOURCE = 'klub100';

/* Isti regex kao u API rutama (src/app/api/demo/route.ts). */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SEND_ERROR =
  'Slanje nije uspelo. Pokušajte ponovo ili nam pišite na info@odontoa.com.';

export default function Klub100Form() {
  const [email, setEmail] = useState('');
  /* Greska polja (field) oznacava input kao neispravan; greska slanja (mreza, server) ne. */
  const [error, setError] = useState<{ text: string; field: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const successRef = useRef<HTMLHeadingElement>(null);
  /* disabled dugme ne stize da se renderuje izmedju dva brza klika; ref je sinhron. */
  const inFlight = useRef(false);

  /* Forma nestaje posle uspeha, pa fokus prelazi na potvrdu (citac ekrana je procita). */
  useEffect(() => {
    if (isDone) successRef.current?.focus();
  }, [isDone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inFlight.current) return;
    const value = email.trim();
    if (!EMAIL_PATTERN.test(value)) {
      setError({ text: 'Unesite ispravnu email adresu.', field: true });
      return;
    }

    inFlight.current = true;
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value }),
      });
      if (response.ok) {
        trackEvent('generate_lead', { lead_source: SOURCE, page_path: '/klub100' });
        setIsDone(true);
      } else {
        setError(
          response.status === 400
            ? { text: 'Proverite email adresu i pokušajte ponovo.', field: true }
            : { text: SEND_ERROR, field: false }
        );
      }
    } catch {
      setError({ text: SEND_ERROR, field: false });
    } finally {
      inFlight.current = false;
      setIsSubmitting(false);
    }
  };

  if (isDone) {
    return (
      <div className="k100-form k100-form--done" role="status">
        <span className="k100-form__done-icon" aria-hidden>
          <Check size={22} strokeWidth={2.5} />
        </span>
        <h2 ref={successRef} tabIndex={-1} className="k100-form__title">
          Hvala!
        </h2>
        <p className="k100-form__body">
          Vaša prijava za Klub 100 je zabeležena. Javićemo Vam se sa sledećim koracima.
        </p>
      </div>
    );
  }

  return (
    <form className="k100-form" onSubmit={handleSubmit} noValidate>
      <h2 className="k100-form__title">Zainteresovani ste?</h2>
      <p className="k100-form__body">
        Ostavite email adresu i javićemo Vam se da zajedno podesimo nalog i odgovorimo na sva
        pitanja.
      </p>

      <label htmlFor="k100-email" className="k100-form__label">
        Email adresa
      </label>
      <input
        id="k100-email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="ime@ordinacija.rs"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (error) setError(null);
        }}
        aria-invalid={error?.field ? true : undefined}
        aria-describedby={error ? 'k100-email-error' : 'k100-email-help'}
        className="k100-form__input"
      />
      {error && (
        <p id="k100-email-error" className="k100-form__error" role="alert">
          {error.text}
        </p>
      )}

      <button type="submit" className="k100-form__submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span className="k100-form__spinner" aria-hidden />
            Slanje...
          </>
        ) : (
          'Želim Klub 100 ponudu'
        )}
      </button>

      <p id="k100-email-help" className="k100-form__help">
        Bez obaveze. Samo ćemo Vam se javiti da dogovorimo sledeći korak.
      </p>
      <p className="k100-form__privacy">
        <Link href="/politika-privatnosti">Politika privatnosti</Link>
      </p>
    </form>
  );
}
