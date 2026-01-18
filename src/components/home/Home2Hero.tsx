'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Image from 'next/image';

const Home2Hero = () => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background gradient - matching Figma fill_7DHPMG */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, rgba(255, 255, 255, 1) 74%, rgba(241, 248, 255, 1) 74%)'
        }}
      />

      <div className="relative mx-auto max-w-[1240px] px-[10px] py-0">
        <div className="flex flex-col lg:flex-row items-start gap-0" style={{ paddingTop: '70px', minHeight: '771.42px' }}>
          {/* Left Column - Content - Exact Figma layout */}
          <div className="w-full lg:w-[620px] flex flex-col relative" style={{ paddingTop: '0px' }}>
            {/* Badge - Exact Figma positioning */}
            <div style={{ paddingLeft: '10px', paddingTop: '77.92px' }}>
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
                <span className="mr-[0.97px]">👋</span>
                <span>Hey! We Are Dentic</span>
              </div>
            </div>

            {/* Main Heading - Exact Figma positioning */}
            <div style={{ paddingLeft: '5px', paddingTop: '53.39px' }}>
              <h1
                className="text-[#000A2D]"
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 800,
                  fontSize: '68px',
                  lineHeight: '1.1em',
                  letterSpacing: '-2.2%',
                  maxWidth: '494.83px'
                }}
              >
                Helping You to<br />
                Bring Back Your<br />
                Happy Smile
              </h1>
            </div>

            {/* Description - Exact Figma positioning */}
            <div style={{ paddingLeft: '10px', paddingTop: '24px', maxWidth: '450px' }}>
              <p
                className="text-[#636571]"
                style={{
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '1.6em'
                }}
              >
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                <br /><br />
                Aenean commodo ligula eget dolor. Aenean massa. Cum sociis
                <br /><br />
                natoque penatibus et magnis dis parturient.
              </p>
            </div>

            {/* Decorative line image placeholder - Exact Figma positioning */}
            <div className="hidden lg:block" style={{ position: 'absolute', left: '390.17px', top: '352.44px', width: '35.66px', height: '37.68px' }}>
              {/* This would be the draw-line.png from Figma */}
              <div className="w-full h-full bg-[#636571] opacity-20" />
            </div>

            {/* Customer Satisfaction Card - Exact Figma dimensions and positioning */}
            <div style={{ paddingLeft: '60px', paddingTop: '24px', position: 'relative' }}>
              <div 
                className="relative rounded-[4px]"
                style={{
                  width: '268.81px',
                  height: '151.39px',
                  background: 'rgba(255, 255, 255, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.7)',
                  boxShadow: '3px 0px 12px 0px rgba(32, 145, 255, 0.13)'
                }}
              >
                {/* Background decoration circles (avatar placeholders) */}
                <div 
                  className="absolute rounded-full border-[4px] border-white"
                  style={{
                    left: '21px',
                    top: '21px',
                    width: '48px',
                    height: '48px',
                    background: '#E9E9E9'
                  }}
                />
                <div 
                  className="absolute rounded-full border-[4px] border-white"
                  style={{
                    left: '54px',
                    top: '21px',
                    width: '48px',
                    height: '48px',
                    background: '#E9E9E9'
                  }}
                />
                <div 
                  className="absolute rounded-full border-[4px] border-white"
                  style={{
                    left: '87px',
                    top: '21px',
                    width: '48px',
                    height: '48px',
                    background: '#E9E9E9'
                  }}
                />

                {/* Number "180" */}
                <span
                  className="absolute text-[#000A2D]"
                  style={{
                    left: '145px',
                    top: '16px',
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 800,
                    fontSize: '42px',
                    lineHeight: '1em'
                  }}
                >
                  180
                </span>

                {/* Plus icon button */}
                <div 
                  className="absolute bg-[#3267FF] rounded-[14px] flex items-center justify-center text-white"
                  style={{
                    left: '211.55px',
                    top: '30.7px',
                    width: '28px',
                    height: '28px',
                    padding: '7px 7.13px 7px 7.87px',
                    fontFamily: 'Font Awesome 5 Free, sans-serif',
                    fontWeight: 900,
                    fontSize: '14px',
                    lineHeight: '1em'
                  }}
                >
                  +
                </div>

                {/* "Satisfied Customer" text */}
                <span
                  className="absolute text-[#000A2D]"
                  style={{
                    left: '21px',
                    top: '83px',
                    width: '150.64px',
                    height: '22px',
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '1em'
                  }}
                >
                  Satisfied Customer
                </span>

                {/* Star rating */}
                <div 
                  className="absolute flex gap-[6px]"
                  style={{
                    left: '21px',
                    top: '109px'
                  }}
                >
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16.02" height="25.59" viewBox="0 0 16.02 25.59" fill="none">
                      <path d="M8.01 0L9.81 5.49L15.69 5.49L10.89 9.18L12.69 14.67L8.01 10.98L3.33 14.67L5.13 9.18L0.33 5.49L6.21 5.49L8.01 0Z" fill="#FFA63A"/>
                    </svg>
                  ))}
                </div>

                {/* "4.9/5 Review" text */}
                <span
                  className="absolute text-[#636571]"
                  style={{
                    left: '135.08px',
                    top: '113px',
                    width: '80.62px',
                    height: '15px',
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '1.6em'
                  }}
                >
                  4.9/5 Review
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Image - Exact Figma positioning */}
          <div className="w-full lg:w-[620px] lg:ml-0 mt-[40px] lg:mt-[70px]">
            <div className="relative w-full" style={{ height: '541.42px' }}>
              {/* Placeholder for dentist image */}
              <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-[4px] flex items-center justify-center">
                <span className="text-[#636571] text-sm">Dentist Image</span>
              </div>
            </div>
          </div>
        </div>

        {/* Three Feature Boxes Below */}
        <div className="mt-[40px] grid grid-cols-1 md:grid-cols-3 gap-[20px] max-w-[1240px]">
          {/* Feature 1: Affordable Price */}
          <div className="bg-white border border-[#EEEEEE] rounded-[4px] p-[20px]">
            <div className="w-[60px] h-[60px] bg-[#F1F8FF] border border-[#EEEEEE] rounded-[4px] mb-[16px] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#3267FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="#3267FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#3267FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3
              className="text-[#000A2D] font-semibold mb-[8px]"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: '1.2em'
              }}
            >
              Affordable Price
            </h3>
            <p
              className="text-[#636571]"
              style={{
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '1.6em'
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus nec.
            </p>
          </div>

          {/* Feature 2: Professional Dentist */}
          <div className="bg-white border border-[#EEEEEE] rounded-[4px] p-[20px]">
            <div className="w-[60px] h-[60px] bg-[#F1F8FF] border border-[#EEEEEE] rounded-[4px] mb-[16px] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#3267FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="#3267FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3
              className="text-[#000A2D] font-semibold mb-[8px]"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: '1.2em'
              }}
            >
              Professional Dentist
            </h3>
            <p
              className="text-[#636571]"
              style={{
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '1.6em'
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus nec.
            </p>
          </div>

          {/* Feature 3: Satisfactory Service */}
          <div className="bg-white border border-[#EEEEEE] rounded-[4px] p-[20px]">
            <div className="w-[60px] h-[60px] bg-[#F1F8FF] border border-[#EEEEEE] rounded-[4px] mb-[16px] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#3267FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 4L12 14.01L9 11.01" stroke="#3267FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3
              className="text-[#000A2D] font-semibold mb-[8px]"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 600,
                fontSize: '20px',
                lineHeight: '1.2em'
              }}
            >
              Satisfactory Service
            </h3>
            <p
              className="text-[#636571]"
              style={{
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '1.6em'
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus nec.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home2Hero;

