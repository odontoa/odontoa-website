'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

const Home2Testimonials = () => {
  const testimonials = [
    {
      quote: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.',
      author: 'José Correia',
      role: 'Marketing Manager',
      avatar: '👤'
    },
    {
      quote: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.',
      author: 'Agathe Dufour',
      role: 'Company CEO',
      avatar: '👤'
    }
  ];

  return (
    <section className="w-full bg-white py-20">
      <div className="mx-auto max-w-[1240px] px-[10px]">
        <div className="flex flex-col lg:flex-row gap-12">
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
                Our Testimonial
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
              The Honest Review<br />
              From Our Client
            </h2>
            <p
              className="text-[#636571] mb-8"
              style={{
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '1.6em'
              }}
            >
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient.
            </p>
            <Button
              className="bg-[#3267FF] text-white hover:bg-[#3267FF]/90 rounded-[4px] px-9 py-4 h-auto"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 700,
                fontSize: '15px',
                lineHeight: '1.6em'
              }}
            >
              See All Review
            </Button>
          </div>

          {/* Right Column - Testimonials */}
          <div className="w-full lg:w-[620px] flex flex-col gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white border border-[#EEEEEE] rounded-[4px] p-6 shadow-sm"
              >
                {/* Quote Icon */}
                <div className="mb-4">
                  <div 
                    className="w-12 h-12 bg-[#3267FF] rounded-[4px] flex items-center justify-center"
                  >
                    <span className="text-white text-2xl">"</span>
                  </div>
                </div>

                {/* Quote */}
                <p
                  className="text-[#636571] mb-6"
                  style={{
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 400,
                    fontSize: '17px',
                    lineHeight: '1.7em'
                  }}
                >
                  {testimonial.quote}
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p
                      className="text-[#000A2D] font-semibold"
                      style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 700,
                        fontSize: '18px',
                        lineHeight: '1.2em'
                      }}
                    >
                      {testimonial.author}
                    </p>
                    <p
                      className="text-[#636571]"
                      style={{
                        fontFamily: 'Archivo, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '1.1em'
                      }}
                    >
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home2Testimonials;





