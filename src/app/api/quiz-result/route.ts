import { NextRequest, NextResponse } from "next/server";
import { EmailService, QuizResultEmailData } from "@/lib/email";

const ALLOWED_BANDS = new Set(["low", "lowMid", "highMid", "high"]);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      totalScore,
      band,
      bandLabel,
      profile,
      profileLabel,
      categories,
      weakestCategories,
    } = body ?? {};

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Neispravan format email adrese." },
        { status: 400 }
      );
    }

    if (
      typeof totalScore !== "number" ||
      totalScore < 0 ||
      totalScore > 100 ||
      Number.isNaN(totalScore)
    ) {
      return NextResponse.json(
        { error: "Neispravan rezultat." },
        { status: 400 }
      );
    }

    if (typeof band !== "string" || !ALLOWED_BANDS.has(band)) {
      return NextResponse.json(
        { error: "Neispravna ocena." },
        { status: 400 }
      );
    }

    if (!Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json(
        { error: "Neispravni podaci o oblastima." },
        { status: 400 }
      );
    }

    const safeCategories = categories
      .filter(
        (c: unknown): c is { id: string; label: string; percent: number } =>
          typeof c === "object" &&
          c !== null &&
          typeof (c as { id?: unknown }).id === "string" &&
          typeof (c as { label?: unknown }).label === "string" &&
          typeof (c as { percent?: unknown }).percent === "number"
      )
      .map((c) => ({
        id: c.id,
        label: c.label,
        percent: Math.max(0, Math.min(100, Math.round(c.percent))),
      }));

    if (safeCategories.length === 0) {
      return NextResponse.json(
        { error: "Neispravni podaci o oblastima." },
        { status: 400 }
      );
    }

    const data: QuizResultEmailData = {
      email: email.trim(),
      totalScore: Math.round(totalScore),
      band,
      bandLabel: typeof bandLabel === "string" ? bandLabel : "",
      profile: typeof profile === "string" ? profile : "hybrid",
      profileLabel: typeof profileLabel === "string" ? profileLabel : "",
      categories: safeCategories,
      weakestCategories: Array.isArray(weakestCategories)
        ? weakestCategories.filter((w): w is string => typeof w === "string")
        : [],
    };

    await EmailService.sendQuizResultEmail(data);

    return NextResponse.json(
      {
        message:
          "Rezultat je uspešno poslat na tvoj email. Proveri i spam folder ako ne stigne odmah.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Quiz result email error:", error);

    if (
      error instanceof Error &&
      error.message.includes("Failed to send quiz result email")
    ) {
      return NextResponse.json(
        {
          error:
            "Greška pri slanju email-a. Pokušaj ponovo kasnije.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Greška na serveru. Pokušaj ponovo kasnije." },
      { status: 500 }
    );
  }
}
