import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import api from '../../services/api';
import CourseCard from '../../components/common/CourseCard';
import { CourseCardSkeleton } from '../../components/common/Skeleton';
import { pageVariants } from '../../utils/animations';

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
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Explore Courses</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Discover expert-led courses designed for high-impact software engineering.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between border border-slate-200/80 dark:border-slate-800/80">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
          >
            <option value="newest">Newest First</option>
            <option value="rating">Highest Rated</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-lg font-bold text-slate-700 dark:text-slate-300">No courses match your filter criteria.</p>
          <button onClick={() => { setSearch(''); setLevel(''); setCategory(''); }} className="text-sm text-primary-600 font-semibold underline">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((c) => (
            <CourseCard key={c._id} course={c} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
