'use client';

import React from 'react';
import { DemoForm } from '@/components/DemoForm';
import { Zap, Shield, Clock } from 'lucide-react';

const Home2CTA = () => {
  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1240px] px-[10px]">
        <div className="flex flex-col lg:flex-row items-center gap-12 bg-gradient-to-br from-muted/50 to-background border border-border rounded-xl p-6 md:p-8 shadow-md">
          {/* Left Column - Content */}
          <div className="w-full lg:w-[620px]">
            <div className="mb-4">
              <div
                className="inline-flex items-center gap-[0.97px] border rounded-full px-4 py-1.5 text-sm font-bold leading-relaxed"
                style={{
                  borderColor: '#EEEEEE',
                  color: '#3267FF',
                }}
              >
                Zakažite demo
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight text-foreground mb-6">
              Pogledajte Odontoa uživo
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Za 15 minuta videćete kako ordinacija ubrzava rad i dobija jasne brojke za bolju organizaciju dana. Bez obaveze i bez komplikovane obuke.
            </p>
          </div>

          {/* Right Column - Form */}
          <div className="w-full lg:w-[480px]">
            <DemoForm 
              title="Zakažite demo"
              description="Ostavite kontakt, javićemo vam se u toku dana"
              buttonText="Zakažite demo"
            />
            
            {/* Additional Info - jedan red */}
            <div className="flex flex-nowrap justify-center items-center gap-4 sm:gap-6 mt-6">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground">15 min demo</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Bez obaveze</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Termin u dogovoru</span>
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-4">
              Podaci su zaštićeni. Ne šaljemo spam.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home2CTA;

