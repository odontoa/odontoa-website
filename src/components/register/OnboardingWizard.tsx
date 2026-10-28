'use client';

import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import StepClinic from './StepClinic';
import StepHours from './StepHours';
import StepReview from './StepReview';
import StepTeam from './StepTeam';
import StepUser from './StepUser';
import {
  CURRENT_SYSTEMS,
  OTHER_SOFTWARE,
  collectErrors,
  hasErrorsWithPrefix,
  initialData,
  phoneForCountry,
  type ClinicData,
  type Country,
  type CurrentSystem,
  type DayHours,
  type DayKey,
  type Errors,
  type TeamData,
  type UserData,
  type WizardData,
} from './wizard-data';

type StepNumber = 1 | 2 | 3 | 4;
type Screen = 'welcome' | StepNumber | 'review' | 'success';

const TOTAL_STEPS = 4;

const SEND_ERROR =
  'Slanje nije uspelo. Pokušajte ponovo ili nam pišite na info@odontoa.com.';

/* Prefiks greske po koraku; korak 3 je u celini opcion, pa nema prefiks. */
const STEP_ERROR_PREFIX: Record<StepNumber, string | null> = {
  1: 'clinic.',
  2: 'hours.',
  3: null,
  4: 'user.',
};

type Action =
  | { type: 'clinic'; field: keyof ClinicData; value: string }
  | { type: 'country'; value: Country }
  | { type: 'day'; day: DayKey; patch: Partial<DayHours> }
  | { type: 'applyMonday' }
  | { type: 'team'; field: keyof TeamData; value: string }
  | { type: 'toggleSystem'; value: CurrentSystem }
  | { type: 'user'; field: keyof UserData; value: string };

function reducer(state: WizardData, action: Action): WizardData {
  switch (action.type) {
    case 'clinic':
      return { ...state, clinic: { ...state.clinic, [action.field]: action.value } };
    /* Promena drzave dira i telefon, pa ide zasebnom akcijom. */
    case 'country':
      return {
        ...state,
        clinic: { ...state.clinic, country: action.value },
        user: {
          ...state.user,
          phone: phoneForCountry(action.value, state.user.phone),
        },
      };
    case 'day':
      return {
        ...state,
        hours: {
          ...state.hours,
          [action.day]: { ...state.hours[action.day], ...action.patch },
        },
      };
    case 'applyMonday': {
      const { from, to } = state.hours.pon;
      const hours = { ...state.hours };
      for (const day of ['uto', 'sre', 'cet', 'pet'] as DayKey[]) {
        hours[day] = { ...hours[day], from, to };
      }
      return { ...state, hours };
    }
    case 'team':
      return { ...state, team: { ...state.team, [action.field]: action.value } };
    case 'toggleSystem': {
      const selected = state.team.currentSystem.includes(action.value)
        ? state.team.currentSystem.filter((system) => system !== action.value)
        : [...state.team.currentSystem, action.value];
      /* Kanonski redosled, da izlaz ne zavisi od redosleda klikanja. */
      const currentSystem = CURRENT_SYSTEMS.filter((system) =>
        selected.includes(system)
      );
      return {
        ...state,
        team: {
          ...state.team,
          currentSystem,
          /* Odcekiran "Drugi softver" cisti i polje "Koji", da ustajala
             vrednost ne otputuje u mejl. */
          currentSystemOther: currentSystem.includes(OTHER_SOFTWARE)
            ? state.team.currentSystemOther
            : '',
        },
      };
    }
    case 'user':
      return { ...state, user: { ...state.user, [action.field]: action.value } };
    default:
      return state;
  }
}

/* Fiksni nav (80px) + vazduh: vrh novog koraka ne sme da ostane ispod nav-a. */
const NAV_OFFSET = 96;

