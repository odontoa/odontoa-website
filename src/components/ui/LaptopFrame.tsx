import React from 'react';

interface LaptopFrameProps {
  children: React.ReactNode;
}

export function LaptopFrame({ children }: LaptopFrameProps) {
  return (
    <div
      className="relative w-full"
      style={{ filter: 'drop-shadow(0 20px 40px rgba(15,23,42,0.12))' }}
    >
      {/* Screen housing / bezel */}
      <div
        className="relative rounded-t-xl"
        style={{ background: '#2a2a2e', padding: '6px 6px 4px 6px' }}
      >
        {/* Camera dot */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: 2,
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#1a1a1c',
          }}
        />

        {/* Screen area */}
        <div
          className="w-full overflow-hidden bg-white"
          style={{ borderRadius: 4, aspectRatio: '16 / 10' }}
        >
          {children}
        </div>
      </div>

      {/* Base / hinge */}
      <div
        className="mx-auto"
        style={{
          width: '108%',
          marginLeft: '-4%',
          height: 10,
          background: 'linear-gradient(180deg, #d4d4d8, #a1a1aa)',
          borderRadius: '0 0 8px 8px',
          borderTop: '1px solid #e4e4e7',
        }}
      >
        {/* Front lip / trackpad hint */}
        <div
          className="mx-auto"
          style={{
            width: '20%',
            height: 3,
            background: '#d4d4d8',
            borderRadius: '0 0 4px 4px',
          }}
        />
      </div>
    </div>
  );
}
