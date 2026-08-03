import {
  CATEGORIES,
  type CategoryId,
  type PracticeType,
  type ProfileId,
  QUESTIONS,
} from "./quiz-data";

export interface CategoryScore {
  id: CategoryId;
  label: string;
  raw: number;
  max: number;
  percent: number;
}

export interface ScoreResult {
  totalRaw: number;
  totalMax: number;
  totalScore: number;
  band: "low" | "lowMid" | "highMid" | "high";
  categories: CategoryScore[];
  weakestCategories: CategoryId[];
}

export function isAnswerComplete(answers: (number | null)[]): boolean {
  return (
    answers.length === QUESTIONS.length &&
    answers.every((a) => a !== null && a !== undefined)
  );
}

export function computeScore(answers: (number | null)[]): ScoreResult {
  const categoryRaw = new Map<CategoryId, number>();
  const categoryMax = new Map<CategoryId, number>();

  QUESTIONS.forEach((q, idx) => {
    const selectedIndex = answers[idx];
    const points =
      selectedIndex !== null && selectedIndex !== undefined
        ? q.options[selectedIndex]?.points ?? 0
        : 0;
    categoryRaw.set(q.category, (categoryRaw.get(q.category) ?? 0) + points);
    categoryMax.set(
      q.category,
      (categoryMax.get(q.category) ?? 0) + Math.max(...q.options.map((o) => o.points))
    );
  });

  const categories: CategoryScore[] = CATEGORIES.map(({ id, label }) => {
    const raw = categoryRaw.get(id) ?? 0;
    const max = categoryMax.get(id) ?? 1;
    return {
      id,
      label,
      raw,
      max,
      percent: Math.round((raw / max) * 100),
    };
  });

  const totalRaw = categories.reduce((sum, c) => sum + c.raw, 0);
  const totalMax = categories.reduce((sum, c) => sum + c.max, 0);
  const totalScore = Math.round((totalRaw / totalMax) * 100);

  const band = bandFor(totalScore);

  const weakestCategories = [...categories]
    .filter((c) => c.percent < 50)
    .sort((a, b) => a.percent - b.percent)
    .map((c) => c.id);

  return {
    totalRaw,
    totalMax,
    totalScore,
    band,
    categories,
    weakestCategories,
  };
}

export function bandFor(
  totalScore: number
): "low" | "lowMid" | "highMid" | "high" {
  if (totalScore <= 30) return "low";
  if (totalScore <= 60) return "lowMid";
  if (totalScore <= 80) return "highMid";
  return "high";
}

export function deriveProfile(
  practice: PracticeType | null,
  score: ScoreResult
): ProfileId {
  const { totalScore, categories } = score;
  const percents = categories.map((c) => c.percent);
  const variance = Math.max(...percents) - Math.min(...percents);

  if (practice === "specialist") {
    return "specialist";
  }

  if (practice === "solo" && totalScore <= 50) {
    return "solo_manual";
  }

  if ((practice === "small" || practice === "multi") && variance >= 40) {
    return "multi_scattered";
  }

  if (practice === "multi") {
    return "multi_scattered";
  }

  if (practice === null) {
    if (totalScore <= 30) return "solo_manual";
    if (variance >= 40) return "multi_scattered";
    return "hybrid";
  }

  return "hybrid";
}

export function profileToDemoParam(profile: ProfileId): string {
  switch (profile) {
    case "solo_manual":
      return "solo";
    case "hybrid":
      return "hybrid";
    case "multi_scattered":
      return "multi";
    case "specialist":
      return "specialist";
  }
}
