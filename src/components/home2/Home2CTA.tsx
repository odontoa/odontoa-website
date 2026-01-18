'use client';

import React from 'react';
import { DemoForm } from '@/components/DemoForm';
import { Zap, Shield, Clock } from 'lucide-react';

const Home2CTA = () => {
  return (
    <section className="w-full bg-white py-20">
      <div className="mx-auto max-w-[1240px] px-[10px]">
        <div 
          className="flex flex-col lg:flex-row items-center gap-12 bg-gradient-to-br from-[#F5F8FF] to-[#FBFDFF] border border-[#EEF2F7] rounded-xl p-8 md:p-12"
          style={{ 
            boxShadow: '0 20px 60px rgba(50, 103, 255, 0.15), 0 8px 30px rgba(15, 23, 42, 0.08)'
          }}
        >
          {/* Left Column - Content */}
          <div className="w-full lg:w-[620px]">
            <div className="mb-4">
              <div 
                className="inline-flex items-center gap-[0.97px] border rounded-[4px]"
                style={{
                  padding: '6px 15.81px 7.39px 16.97px',
                  borderColor: '#EEEEEE',
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  lineHeight: '1.6em',
                  color: '#3267FF'
                }}
              >
                Kontaktirajte nas
              </div>
            </div>
            <h2
              className="text-[#000A2D] mb-6"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 800,
                fontSize: '52px',
                lineHeight: '1.1em',
                letterSpacing: '-2.88%'
              }}
            >
              Postanite naš sledeći<br />
              zadovoljni klijent
            </h2>
            <p
              className="text-[#636571]"
              style={{
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '1.6em'
              }}
            >
              Zakažite demo i saznajte kako da automatizujete zakazivanja, smanjite broj propuštenih termina i uštedite 10+ sati nedeljno. Sve to bez komplikovane obuke.
            </p>
          </div>

          {/* Right Column - Form */}
          <div className="w-full lg:w-[480px]">
            <DemoForm 
              title="Zakažite demo"
              description="Kontaktirajte nas za besplatan demo Odontoa sistema"
              buttonText="Zakaži demo"
            />
            
            {/* Additional Info */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-6">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#3267FF]" />
                <span className="text-sm text-[#636571]" style={{ fontFamily: 'Archivo, sans-serif' }}>Demo traje 15 minuta</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#3267FF]" />
                <span className="text-sm text-[#636571]" style={{ fontFamily: 'Archivo, sans-serif' }}>Bez obaveze</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#3267FF]" />
                <span className="text-sm text-[#636571]" style={{ fontFamily: 'Archivo, sans-serif' }}>Odmah dostupan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home2CTA;

