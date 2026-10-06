import Image from 'next/image';
import { Camera, Plus, ScanLine } from 'lucide-react';
import { AppFrame, Pill } from './AppFrame';
import { PatientHead, PatientTabs } from './Karton';
import { RTG_MEDIA, RTG_PATIENT, RTG_VIEW, type MediaImage, type MediaKind } from './data';

/*
 * Snimci: pravi snimak preko next/image kad postoji src, inace neutralan slot iste
 * velicine (ikonica + vrsta). Zamena slike je samo upis src u data.ts.
 */
export function MediaSlot({ image, kind, sizes = '320px', fit = 'cover' }: { image: MediaImage; kind: MediaKind; sizes?: string; fit?: 'cover' | 'contain' }) {
  const Icon = kind === 'Rendgen' ? ScanLine : Camera;
  return (
    <div className={`pv-media-img${image.src ? '' : ' is-empty'}`}>
      {image.src ? (
        <Image src={image.src} alt="" fill sizes={sizes} style={{ objectFit: fit, objectPosition: image.position ?? 'center' }} />
      ) : (
        <span className="pv-slot">
          <Icon size={18} strokeWidth={1.6} />
          {kind}
        </span>
      )}
    </div>
  );
}

/** Pozadina: galerija "Snimci" u kartonu pacijenta. */
export function RtgScreen() {
  const xray = RTG_MEDIA.filter((m) => m.kind === 'Rendgen').length;
  return (
    <AppFrame active="pac" crumb="Pacijenti" current={RTG_PATIENT.name}>
      <PatientHead p={RTG_PATIENT} />
      <PatientTabs sub="Snimci" />
      <div className="pv-row pv-filters">
        <span className="pv-chip is-on">Svi ({RTG_MEDIA.length})</span>
        <span className="pv-chip">Rendgen snimci ({xray})</span>
        <span className="pv-chip">Fotografije ({RTG_MEDIA.length - xray})</span>
        <span className="pv-btn pv-btn--p pv-ml">
          <Plus size={14} strokeWidth={2} />
          Dodaj snimak
        </span>
      </div>
      <div className="pv-media">
        {RTG_MEDIA.map((m, i) => (
          <div key={m.title + i} className="pv-mcard">
            <MediaSlot image={m.image} kind={m.kind} />
            <div className="pv-mcard-meta">
              <b>
                {m.title}
                <Pill tone={m.kind === 'Rendgen' ? 'draft' : 'gray'}>{m.kind}</Pill>
              </b>
            </div>
          </div>
        ))}
      </div>
    </AppFrame>
  );
}

/** Prednji plan: pregled snimka, veliki panoramski RTG i traka sa svim snimcima i fotografijom. */
export function RtgViewer() {
  const main = RTG_MEDIA[RTG_VIEW.main];
  return (
    <div className="pv-surface pv-viewer">
      <div className="pv-row pv-viewer-h">
        <b>{main.title}</b>
        <Pill tone="draft">{main.kind}</Pill>
        <span className="pv-muted pv-ml pv-s12">
          {RTG_VIEW.strip.indexOf(RTG_VIEW.main) + 1} / {RTG_VIEW.strip.length}
        </span>
      </div>
      <div className="pv-viewer-main">
        <MediaSlot image={main.image} kind={main.kind} sizes="(max-width: 720px) 90vw, 640px" fit="contain" />
      </div>
      <div className="pv-viewer-strip">
        {RTG_VIEW.strip.map((i) => {
          const m = RTG_MEDIA[i];
          return (
            /* Bez natpisa ispod slicica: naziv izabranog snimka je u zaglavlju pregleda. */
            <div key={i} className={`pv-thumb${i === RTG_VIEW.main ? ' is-on' : ''}`}>
              <MediaSlot image={m.image} kind={m.kind} sizes="160px" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
