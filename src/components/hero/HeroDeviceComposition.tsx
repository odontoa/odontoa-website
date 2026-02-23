'use client';

import React from 'react';
import Image from 'next/image';

/**
 * HeroDeviceComposition — static hero artwork.
 * Renders new-her-2-image.svg as a simple responsive image.
 * No live React screens, no slot positioning, no overlays.
 */
export function HeroDeviceComposition() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Image
        src="/images/hero-bg-home2.svg"
        alt="Odontoa dashboard prikaz"
        width={900}
        height={600}
        priority
        className="w-full h-auto object-contain"
        style={{ maxWidth: '100%' }}
      />
    </div>
  );
}
