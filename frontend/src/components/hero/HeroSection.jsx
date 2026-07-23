import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import CinematicHeroBackground from './CinematicHeroBackground';

const TICKER_ITEMS = [
  'Karthik finished Level 1 - earned certification',
  '1,247 students enrolled this month',
  'Rahul is on Day 47 of his roadmap',
  'Akhil started Level 2 - Java + DSA',
  'Priya from Vijayawada just started Python Foundation',
  '100% placement record for the last cohort',
  'Join our community of 15k+ active learners',
];

function TickerBar() {
  // Duplicate the array to ensure seamless infinite scrolling marquee
  const duplicatedItems = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="w-full bg-[#090d16] dark:bg-[#06090f] border-y border-slate-200/10 dark:border-slate-800/40 py-2.5 sm:py-3 overflow-hidden relative select-none z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
        {/* Pinned LIVE Badge */}
        <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded text-[11px] font-extrabold tracking-wider uppercase shrink-0 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          LIVE
        </div>

        {/* Scrolling text wrapper */}
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-16">
            {duplicatedItems.map((item, index) => (
              <span
                key={index}
                className="text-slate-300 dark:text-slate-400 text-xs sm:text-sm font-medium flex items-center gap-2"
              >
                {item}
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-700 ml-16" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <div className="w-full flex flex-col">
      {/* 1. Live Student Activity Ticker */}
      <TickerBar />

      <CinematicHeroBackground>
        {/* Hero Content Grid */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 flex-1 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
            
            {/* Left Column: Text & Badges & CTAs */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="lg:col-span-7 flex flex-col items-start text-left space-y-6 sm:space-y-8"
            >
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  LIVE - 1,247 ENROLLED THIS MONTH
                </div>
                <div className="inline-flex items-center gap-1.5 bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide">
                  🔥 REAL TALK INSIDE
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] leading-[1.12] text-[#0F172A] dark:text-white font-serif font-semibold tracking-tight">
                Your batchmates got placed.
                <span className="italic text-lime-600 dark:text-lime-400 underline decoration-lime-500/30 decoration-4 underline-offset-[8px] block mt-3">
                  You're still scrolling.
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-350 leading-relaxed max-w-xl font-sans">
                Free tutorials won't get you placed. Expensive bootcamps aren't fair.
                There's a third path — built by industry veterans who have walked the path.
                Same struggles. Same ambitions. Now teaching the exact blueprint to unlock your career.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2">
                <Link
                  to="/courses"
                  className="w-full sm:w-auto h-[54px] sm:h-[58px] px-8 rounded-xl font-semibold text-white bg-gradient-to-r from-[#C96B00] to-[#F59E0B] hover:from-[#B56000] hover:to-[#E08E07] shadow-sm hover:shadow-glow transition-all duration-200 flex items-center justify-center gap-2 text-base sm:text-lg min-w-[190px]"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/signup"
                  className="w-full sm:w-auto h-[54px] sm:h-[58px] px-8 rounded-xl font-semibold text-[#0F172A] dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 shadow-sm transition-all duration-200 flex items-center justify-center gap-2 text-base sm:text-lg min-w-[190px] backdrop-blur-sm"
                >
                  <Play className="w-4 h-4 fill-current text-slate-600 dark:text-slate-400" />
                  <span>Watch Demo</span>
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Animated Tree Emblem */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="lg:col-span-5 flex justify-center items-center relative w-full"
            >
              <div className="relative flex justify-center items-center w-full max-w-[280px] sm:max-w-[380px] lg:max-w-[420px] xl:max-w-[460px] aspect-square">
                
                {/* 1. Concentric Ripple Rings (Pulsing behind the tree) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div
                    animate={{ scale: [0.8, 1.5], opacity: [0.35, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute w-full h-full border border-dashed border-[#F59E0B]/20 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [0.8, 1.5], opacity: [0.35, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeOut', delay: 2.5 }}
                    className="absolute w-full h-full border border-dashed border-[#C96B00]/25 rounded-full"
                  />
                </div>

                {/* 2. Subtle Radial Glow in Background */}
                <div className="absolute w-[80%] h-[80%] bg-gradient-to-tr from-[#C96B00]/15 to-[#F59E0B]/20 dark:from-[#C96B00]/25 dark:to-[#F59E0B]/30 rounded-full blur-3xl pointer-events-none" />

                {/* 3. Floating Magical Particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-full">
                  {[...Array(8)].map((_, i) => {
                    const randomX = (i * 27) % 50 - 25; // range: -25 to 25
                    const duration = 4 + (i % 3);       // range: 4 to 6
                    const delay = i * 0.7;
                    return (
                      <motion.div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-r from-amber-400 to-[#F59E0B] blur-[0.5px]"
                        style={{
                          width: `${(i % 3) * 2 + 4}px`, // 4px, 6px, 8px
                          height: `${(i % 3) * 2 + 4}px`,
                          left: `${20 + (i * 11) % 60}%`, // range: 20% to 80%
                          bottom: '15%',
                        }}
                        animate={{
                          y: [0, -180],
                          x: [0, randomX],
                          opacity: [0, 0.7, 0],
                          scale: [0.6, 1.2, 0.6],
                        }}
                        transition={{
                          duration: duration,
                          repeat: Infinity,
                          delay: delay,
                          ease: 'easeOut',
                        }}
                      />
                    );
                  })}
                </div>

                {/* 4. Animated Tree Emblem */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [-1, 1, -1],
                  }}
                  transition={{
                    duration: 5,
                    ease: 'easeInOut',
                    repeat: Infinity,
                  }}
                  whileHover={{ 
                    scale: 1.04, 
                    rotate: 0,
                    filter: 'drop-shadow(0 15px 30px rgba(245,158,11,0.4))'
                  }}
                  className="relative z-10 w-[85%] h-[85%] flex justify-center items-center cursor-pointer"
                >
                  <img
                    src="/favicon.png"
                    alt="Orvion Tree Emblem"
                    className="w-full h-full object-contain select-none transition-filter duration-300 filter drop-shadow-[0_8px_16px_rgba(201,107,0,0.15)] dark:drop-shadow-[0_12px_24px_rgba(245,158,11,0.22)]"
                    loading="eager"
                  />
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </CinematicHeroBackground>
    </div>
  );
}
