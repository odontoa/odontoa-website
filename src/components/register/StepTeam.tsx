import WizardField from './WizardField';
import {
  CURRENT_SYSTEMS,
  OTHER_SOFTWARE,
  PATIENT_VOLUMES,
  type CurrentSystem,
  type PatientVolume,
  type TeamData,
} from './wizard-data';

interface StepTeamProps {
  team: TeamData;
  onChange: (field: keyof TeamData, value: string) => void;
  onToggleSystem: (system: CurrentSystem) => void;
}

export default function StepTeam({ team, onChange, onToggleSystem }: StepTeamProps) {
  return (
    <div className="register-step">
      <h2 className="register-step__title">Tim i trenutni sistem</h2>
      <p className="register-step__lead">
        Sva polja su opciona. Pomažu nam da pripremimo uvoz podataka pre razgovora.
      </p>

      <div className="register-step__row">
        <WizardField id="team-chairs" label="Broj stolica">
          <input
            id="team-chairs"
            className="register-field__input"
            type="number"
            inputMode="numeric"
            min={0}
            value={team.chairs}
            onChange={(e) => onChange('chairs', e.target.value)}
            placeholder="2"
          />
        </WizardField>

        <WizardField id="team-members" label="Broj doktora / članova tima">
          <input
            id="team-members"
            className="register-field__input"
            type="number"
            inputMode="numeric"
            min={0}
            value={team.members}
            onChange={(e) => onChange('members', e.target.value)}
            placeholder="4"
          />
        </WizardField>
      </div>

      <div className="register-field">
        <span className="register-field__label">Šta trenutno koristite?</span>
        <p className="register-field__hint register-field__hint--above">
          Možeš izabrati više odgovora.
        </p>
        <div className="register-choices">
          {CURRENT_SYSTEMS.map((system) => {
            const checked = team.currentSystem.includes(system);
            return (
              <label
                key={system}
                className={
                  checked ? 'register-choice register-choice--on' : 'register-choice'
                }
              >
                <input
                  type="checkbox"
                  className="register-choice__check"
                  checked={checked}
                  onChange={() => onToggleSystem(system)}
                />
                <span className="register-choice__label">{system}</span>
              </label>
            );
          })}
        </div>
      </div>

      {team.currentSystem.includes(OTHER_SOFTWARE) && (
        <WizardField id="team-system-other" label="Koji">
          <input
            id="team-system-other"
            className="register-field__input"
            type="text"
            value={team.currentSystemOther}
            onChange={(e) => onChange('currentSystemOther', e.target.value)}
            placeholder="Naziv softvera"
          />
        </WizardField>
      )}

      <WizardField id="team-volume" label="Okvirno pacijenata">
        <select
          id="team-volume"
          className="register-field__input register-field__select"
          value={team.patientVolume}
          onChange={(e) => onChange('patientVolume', e.target.value as PatientVolume)}
        >
          <option value="">Izaberi</option>
          {PATIENT_VOLUMES.map((volume) => (
            <option key={volume} value={volume}>
              {volume}
            </option>
          ))}
        </select>
      </WizardField>
    </div>
  );
}
