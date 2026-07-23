import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Shield, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { pageVariants } from '../../utils/animations';

export default function AboutPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16"
    >
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-4 py-1.5 rounded-full glass-panel border border-primary-500/30 text-xs font-semibold text-primary-600 dark:text-primary-400">
          About ORVION LMS
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Empowering Education Through <span className="gradient-text">Engineering Excellence</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          ORVION is a next-generation Learning Management System built for students, professionals, and enterprise teams seeking high-impact, verifiable tech education.
        </p>
      </div>

      {/* Core Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-panel p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-600/10 text-primary-600 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Our Mission</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            To provide accessible, interactive, and production-grade education that bridges the gap between theoretical knowledge and real-world engineering.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary-500/10 text-secondary-500 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Global Community</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Connect with over 25,000+ passionate learners, industry mentors, and peer reviewers in an active Q&A environment.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-accent-success/10 text-accent-success flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Verifiable Credentials</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Every course completion awards a cryptographically signed certificate complete with a public QR code verification portal.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
