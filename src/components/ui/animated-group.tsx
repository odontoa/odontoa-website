'use client';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import React from 'react';

type PresetType =
  | 'fade'
  | 'slide'
  | 'scale'
  | 'blur'
  | 'blur-slide'
  | 'zoom'
  | 'flip'
  | 'bounce'
  | 'rotate'
  | 'swing';

type AnimatedGroupProps = {
  children: ReactNode;
  className?: string;
  variants?: {
    container?: unknown;
    item?: unknown;
  };
  preset?: PresetType;
};

// Jednostavna komponenta bez framer-motion animacija koje uzrokuju hydration probleme
// Animacije su sada CSS-based kroz klase
function AnimatedGroup({
  children,
  className,
}: AnimatedGroupProps) {
  return (
    <div className={cn('animate-in fade-in duration-700', className)}>
      {children}
    </div>
  );
}

export { AnimatedGroup }; 