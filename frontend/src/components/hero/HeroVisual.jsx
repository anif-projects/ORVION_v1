import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Star, User, Award } from 'lucide-react';

export default function HeroVisual({ mousePos = { x: 0, y: 0 } }) {
  return (
    <div className="relative w-full flex items-center justify-center lg:justify-end select-none py-4 sm:py-6">
      
      {/* 1. Blurred Radial Ambient Glow Background */}
      <motion.div
        animate={{
          x: [0, 15, 0, -15, 0],
          y: [0, -15, 15, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-[420px] h-[420px] sm:w-[500px] sm:h-[500px] rounded-full blur-[180px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(217, 119, 6, 0.14), rgba(255, 120, 0, 0.05) 50%, transparent 75%)',
          transform: `translate3d(${mousePos.x * 12}px, ${mousePos.y * 12}px, 0)`,
          willChange: 'transform',
        }}
      />

      {/* 2. Main Professional Portrait Card Placeholder (360px x 480px) */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[360px] h-[460px] sm:h-[480px] rounded-[26px] p-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 shadow-[0_20px_50px_rgba(15,23,42,0.10)] flex flex-col justify-between"
      >
        
        {/* Top-Left Floating Badge */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-md text-[11px] font-bold text-slate-800 dark:text-white">
          <Camera className="w-3.5 h-3.5 text-[#D97706]" />
          <span>Mentor Profile</span>
        </div>

        {/* Top-Right Floating Badge */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-md text-[11px] font-bold text-slate-800 dark:text-white">
          <div className="flex items-center gap-0.5 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span>Trusted Mentor</span>
        </div>

        {/* Inner Placeholder Canvas */}
        <div className="w-full h-full rounded-[20px] bg-gradient-to-b from-slate-100/90 via-slate-100/60 to-slate-200/80 dark:from-slate-800/90 dark:via-slate-800/60 dark:to-slate-900/90 border border-dashed border-slate-300 dark:border-slate-700/80 flex flex-col items-center justify-center text-center p-5 relative overflow-hidden group">
          
          {/* Subtle grid pattern background in placeholder */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }}
          />

          {/* Centered Silhouette Icon & Title */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/90 shadow-md flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3 group-hover:scale-105 transition-transform duration-300">
              <User className="w-8 h-8 sm:w-9 sm:h-9 text-[#D97706]/70" />
            </div>

            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-600 dark:text-slate-300">
              Your Image Here
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
              Portrait Photo (360px × 480px)
            </span>
          </div>
        </div>

        {/* Floating Overlapping Information Card at Bottom */}
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-[92%] z-30 p-3 sm:p-3.5 rounded-[18px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-amber-500/20 dark:border-amber-500/30 shadow-[0_12px_30px_rgba(15,23,42,0.12)] flex items-center gap-3">
          
          {/* Icon Badge */}
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[#D97706] shrink-0">
            <Award className="w-4 h-4" />
          </div>

          {/* Mentor Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-[#0F172A] dark:text-white uppercase tracking-wider truncate">
                YOUR NAME
              </h4>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0 ml-1.5" title="Available for Mentorship" />
            </div>
            <p className="text-[10px] font-bold text-[#D97706] truncate mt-0.5">
              Founder & Lead Mentor
            </p>
            <div className="flex items-center gap-1.5 mt-1 pt-1 border-t border-slate-200/60 dark:border-slate-800 text-[9px] font-semibold text-slate-500 dark:text-slate-400">
              <span>10+ Yrs Exp</span>
              <span>•</span>
              <span className="truncate">AI • Data Eng • ML</span>
            </div>
          </div>

        </div>

      </motion.div>

    </div>
  );
}
