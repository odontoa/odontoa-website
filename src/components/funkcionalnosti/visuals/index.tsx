import type { ReactNode } from 'react';
import ProductStage, { type StageLayout } from '../ProductStage';
import { CalendarDetail, CalendarScreen } from './Calendar';
import { KartonScreen, OdontogramDetail } from './Karton';
import { RtgScreen, RtgViewer } from './Rtg';
import { TehnikaOrder, TehnikaScreen } from './Tehnika';
import { DokumentacijaScreen, SaglasnostDoc } from './Dokumentacija';
import { FinansijeFocus, FinansijeScreen } from './Finansije';
import { AsistentPanel, AsistentScreen } from './Asistent';
import './product.css';

type FeatureVisualSpec = {
  label: string;
  back: () => ReactNode;
  front: () => ReactNode;
  layout: StageLayout;
};

/*
 * Prikaz proizvoda po funkcionalnosti (H5 + V3). Kompozicije su iz finalne verzije
 * Funkcionalnosti laboratorije; brojevi su koordinate ploce od 1080px.
 */
const STD = { height: 700, back: [40, 40, 0.8] as [number, number, number], backOpacity: 0.55, front: { right: 40, bottom: 40 } };

export const FEATURE_VISUALS: Record<string, FeatureVisualSpec> = {
  'zakazivac-termina': {
    label: 'Kalendar termina u Odontoi: nedelja 27–31. jul, termini po statusu i termin pomeren na 13:15 uz obaveštenje pacijentu.',
    back: () => <CalendarScreen />,
    front: () => <CalendarDetail />,
    layout: { ...STD, frontWidth: 620, frontHeight: 440, focusX: 1 },
  },
  'karton-i-odontogram': {
    label: 'Karton pacijentkinje u Odontoi sa odontogramom i statusima zuba (karijes, ispun, krunica, endodoncija); otvoren zub 36 sa dijagnozom K04.0.',
    back: () => <KartonScreen />,
    front: () => <OdontogramDetail />,
    layout: { ...STD, frontWidth: 640, frontHeight: 480, focusX: 0.85 },
  },
  'rtg-i-fotografije': {
    label: 'Pregled snimka u kartonu: veliki panoramski rendgen snimak i traka sa još jednim panoramskim, periapikalnim snimkom i intraoralnom fotografijom; iza je galerija snimaka pacijenta.',
    back: () => <RtgScreen />,
    front: () => <RtgViewer />,
    layout: { ...STD, frontWidth: 640, frontHeight: 470, focusX: 0.5, mobileMin: 0.5 },
  },
  'zubna-tehnika': {
    label: 'Lista radnih naloga i otvoren nalog za tehničara: laboratorija, rok, bezmetalna krunica na zubu 16, boja A2 i cena rada.',
    back: () => <TehnikaScreen />,
    front: () => <TehnikaOrder />,
    layout: { height: 520, back: [28, 28, 0.96], backOpacity: 0.55, front: { right: 40, top: 40 }, frontWidth: 440, frontHeight: 410, focusX: 0 },
  },
  'dokumentacija-i-saglasnosti': {
    label: 'Saglasnost za vađenje zuba sa zaglavljem ordinacije i potpisima pacijenta i stomatologa; može da se odštampa ili potpiše na tabletu. Iza je lista šablona dokumenata.',
    back: () => <DokumentacijaScreen />,
    front: () => <SaglasnostDoc />,
    layout: { height: 580, back: [40, 40, 0.8], backOpacity: 0.55, front: { right: 60, top: 40 }, frontWidth: 470, frontHeight: 500, focusX: 0.5 },
  },
  'finansije-i-podsetnici': {
    label: 'Predračun pacijentkinje sa preostalim dugom od 98.800 RSD i zakazanim SMS podsetnikom za dug.',
    back: () => <FinansijeScreen />,
    front: () => <FinansijeFocus />,
    layout: { height: 540, back: [36, 36, 0.9], backOpacity: 0.72, front: { right: 30, top: 70 }, frontWidth: 430, frontHeight: 360, focusX: 0 },
  },
  'ai-asistent': {
    label: 'Doktorka pita Odontoa asistenta koji pacijenti duguju više od 20.000 RSD i dobija odgovor iz podataka ordinacije.',
    back: () => <AsistentScreen />,
    front: () => <AsistentPanel />,
    layout: { height: 790, back: [36, 60, 0.74], backOpacity: 0.42, front: { right: 44, top: 36, scale: 1.04 }, frontWidth: 470, frontHeight: 700, focusX: 0.5 },
  },
};

/** Ceo prikaz (pozadina + detalj) za hero stranice funkcionalnosti. */
export function FeatureProduct({ slug }: { slug: string }) {
  const v = FEATURE_VISUALS[slug];
  if (!v) return null;
  return <ProductStage label={v.label} layout={v.layout} back={v.back()} front={v.front()} />;
}

/** Samo detalj (bez pozadine), za product canvas na /funkcionalnosti. */
export function FeatureDetail({ slug }: { slug: string }) {
  const v = FEATURE_VISUALS[slug];
  return v ? <>{v.front()}</> : null;
}
