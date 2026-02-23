import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div
      className="relative w-full"
      style={{ filter: 'drop-shadow(0 12px 32px rgba(15,23,42,0.18))' }}
    >
      {/* Phone body */}
      <div
        className="relative"
        style={{
          background: '#1a1a1a',
          borderRadius: 22,
          padding: 4,
        }}
      >
        {/* Dynamic Island */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-10"
          style={{
            top: 8,
            width: 48,
            height: 14,
            borderRadius: 999,
            background: '#000',
          }}
        />

        {/* Side buttons (right edge) */}
        <div
          className="absolute"
          style={{
            right: -2,
            top: 48,
            width: 2,
            height: 16,
            borderRadius: 1,
            background: '#2a2a2e',
          }}
        />
        <div
          className="absolute"
          style={{
            right: -2,
            top: 72,
            width: 2,
            height: 10,
            borderRadius: 1,
            background: '#2a2a2e',
          }}
        />

        {/* Screen area */}
        <div
          className="w-full overflow-hidden bg-white"
          style={{
            borderRadius: 18,
            aspectRatio: '9 / 19.5',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
