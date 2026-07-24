import React from 'react';
import { motion } from 'framer-motion';

export default function CinematicHeroBackground({ children, mousePos = { x: 0, y: 0 } }) {
  // 5-6 Tiny Floating Light Orbs (12-24px, 0.08 opacity, soft orange / warm gold / light cream)
  const orbs = [
    { size: 16, top: '15%', left: '12%', color: '#FF9D3B', duration: 14, dx: [0, 22, -15, 0], dy: [0, -18, 25, 0] },
    { size: 24, top: '25%', right: '18%', color: '#F59E0B', duration: 16, dx: [0, -25, 15, 0], dy: [0, 20, -22, 0] },
    { size: 14, top: '65%', left: '20%', color: '#FFF8EA', duration: 18, dx: [0, 18, -20, 0], dy: [0, -25, 15, 0] },
    { size: 20, top: '70%', right: '15%', color: '#FF9D3B', duration: 13, dx: [0, -20, 25, 0], dy: [0, 15, -18, 0] },
    { size: 12, top: '40%', right: '35%', color: '#F59E0B', duration: 15, dx: [0, 15, -22, 0], dy: [0, -20, 16, 0] },
    { size: 18, top: '10%', right: '40%', color: '#FF9D3B', duration: 17, dx: [0, -18, 20, 0], dy: [0, 22, -15, 0] },
  ];

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-center items-center bg-[#FFFCF8] dark:bg-[#0B0F17] overflow-hidden select-none -mt-20 sm:-mt-[88px] pt-24 sm:pt-28 lg:pt-32 pb-[48px] sm:pb-[64px] lg:pb-[80px]">
      
      {/* 1. Static 2% #ECE8DF Engineering Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right, #ECE8DF 1px, transparent 1px), linear-gradient(to bottom, #ECE8DF 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* 2. Soft Warm Top Light Fading Naturally Toward Bottom (8% Opacity, No Animation) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[320px] bg-gradient-to-b from-[#FFAA3C]/[0.16] via-[#FF7800]/[0.05] to-transparent blur-3xl opacity-8 pointer-events-none" />

      {/* 3. 2-3 Extremely Thin Curved SVG Lines (Stroke draw 1.5s once, color rgba(255,160,60,0.08)) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
        <motion.path
          d="M -100 150 Q 400 50 1200 350"
          fill="none"
          stroke="rgba(255, 160, 60, 0.08)"
          strokeWidth="1.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
        <motion.path
          d="M 200 -50 Q 800 400 1600 100"
          fill="none"
          stroke="rgba(255, 160, 60, 0.06)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: 'easeInOut' }}
        />
      </svg>

      {/* 4. 5-6 Floating Light Orbs (12-24px, 0.08 opacity, float randomly 20-30px over 12-18s) */}
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          animate={{
            x: orb.dx,
            y: orb.dy,
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute rounded-full opacity-[0.08] blur-xs pointer-events-none"
          style={{
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            backgroundColor: orb.color,
          }}
        />
      ))}

      {/* Hero Content Container */}
      <div className="relative z-10 w-full flex flex-col justify-center items-center my-auto">
        {children}
      </div>
    </div>
  );
}
