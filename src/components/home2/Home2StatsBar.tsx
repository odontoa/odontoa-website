'use client';

import React from 'react';

const Home2StatsBar = () => {
  const stats = [
    {
      number: '1,200',
      label: 'Happy Client',
      icon: (
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
          <rect width="70" height="70" rx="4" fill="#3267FF" opacity="0.1"/>
          <path d="M35 20C30.5817 20 27 23.5817 27 28C27 32.4183 30.5817 36 35 36C39.4183 36 43 32.4183 43 28C43 23.5817 39.4183 20 35 20Z" fill="#3267FF"/>
          <path d="M25 50C25 45.5817 28.5817 42 33 42H37C41.4183 42 45 45.5817 45 50V52H25V50Z" fill="#3267FF"/>
        </svg>
      )
    },
    {
      number: '15',
      label: 'Year Experience',
      icon: (
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
          <rect width="70" height="70" rx="4" fill="#3267FF" opacity="0.1"/>
          <path d="M35 15L40 25L50 27L42 35L43 45L35 40L27 45L28 35L20 27L30 25L35 15Z" fill="#3267FF"/>
        </svg>
      )
    },
    {
      number: '70',
      label: 'Doctor & Staff',
      icon: (
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
          <rect width="70" height="70" rx="4" fill="#3267FF" opacity="0.1"/>
          <path d="M35 20C30.5817 20 27 23.5817 27 28C27 32.4183 30.5817 36 35 36C39.4183 36 43 32.4183 43 28C43 23.5817 39.4183 20 35 20Z" fill="#3267FF"/>
          <path d="M25 50C25 45.5817 28.5817 42 33 42H37C41.4183 42 45 45.5817 45 50V52H25V50Z" fill="#3267FF"/>
        </svg>
      )
    },
    {
      number: '340',
      label: 'Online Appointment',
      icon: (
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
          <rect width="70" height="70" rx="4" fill="#3267FF" opacity="0.1"/>
          <path d="M35 20L40 30L50 32L42 40L43 50L35 45L27 50L28 40L20 32L30 30L35 20Z" fill="#3267FF"/>
        </svg>
      )
    }
  ];

  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto max-w-[1240px] px-[10px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4">
                {stat.icon}
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span
                  className="text-[#000A2D] font-bold"
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 800,
                    fontSize: '48px',
                    lineHeight: '1em'
                  }}
                >
                  {stat.number}
                </span>
                <span
                  className="text-[#3267FF] font-bold"
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 800,
                    fontSize: '48px',
                    lineHeight: '1em'
                  }}
                >
                  +
                </span>
              </div>
              <p
                className="text-[#636571]"
                style={{
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '1.6em'
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home2StatsBar;





