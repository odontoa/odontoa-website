'use client';

import * as React from 'react';
import { Check, X } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

type Row = { feature: string; values: boolean[] };

export function OdontoaCompareTable({
  title = 'Odontoa ili papir i Excel?',
  columns,
  rows,
  emphasizeIndex = 0,
}: {
  title?: string;
  columns: string[];
  rows: Row[];
  emphasizeIndex?: number;
}) {
  const BG = 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(37, 99, 235, 0.08) 25%, rgba(14, 165, 233, 0.05) 50%, rgba(37, 99, 235, 0.08) 75%, rgba(255, 255, 255, 0.4) 100%)';
  const LIME = '#16A34A';

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
        <motion.div
          className="hidden sm:block w-full rounded-2xl bg-white px-6 py-4 shadow-sm sticky top-16 z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid" style={gridTemplate}>
            <motion.div
              className="text-2xl md:text-3xl font-extrabold text-neutral-900 pl-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {title}
            </motion.div>

            {columns.map((c, i) => (
              <motion.div
                key={i}
                className="flex items-center justify-center text-base md:text-lg font-semibold text-neutral-800 whitespace-nowrap"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              >
                {c}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Desktop */}
        <div className="mx-auto mt-4 max-w-5xl hidden sm:block">
          <div className="relative" ref={tableRef}>
            {hilite && (
              <motion.div
                aria-hidden="true"
                className="absolute top-0 bottom-0 rounded-lg pointer-events-none"
                style={{
                  left: hilite.left,
                  width: hilite.width,
                  background: 'rgba(59, 130, 246, 0.1)',
                  boxShadow: 'inset 0 0 0 1px rgba(59, 130, 246, 0.2)',
                }}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            )}

            <div className="relative z-10">
              {rows.map((r, ri) => (
                <motion.div
                  key={ri}
                  className={`grid ${ri === 0 ? '' : 'border-t border-slate-300/50'} py-5 md:py-6`}
                  style={gridTemplate}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ 
                    duration: 0.7, 
                    delay: 0.3 + ri * 0.18,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  <motion.div
                    className="pl-6 text-slate-700 text-[15px] md:text-base"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ 
                      duration: 0.7, 
                      delay: 0.35 + ri * 0.18,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    {r.feature}
                  </motion.div>

                  {r.values.map((v, vi) => (
                    <motion.div
                      key={vi}
                      className="flex items-center justify-center pl-4"
                      data-row={ri}
                      data-col={vi}
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.45 + ri * 0.18 + vi * 0.05,
                      }}
                    >
                      {v ? (
                        <motion.span
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full"
                          style={{ background: 'rgba(22, 163, 74, 0.15)' }}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={isInView ? { 
                            opacity: 1, 
                            scale: [0, 1.2, 1]
                          } : { opacity: 0, scale: 0 }}
                          transition={{
                            duration: 0.6,
                            delay: 0.5 + ri * 0.18 + vi * 0.05,
                            ease: [0.34, 1.56, 0.64, 1]
                          }}
                        >
                          <Check className="h-5 w-5" color={LIME} strokeWidth={3} />
                        </motion.span>
                      ) : (
                        <span
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300/40"
                          style={{ background: 'rgba(255,92,92,0.15)' }}
                        >
                          <X className="h-5 w-5" color="#FF5C5C" strokeWidth={2.5} />
                        </span>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="sm:hidden mt-4">
          {/* Mobile Header */}
          <motion.div
            className="bg-white rounded-2xl px-4 py-4 mb-3 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className="text-xl font-extrabold text-neutral-900">
                {title}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-neutral-800">Odontoa</span>
                <span className="text-sm font-semibold text-neutral-800">Ručno</span>
              </div>
            </div>
          </motion.div>

          {/* Mobile Rows */}
          <div className="space-y-2">
            {rows.map((r, ri) => (
              <motion.div
                key={ri}
                className="bg-white/60 rounded-lg border border-slate-300/50 px-4 py-3"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ 
                  duration: 0.7, 
                  delay: 0.3 + ri * 0.18, 
                  ease: [0.22, 1, 0.36, 1] 
                }}
              >
                <div className="flex items-center justify-between">
                  <motion.div
                    className="text-slate-700 font-medium text-sm flex-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.7, delay: 0.35 + ri * 0.18, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {r.feature}
                  </motion.div>
                  <div className="flex items-center gap-6 ml-4">
                    {r.values.map((v, vi) => (
                      <motion.div
                        key={vi}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={isInView ? { 
                          opacity: 1, 
                          scale: [0, 1.2, 1]
                        } : { opacity: 0, scale: 0 }}
                        transition={{
                          duration: 0.6,
                          delay: 0.5 + ri * 0.18 + vi * 0.05,
                          ease: [0.34, 1.56, 0.64, 1]
                        }}
                      >
                        {v ? (
                          <motion.span
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                            style={{ 
                              background: vi === emphasizeIndex ? 'rgba(22, 163, 74, 0.25)' : 'rgba(22, 163, 74, 0.15)'
                            }}
                          >
                            <Check className="h-4 w-4" color={LIME} />
                          </motion.span>
                        ) : (
                          <span
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(255,92,92,0.15)] border border-slate-300/40"
                          >
                            <X className="h-4 w-4" color="#FF5C5C" strokeWidth={2.5} />
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
