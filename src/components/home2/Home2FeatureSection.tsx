'use client';

import React from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import CountUp from 'react-countup';

const Home2FeatureSection = () => {
  const progressItems = [
    {
      label: 'Digitalni kartoni i upravljanje',
      percentage: 95
    },
    {
      label: 'Automatsko zakazivanje i podsetnici',
      percentage: 87
    }
  ];

  return (
    <section className="w-full bg-white py-20">
      <div className="mx-auto max-w-[1240px] px-[10px]">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Column - Image */}
          <div className="w-full lg:w-[620px] relative">
            <div className="relative w-full h-[600px] rounded-[4px] overflow-hidden">
              <Image
                src="/images/1dentist-smiling.jpg"
                alt="Dentist"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 620px"
              />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="w-full lg:w-[620px] flex flex-col">
            {/* Badge */}
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
                Why Choose Us
              </div>
            </div>

            {/* Heading */}
            <h2
              className="text-[#000A2D] mb-6 flex items-center gap-3"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 800,
                fontSize: '52px',
                lineHeight: '1.1em',
                letterSpacing: '-2.88%'
              }}
            >
              Helping Your Dental Problems
              <Zap className="w-8 h-8 text-[#3267FF]" fill="#3267FF" />
            </h2>

            {/* Description */}
            <p
              className="text-[#636571] mb-8"
              style={{
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '1.6em'
              }}
            >
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
            </p>

            {/* Progress Bars */}
            <div className="space-y-6 mb-8">
              {progressItems.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[#000A2D]"
                      style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 600,
                        fontSize: '16px',
                        lineHeight: '1.2em'
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="text-[#3267FF] font-bold"
                      style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 700,
                        fontSize: '16px',
                        lineHeight: '1.2em'
                      }}
                    >
                      <CountUp
                        end={item.percentage}
                        duration={2}
                        enableScrollSpy
                        scrollSpyOnce
                      />%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#F1F8FF] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#3267FF] rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${item.percentage}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home2FeatureSection;

