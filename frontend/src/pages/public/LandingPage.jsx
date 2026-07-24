import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { pageVariants, fadeInContainer, fadeInItem } from '../../utils/animations';
import CourseCard from '../../components/common/CourseCard';
import api from '../../services/api';

import HeroSection from '../../components/hero/HeroSection';
import WhyOrvionSection from '../../components/why-orvion/WhyOrvionSection';
import HowItWorksSection from '../../components/how-it-works/HowItWorksSection';
import StudentSuccessStoriesSection from '../../components/testimonials/StudentSuccessStoriesSection';

export default function LandingPage() {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/courses?isFeatured=true&limit=3');
        if (res.data.data && res.data.data.courses && res.data.data.courses.length > 0) {
          setFeaturedCourses(res.data.data.courses);
        } else {
          setFeaturedCourses(demoCourses);
        }
      } catch (err) {
        console.error('Failed to fetch featured courses:', err);
        setFeaturedCourses(demoCourses);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const demoCourses = [
    {
      _id: '1',
      title: 'Full-Stack React & Node.js Masterclass',
      slug: 'fullstack-react-nodejs-masterclass',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      price: 4999,
      discountPrice: 2999,
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
      price: 7999,
      discountPrice: 4999,
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
      price: 3999,
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
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full flex flex-col items-center">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Why Orvion Section */}
      <WhyOrvionSection />

      {/* 3. Featured Courses Section */}
      <section className="w-full min-h-screen flex flex-col items-center justify-center py-[48px] sm:py-[64px] lg:py-[80px] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full my-auto">
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
            {featuredCourses.map((c) => (
              <motion.div key={c._id} variants={fadeInItem}>
                <CourseCard course={c} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <HowItWorksSection />

      {/* 5. Testimonials Section */}
      <StudentSuccessStoriesSection />
    </motion.div>
  );
}
