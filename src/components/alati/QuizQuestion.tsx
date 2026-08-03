"use client";

import { ChevronLeft } from "lucide-react";
import type { AnswerOption } from "./quiz-data";

interface QuizQuestionProps {
  index: number;
  total: number;
  question: string;
  options: AnswerOption[];
  selected: number | null;
  onSelect: (optionIndex: number) => void;
  onBack: () => void;
  canGoBack: boolean;
  optional?: boolean;
  helper?: string;
  onSkip?: () => void;
  skipLabel?: string;
}

export default function QuizQuestion({
  index,
  total,
  question,
  options,
  selected,
  onSelect,
  onBack,
  canGoBack,
  optional,
  helper,
  onSkip,
  skipLabel,
}: QuizQuestionProps) {
  const progress = Math.round(((index + 1) / total) * 100);

  return (
    <div className="alati-quiz">
      <div className="alati-quiz__progress">
        <div className="alati-quiz__progress-head">
          <span>
            {optional ? "Opcionalno pitanje" : `Pitanje ${index + 1} od ${total}`}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="alati-quiz__progress-track">
          <div
            className="alati-quiz__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="alati-quiz__question">{question}</h2>
      {helper && <p className="alati-quiz__helper">{helper}</p>}

      <ul className="alati-quiz__options">
        {options.map((opt, i) => {
          const isSelected = selected === i;
          return (
            <li key={i}>
              <button
                type="button"
                className={`alati-quiz__option${isSelected ? " is-selected" : ""}`}
                onClick={() => onSelect(i)}
                aria-pressed={isSelected}
              >
                <span className="alati-quiz__option-marker" aria-hidden="true">
                  {String.fromCharCode(97 + i)}
                </span>
                <span className="alati-quiz__option-label">{opt.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="alati-quiz__nav">
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          className="alati-quiz__back"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          <span>Nazad</span>
        </button>
        {optional && onSkip && (
          <button type="button" onClick={onSkip} className="alati-quiz__skip">
            {skipLabel ?? "Preskoči"}
          </button>
        )}
      </div>
    </div>
  );
}
