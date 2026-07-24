import React from 'react';
import { motion } from 'framer-motion';
import treeLogo from '../../assets/orvion-tree-logo.png';

export default function HeroVisual({ mousePos = { x: 0, y: 0 } }) {
  return (
    <div className="relative w-full flex items-center justify-center select-none py-2 sm:py-4">
      
      {/* 1. Large Blurred Radial Gradient Behind Tree (700px x 700px, 220px blur, rgba(255,170,60,0.12) to rgba(255,120,0,0.05)) */}
      {/* Moves slowly in a circular path over 20s infinite, with 12px subtle mouse parallax */}
      <motion.div
        animate={{
          x: [0, 20, 0, -20, 0],
          y: [0, -20, 20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-[600px] h-[600px] sm:w-[700px] sm:h-[700px] rounded-full blur-[220px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 170, 60, 0.12), rgba(255, 120, 0, 0.05) 50%, transparent 75%)',
          transform: `translate3d(${mousePos.x * 12}px, ${mousePos.y * 12}px, 0)`,
          willChange: 'transform',
        }}
      />

      {/* 2. Orvion Tree Illustration (Tree is 100% static after load entrance animation) */}
      {/* Single Page-Load Animation: Fade In (0->1), Scale (0.94->1), TranslateY (20px->0) over 900ms */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 cursor-default flex items-center justify-center"
      >
        <img
          src={treeLogo}
          alt="Orvion Tree Logo"
          className="w-[580px] sm:w-[720px] lg:w-[820px] xl:w-[900px] h-auto object-contain select-none pointer-events-auto"
        />
      </motion.div>

    </div>
  );
}
