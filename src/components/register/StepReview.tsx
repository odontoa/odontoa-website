import {
  displayValue,
  formatAddress,
  formatCountry,
  formatCurrentSystems,
  formatHoursSummary,
  type WizardData,
} from './wizard-data';

interface StepReviewProps {
  data: WizardData;
  onEdit: (step: 1 | 2 | 3 | 4) => void;
}

export default function StepReview({ data, onEdit }: StepReviewProps) {
  const { clinic, hours, team, user } = data;

  return (
    <div className="register-step">
      <h2 className="register-step__title">Provera</h2>
      <p className="register-step__lead">
        Pogledaj podatke pre slanja. Svaku sekciju možeš izmeniti.
      </p>

      <section className="register-review__group">
        <div className="register-review__head">
          <h3 className="register-review__title">O ordinaciji</h3>
          <button type="button" className="register-linkbtn" onClick={() => onEdit(1)}>
            Izmeni
          </button>
        </div>
        <dl className="register-review__list">
          <div>
            <dt>Naziv</dt>
            <dd>{displayValue(clinic.name)}</dd>
          </div>
          <div>
            <dt>Adresa</dt>
            <dd>{formatAddress(clinic)}</dd>
          </div>
          <div>
            <dt>Država</dt>
            <dd>{formatCountry(clinic)}</dd>
          </div>
        </dl>
      </section>

      <section className="register-review__group">
        <div className="register-review__head">
          <h3 className="register-review__title">Radno vreme</h3>
          <button type="button" className="register-linkbtn" onClick={() => onEdit(2)}>
            Izmeni
          </button>
        </div>
        <p className="register-review__summary">{formatHoursSummary(hours)}</p>
      </section>

      <section className="register-review__group">
        <div className="register-review__head">
          <h3 className="register-review__title">Tim i trenutni sistem</h3>
          <button type="button" className="register-linkbtn" onClick={() => onEdit(3)}>
            Izmeni
          </button>
        </div>
        <dl className="register-review__list">
          <div>
            <dt>Broj stolica</dt>
            <dd>{displayValue(team.chairs)}</dd>
          </div>
          <div>
            <dt>Broj doktora / članova tima</dt>
            <dd>{displayValue(team.members)}</dd>
          </div>
          <div>
            <dt>Trenutno koriste</dt>
            <dd>{formatCurrentSystems(team)}</dd>
          </div>
          <div>
            <dt>Okvirno pacijenata</dt>
            <dd>{displayValue(team.patientVolume)}</dd>
          </div>
        </dl>
      </section>

      <section className="register-review__group">
        <div className="register-review__head">
          <h3 className="register-review__title">Glavni korisnik</h3>
          <button type="button" className="register-linkbtn" onClick={() => onEdit(4)}>
            Izmeni
          </button>
        </div>
        <dl className="register-review__list">
          <div>
            <dt>Ime i prezime</dt>
            <dd>{`${user.firstName.trim()} ${user.lastName.trim()}`.trim()}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{displayValue(user.email)}</dd>
          </div>
          <div>
            <dt>Telefon</dt>
            <dd>{displayValue(user.phone)}</dd>
          </div>
          <div>
            <dt>Kako su saznali za nas</dt>
            <dd>{displayValue(user.source)}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
