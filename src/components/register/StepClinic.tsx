import WizardField from './WizardField';
import {
  COUNTRIES,
  COUNTRY_LABELS,
  COUNTRY_OTHER,
  type ClinicData,
  type Country,
  type Errors,
} from './wizard-data';

interface StepClinicProps {
  clinic: ClinicData;
  errors: Errors;
  onChange: (field: keyof ClinicData, value: string) => void;
  onCountryChange: (country: Country) => void;
  onBlur: (key: string) => void;
}

export default function StepClinic({
  clinic,
  errors,
  onChange,
  onCountryChange,
  onBlur,
}: StepClinicProps) {
  return (
    <div className="register-step">
      <h2 className="register-step__title">O ordinaciji</h2>
      <p className="register-step__lead">
        Osnovni podaci ordinacije. Samo naziv je obavezan, ostalo možeš dopuniti kasnije.
      </p>

      <WizardField
        id="clinic-name"
        label="Naziv ordinacije"
        required
        error={errors['clinic.name']}
      >
        <input
          id="clinic-name"
          className="register-field__input"
          type="text"
          value={clinic.name}
          onChange={(e) => onChange('name', e.target.value)}
          onBlur={() => onBlur('clinic.name')}
          aria-invalid={errors['clinic.name'] ? true : undefined}
          aria-describedby={errors['clinic.name'] ? 'clinic-name-error' : undefined}
          placeholder="Stomatološka ordinacija Dent"
          autoComplete="organization"
        />
      </WizardField>

      <WizardField id="clinic-street" label="Ulica i broj">
        <input
          id="clinic-street"
          className="register-field__input"
          type="text"
          value={clinic.street}
          onChange={(e) => onChange('street', e.target.value)}
          placeholder="Knez Mihailova 12"
          autoComplete="street-address"
        />
      </WizardField>

      <div className="register-step__row">
        <WizardField id="clinic-zip" label="Poštanski broj">
          <input
            id="clinic-zip"
            className="register-field__input"
            type="text"
            inputMode="numeric"
            value={clinic.zip}
            onChange={(e) => onChange('zip', e.target.value)}
            placeholder="11000"
            autoComplete="postal-code"
          />
        </WizardField>

        <WizardField id="clinic-city" label="Grad">
          <input
            id="clinic-city"
            className="register-field__input"
            type="text"
            value={clinic.city}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder="Beograd"
            autoComplete="address-level2"
          />
        </WizardField>
      </div>

      <WizardField id="clinic-country" label="Država">
        <select
          id="clinic-country"
          className="register-field__input register-field__select"
          value={clinic.country}
          onChange={(e) => onCountryChange(e.target.value as Country)}
        >
          {COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {COUNTRY_LABELS[country]}
            </option>
          ))}
        </select>
      </WizardField>

      {clinic.country === COUNTRY_OTHER && (
        <WizardField id="clinic-country-other" label="Naziv države">
          <input
            id="clinic-country-other"
            className="register-field__input"
            type="text"
            value={clinic.countryOther}
            onChange={(e) => onChange('countryOther', e.target.value)}
            placeholder="Slovenija"
            autoComplete="country-name"
          />
        </WizardField>
      )}
    </div>
  );
}
