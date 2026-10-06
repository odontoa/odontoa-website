"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { analytics } from "@/lib/analytics/events";
import QuizQuestion from "./QuizQuestion";
import QuizResult from "./QuizResult";
import {
  CATEGORIES,
  PRACTICE_OPTIONS,
  PROFILE_QUESTION,
  QUESTIONS,
  type PracticeType,
} from "./quiz-data";
import { computeScore, deriveProfile, isAnswerComplete } from "./scoring";

type Stage = "intro" | "profile" | "quiz" | "result";

const SCORING_TOTAL = QUESTIONS.length;

export default function DigitalReadinessTool() {
  const [stage, setStage] = useState<Stage>("intro");
  const [practice, setPractice] = useState<PracticeType | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    Array(SCORING_TOTAL).fill(null)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const quizSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToQuiz = useCallback(() => {
    if (quizSectionRef.current) {
      quizSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  const handleStart = () => {
    setStage("profile");
    setCurrentIndex(0);
    analytics.quizStart();
    setTimeout(scrollToQuiz, 50);
  };

  const handleProfileSelect = (value: PracticeType) => {
    setPractice(value);
    setStage("quiz");
    setCurrentIndex(0);
  };

  const handleProfileSkip = () => {
    setPractice(null);
    setStage("quiz");
    setCurrentIndex(0);
  };

  const handleSelectAnswer = (optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = optionIndex;
      return next;
    });
    analytics.quizQuestionAnswered(currentIndex + 1, QUESTIONS[currentIndex].id);

    if (currentIndex < SCORING_TOTAL - 1) {
      setTimeout(() => {
        setCurrentIndex((idx) => Math.min(idx + 1, SCORING_TOTAL - 1));
      }, 220);
    } else {
      const finalAnswers = [...answers];
      finalAnswers[currentIndex] = optionIndex;
      if (isAnswerComplete(finalAnswers)) {
        setTimeout(() => setStage("result"), 220);
      }
    }
  };

  const handleBack = () => {
    if (stage === "quiz") {
      if (currentIndex > 0) {
        setCurrentIndex((idx) => idx - 1);
      } else {
        setStage("profile");
      }
    }
  };

  const handleRestart = () => {
    setAnswers(Array(SCORING_TOTAL).fill(null));
    setPractice(null);
    setCurrentIndex(0);
    setStage("intro");
    setTimeout(scrollToQuiz, 50);
  };

  const score = useMemo(() => {
    if (stage !== "result" || !isAnswerComplete(answers)) return null;
    return computeScore(answers);
  }, [stage, answers]);

  const profile = useMemo(() => {
    if (!score) return null;
    return deriveProfile(practice, score);
  }, [practice, score]);

  return (
    <div className="alati-tool">
      <section className="alati-tool__intro">
        <p className="alati-tool__intro-pill">Besplatan alat</p>
        <h1 className="alati-tool__intro-title">
          Koliko je tvoja ordinacija digitalno spremna?
        </h1>
        <p className="alati-tool__intro-subtitle">
          Odgovori na 12 kratkih pitanja i saznaj gde tvoja ordinacija već
          radi dobro, a gde gubi vreme i kontrolu.
        </p>
        <div className="alati-tool__intro-cta">
          <button
            type="button"
            onClick={handleStart}
            className="alati-tool__start-button"
            aria-label="Pokreni test digitalne spremnosti"
          >
            <span>Pokreni test</span>
            <ArrowRight size={16} aria-hidden="true" />
          </button>
          <p className="alati-tool__intro-microcopy">
            Besplatno. Bez registracije. Rezultat odmah.
          </p>
          <p className="alati-tool__intro-submicrocopy">
            Email nije obavezan.
          </p>
        </div>

        <div className="alati-tool__categories">
          <p className="alati-tool__categories-title">Šta tačno procenjujemo?</p>
          <ul className="alati-tool__categories-list">
            {CATEGORIES.map((c) => (
              <li key={c.id} className="alati-tool__category-chip">
                {c.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {stage !== "intro" && (
      <section
        ref={quizSectionRef}
        className="alati-tool__stage"
        aria-live="polite"
      >
        {stage === "profile" && (
          <div className="alati-quiz">
            <div className="alati-quiz__progress">
              <div className="alati-quiz__progress-head">
                <span>Opcionalno pitanje</span>
                <span>Pre testa</span>
              </div>
              <div className="alati-quiz__progress-track">
                <div
                  className="alati-quiz__progress-fill"
                  style={{ width: "5%" }}
                />
              </div>
            </div>
            <h2 className="alati-quiz__question">{PROFILE_QUESTION.question}</h2>
            <p className="alati-quiz__helper">{PROFILE_QUESTION.helper}</p>
            <ul className="alati-quiz__options">
              {PRACTICE_OPTIONS.map((opt, i) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    className="alati-quiz__option"
                    onClick={() => handleProfileSelect(opt.value)}
                  >
                    <span
                      className="alati-quiz__option-marker"
                      aria-hidden="true"
                    >
                      {String.fromCharCode(97 + i)}
                    </span>
                    <span className="alati-quiz__option-label">
                      {opt.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="alati-quiz__nav alati-quiz__nav--center">
              <button
                type="button"
                onClick={handleProfileSkip}
                className="alati-quiz__skip"
              >
                {PROFILE_QUESTION.skipLabel}
              </button>
            </div>
          </div>
        )}

        {stage === "quiz" && (
          <QuizQuestion
            index={currentIndex}
            total={SCORING_TOTAL}
            question={QUESTIONS[currentIndex].question}
            options={QUESTIONS[currentIndex].options}
            selected={answers[currentIndex]}
            onSelect={handleSelectAnswer}
            onBack={handleBack}
            canGoBack={true}
          />
        )}

        {stage === "result" && score && profile && (
          <QuizResult score={score} profile={profile} onRestart={handleRestart} />
        )}
      </section>
      )}
    </div>
  );
}
