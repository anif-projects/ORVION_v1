import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export default function CoursesHero({ search = '', setSearch = () => {} }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      className="relative w-full overflow-hidden rounded-3xl pt-[60px] pb-[50px] mb-[36px] px-4 sm:px-6 lg:px-8 select-none"
      style={{
        background: 'linear-gradient(180deg, #FFFDF8 0%, #FFF8F1 35%, #FEF4E8 100%)',
        willChange: 'opacity',
      }}
    >
      {/* 1. Subtle Radial Ambient Glow behind Heading */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full blur-[160px] pointer-events-none"
        style={{
          background: 'rgba(201, 129, 35, 0.10)',
          willChange: 'transform, opacity',
        }}
      />

      {/* 2. Floating Blurred Circles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 0.07,
          x: [0, 20, -15, 0],
          y: [0, -25, 15, 0],
        }}
        transition={{
          opacity: { duration: 1.2, ease: 'easeOut' },
          x: { duration: 20, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 20, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute top-8 left-[8%] w-[80px] h-[80px] rounded-full blur-xl pointer-events-none"
        style={{ backgroundColor: '#9A5200', willChange: 'transform, opacity' }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 0.06,
          x: [0, -30, 20, 0],
          y: [0, 20, -20, 0],
        }}
        transition={{
          opacity: { duration: 1.2, delay: 0.2, ease: 'easeOut' },
          x: { duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2 },
          y: { duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2 },
        }}
        className="absolute bottom-6 right-[10%] w-[120px] h-[120px] rounded-full blur-2xl pointer-events-none"
        style={{ backgroundColor: '#C87817', willChange: 'transform, opacity' }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 0.05,
          x: [0, 25, -25, 0],
          y: [0, -15, 25, 0],
        }}
        transition={{
          opacity: { duration: 1.2, delay: 0.4, ease: 'easeOut' },
          x: { duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 4 },
          y: { duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 4 },
        }}
        className="absolute top-1/3 right-[22%] w-[160px] h-[160px] rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: '#E9B45C', willChange: 'transform, opacity' }}
      />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-[900px] mx-auto text-center flex flex-col items-center">
        {/* Animated Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold text-[#0F172A] dark:text-white leading-[1.1] tracking-[-0.03em]"
          style={{ willChange: 'transform, opacity' }}
        >
          Build Skills That{' '}
          <motion.span
            initial={{ backgroundPosition: '200% 0%' }}
            animate={{ backgroundPosition: '0% 0%' }}
            transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
            className="bg-clip-text text-transparent inline-block"
            style={{
              backgroundImage: 'linear-gradient(90deg, #9A5200 0%, #C87817 50%, #E9B45C 100%, #9A5200 150%)',
              backgroundSize: '200% 100%',
              willChange: 'background-position',
            }}
          >
            Shape Your Future
          </motion.span>
        </motion.h1>

        {/* ONE Modern Centered Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-[36px] w-full max-w-[480px] mx-auto relative group"
        >
          <div className="relative flex items-center w-full h-[52px] rounded-[16px] bg-white/85 dark:bg-slate-900/85 backdrop-blur-[18px] border border-[#0F172A]/10 dark:border-slate-800/80 shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:shadow-[0_14px_35px_rgba(15,23,42,0.09)] hover:-translate-y-[2px] transition-all duration-250 px-5 focus-within:border-[#C87817] focus-within:shadow-[0_0_0_4px_rgba(200,120,23,0.10)]">
            <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="w-full h-full bg-transparent text-[#0F172A] dark:text-white text-sm font-medium placeholder:text-[#94A3B8] focus:outline-none"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
