"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ClipboardCopy, Printer, RotateCcw } from "lucide-react";
import { analytics } from "@/lib/analytics/events";

interface ChecklistItem {
  id: string;
  text: string;
}

interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
}

const CHECKLIST_SECTIONS: ChecklistSection[] = [
  {
    id: "priprema",
    title: "1. Priprema",
    items: [
      { id: "p1", text: "Odredite jednu osobu koja vodi prelazak" },
      { id: "p2", text: "Napravite listu aktivnih pacijenata" },
      { id: "p3", text: "Odlučite šta unosite odmah, a šta kasnije" },
      { id: "p4", text: "Dogovorite pravilo za imenovanje pacijenata i unos telefona" },
    ],
  },
  {
    id: "aktivni",
    title: "2. Aktivni pacijenti",
    items: [
      { id: "a1", text: "Prvo unesite pacijente koji imaju zakazane termine" },
      { id: "a2", text: "Zatim pacijente koji su bili u poslednjih 6 meseci" },
      { id: "a3", text: "Stare kartone prebacujte postepeno, po potrebi" },
    ],
  },
  {
    id: "kartoni",
    title: "3. Kartoni i terapije",
    items: [
      { id: "k1", text: "Unesite osnovne podatke pacijenta" },
      { id: "k2", text: "Unesite najvažnije terapije u toku" },
      { id: "k3", text: "Dodajte napomene koje tim često traži" },
      { id: "k4", text: "Ne pokušavajte da digitalizujete sve stare podatke prvog dana" },
    ],
  },
  {
    id: "termini",
    title: "4. Termini i podsetnici",
    items: [
      { id: "t1", text: "Prebacite narednih 7 do 14 dana termina" },
      { id: "t2", text: "Proverite trajanje termina po tipu intervencije" },
      { id: "t3", text: "Definišite ko potvrđuje i pomera termine" },
      { id: "t4", text: "Uvedite podsetnike tek kada je raspored sređen" },
    ],
  },
  {
    id: "tim",
    title: "5. Tim i pravila rada",
    items: [
      { id: "tim1", text: "Dogovorite ko unosi nove pacijente" },
      { id: "tim2", text: "Dogovorite ko ažurira karton posle pregleda" },
      { id: "tim3", text: "Dogovorite gde se pišu interne napomene" },
      { id: "tim4", text: "Izbacite dupliranje u papir, Viber i Excel gde god je moguće" },
    ],
  },
  {
    id: "provera",
    title: "6. Provera posle prve nedelje",
    items: [
      { id: "pr1", text: "Proverite da li tim nalazi podatke brže" },
      { id: "pr2", text: "Proverite gde i dalje nastaje dupli unos" },
      { id: "pr3", text: "Proverite koji pacijenti nisu dobro prebačeni" },
      { id: "pr4", text: "Ispravite pravila pre nego što ubacite još podataka" },
    ],
  },
];

const ALL_ITEMS = CHECKLIST_SECTIONS.flatMap((s) => s.items);
const TOTAL_ITEMS = ALL_ITEMS.length;
const COMPLETION_THRESHOLD = 17;
const STORAGE_KEY = "odontoa_ptd_checklist";

