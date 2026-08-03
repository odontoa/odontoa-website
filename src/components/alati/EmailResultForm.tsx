"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { analytics } from "@/lib/analytics/events";
import type { ScoreResult } from "./scoring";
import type { ProfileId } from "./quiz-data";

interface EmailResultFormProps {
  score: ScoreResult;
  profile: ProfileId;
  bandLabel: string;
  profileLabel: string;
}

export default function EmailResultForm({
  score,
  profile,
  bandLabel,
  profileLabel,
}: EmailResultFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/quiz-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          totalScore: score.totalScore,
          band: score.band,
          bandLabel,
          profile,
          profileLabel,
          categories: score.categories.map((c) => ({
            id: c.id,
            label: c.label,
            percent: c.percent,
          })),
          weakestCategories: score.weakestCategories,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: data.message ?? "Rezultat je poslat na vaš email.",
        });
        analytics.quizEmailCapture(score.totalScore, profile);
        setEmail("");
      } else {
        setMessage({
          type: "error",
          text: data.error ?? "Greška pri slanju. Pokušajte ponovo.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Greška pri slanju. Pokušajte ponovo kasnije.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="alati-email-form">
      <h3 className="alati-email-form__title">Sačuvajte rezultat</h3>
      <p className="alati-email-form__body">
        Pošaljite rezultat sebi na email i podelite ga sa timom kada budete
        planirali sledeće korake.
      </p>
      <form onSubmit={handleSubmit} className="alati-email-form__form">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Vaš email"
          aria-label="Email adresa"
          className="alati-email-form__input"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting || !email}
          className="alati-email-form__button"
        >
          {isSubmitting ? (
            <span>Slanje...</span>
          ) : (
            <>
              <span>Pošalji rezultat</span>
              <ArrowRight size={16} aria-hidden="true" />
            </>
          )}
        </button>
      </form>
      <p className="alati-email-form__microcopy">
        Email nije obavezan. Rezultat ostaje vidljiv i bez slanja.
      </p>
      {message && (
        <div
          className={`alati-email-form__message alati-email-form__message--${message.type}`}
          role="status"
        >
          {message.text}
        </div>
      )}
      <p className="alati-email-form__legal">
        Vaši podaci su zaštićeni u skladu sa GDPR regulativom.{" "}
        <a href="/politika-privatnosti">Politika privatnosti</a>.
      </p>
    </div>
  );
}
