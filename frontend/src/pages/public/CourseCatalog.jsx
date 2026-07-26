import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import api from '../../services/api';
import CourseCard from '../../components/common/CourseCard';
import { CourseCardSkeleton } from '../../components/common/Skeleton';
import { pageVariants } from '../../utils/animations';
import CoursesHero from '../../components/courses/CoursesHero';

export default function CourseCatalog() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    fetchCourses();
  }, [search, category, level, sort]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/courses', {
        params: { search, category, level, sort },
      });
      setCourses(res.data.data.courses || []);
    } catch (err) {
      console.error(err);
      // Fallback demo courses if backend server is not yet running locally
      setCourses([
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
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6"
    >
      {/* Hero Section with Centered Single Search Bar */}
      <CoursesHero search={search} setSearch={setSearch} />

      {/* Courses Grid Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ willChange: 'transform, opacity' }}
      >
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <p className="text-lg font-bold text-slate-700 dark:text-slate-300">No courses match your search criteria.</p>
            <button onClick={() => setSearch('')} className="text-sm text-primary-600 font-semibold underline hover:scale-[1.04] transition-transform duration-200">
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((c, index) => (
              <CourseCard key={c._id} course={c} index={index} />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
