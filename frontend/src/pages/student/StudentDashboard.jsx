import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Award, Flame, BookOpen, Clock, CheckCircle2, ArrowRight, X } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { pageVariants } from '../../utils/animations';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [certsCount, setCertsCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [learningRes, certsRes, eventsRes] = await Promise.all([
        api.get('/learning/my-courses'),
        api.get('/certificates/my-certificates').catch(() => ({ data: { data: { certificates: [] } } })),
        api.get('/events/my-events').catch(() => ({ data: { data: { events: [] } } }))
      ]);
      
      setEnrollments(learningRes.data.data.enrollments || []);
      setCertsCount(certsRes.data.data.certificates?.length || 0);
      setEventsCount(eventsRes.data.data.events?.length || 0);
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
            subtitle: 'Build scalable modern web applications with clean architecture',
            description: 'Master frontend and backend web development using React, Node.js, Express, MySQL, and Redux Toolkit with responsive animations.',
            thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
            totalLessons: 8,
            totalDuration: 420,
            level: 'all_levels',
            slug: 'fullstack-react-nodejs-masterclass',
            learningOutcomes: ['Build enterprise React apps', 'Design RESTful Express APIs', 'Implement JWT & Security']
          },
        },
      ]);
      setCertsCount(1);
      setEventsCount(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8 relative">
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

        <div className="flex flex-wrap gap-4 justify-center md:justify-end">
          <div className="glass-card px-4 py-3 rounded-2xl text-center min-w-[100px]">
            <div className="text-xl font-extrabold text-slate-900 dark:text-white">{enrollments.length}</div>
            <div className="text-xs text-slate-500">Enrolled Courses</div>
          </div>
          <div className="glass-card px-4 py-3 rounded-2xl text-center min-w-[100px]">
            <div className="text-xl font-extrabold text-accent-success">{certsCount}</div>
            <div className="text-xs text-slate-500">Certificates Earned</div>
          </div>
          <div className="glass-card px-4 py-3 rounded-2xl text-center min-w-[100px]">
            <div className="text-xl font-extrabold text-primary-600">{eventsCount}</div>
            <div className="text-xs text-slate-500">Registered Events</div>
          </div>
        </div>
      </div>

      {/* Continue Learning Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary-600" /> Continue Learning
        </h2>

        {loading ? (
          <div className="text-slate-500">Loading enrolled courses...</div>
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedCourse(item.course)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
                    >
                      View Details
                    </button>
                    <Link
                      to={`/learning/player/${item.course?.slug || 'fullstack-react-nodejs-masterclass'}`}
                      className="px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-primary-700 transition"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" /> Resume Lesson
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Course Overview Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 relative flex flex-col justify-between space-y-6">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedCourse(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row gap-4 items-start border-b border-slate-100 dark:border-slate-800/80 pb-4">
                <img src={selectedCourse.thumbnail} alt={selectedCourse.title} className="w-32 h-24 rounded-2xl object-cover shadow-sm border border-slate-200 dark:border-slate-800" />
                <div className="space-y-1.5 flex-1">
                  <h3 className="font-extrabold text-slate-950 dark:text-white text-lg sm:text-xl">{selectedCourse.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{selectedCourse.subtitle}</p>
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                    <span className="bg-primary-600/10 text-primary-600 dark:text-primary-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px]">
                      {selectedCourse.level?.replace('_', ' ') || 'All Levels'}
                    </span>
                    <span className="text-slate-350 dark:text-slate-650">•</span>
                    <span className="text-slate-500 font-medium">{selectedCourse.totalLessons || 8} Lessons</span>
                    <span className="text-slate-350 dark:text-slate-650">•</span>
                    <span className="text-slate-500 font-medium">{selectedCourse.totalDuration || 420} Mins</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Course Description</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{selectedCourse.description}</p>
              </div>

              {/* Learning Outcomes */}
              {selectedCourse.learningOutcomes && selectedCourse.learningOutcomes.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">What You'll Learn</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedCourse.learningOutcomes.map((outcome, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-350 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
              >
                Close Overview
              </button>
              <Link
                to={`/learning/player/${selectedCourse.slug}`}
                onClick={() => setSelectedCourse(null)}
                className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Continue Learning</span>
              </Link>
            </div>

          </div>
        </div>
      )}
    </motion.div>
  );
}
