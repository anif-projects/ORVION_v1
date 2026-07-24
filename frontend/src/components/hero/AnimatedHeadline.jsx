import React from 'react';
import { motion } from 'framer-motion';
import TypingText from './TypingText';

export default function AnimatedHeadline() {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.215, 0.61, 0.355, 1] }}
      className="text-5xl sm:text-6xl lg:text-[72px] font-bold tracking-[-0.04em] leading-[0.95] text-slate-900 dark:text-white select-none text-left"
    >
      {/* Line 1 (Fixed: Turn Ambition) */}
      <span className="block font-bold">
        Turn Ambition
      </span>

      {/* Line 2 (Dynamic Word Changing Every 3s) */}
      <span className="block mt-2 min-h-[1.1em]">
        <TypingText />
      </span>
    </motion.h1>
  );
}
