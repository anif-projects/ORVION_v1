import React from 'react';
import { motion } from 'framer-motion';
import sainadhImg from '../../assets/sainadh_narne.jpg';

export default function HeroVisual({ mousePos = { x: 0, y: 0 } }) {
  return (
    <div className="relative w-full flex items-center justify-center lg:justify-end select-none py-4 sm:py-6">
      
      {/* 1. Blurred Radial Ambient Glow Background */}
      <motion.div
        animate={{
          x: [0, 15, 0, -15, 0],
          y: [0, -15, 15, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-[420px] h-[420px] sm:w-[500px] sm:h-[500px] rounded-full blur-[180px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(217, 119, 6, 0.14), rgba(255, 120, 0, 0.05) 50%, transparent 75%)',
          transform: `translate3d(${mousePos.x * 12}px, ${mousePos.y * 12}px, 0)`,
          willChange: 'transform',
        }}
      />

      {/* 2. Main Mentor Spotlight Container */}
      <div className="relative z-10 w-full max-w-[380px] sm:max-w-[400px]">
        
        {/* Image Container with Fade + Scale Animation (0.95 -> 1, 800ms) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-[480px] sm:h-[520px] rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(15,23,42,0.12)] relative bg-slate-100 dark:bg-slate-900 border-0"
        >
          <img
            src={sainadhImg}
            alt="SAINADH NARNE - Founder & CEO"
            className="w-full h-full object-cover"
            style={{ objectPosition: '65% center' }}
          />

          {/* 3. Floating Glass Profile Nameplate Card (Placed INSIDE image container: right 18px, bottom 18px, 250px x 80px) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-[18px] bottom-[18px] w-[250px] max-w-[calc(100%-36px)] h-[80px] z-30 py-[14px] px-[18px] rounded-[20px] shadow-[0_12px_30px_rgba(15,23,42,0.12)] text-center flex flex-col justify-center items-center"
            style={{
              background: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              border: '1px solid rgba(255, 255, 255, 0.7)',
            }}
          >
            <h3
              className="uppercase text-center text-[#0F172A]"
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: '16px',
                fontWeight: 400,
                letterSpacing: '0.03em',
                lineHeight: 1.1,
              }}
            >
              SAINADH NARNE
            </h3>
            <p
              className="uppercase text-center text-[#B56A14] mt-[4px]"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              Founder & CEO
            </p>
          </motion.div>
        </motion.div>

      </div>

    </div>
  );
}




