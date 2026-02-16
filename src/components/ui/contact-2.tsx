'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { analytics } from '@/lib/analytics/events';

export interface Contact2Props {
  title?: string;
  description?: string;
  phone?: string;
  email?: string;
  web?: { label: string; url: string };
}

export const Contact2 = ({
  title = 'Kontakt',
  description = 'Dostupni smo za pitanja, povratne informacije ili saradnju. Javite nam se — rado ćemo pomoći!',
  phone = '+381 60 123 4567',
  email = 'info@odontoa.info',
  web = { label: 'odontoa.com', url: 'https://odontoa.com' },
}: Contact2Props) => {
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

  return (
    <section className="py-20 md:py-32 font-sans">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-screen-xl flex-col justify-between gap-10 lg:flex-row lg:gap-20">
          <div className="mx-auto flex max-w-sm flex-col justify-between gap-5">
            <div className="text-center lg:text-left">
              <h1 className="font-manrope mb-2 text-4xl font-semibold text-foreground lg:mb-1 lg:text-5xl xl:text-6xl">
                {title}
              </h1>
              <p className="text-muted-foreground/80 text-base leading-relaxed">{description}</p>
            </div>
            <div className="mx-auto w-fit lg:mx-0 -mt-1">
              <h3 className="font-manrope mb-4 text-center text-xl font-semibold text-foreground lg:text-left lg:text-2xl">
                Kontakt podaci
              </h3>
              <ul className="ml-4 list-disc space-y-1 text-muted-foreground">
                <li>
                  <span className="font-semibold text-foreground">Telefon: </span>
                  {phone}
                </li>
                <li>
                  <span className="font-semibold text-foreground">Email: </span>
                  <a href={`mailto:${email}`} className="underline hover:text-primary">
                    {email}
                  </a>
                </li>
                <li>
                  <span className="font-semibold text-foreground">Web: </span>
                  <a href={web.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                    {web.label}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mx-auto flex max-w-screen-md flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-lg md:p-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="firstname" className="text-foreground">Ime</Label>
                  <Input
                    type="text"
                    id="firstname"
                    placeholder="Ime"
                    value={form.firstname}
                    onChange={(e) => setForm((prev) => ({ ...prev, firstname: e.target.value }))}
                    required
                    className="bg-background border-border"
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="lastname" className="text-foreground">Prezime</Label>
                  <Input
                    type="text"
                    id="lastname"
                    placeholder="Prezime"
                    value={form.lastname}
                    onChange={(e) => setForm((prev) => ({ ...prev, lastname: e.target.value }))}
                    required
                    className="bg-background border-border"
                  />
                </div>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="vas.email@primer.com"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  required
                  className="bg-background border-border"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="phone" className="text-foreground">Telefon</Label>
                <Input
                  type="tel"
                  id="phone"
                  placeholder="+381 60 123 4567"
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  required
                  className="bg-background border-border"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="clinic" className="text-foreground">Naziv ordinacije</Label>
                <Input
                  type="text"
                  id="clinic"
                  placeholder="Naziv vaše ordinacije"
                  value={form.clinic}
                  onChange={(e) => setForm((prev) => ({ ...prev, clinic: e.target.value }))}
                  required
                  className="bg-background border-border"
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="message" className="text-foreground">Poruka</Label>
                <Textarea
                  id="message"
                  placeholder="Napišite šta vas zanima - demo, cene, tehnička podrška ili saradnja…"
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  required
                  rows={5}
                  className="min-h-[120px] resize-none bg-background border-border placeholder:text-muted-foreground"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="pillPrimary"
                size="pill"
                className="w-full font-semibold disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Slanje...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 text-white" />
                    Pošalji poruku
                  </>
                )}
              </Button>
              {submitMessage && (
                <div
                  className={`rounded-lg border p-3 text-sm ${
                    submitMessage.type === 'success'
                      ? 'border-green-200 bg-green-50 text-green-800'
                      : 'border-red-200 bg-red-50 text-red-800'
                  }`}
                >
                  {submitMessage.text}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
