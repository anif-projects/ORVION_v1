import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Award, Zap } from 'lucide-react';
import { pageVariants, fadeInContainer, fadeInItem } from '../../utils/animations';
import CourseCard from '../../components/common/CourseCard';

import HeroSection from '../../components/hero/HeroSection';

export default function LandingPage() {
  const sampleCourses = [
    {
      _id: '1',
      title: 'Full-Stack React & Node.js Masterclass',
      slug: 'fullstack-react-nodejs-masterclass',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      price: 89.99,
      discountPrice: 49.99,
      category: { name: 'Web Dev', color: '#4F46E5' },
      instructor: { name: 'Super Admin' },
      rating: 4.9,
      enrolledCount: 1420,
      totalDuration: 420,
      totalLessons: 8,
      level: 'all_levels',
    },
    {
      _id: '2',
      title: 'AI System Design & Machine Learning Pipelines',
      slug: 'ai-system-design',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
      price: 129.99,
      discountPrice: 89.99,
      category: { name: 'AI & ML', color: '#06B6D4' },
      instructor: { name: 'Dr. Sarah Lin' },
      rating: 5.0,
      enrolledCount: 980,
      totalDuration: 540,
      totalLessons: 14,
      level: 'advanced',
    },
    {
      _id: '3',
      title: 'Glassmorphism UI/UX Design System with Tailwind',
      slug: 'glassmorphism-ui-design',
      thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
      price: 59.99,
      discountPrice: 0,
      category: { name: 'UI/UX Design', color: '#22C55E' },
      instructor: { name: 'Elena Rostova' },
      rating: 4.8,
      enrolledCount: 2150,
      totalDuration: 280,
      totalLessons: 10,
      level: 'beginner',
    },
  ];

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-24 pb-16">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Featured Courses
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Handcrafted curriculum designed by industry engineering leads.
            </p>
          </div>
          <Link to="/courses" className="text-primary-600 dark:text-primary-400 font-semibold text-sm hover:underline">
            View All Courses &rarr;
          </Link>
        </div>

        <motion.div variants={fadeInContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleCourses.map((c) => (
            <motion.div key={c._id} variants={fadeInItem}>
              <CourseCard course={c} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800/80 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Built for Enterprise Learning
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Engineered with security, adaptive video chunk streaming, and RBAC permission models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 p-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-600/10 text-primary-600 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Adaptive Video Streaming</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Cloudinary signed tokens and HLS chunk streaming for zero-lag video playback across all devices.
              </p>
            </div>

            <div className="space-y-3 p-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary-500/10 text-secondary-500 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Stripe & Razorpay Integration</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Abstracted strategy design pattern handling multi-currency checkouts, webhooks, and invoice generation.
              </p>
            </div>

            <div className="space-y-3 p-4">
              <div className="w-12 h-12 rounded-2xl bg-accent-success/10 text-accent-success flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Verifiable QR Certificates</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Automatic SHA-256 hash generation and public verification lookup portal for graduates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
