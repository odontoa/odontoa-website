import { DAYS, type DayHours, type DayKey, type Errors } from './wizard-data';

interface StepHoursProps {
  hours: Record<DayKey, DayHours>;
  errors: Errors;
  onChange: (day: DayKey, patch: Partial<DayHours>) => void;
  onApplyMonday: () => void;
}

export default function StepHours({
  hours,
  errors,
  onChange,
  onApplyMonday,
}: StepHoursProps) {
  return (
    <div className="register-step">
      <h2 className="register-step__title">Radno vreme</h2>
      <p className="register-step__lead">
        Označi dane kada ordinacija radi i unesi vreme. Kasnije se menja u sistemu.
      </p>

      <div className="register-hours">
        {DAYS.map((day) => {
          const value = hours[day.key];
          const error = errors[`hours.${day.key}`];
          return (
            <div className="register-hours__row" key={day.key}>
              <label className="register-hours__day">
                <input
                  type="checkbox"
                  className="register-hours__check"
                  checked={value.open}
                  onChange={(e) => onChange(day.key, { open: e.target.checked })}
                />
                <span>{day.label}</span>
              </label>

              {value.open ? (
                <div className="register-hours__times">
                  <label className="register-hours__time-label">
                    <span>od</span>
                    <input
                      type="time"
                      className="register-field__input register-hours__time"
                      value={value.from}
                      onChange={(e) => onChange(day.key, { from: e.target.value })}
                      aria-invalid={error ? true : undefined}
                      aria-label={`${day.label}, radno vreme od`}
                    />
                  </label>
                  <label className="register-hours__time-label">
                    <span>do</span>
                    <input
                      type="time"
                      className="register-field__input register-hours__time"
                      value={value.to}
                      onChange={(e) => onChange(day.key, { to: e.target.value })}
                      aria-invalid={error ? true : undefined}
                      aria-label={`${day.label}, radno vreme do`}
                    />
                  </label>
                </div>
              ) : (
                <span className="register-hours__closed">ne radi</span>
              )}

              {error && (
                <p className="register-field__error register-hours__error" role="alert">
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button type="button" className="register-linkbtn" onClick={onApplyMonday}>
        Primeni radno vreme ponedeljka na sve radne dane
      </button>
    </div>
  );
}
