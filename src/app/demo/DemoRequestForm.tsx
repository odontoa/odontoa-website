'use client';

import { useState } from 'react';
import Link from 'next/link';
import { analytics } from '@/lib/analytics/events';

/* Zahtev za demo: ista polja i isti endpoint (/api/demo) kao DemoForm iz ranije
   sekcije #demo na pocetnoj. Poruke su na klijentu u "ti" formi; API se ne menja. */
export default function DemoRequestForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);
    try {
      const response = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        }),
      });
      if (response.ok) {
        setSubmitMessage({
          type: 'success',
          text: 'Hvala! Javljamo ti se u roku od jednog radnog dana da dogovorimo termin.',
        });
        analytics.demoRequest();
        setForm({ name: '', email: '', phone: '' });
      } else {
        const data = await response.json().catch(() => null);
        setSubmitMessage({
          type: 'error',
          text: response.status === 400 && data?.error === 'Neispravan format email adrese'
            ? 'Proveri email adresu i pokušaj ponovo.'
            : 'Slanje nije uspelo. Pokušaj ponovo ili nam piši na info@odontoa.com.',
        });
      }
    } catch {
      setSubmitMessage({
        type: 'error',
        text: 'Slanje nije uspelo. Pokušaj ponovo ili nam piši na info@odontoa.com.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact__card">
      <form onSubmit={handleSubmit} className="contact__form">
        <div className="contact__field">
          <label htmlFor="demo-name" className="contact__label">Ime i prezime</label>
          <input
            type="text"
            id="demo-name"
            placeholder="Ime i prezime"
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
            className="contact__input"
          />
        </div>
        <div className="contact__field">
          <label htmlFor="demo-email" className="contact__label">Email</label>
          <input
            type="email"
            id="demo-email"
            placeholder="ime@ordinacija.rs"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
            className="contact__input"
          />
        </div>
        <div className="contact__field">
          <label htmlFor="demo-phone" className="contact__label">Telefon</label>
          <input
            type="tel"
            id="demo-phone"
            placeholder="Tvoj broj telefona"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            required
            className="contact__input"
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-cta contact__submit">
          {isSubmitting ? (
            <>
              <span className="contact__spinner" aria-hidden />
              Slanje...
            </>
          ) : (
            'Zakaži demo'
          )}
        </button>

        {submitMessage && (
          <div
            role="status"
            className={`contact__status ${submitMessage.type === 'success' ? 'contact__status--success' : 'contact__status--error'}`}
          >
            {submitMessage.text}
          </div>
        )}

        <p className="demo__privacy">
          Tvoji podaci su zaštićeni u skladu sa GDPR regulativom.{' '}
          <Link href="/politika-privatnosti">Politika privatnosti</Link>
        </p>
      </form>
    </div>
  );
}
