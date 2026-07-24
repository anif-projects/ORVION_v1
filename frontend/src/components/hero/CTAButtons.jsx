import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTAButtons() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.45, ease: [0.215, 0.61, 0.355, 1] }}
      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto pt-1"
    >
      {/* Primary CTA Button */}
      <Link
        to="/courses"
        className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-white text-base bg-gradient-to-r from-primary-600 via-primary-500 to-amber-600 hover:from-primary-700 hover:to-amber-700 shadow-md shadow-primary-600/20 hover:shadow-lg hover:shadow-primary-600/30 transition-all duration-250 hover:scale-[1.01] hover:-translate-y-1 flex items-center justify-center gap-2.5 group"
      >
        <span>Start Learning</span>
        <ArrowRight className="w-4 h-4 transition-transform duration-250 group-hover:translate-x-1" />
      </Link>

      {/* Secondary Ghost Button */}
      <Link
        to="/courses"
        className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-slate-800 dark:text-slate-100 text-base bg-white/70 dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800/90 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 shadow-sm transition-all duration-250 hover:scale-[1.01] hover:-translate-y-1 flex items-center justify-center gap-2 backdrop-blur-md hover:border-slate-300 dark:hover:border-slate-700"
      >
        <span>Explore Programs</span>
      </Link>
    </motion.div>
  );
}
