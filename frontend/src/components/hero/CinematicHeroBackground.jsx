import React from 'react';

export default function CinematicHeroBackground({ children }) {
  return (
    <div className="relative w-full min-h-screen lg:min-h-[750px] flex flex-col justify-between items-center bg-[#FAFBFC] dark:bg-[#0B0F17] overflow-hidden select-none">
      {/* Minimalist Background with Subtle Orange Radial Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at center, rgba(201,107,0,.06), transparent 70%)',
        }}
      />

      {/* Hero Content Wrapper */}
      <div className="relative z-10 w-full flex-col justify-between items-center flex-1 flex">
        {children}
      </div>
    </div>
  );
}
