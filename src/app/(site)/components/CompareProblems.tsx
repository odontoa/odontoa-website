'use client';

import * as React from 'react';
import { Check, X } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

type Row = { feature: string; values: boolean[] };

export function OdontoaCompareTable({
  title = 'Prepoznajete li ove probleme? – 2',
  columns,
  rows,
  emphasizeIndex = 0, // 0 = Odontoa
}: {
  title?: string;
  columns: string[];
  rows: Row[];
  emphasizeIndex?: number;
}) {
  // Odontoa brend
  const BG = '#0C2E1C';      // dark green
  const LIME = '#CFF86A';    // lime

  const gridTemplate = {
    display: 'grid',
    gridTemplateColumns: `minmax(240px,1fr) repeat(${columns.length}, 150px)`,
    alignItems: 'center',
  } as React.CSSProperties;

  const tableRef = React.useRef<HTMLDivElement>(null);
  const [hilite, setHilite] = React.useState<{left:number;width:number}|null>(null);

  const sectionRef = React.useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  React.useLayoutEffect(() => {
    const root = tableRef.current;
    if (!root) return;
    const cell = root.querySelector<HTMLElement>(`[data-row="0"][data-col="${emphasizeIndex}"]`);
    if (!cell) return;
    const rootBox = root.getBoundingClientRect();
    const cellBox = cell.getBoundingClientRect();
    setHilite({ left: cellBox.left - rootBox.left, width: cellBox.width });
  }, [columns.length, rows.length, emphasizeIndex]);

  return (
    <section ref={sectionRef} className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl rounded-2xl px-5 pb-8 pt-6" style={{ background: BG }}>
        {/* Header */}
        <motion.div
          className="mx-auto max-w-5xl rounded-2xl bg-white px-6 py-4 shadow-sm sticky top-16 z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid" style={gridTemplate}>
            <motion.div
              className="text-2xl md:text-3xl font-extrabold text-neutral-900"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {title}
            </motion.div>

            {columns.map((c, i) => (
              <motion.div
                key={i}
                className="flex items-center justify-center text-base md:text-lg font-semibold text-neutral-800 pt-[2px]"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {c}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Desktop tabela */}
        <div className="mx-auto mt-4 max-w-5xl hidden sm:block">
          <div className="relative" ref={tableRef}>
            {hilite && (
              <motion.div
                aria-hidden="true"
                className="absolute top-0 bottom-0 rounded-lg pointer-events-none"
                style={{
                  left: hilite.left,
                  width: hilite.width,
                  background: 'rgba(255,255,255,0.05)',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.10)',
                  zIndex: 0,
                }}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            )}

            <div className="relative z-10 space-y-0">
              {rows.map((r, ri) => (
                <motion.div
                  key={ri}
                  className={`grid ${ri === 0 ? '' : 'border-t border-white/10'} py-5 md:py-6`}
                  style={gridTemplate}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.3 + ri * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    className="pl-2 text-white/90 text-[15px] md:text-base"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.6, delay: 0.4 + ri * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {r.feature}
                  </motion.div>

                  {r.values.map((v, vi) => (
                    <motion.div
                      key={vi}
                      className="flex items-center justify-center"
                      data-row={ri}
                      data-col={vi}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.5 + ri * 0.1 + vi * 0.05,
                        ease: [0.22, 1, 0.36, 1],
                        type: 'spring',
                        stiffness: 200,
                        damping: 20,
                      }}
                    >
                      {v ? (
                        <motion.span
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full"
                          style={{ background: 'rgba(207,248,106,0.18)' }}
                          title="Uključeno"
                          aria-label={`${columns[vi]}: uključeno`}
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                        >
                          <motion.svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={LIME}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                            initial={{ pathLength: 0 }}
                            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                            transition={{ duration: 0.8, delay: 0.7 + ri * 0.1 + vi * 0.05, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </motion.svg>
                        </motion.span>
                      ) : (
                        <motion.span
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10"
                          style={{ background: 'rgba(255,92,92,0.15)' }}
                          title="Nije uključeno"
                          aria-label={`${columns[vi]}: nije uključeno`}
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                        >
                          <motion.div
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={isInView ? { rotate: 0, opacity: 1 } : { rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 + ri * 0.1 + vi * 0.05, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <X className="h-5 w-5" color="#FF5C5C" strokeWidth={2.5} />
                          </motion.div>
                        </motion.span>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden mt-4 space-y-3">
          {rows.map((r, ri) => (
            <motion.div
              key={ri}
              className="rounded-lg border border-white/10 bg-white/5 p-3"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 + ri * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="text-white font-medium mb-3"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.6, delay: 0.4 + ri * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {r.feature}
              </motion.div>
              <div className="grid grid-cols-2 gap-3">
                {columns.map((c, i) => {
                  const v = r.values[i];
                  const emphas = i === emphasizeIndex;
                  return (
                    <motion.div
                      key={c}
                      className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5, delay: 0.5 + ri * 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <span className={`text-xs ${emphas ? 'font-semibold text-white' : 'text-white/80'}`}>{c}</span>
                      {v ? (
                        <motion.span
                          className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${emphas ? 'bg-[rgba(207,248,106,0.28)]' : 'bg-[rgba(207,248,106,0.18)]'}`}
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                        >
                          <Check className="h-4 w-4" color={LIME} />
                        </motion.span>
                      ) : (
                        <motion.span
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(255,92,92,0.15)] border border-white/10"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                        >
                          <X className="h-4 w-4" color="#FF5C5C" strokeWidth={2.5} />
                        </motion.span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
