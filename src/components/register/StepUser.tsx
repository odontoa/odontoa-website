import WizardField from './WizardField';
import type { Errors, UserData } from './wizard-data';

interface StepUserProps {
  user: UserData;
  errors: Errors;
  onChange: (field: keyof UserData, value: string) => void;
  onBlur: (key: string) => void;
}

export default function StepUser({ user, errors, onChange, onBlur }: StepUserProps) {
  return (
    <div className="register-step">
      <h2 className="register-step__title">Glavni korisnik</h2>
      <p className="register-step__lead">
        Osoba sa kojom se dogovaramo o uvozu podataka i podešavanju.
      </p>

      <div className="register-step__row">
        <WizardField
          id="user-first"
          label="Ime"
          required
          error={errors['user.firstName']}
        >
          <input
            id="user-first"
            className="register-field__input"
            type="text"
            value={user.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            onBlur={() => onBlur('user.firstName')}
            aria-invalid={errors['user.firstName'] ? true : undefined}
            aria-describedby={errors['user.firstName'] ? 'user-first-error' : undefined}
            autoComplete="given-name"
          />
        </WizardField>

        <WizardField
          id="user-last"
          label="Prezime"
          required
          error={errors['user.lastName']}
        >
          <input
            id="user-last"
            className="register-field__input"
            type="text"
            value={user.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            onBlur={() => onBlur('user.lastName')}
            aria-invalid={errors['user.lastName'] ? true : undefined}
            aria-describedby={errors['user.lastName'] ? 'user-last-error' : undefined}
            autoComplete="family-name"
          />
        </WizardField>
      </div>

      <WizardField id="user-email" label="Email" required error={errors['user.email']}>
        <input
          id="user-email"
          className="register-field__input"
          type="email"
          value={user.email}
          onChange={(e) => onChange('email', e.target.value)}
          onBlur={() => onBlur('user.email')}
          aria-invalid={errors['user.email'] ? true : undefined}
          aria-describedby={errors['user.email'] ? 'user-email-error' : undefined}
          placeholder="ime@ordinacija.rs"
          autoComplete="email"
        />
      </WizardField>

      <WizardField
        id="user-phone"
        label="Telefon"
        required
        error={errors['user.phone']}
        hint="Prefiks možeš slobodno izmeniti."
      >
        <input
          id="user-phone"
          className="register-field__input"
          type="tel"
          value={user.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          onBlur={() => onBlur('user.phone')}
          aria-invalid={errors['user.phone'] ? true : undefined}
          aria-describedby={errors['user.phone'] ? 'user-phone-error' : undefined}
          autoComplete="tel"
        />
      </WizardField>

      <WizardField id="user-source" label="Kako ste saznali za nas?">
        <input
          id="user-source"
          className="register-field__input"
          type="text"
          value={user.source}
          onChange={(e) => onChange('source', e.target.value)}
          placeholder="Preporuka kolege, pretraga, Instagram..."
        />
      </WizardField>
    </div>
  );
}