export default function OnboardingWizard() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [data, dispatch] = useReducer(reducer, undefined, initialData);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const errors = useMemo(() => collectErrors(data), [data]);

  /* Posle promene ekrana fokus ide na karticu (citac ekrana i tastatura krecu od
     vrha koraka). Na telefonu je dugme "Dalje" ispod kraja dugog koraka, pa se
     stranica jos poravna tako da novi korak pocne odmah ispod fiksnog nav-a.
     Desktop se ne skroluje. */
  const cardRef = useRef<HTMLDivElement>(null);
  const isFirstScreen = useRef(true);
  useEffect(() => {
    if (isFirstScreen.current) {
      isFirstScreen.current = false;
      return;
    }
    const card = cardRef.current;
    if (!card) return;
    card.focus({ preventScroll: true });
    if (!window.matchMedia('(max-width: 767px)').matches) return;
    const top = card.getBoundingClientRect().top;
    if (top < NAV_OFFSET || top > window.innerHeight) window.scrollBy(0, top - NAV_OFFSET);
  }, [screen]);

  /* Greske obaveznih polja se prikazuju kada korisnik napusti polje.
     Greske radnog vremena se prikazuju odmah, jer su podrazumevane
     vrednosti ispravne pa se poruka pojavljuje samo posle izmene. */
  const visibleErrors = useMemo<Errors>(() => {
    const visible: Errors = {};
    for (const [key, message] of Object.entries(errors)) {
      if (key.startsWith('hours.') || touched[key]) {
        visible[key] = message;
      }
    }
    return visible;
  }, [errors, touched]);

  const markTouched = (key: string) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const stepPrefix = typeof screen === 'number' ? STEP_ERROR_PREFIX[screen] : null;
  const canAdvance = stepPrefix === null || !hasErrorsWithPrefix(errors, stepPrefix);
  const canSubmit = Object.keys(errors).length === 0;

  const goNext = () => {
    if (typeof screen !== 'number') return;
    if (!canAdvance) return;
    setScreen(screen < TOTAL_STEPS ? ((screen + 1) as StepNumber) : 'review');
  };

  const goBack = () => {
    if (screen === 'review') {
      setScreen(TOTAL_STEPS);
      return;
    }
    if (typeof screen !== 'number') return;
    setScreen(screen === 1 ? 'welcome' : ((screen - 1) as StepNumber));
  };

  /* Success se prikazuje samo na uspesan odgovor. Na gresku podaci ostaju u
     state-u, pa korisnik moze da pokusa ponovo bez ponovnog unosa. */
  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        /* 400 nosi konkretnu gresku validacije; sve ostalo (slanje mejla, server)
           dobija poruku sa adresom, da prijava ne propadne bez alternative. */
        setSubmitError(
          response.status === 400 && typeof result.error === 'string'
            ? result.error
            : SEND_ERROR
        );
        return;
      }

      setScreen('success');
    } catch {
      setSubmitError(SEND_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (screen === 'welcome') {
    return (
      <div ref={cardRef} tabIndex={-1} className="register-card register-card--center register-card--welcome">
        <p className="register-welcome__eyebrow">Podešavanje ordinacije</p>
        <h1 className="register-welcome__title">
          Dobrodošli u <span className="register-welcome__accent">Odontoa</span>
        </h1>
        <p className="register-welcome__sub">
          Podesimo tvoju ordinaciju za par minuta.
        </p>
        <button
          type="button"
          className="register-btn register-btn--primary"
          onClick={() => setScreen(1)}
        >
          <span>Krenimo</span>
          <ArrowRight size={16} aria-hidden />
        </button>
      </div>
    );
  }

  if (screen === 'success') {
    return (
      <div ref={cardRef} tabIndex={-1} className="register-card register-card--center">
        <h1 className="register-welcome__title">Hvala.</h1>
        <p className="register-welcome__sub">
          Javljamo ti se u roku od jednog radnog dana sa sledećim koracima.
        </p>
        <Link href="/" className="register-btn register-btn--secondary">
          Vrati se na sajt
        </Link>
      </div>
    );
  }

  const progress = typeof screen === 'number' ? (screen / TOTAL_STEPS) * 100 : 100;

  return (
    <div ref={cardRef} tabIndex={-1} className="register-card">
      <div className="register-progress">
        <div className="register-progress__head">
          <span>
            {typeof screen === 'number' ? `Korak ${screen} od ${TOTAL_STEPS}` : 'Provera'}
          </span>
          <span>Podešavanje ordinacije</span>
        </div>
        <div className="register-progress__track">
          <div className="register-progress__fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="register-screen" aria-live="polite">
        {screen === 1 && (
          <StepClinic
            clinic={data.clinic}
            errors={visibleErrors}
            onChange={(field, value) => dispatch({ type: 'clinic', field, value })}
            onCountryChange={(country) => dispatch({ type: 'country', value: country })}
            onBlur={markTouched}
          />
        )}

        {screen === 2 && (
          <StepHours
            hours={data.hours}
            errors={visibleErrors}
            onChange={(day, patch) => dispatch({ type: 'day', day, patch })}
            onApplyMonday={() => dispatch({ type: 'applyMonday' })}
          />
        )}

        {screen === 3 && (
          <StepTeam
            team={data.team}
            onChange={(field, value) => dispatch({ type: 'team', field, value })}
            onToggleSystem={(system) => dispatch({ type: 'toggleSystem', value: system })}
          />
        )}

        {screen === 4 && (
          <StepUser
            user={data.user}
            errors={visibleErrors}
            onChange={(field, value) => dispatch({ type: 'user', field, value })}
            onBlur={markTouched}
          />
        )}

        {screen === 'review' && (
          <StepReview data={data} onEdit={(step) => setScreen(step)} />
        )}
      </div>

      {screen === 'review' && (
        <p className="register-legal">
          Vaši podaci su zaštićeni u skladu sa GDPR regulativom.{' '}
          <Link href="/politika-privatnosti">Politika privatnosti</Link>.
        </p>
      )}

      {submitError && (
        <p className="register-submit-error" role="alert">
          {submitError}
        </p>
      )}

      <div className="register-nav">
        <button
          type="button"
          className="register-btn register-btn--secondary"
          onClick={goBack}
          disabled={isSubmitting}
        >
          <ArrowLeft size={16} aria-hidden />
          <span>Nazad</span>
        </button>

        {screen === 'review' ? (
          <button
            type="button"
            className="register-btn register-btn--primary"
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
          >
            <span>{isSubmitting ? 'Slanje...' : 'Pošalji'}</span>
            <ArrowRight size={16} aria-hidden />
          </button>
        ) : (
          <button
            type="button"
            className="register-btn register-btn--primary"
            onClick={goNext}
            disabled={!canAdvance}
          >
            <span>Dalje</span>
            <ArrowRight size={16} aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
