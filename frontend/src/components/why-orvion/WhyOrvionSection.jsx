import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import InfiniteCurvedCarousel from './InfiniteCurvedCarousel';

export default function WhyOrvionSection() {
  const sectionRef = useRef(null);

  return (
    <section 
      ref={sectionRef}
      className="w-full min-h-screen flex flex-col items-center justify-center py-[48px] sm:py-[64px] lg:py-[80px] relative overflow-hidden bg-gradient-to-b from-transparent via-[#FCFBF9]/60 to-transparent dark:via-[#090D16]/60"
    >
      {/* Subtle Dotted Background Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 w-full my-auto flex flex-col items-center justify-center">
        
        {/* Brand Heading: "Why ORVION" */}
        <div className="text-center max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 mb-12 lg:mb-16 flex flex-col items-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-baseline justify-center gap-5 sm:gap-7 select-none text-center"
          >
            {/* Word 1: "Why" (#0F172A, Weight 700, Visually Balanced Height) */}
            <span 
              className="font-bold text-[#0F172A] dark:text-white text-[36px] sm:text-[50px] md:text-[62px] lg:text-[74px] tracking-tight leading-none"
              style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
            >
              Why
            </span>

            {/* Word 2: "ORVION" (FULL UPPERCASE, Official Logo Copper-Gold Palette, Serif Font) */}
            <span
              className="font-semibold text-[38px] sm:text-[52px] md:text-[66px] lg:text-[78px] leading-none tracking-[0.05em]"
              style={{
                fontFamily: "'Cinzel', 'Cormorant Garamond', 'DM Serif Display', serif",
                background: 'linear-gradient(90deg, #9A5313 0%, #B66A18 30%, #D88B2E 65%, #F0C26B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ORVION
            </span>
          </motion.h2>
        </div>

        {/* Curved Horizontal Infinite Carousel Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <InfiniteCurvedCarousel />
        </motion.div>

      </div>
    </section>
  );
}
