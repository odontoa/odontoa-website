'use client';

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type StageLayout = {
  /** Dizajnerska velicina ploce (px); ploca se skalira na sirinu kolone. */
  height: number;
  /** Pozadinska aplikacija: [x, y, scale] u koordinatama ploce, i prozirnost. */
  back: [number, number, number];
  backOpacity: number;
  /** Prednji detalj: pozicija u ploci i opciono uvecanje. */
  front: { right?: number; top?: number; bottom?: number; scale?: number };
  /** Prirodna sirina i priblizna visina detalja (za mobilni isecak pre merenja). */
  frontWidth: number;
  frontHeight: number;
  /** Na telefonu: koji deo detalja ostaje u kadru (0 levo, 1 desno). */
  focusX: number;
  /** Na telefonu: najmanja skala detalja (podrazumevano 0.74). Manja vrednost = ceo detalj, bez secenja. */
  mobileMin?: number;
};

const DESIGN_W = 1080;
/* Na telefonu se detalj ne smanjuje ispod ovoga; visak se sece oko focusX. */
const MOBILE_MIN_SCALE = 0.74;
const MOBILE_GUTTER = 14;
/* Prostor ispod detalja u canvasu indeksa, da senka kartice ne bude odsecena. */
const FIT_SHADOW = 28;

/**
 * H5 + V3: siroka aplikacija iza (kontekst) i detalj funkcionalnosti ispred.
 * Desktop: cela kompozicija u fiksnoj dizajnerskoj velicini, skalirana na sirinu.
 * Telefon: samo detalj, citljiv (najmanje 74%), isecen oko dela koji nosi poentu.
 * Sve je dekorativno (aria-hidden); smisao nosi aria-label.
 */
export default function ProductStage({ label, layout, back, front }: { label: string; layout: StageLayout; back: ReactNode; front: ReactNode }) {
  const deskRef = useRef<HTMLDivElement>(null);
  const mobRef = useRef<HTMLDivElement>(null);
  const mobInnerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const [mob, setMob] = useState<{ s: number; left: number; h: number } | null>(null);

  useIsoLayoutEffect(() => {
    const measure = () => {
      const d = deskRef.current;
      if (d && d.clientWidth) setScale(Math.min(1, d.clientWidth / DESIGN_W));
      const m = mobRef.current;
      const inner = mobInnerRef.current;
      if (m && inner && m.clientWidth) {
        const avail = m.clientWidth - MOBILE_GUTTER;
        const s = Math.max(layout.mobileMin ?? MOBILE_MIN_SCALE, Math.min(1, avail / layout.frontWidth));
        const overflow = Math.max(0, layout.frontWidth * s - avail);
        setMob({ s, left: MOBILE_GUTTER - overflow * layout.focusX, h: Math.ceil(inner.offsetHeight * s) + MOBILE_GUTTER * 2 });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (deskRef.current) ro.observe(deskRef.current);
    if (mobRef.current) ro.observe(mobRef.current);
    return () => ro.disconnect();
  }, [layout.frontWidth, layout.focusX, layout.mobileMin]);

  const { back: [bx, by, bs], front: f } = layout;
  const frontStyle: CSSProperties = {
    right: f.right,
    top: f.top,
    bottom: f.bottom,
    transform: f.scale ? `scale(${f.scale})` : undefined,
    transformOrigin: `${f.top != null ? 'top' : 'bottom'} right`,
  };

  return (
    <div className="pv-stage" role="img" aria-label={label}>
      <div
        ref={deskRef}
        className="pv-stage-d"
        style={{ aspectRatio: `${DESIGN_W} / ${layout.height}` }}
        aria-hidden="true"
      >
        <div
          className="pv-plate"
          style={{
            width: DESIGN_W,
            height: layout.height,
            ...(scale != null ? { transform: `scale(${scale})` } : {}),
          }}
        >
          <div className="pv-back" style={{ left: bx, top: by, transform: `scale(${bs})`, opacity: layout.backOpacity }}>
            {back}
          </div>
          <div className="pv-front" style={frontStyle}>
            {front}
          </div>
        </div>
      </div>
      <div
        ref={mobRef}
        className="pv-stage-m"
        style={{ height: mob ? mob.h : Math.round(layout.frontHeight * 0.8) }}
        aria-hidden="true"
      >
        <div
          ref={mobInnerRef}
          className="pv-stage-m-in"
          style={{
            width: layout.frontWidth,
            transform: `scale(${mob ? mob.s : 0.8})`,
            left: mob ? mob.left : MOBILE_GUTTER,
          }}
        >
          {front}
        </div>
      </div>
    </div>
  );
}

/** Detalj skaliran na sirinu kolone (nikad vise od 100%), za product canvas na /funkcionalnosti. */
export function DetailFit({ width, children }: { width: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ s: number; h: number } | null>(null);
  useIsoLayoutEffect(() => {
    const measure = () => {
      if (!ref.current || !inner.current || !ref.current.clientWidth) return;
      const s = Math.min(1, ref.current.clientWidth / width);
      setFit({ s, h: Math.ceil(inner.current.offsetHeight * s) + FIT_SHADOW });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (ref.current) ro.observe(ref.current);
    if (inner.current) ro.observe(inner.current);
    return () => ro.disconnect();
  }, [width]);
  return (
    <div ref={ref} className="pv-fit" style={fit ? { height: fit.h } : undefined} aria-hidden="true">
      <div
        ref={inner}
        className="pv-fit-in pv-canvas-solo"
        style={{ width, transform: fit ? `scale(${fit.s})` : undefined, left: fit ? `calc(50% - ${(width * fit.s) / 2}px)` : 0 }}
      >
        {children}
      </div>
    </div>
  );
}

/** Mobilni isecak detalja: najmanje 74%, isecen oko focusX (isti kao u heroju). */
export function DetailCrop({ width, height, focusX, minScale = MOBILE_MIN_SCALE, children }: { width: number; height: number; focusX: number; minScale?: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [mob, setMob] = useState<{ s: number; left: number; h: number } | null>(null);
  useIsoLayoutEffect(() => {
    const measure = () => {
      if (!ref.current || !inner.current || !ref.current.clientWidth) return;
      const avail = ref.current.clientWidth - MOBILE_GUTTER;
      const s = Math.max(minScale, Math.min(1, avail / width));
      const overflow = Math.max(0, width * s - avail);
      setMob({ s, left: MOBILE_GUTTER - overflow * focusX, h: Math.ceil(inner.current.offsetHeight * s) + MOBILE_GUTTER * 2 });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, [width, focusX, minScale]);
  return (
    <div ref={ref} className="pv-stage-m pv-crop" style={{ height: mob ? mob.h : Math.round(height * 0.8) }} aria-hidden="true">
      <div
        ref={inner}
        className="pv-stage-m-in pv-canvas-solo"
        style={{ width, transform: `scale(${mob ? mob.s : 0.8})`, left: mob ? mob.left : MOBILE_GUTTER }}
      >
        {children}
      </div>
    </div>
  );
}