export default function PaperChecklist() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [analyticsStarted, setAnalyticsStarted] = useState(false);
  const [copied, setCopied] = useState(false);
  const checklistRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const ids: string[] = JSON.parse(raw);
        setChecked(new Set(ids));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const saveToStorage = useCallback((set: Set<string>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
    } catch {
      // ignore storage errors
    }
  }, []);

  const scrollToChecklist = useCallback(() => {
    if (checklistRef.current) {
      checklistRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const fireAnalyticsStart = useCallback(() => {
    if (!analyticsStarted) {
      analytics.toolStart("paper_to_digital_checklist");
      setAnalyticsStarted(true);
    }
  }, [analyticsStarted]);

  const handleOpenChecklist = () => {
    fireAnalyticsStart();
    setTimeout(scrollToChecklist, 50);
  };

  const handleToggle = (id: string) => {
    fireAnalyticsStart();
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveToStorage(next);
      return next;
    });
  };

  const handleReset = () => {
    const empty = new Set<string>();
    setChecked(empty);
    saveToStorage(empty);
  };

  const handleCopy = useCallback(async () => {
    const lines: string[] = [
      "Checklist za prelazak sa papira na digitalni karton",
      "",
    ];
    CHECKLIST_SECTIONS.forEach((section) => {
      lines.push(section.title);
      section.items.forEach((item) => {
        const mark = checked.has(item.id) ? "[x]" : "[ ]";
        lines.push(`  ${mark} ${item.text}`);
      });
      lines.push("");
    });
    lines.push(
      "Ovo je praktičan plan za postepen prelazak sa papira na digitalni karton."
    );
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  }, [checked]);

  const handlePrint = () => {
    window.print();
  };

  const checkedCount = checked.size;
  const progressPercent = Math.round((checkedCount / TOTAL_ITEMS) * 100);
  const showCompletion = checkedCount >= COMPLETION_THRESHOLD;

  return (
    <div className="alati-tool">
      <section className="alati-tool__intro alati-checklist__intro">
        <p className="alati-tool__intro-pill">Besplatan alat</p>
        <h1 className="alati-tool__intro-title">
          Checklist za prelazak sa papira na digitalni karton
        </h1>
        <p className="alati-tool__intro-subtitle">
          Praktičan plan koraka koji možete da čekirate, kopirate ili odštampate
          kada pripremate prelazak ordinacije na digitalni karton.
        </p>
        <div className="alati-tool__intro-cta">
          <button
            type="button"
            onClick={handleOpenChecklist}
            className="alati-tool__start-button"
            aria-label="Otvori checklistu"
          >
            <span>Otvori checklistu</span>
            <ArrowRight size={16} aria-hidden="true" />
          </button>
          <p className="alati-tool__intro-microcopy">
            Besplatno. Bez registracije. Možete koristiti odmah.
          </p>
        </div>
      </section>

      <section ref={checklistRef} aria-label="Checklist za prelazak na digitalni karton">
        <div className="alati-checklist__progress">
          <p className="alati-checklist__progress-text">
            Završeno {checkedCount} od {TOTAL_ITEMS} koraka
          </p>
          <div className="alati-checklist__progress-bar-track">
            <div
              className="alati-checklist__progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={checkedCount}
              aria-valuemin={0}
              aria-valuemax={TOTAL_ITEMS}
            />
          </div>
        </div>

        <p className="alati-checklist__action-note">
          Ne morate sve završiti na sajtu. Checklistu možete kopirati,
          odštampati ili podeliti sa timom.
        </p>

        <div className="alati-checklist__actions">
          <button
            type="button"
            className={`alati-checklist__action-btn${copied ? " alati-checklist__action-btn--copied" : ""}`}
            onClick={handleCopy}
          >
            <ClipboardCopy size={14} aria-hidden="true" />
            <span>{copied ? "Kopirano!" : "Kopiraj checklistu"}</span>
          </button>
          <button
            type="button"
            className="alati-checklist__action-btn"
            onClick={handlePrint}
          >
            <Printer size={14} aria-hidden="true" />
            <span>Odštampaj checklistu</span>
          </button>
          <button
            type="button"
            className="alati-checklist__action-btn"
            onClick={handleReset}
          >
            <RotateCcw size={14} aria-hidden="true" />
            <span>Resetuj checklistu</span>
          </button>
        </div>

        {showCompletion && (
          <div className="alati-checklist__completion-card">
            <p className="alati-checklist__completion-title">Dobar početak.</p>
            <p className="alati-checklist__completion-body">
              Sledeći korak je da prve aktivne pacijente i termine vodite iz
              jednog sistema, bez paralelnog dupliranja u papir i poruke.
            </p>
          </div>
        )}

        {CHECKLIST_SECTIONS.map((section) => (
          <div key={section.id} className="alati-checklist__section">
            <h3 className="alati-checklist__section-title">{section.title}</h3>
            <ul className="alati-checklist__items">
              {section.items.map((item) => {
                const isChecked = checked.has(item.id);
                return (
                  <li
                    key={item.id}
                    className={`alati-checklist__item${isChecked ? " alati-checklist__item--checked" : ""}`}
                    onClick={() => handleToggle(item.id)}
                  >
                    <input
                      type="checkbox"
                      id={item.id}
                      checked={isChecked}
                      onChange={() => handleToggle(item.id)}
                      className="alati-checklist__checkbox"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <label
                      htmlFor={item.id}
                      className="alati-checklist__item-label"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.text}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {showCompletion && (
          <div className="alati-result__cta-card" style={{ marginTop: "24px" }}>
            <p className="alati-result__cta-title">
              Želite da vidite kako bi digitalni karton izgledao u Odontoa sistemu?
            </p>
            <p className="alati-result__cta-body">Razumljiv demo, bez pritiska.</p>
            <a
              href="/demo?source=paper-to-digital-checklist"
              className="alati-result__cta-button"
              onClick={() =>
                analytics.toolCtaClick(
                  "paper_to_digital_checklist",
                  "/demo?source=paper-to-digital-checklist"
                )
              }
            >
              <span>Zakažite Odontoa demo</span>
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
