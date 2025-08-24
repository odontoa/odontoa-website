'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, X } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface StickyCTAProps {
  className?: string;
}

export function StickyCTA({ className }: StickyCTAProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Prikaži nakon 50% scroll-a na desktop-u
      if (window.innerWidth >= 768) {
        setIsVisible(scrollY > windowHeight * 0.5 && scrollY < documentHeight - windowHeight - 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 hidden md:block",
      className
    )}>
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 max-w-xs">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-normal text-gray-900 mb-1">
              Zakažite demo
            </h4>
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">
              Vidite kako Odontoa može da transformiše vašu ordinaciju
            </p>
            <Button asChild size="sm" className="w-full text-white">
              <Link href="#demo">
                Zakaži demo
              </Link>
            </Button>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 