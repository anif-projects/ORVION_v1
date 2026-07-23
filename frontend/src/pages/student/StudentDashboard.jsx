import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Award, Flame, BookOpen, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { pageVariants } from '../../utils/animations';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/learning/my-courses');
      setEnrollments(res.data.data.enrollments || []);
    } catch (err) {
      console.error(err);
      // Fallback state
      setEnrollments([
        {
          _id: 'e1',
          progressPercentage: 65,
          course: {
            _id: '1',
            title: 'Full-Stack React & Node.js Masterclass',
            slug: 'fullstack-react-nodejs-masterclass',
            thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
            totalLessons: 8,
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
      {/* Welcome Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-primary-600/10 via-secondary-500/5 to-transparent flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Welcome back, <span className="gradient-text">{user?.name || 'Student'}</span>! 👋
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            You're on a <strong className="text-amber-500 inline-flex items-center gap-1"><Flame className="w-4 h-4 fill-amber-500" /> 7-day streak!</strong> Keep up the great progress.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="glass-card px-4 py-3 rounded-2xl text-center">
            <div className="text-xl font-extrabold text-slate-900 dark:text-white">{enrollments.length}</div>
            <div className="text-xs text-slate-500">Enrolled Courses</div>
          </div>
          <div className="glass-card px-4 py-3 rounded-2xl text-center">
            <div className="text-xl font-extrabold text-accent-success">1</div>
            <div className="text-xs text-slate-500">Certificates Earned</div>
          </div>
        </div>
      </div>

      {/* Continue Learning Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary-600" /> Continue Learning
        </h2>

        {loading ? (
          <div>Loading enrolled courses...</div>
        ) : enrollments.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center space-y-3">
            <p className="text-sm text-slate-500">You are not enrolled in any courses yet.</p>
            <Link to="/courses" className="inline-block px-4 py-2 rounded-xl bg-primary-600 text-white font-bold text-xs">
              Explore Course Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrollments.map((item) => (
              <div key={item._id} className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-4 flex flex-col justify-between">
                <div className="flex gap-4">
                  <img src={item.course?.thumbnail} alt={item.course?.title} className="w-24 h-20 rounded-xl object-cover" />
                  <div className="space-y-1 flex-1">
                    <h3 className="font-bold text-slate-800 dark:text-white text-base line-clamp-1">{item.course?.title}</h3>
                    <div className="text-xs text-slate-500">{item.progressPercentage}% Completed</div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-2">
                      <div className="bg-gradient-to-r from-primary-600 to-secondary-500 h-full rounded-full transition-all" style={{ width: `${item.progressPercentage}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  <span className="text-xs text-slate-400">Last watched: 2 hours ago</span>
                  <Link
                    to={`/learning/player/${item.course?.slug || 'fullstack-react-nodejs-masterclass'}`}
                    className="px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-primary-700 transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> Resume Lesson
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
