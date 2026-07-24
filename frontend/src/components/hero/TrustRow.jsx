import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function TrustRow() {
  const trustItems = [
    'Industry Mentors',
    'Project-Based Learning',
    'Career Support',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
      className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-4 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400"
    >
      {trustItems.map((item, index) => (
        <React.Fragment key={item}>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{item}</span>
          </div>
          {index < trustItems.length - 1 && (
            <span className="text-slate-300 dark:text-slate-700 font-bold select-none">•</span>
          )}
        </React.Fragment>
      ))}
    </motion.div>
  );
}
