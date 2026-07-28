import React from 'react';
import { motion } from 'framer-motion';
import sainadhImg from '../../assets/sainadh_narne.jpg';

export default function HeroVisual({ mousePos = { x: 0, y: 0 } }) {
  return (
    <div className="relative w-full flex items-center justify-center lg:justify-end select-none py-2 sm:py-4">
      
      {/* 1. Subtle Ambient Radial Glow */}
      <motion.div
        animate={{
          x: [0, 10, 0, -10, 0],
          y: [0, -10, 10, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full blur-[140px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(217, 119, 6, 0.12), rgba(249, 115, 22, 0.04) 55%, transparent 75%)',
          transform: `translate3d(${mousePos.x * 8}px, ${mousePos.y * 8}px, 0)`,
          willChange: 'transform',
        }}
      />

      {/* 2. MAIN HERO IMAGE WRAPPER WITH DECORATIVE ACCENTS */}
      <div className="relative z-10 w-full max-w-[340px] sm:max-w-[390px] lg:max-w-[430px] flex items-center justify-center">
        
        {/* --- MINIMAL DECORATIVE ACCENTS --- */}
        {/* Accent 1: Thin curved light orange SVG line */}
        <svg
          className="absolute -top-6 -right-6 w-24 h-24 text-amber-500/25 pointer-events-none hidden sm:block"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M 10 90 Q 50 10 90 40" />
        </svg>

        {/* Accent 2: Small soft orange glowing dots */}
        <div className="absolute -top-3 -left-2 w-3 h-3 rounded-full bg-amber-500/40 blur-[1px] pointer-events-none" />
        <div className="absolute -bottom-2 -right-3 w-2.5 h-2.5 rounded-full bg-orange-500/50 blur-[1px] pointer-events-none" />
        <div className="absolute top-1/2 -left-4 w-2 h-2 rounded-full bg-amber-400/30 blur-[0.5px] pointer-events-none hidden sm:block" />

        {/* Accent 3: Small floating accent square */}
        <div className="absolute -top-4 right-12 w-4 h-4 rounded-md border border-amber-500/30 bg-amber-500/10 rotate-12 pointer-events-none hidden sm:block" />

        {/* --- PREMIUM PORTRAIT CONTAINER --- */}
        {/* Load Animation: Fade in (0->100%), Scale (0.96->1), Slide Up 20px over 800ms */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.02 }}
          className="w-full p-[2px] rounded-[28px] bg-gradient-to-br from-amber-500/40 via-orange-400/25 to-amber-600/40 shadow-[0_16px_40px_-12px_rgba(217,119,6,0.12),0_0_35px_rgba(217,119,6,0.12)] hover:shadow-[0_24px_50px_-12px_rgba(217,119,6,0.22),0_0_45px_rgba(217,119,6,0.2)] hover:from-amber-500/70 hover:via-orange-400/45 hover:to-amber-600/70 transition-all duration-300 group relative"
        >
          {/* Inner Frame with 28px border radius, soft inner ring, subtle background */}
          <div className="w-full h-[450px] sm:h-[500px] lg:h-[530px] rounded-[26px] overflow-hidden bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 relative ring-1 ring-white/80 dark:ring-white/10 shadow-inner">
            
            {/* Subject Image: Uncropped face, full upper body visible, subject positioned slightly right */}
            <img
              src={sainadhImg}
              alt="SAINADH NARNE - Founder & CEO"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
              style={{ objectPosition: '62% 15%' }}
            />

            {/* Subtle Gradient Vignette at bottom for nameplate contrast */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/60 via-slate-950/20 to-transparent pointer-events-none" />

            {/* --- ELEGANT NAMEPLATE CARD --- */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-[16px] bottom-[16px] sm:right-[18px] sm:bottom-[18px] w-[240px] max-w-[calc(100%-32px)] z-30 py-[12px] px-[16px] rounded-[18px] shadow-lg text-center flex flex-col justify-center items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-white/80 dark:border-slate-800/80"
            >
              <h3
                className="uppercase text-center text-[#0F172A] dark:text-white"
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: '15px',
                  fontWeight: 400,
                  letterSpacing: '0.03em',
                  lineHeight: 1.1,
                }}
              >
                SAINADH NARNE
              </h3>
              <p
                className="uppercase text-center text-[#D97706] dark:text-amber-400 mt-[3px]"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '10.5px',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                Founder & CEO
              </p>
            </motion.div>

          </div>
        </motion.div>

      </div>

    </div>
  );
}
