import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import CourseCard from '../../components/common/CourseCard';
import { CourseCardSkeleton } from '../../components/common/Skeleton';
import { pageVariants } from '../../utils/animations';
import CoursesHero from '../../components/courses/CoursesHero';
import toast from 'react-hot-toast';

export default function CourseCatalog() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || '';

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    fetchCourses();
  }, [search, category, level, sort, type]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/courses', {
        params: { search, category, level, sort, type },
      });
      setCourses(res.data.data.courses || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to retrieve courses from database.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Determine headers based on type
  let heroTitle = null;
  let heroSubtitle = null;
  if (type === 'offline') {
    heroTitle = 'Premium Offline Programs';
    heroSubtitle = 'Industry-designed curriculum with real mentorship, live labs, and offline classroom cohorts.';
  } else if (type === 'online') {
    heroTitle = 'Premium Online Courses';
    heroSubtitle = 'Learn at your own pace with structured self-paced modules, interactive quizzes, and project labs.';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6"
    >
      {/* Hero Section with Custom Headers */}
      <CoursesHero
        search={search}
        setSearch={setSearch}
        title={heroTitle}
        subtitle={heroSubtitle}
      />

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
              <CourseCard key={c._id || c.id} course={c} index={index} />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
