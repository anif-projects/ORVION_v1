import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CinematicHeroBackground from './CinematicHeroBackground';
import AnimatedHeadline from './AnimatedHeadline';
import HeroVisual from './HeroVisual';
import CTAButtons from './CTAButtons';

export default function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Subtle Mouse Parallax tracking for background gradient ONLY (max 12px)
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <CinematicHeroBackground mousePos={mousePos}>
      <section className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 min-h-[80vh] lg:min-h-[84vh] flex items-center justify-center relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center w-full my-auto">
          
          {/* Left Column Content (58% width on Desktop, Centered on Mobile) */}
          <div className="lg:col-span-7 flex flex-col items-center sm:items-start text-center sm:text-left space-y-6 sm:space-y-7 z-10 w-full">
            
            {/* 1. Animated Headline (Fade Up, Duration 700ms, Delay 150ms) */}
            <AnimatedHeadline />

            {/* 2. Description (Fade Up, Duration 700ms, Delay 300ms) */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
              className="text-base sm:text-lg lg:text-[18px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-[620px] font-normal"
            >
              Build practical skills through expert-led learning, hands-on projects, and career-focused guidance designed for real-world success.
            </motion.p>

            {/* 3. CTA Buttons (Fade Up, Duration 700ms, Delay 450ms) */}
            <CTAButtons />

          </div>

          {/* Right Column Logo Visual (Hidden on Mobile, Static Tree with Background Parallax) */}
          <div className="hidden sm:flex lg:col-span-5 justify-center items-center relative w-full -mt-4 lg:-mt-8">
            <HeroVisual mousePos={mousePos} />
          </div>

        </div>
      </section>
    </CinematicHeroBackground>
  );
}
