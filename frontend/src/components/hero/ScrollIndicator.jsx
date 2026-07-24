import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      transition={{ duration: 1, delay: 1 }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none select-none z-20"
    >
      <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 dark:text-slate-500">
        Scroll
      </span>
      <div className="w-5 h-8 rounded-full border-2 border-slate-400 dark:border-slate-600 flex justify-center p-1">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-1 h-2 rounded-full bg-slate-500 dark:bg-slate-400"
        />
      </div>
      <ChevronDown className="w-3.5 h-3.5 text-slate-400 animate-bounce -mt-1" />
    </motion.div>
  );
}
