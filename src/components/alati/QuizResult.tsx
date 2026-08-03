"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { analytics } from "@/lib/analytics/events";
import CategoryBar from "./CategoryBar";
import EmailResultForm from "./EmailResultForm";
import {
  BAND_COPY,
  CATEGORY_RECOMMENDATIONS,
  CATEGORY_RESOURCES,
  CATEGORIES,
  PROFILE_COPY,
  type CategoryId,
  type ProfileId,
} from "./quiz-data";
import { profileToDemoParam, type ScoreResult } from "./scoring";

interface QuizResultProps {
  score: ScoreResult;
  profile: ProfileId;
  onRestart: () => void;
}

export default function QuizResult({
  score,
  profile,
  onRestart,
}: QuizResultProps) {
  const band = BAND_COPY[score.band];
  const profileCopy = PROFILE_COPY[profile];
  const weakest = score.weakestCategories.slice(0, 3);
  const resourceCategoryId: CategoryId | undefined =
    weakest[0] ??
    [...score.categories].sort((a, b) => a.percent - b.percent)[0]?.id;
  const resources = resourceCategoryId
    ? CATEGORY_RESOURCES[resourceCategoryId]
    : [];
  const demoHref = `/demo?source=digital-readiness-tool&profile=${profileToDemoParam(profile)}`;

  useEffect(() => {
    analytics.quizComplete({
      totalScore: score.totalScore,
      band: score.band,
      profile,
      weakestCategory: weakest[0],
    });
  }, [score.totalScore, score.band, profile, weakest]);

  return (
    <div className="alati-result">
      <header className="alati-result__hero">
        <p className="alati-result__hero-pill">Vaš rezultat</p>
        <div className="alati-result__score">
          <span className="alati-result__score-value">{score.totalScore}</span>
          <span className="alati-result__score-suffix">/ 100</span>
        </div>
        <p className="alati-result__band">{band.label}</p>
        <p className="alati-result__band-desc">{band.description}</p>
      </header>

      <section
        className="alati-result__block"
        aria-labelledby="alati-result-categories"
      >
        <h3 id="alati-result-categories" className="alati-result__block-title">
          Pregled po oblastima
        </h3>
        <div className="alati-result__bars">
          {score.categories.map((c) => (
            <CategoryBar key={c.id} label={c.label} percent={c.percent} />
          ))}
        </div>
      </section>

      <section
        className="alati-result__block"
        aria-labelledby="alati-result-profile"
      >
        <h3 id="alati-result-profile" className="alati-result__block-title">
          Profil ordinacije
        </h3>
        <div className="alati-result__profile-card">
          <p className="alati-result__profile-label">{profileCopy.label}</p>
          <p className="alati-result__profile-desc">{profileCopy.description}</p>
        </div>
      </section>

      <section
        className="alati-result__block"
        aria-labelledby="alati-result-next"
      >
        <h3 id="alati-result-next" className="alati-result__block-title">
          Najvažniji sledeći koraci
        </h3>
        {weakest.length > 0 ? (
          <ul className="alati-result__recommendations">
            {weakest.map((cat) => (
              <li key={cat} className="alati-result__recommendation">
                <p className="alati-result__recommendation-label">
                  {CATEGORIES.find((c) => c.id === cat)?.label}
                </p>
                <p className="alati-result__recommendation-body">
                  {CATEGORY_RECOMMENDATIONS[cat]}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="alati-result__no-weak">
            Sve oblasti pokrivene su iznad polovine. Sledeći korak je dublja
            optimizacija, najčešće kroz analitiku i automatizaciju.
          </p>
        )}
      </section>

      {resources.length > 0 && (
        <section
          className="alati-result__block"
          aria-labelledby="alati-result-resources"
        >
          <h3 id="alati-result-resources" className="alati-result__block-title">
            Preporučeno za vas
          </h3>
          <ul className="alati-result__resources">
            {resources.map((r, i) => (
              <li key={i}>
                <Link
                  href={r.href}
                  className="alati-result__resource-link"
                  onClick={() =>
                    analytics.quizCtaClick(
                      "resource_link",
                      r.href,
                      score.totalScore
                    )
                  }
                >
                  <span>{r.label}</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section
        className="alati-result__cta-card"
        aria-labelledby="alati-result-cta"
      >
        <h3 id="alati-result-cta" className="alati-result__cta-title">
          {profileCopy.ctaHeadline}
        </h3>
        <p className="alati-result__cta-body">{profileCopy.ctaBody}</p>
        <Link
          href={demoHref}
          className="alati-result__cta-button"
          onClick={() =>
            analytics.quizCtaClick("demo", demoHref, score.totalScore)
          }
        >
          <span>Zakažite Odontoa demo</span>
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>

      <EmailResultForm
        score={score}
        profile={profile}
        bandLabel={band.label}
        profileLabel={profileCopy.label}
      />

      <div className="alati-result__restart">
        <button
          type="button"
          onClick={onRestart}
          className="alati-result__restart-button"
        >
          <RotateCcw size={14} aria-hidden="true" />
          <span>Pokušaj ponovo</span>
        </button>
      </div>
    </div>
  );
}
