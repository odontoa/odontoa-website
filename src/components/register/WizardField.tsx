import type { ReactNode } from 'react';

interface WizardFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

/* Zajednicki okvir polja: labela, kontrola, inline greska. */
export default function WizardField({
  id,
  label,
  required,
  error,
  hint,
  children,
}: WizardFieldProps) {
  return (
    <div className="register-field">
      <label className="register-field__label" htmlFor={id}>
        {label}
        {required && (
          <span className="register-field__req" aria-hidden>
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && <p className="register-field__hint">{hint}</p>}
      {error && (
        <p className="register-field__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
