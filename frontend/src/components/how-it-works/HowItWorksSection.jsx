import React from 'react';
import { motion } from 'framer-motion';
import StackedDeckCarousel from './StackedDeckCarousel';

export default function HowItWorksSection() {
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center py-[48px] sm:py-[64px] lg:py-[80px] relative overflow-hidden bg-[#FCFAF7] dark:bg-[#0B0F17]">
      
      {/* Soft Orange Ambient Lighting & Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary-500/8 dark:bg-primary-500/12 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Dotted Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 w-full my-auto flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center max-w-[600px] mx-auto flex flex-col items-center">
          
          {/* Large Heading (64px) */}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-[64px] font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-4"
          >
            How It <span className="text-primary-600 dark:text-primary-500">Works</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-[600px]"
          >
            Your learning journey in five simple steps.
          </motion.p>

        </div>

        {/* Stacked Deck / Interactive Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full"
        >
          <StackedDeckCarousel />
        </motion.div>

      </div>
    </section>
  );
}
