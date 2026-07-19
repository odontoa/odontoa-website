'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';

/*
  Scroll reveal za krupne celine sekcija (header blok, vizual). Ne koristi se u herou.
  Uvek renderuje motion.div (i za reduced-motion) - grananje na obican <div> pravi
  hydration mismatch sa SSR inline stilovima (opacity:0 ostane zauvek). Kod reduced
  korisnika "hidden" varijanta je vec finalno stanje, pa nema nikakve animacije.
*/
export default function Reveal({
  children,
  delay = 0,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: reduced
            ? { duration: 0 }
            : { duration: 0.55, ease: [0.2, 0.7, 0.3, 1], delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
