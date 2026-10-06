"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { analytics } from "@/lib/analytics/events";

type Stage = "intro" | "form" | "result";

interface FormState {
  workDaysPerWeek: string;
  kartoniMinutes: string;
  zakazivanjeMinutes: string;
  podsetniciMinutes: string;
  tehnikaMinutes: string;
  izvestajiMinutes: string;
}

const DEFAULT_FORM: FormState = {
  workDaysPerWeek: "5",
  kartoniMinutes: "30",
  zakazivanjeMinutes: "20",
  podsetniciMinutes: "10",
  tehnikaMinutes: "15",
  izvestajiMinutes: "30",
};

function parseOrZero(s: string): number {
  return Math.max(0, parseInt(s, 10) || 0);
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

const RECOMMENDATIONS: Record<string, string> = {
  kartoni:
    "Počni od digitalnog kartona pacijenta. Od njega zavise istorija lečenja, terapije i budući termini.",
  zakazivanje:
    "Digitalni kalendar i jasni statusi termina smanjuju svakodnevnu koordinaciju i ručno pomeranje.",
  podsetnici:
    "Automatski podsetnici zamenjuju ručne pozive i poruke bez dodatnog rada tima.",
  tehnika:
    "Uz svaki radni nalog vodi laboratoriju, status i cenu, da na kraju meseca ne sabiraš račune ručno.",
  izvestaji:
    "Definiši 3 do 5 brojki koje pratiš svake nedelje, umesto ručnog sabiranja na kraju meseca.",
};

export default function TimeCalculator() {
  const [stage, setStage] = useState<Stage>("intro");
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const formRef = useRef<HTMLElement | null>(null);

  const scrollToForm = useCallback(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleStartCalc = () => {
    setStage("form");
    setTimeout(scrollToForm, 50);
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analytics.toolComplete("time_savings_calculator");
    setStage("result");
    setTimeout(scrollToForm, 50);
  };

  const handleRestart = () => {
    setForm(DEFAULT_FORM);
    setStage("intro");
    setTimeout(scrollToForm, 50);
  };

  const result = useMemo(() => {
    const workDays = clamp(parseOrZero(form.workDaysPerWeek), 1, 7);
    const kartoniWeekly = parseOrZero(form.kartoniMinutes) * workDays;
    const zakazivanjeWeekly = parseOrZero(form.zakazivanjeMinutes) * workDays;
    const podsetniciWeekly = parseOrZero(form.podsetniciMinutes) * workDays;
    const tehnikaWeekly = parseOrZero(form.tehnikaMinutes);
    const izvestajiWeekly = parseOrZero(form.izvestajiMinutes);
    const totalWeeklyMinutes =
      kartoniWeekly +
      zakazivanjeWeekly +
      podsetniciWeekly +
      tehnikaWeekly +
      izvestajiWeekly;
    const weeklyHours = round1(totalWeeklyMinutes / 60);
    const monthlyHours = round1(weeklyHours * 4.3);
    const yearlyHours = Math.round(weeklyHours * 52);

    const areas = [
      { id: "kartoni", label: "Kartoni pacijenata", weeklyMinutes: kartoniWeekly },
      { id: "zakazivanje", label: "Zakazivanje termina", weeklyMinutes: zakazivanjeWeekly },
      { id: "podsetnici", label: "Podsetnici pacijentima", weeklyMinutes: podsetniciWeekly },
      { id: "tehnika", label: "Zubna tehnika", weeklyMinutes: tehnikaWeekly },
      { id: "izvestaji", label: "Izveštaji i sabiranje podataka", weeklyMinutes: izvestajiWeekly },
    ].sort((a, b) => b.weeklyMinutes - a.weeklyMinutes);

    const topRecommendations = areas.filter((a) => a.weeklyMinutes > 0).slice(0, 3);
    const topArea = areas[0]?.weeklyMinutes > 0 ? areas[0] : null;

    return { weeklyHours, monthlyHours, yearlyHours, areas, topRecommendations, topArea };
  }, [form]);

  return (
    <div className="alati-tool">
      <section className="alati-tool__intro">
        <p className="alati-tool__intro-pill">Besplatan alat</p>
        <h1 className="alati-tool__intro-title">
          Koliko vremena tvoja ordinacija gubi na ručne poslove?
        </h1>
        <p className="alati-tool__intro-subtitle">
          Unesi okvirne podatke i dobij procenu koliko sati nedeljno odlazi
          na kartone, zakazivanje, podsetnike, zubnu tehniku i izveštaje.
        </p>
        <div className="alati-tool__intro-cta">
          <button
            type="button"
            onClick={handleStartCalc}
            className="alati-tool__start-button"
            aria-label="Izračunaj uštedu vremena"
          >
            <span>Izračunaj uštedu vremena</span>
            <ArrowRight size={16} aria-hidden="true" />
          </button>
          <p className="alati-tool__intro-microcopy">
            Besplatno. Bez registracije. Rezultat odmah.
          </p>
        </div>
      </section>

      {stage !== "intro" && (
        <section ref={formRef} aria-live="polite">
          {stage === "form" && (
            <form className="alati-calc__form" onSubmit={handleSubmit}>
              <div>
                <p className="alati-calc__form-lead">
                  Ne moraš da znaš tačne brojke. Unesi okvirnu procenu za
                  prosečan radni dan ili prosečnu nedelju.
                </p>
                <p className="alati-calc__form-hint">
                  Primer vrednosti, slobodno izmeni.
                </p>
              </div>

              <fieldset className="alati-calc__fieldset">
                <legend className="alati-calc__legend">Opšte</legend>
                <div className="alati-calc__group">
                  <label className="alati-calc__label" htmlFor="workDays">
                    Broj radnih dana nedeljno
                  </label>
                  <p className="alati-calc__field-helper">
                    Koliko dana nedeljno ordinacija aktivno prima pacijente?
                  </p>
                  <div className="alati-calc__input-row">
                    <input
                      id="workDays"
                      type="number"
                      className="alati-calc__input"
                      min={1}
                      max={7}
                      value={form.workDaysPerWeek}
                      onChange={(e) => handleChange("workDaysPerWeek", e.target.value)}
                    />
                    <span className="alati-calc__unit">dana</span>
                  </div>
                </div>
              </fieldset>

              <fieldset className="alati-calc__fieldset">
                <legend className="alati-calc__legend">Dnevno</legend>
                <div className="alati-calc__group">
                  <label className="alati-calc__label" htmlFor="kartoniMin">
                    Kartoni pacijenata
                  </label>
                  <p className="alati-calc__field-helper">
                    Koliko minuta dnevno tim potroši na traženje, otvaranje ili
                    dopunu kartona?
                  </p>
                  <div className="alati-calc__input-row">
                    <input
                      id="kartoniMin"
                      type="number"
                      className="alati-calc__input"
                      min={0}
                      value={form.kartoniMinutes}
                      onChange={(e) => handleChange("kartoniMinutes", e.target.value)}
                    />
                    <span className="alati-calc__unit">min/dan</span>
                  </div>
                </div>
                <div className="alati-calc__group">
                  <label className="alati-calc__label" htmlFor="zakazivanjeMin">
                    Zakazivanje i pomeranje termina
                  </label>
                  <p className="alati-calc__field-helper">
                    Koliko minuta dnevno ode na zakazivanje, pomeranje i
                    usklađivanje termina?
                  </p>
                  <div className="alati-calc__input-row">
                    <input
                      id="zakazivanjeMin"
                      type="number"
                      className="alati-calc__input"
                      min={0}
                      value={form.zakazivanjeMinutes}
                      onChange={(e) => handleChange("zakazivanjeMinutes", e.target.value)}
                    />
                    <span className="alati-calc__unit">min/dan</span>
                  </div>
                </div>
                <div className="alati-calc__group">
                  <label className="alati-calc__label" htmlFor="podsetniciMin">
                    Ručni podsetnici pacijentima
                  </label>
                  <p className="alati-calc__field-helper">
                    Koliko minuta dnevno ode na pozive, Viber, SMS ili druge
                    ručne podsetnike?
                  </p>
                  <div className="alati-calc__input-row">
                    <input
                      id="podsetniciMin"
                      type="number"
                      className="alati-calc__input"
                      min={0}
                      value={form.podsetniciMinutes}
                      onChange={(e) => handleChange("podsetniciMinutes", e.target.value)}
                    />
                    <span className="alati-calc__unit">min/dan</span>
                  </div>
                </div>
              </fieldset>

              <fieldset className="alati-calc__fieldset">
                <legend className="alati-calc__legend">Nedeljno</legend>
                <div className="alati-calc__group">
                  <label className="alati-calc__label" htmlFor="tehnikaMin">
                    Zubna tehnika
                  </label>
                  <p className="alati-calc__field-helper">
                    Koliko minuta nedeljno potrošiš na praćenje radnih naloga,
                    laboratorija i troškova tehnike?
                  </p>
                  <div className="alati-calc__input-row">
                    <input
                      id="tehnikaMin"
                      type="number"
                      className="alati-calc__input"
                      min={0}
                      value={form.tehnikaMinutes}
                      onChange={(e) => handleChange("tehnikaMinutes", e.target.value)}
                    />
                    <span className="alati-calc__unit">min/ned.</span>
                  </div>
                </div>
                <div className="alati-calc__group">
                  <label className="alati-calc__label" htmlFor="izvestajiMin">
                    Izveštaji i sabiranje podataka
                  </label>
                  <p className="alati-calc__field-helper">
                    Koliko minuta nedeljno ode na ručno sabiranje termina,
                    prihoda, troškova ili drugih podataka?
                  </p>
                  <div className="alati-calc__input-row">
                    <input
                      id="izvestajiMin"
                      type="number"
                      className="alati-calc__input"
                      min={0}
                      value={form.izvestajiMinutes}
                      onChange={(e) => handleChange("izvestajiMinutes", e.target.value)}
                    />
                    <span className="alati-calc__unit">min/ned.</span>
                  </div>
                </div>
              </fieldset>

              <button type="submit" className="alati-tool__start-button">
                <span>Prikaži procenu</span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </form>
          )}

          {stage === "result" && (
            <div className="alati-calc__result">
              <div className="alati-result__hero">
                <p className="alati-result__hero-pill">Procena vremena koje odlazi na ručne procese</p>
                <div className="alati-calc__stat-cards">
                  <div className="alati-calc__stat-card">
                    <span className="alati-calc__stat-value">{result.weeklyHours} h</span>
                    <span className="alati-calc__stat-label">Nedeljno</span>
                  </div>
                  <div className="alati-calc__stat-card">
                    <span className="alati-calc__stat-value">{result.monthlyHours} h</span>
                    <span className="alati-calc__stat-label">Mesečno</span>
                  </div>
                  <div className="alati-calc__stat-card">
                    <span className="alati-calc__stat-value">~{result.yearlyHours} h</span>
                    <span className="alati-calc__stat-label">Godišnje</span>
                  </div>
                </div>
                {result.topArea && (
                  <p className="alati-calc__top-area" style={{ marginTop: "16px" }}>
                    Najviše vremena trenutno odlazi na:{" "}
                    <strong>{result.topArea.label.toLowerCase()}</strong>.
                    Prvi korak nije da digitalizuješ sve odjednom, već da počneš
                    od oblasti koja najviše opterećuje tim.
                  </p>
                )}
              </div>

              <div className="alati-result__block">
                <h2 className="alati-result__block-title">Pregled po oblastima</h2>
                <ul className="alati-calc__area-list">
                  {result.areas.map((area) => (
                    <li key={area.id} className="alati-calc__area-row">
                      <span className="alati-calc__area-label">{area.label}</span>
                      <span className="alati-calc__area-value">
                        {round1(area.weeklyMinutes / 60)} h / ned.
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {result.topRecommendations.length > 0 && (
                <div className="alati-result__block">
                  <h2 className="alati-result__block-title">Preporuke</h2>
                  <ul className="alati-result__recommendations">
                    {result.topRecommendations.map((area) => (
                      <li key={area.id} className="alati-result__recommendation">
                        <p className="alati-result__recommendation-label">
                          {area.label}
                        </p>
                        <p className="alati-result__recommendation-body">
                          {RECOMMENDATIONS[area.id]}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="alati-result__cta-card">
                <p className="alati-result__cta-title">
                  Želiš da vidiš kako bi ovi procesi izgledali u jednom sistemu?
                </p>
                <p className="alati-result__cta-body">Razumljiv demo, bez pritiska.</p>
                <a
                  href="/demo?source=time-savings-calculator"
                  className="alati-result__cta-button"
                  onClick={() =>
                    analytics.toolCtaClick(
                      "time_savings_calculator",
                      "/demo?source=time-savings-calculator"
                    )
                  }
                >
                  <span>Zakaži Odontoa demo</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </a>
              </div>

              <p className="alati-calc__disclaimer">
                Ovo nije garantovana ušteda, već okvirna procena vremena koje
                trenutno odlazi na ručne procese.
              </p>

              <div className="alati-result__restart">
                <button
                  type="button"
                  className="alati-result__restart-button"
                  onClick={handleRestart}
                >
                  <RotateCcw size={14} aria-hidden="true" />
                  <span>Izračunaj ponovo</span>
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
