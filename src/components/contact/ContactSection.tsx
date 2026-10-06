'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { analytics } from '@/lib/analytics/events';

export interface ContactSectionProps {
  title?: string;
  description?: string;
  phone?: string | null;
  email?: string;
  web?: { label: string; url: string };
}

export const ContactSection = ({
  title = 'Kontakt',
  description = 'Dostupni smo za pitanja, povratne informacije ili saradnju. Javi nam se, rado ćemo pomoći.',
  phone,
  email = 'info@odontoa.com',
  web = { label: 'odontoa.com', url: 'https://odontoa.com' },
}: ContactSectionProps) => {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    clinic: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${form.firstname.trim()} ${form.lastname.trim()}`.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          clinic: form.clinic.trim(),
          subject: 'Kontakt sa sajta',
          message: form.message.trim(),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSubmitMessage({ type: 'success', text: data.message });
        analytics.contactFormSubmit();
        setForm({
          firstname: '',
          lastname: '',
          email: '',
          phone: '',
          clinic: '',
          message: '',
        });
      } else {
        setSubmitMessage({ type: 'error', text: data.error || 'Greška pri slanju poruke.' });
      }
    } catch {
      setSubmitMessage({ type: 'error', text: 'Greška pri slanju poruke. Pokušajte ponovo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* UI u production dizajnu sajta (kontakt.css, --stellar-* tokeni). Polja, validacija
     i slanje su nepromenjeni. */
  return (
    <section className="contact">
      <div className="contact__inner">
        <div>
          <h1 className="contact__title">{title}</h1>
          <p className="contact__lead">{description}</p>

          <h3 className="contact__details-title">Kontakt podaci</h3>
          <dl className="contact__details">
            {/* Telefon se prikazuje tek kad postoji pravi poslovni broj (businessConfig.phone). */}
            {phone && (
              <div className="contact__detail">
                <dt>Telefon</dt>
                <dd><a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a></dd>
              </div>
            )}
            <div className="contact__detail">
              <dt>Email</dt>
              <dd><a href={`mailto:${email}`}>{email}</a></dd>
            </div>
            <div className="contact__detail">
              <dt>Web</dt>
              <dd><a href={web.url} target="_blank" rel="noopener noreferrer">{web.label}</a></dd>
            </div>
          </dl>
        </div>

        <div className="contact__card">
          <form onSubmit={handleSubmit} className="contact__form">
            <div className="contact__row">
                <div className="contact__field">
                  <label htmlFor="firstname" className="contact__label">Ime</label>
                  <input
                    type="text"
                    id="firstname"
                    placeholder="Ime"
                    value={form.firstname}
                    onChange={(e) => setForm((prev) => ({ ...prev, firstname: e.target.value }))}
                    required
                    className="contact__input"
                  />
                </div>
                <div className="contact__field">
                  <label htmlFor="lastname" className="contact__label">Prezime</label>
                  <input
                    type="text"
                    id="lastname"
                    placeholder="Prezime"
                    value={form.lastname}
                    onChange={(e) => setForm((prev) => ({ ...prev, lastname: e.target.value }))}
                    required
                    className="contact__input"
                  />
                </div>
            </div>
                <div className="contact__field">
                  <label htmlFor="email" className="contact__label">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="ime@ordinacija.rs"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    className="contact__input"
                  />
                </div>
                <div className="contact__field">
                  <label htmlFor="phone" className="contact__label">Telefon</label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="Tvoj broj telefona"
                    value={form.phone}
                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                    required
                    className="contact__input"
                  />
                </div>
                <div className="contact__field">
                  <label htmlFor="clinic" className="contact__label">Naziv ordinacije</label>
                  <input
                    type="text"
                    id="clinic"
                    placeholder="Naziv ordinacije"
                    value={form.clinic}
                    onChange={(e) => setForm((prev) => ({ ...prev, clinic: e.target.value }))}
                    required
                    className="contact__input"
                  />
                </div>
            <div className="contact__field">
              <label htmlFor="message" className="contact__label">Poruka</label>
              <textarea
                id="message"
                placeholder="Napiši šta te zanima: demo, cene, tehnička podrška ili saradnja…"
                value={form.message}
                onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                required
                rows={5}
                className="contact__input contact__input--area"
              />
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-cta contact__submit">
              {isSubmitting ? (
                <>
                  <span className="contact__spinner" aria-hidden="true" />
                  Slanje...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Pošalji poruku
                </>
              )}
            </button>
            {submitMessage && (
              <div
                role="status"
                className={`contact__status ${
                  submitMessage.type === 'success' ? 'contact__status--success' : 'contact__status--error'
                }`}
              >
                {submitMessage.text}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};
