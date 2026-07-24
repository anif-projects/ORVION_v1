import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Check, Clock, BookOpen, Star, ShieldCheck, Award } from 'lucide-react';
import ReactPlayer from 'react-player';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { pageVariants } from '../../utils/animations';

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    fetchCourseDetail();
  }, [slug]);

  const fetchCourseDetail = async () => {
    try {
      const res = await api.get(`/courses/slug/${slug}`);
      setCourse(res.data.data.course);
    } catch (err) {
      console.error(err);
      // Fallback detail for demonstration
      setCourse({
        _id: '1',
        title: 'Full-Stack React & Node.js Masterclass',
        slug: 'fullstack-react-nodejs-masterclass',
        subtitle: 'Build scalable modern web applications with clean architecture',
        description: 'Master frontend and backend web development using React, Node.js, Express, MongoDB, and Redux Toolkit with glassmorphism UI design.',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        previewVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        price: 89.99,
        discountPrice: 49.99,
        category: { name: 'Web Development', color: '#4F46E5' },
        instructor: { name: 'Super Admin' },
        learningOutcomes: ['Build enterprise React apps', 'Design RESTful Express APIs', 'Implement JWT & Security'],
        requirements: ['Basic JavaScript knowledge'],
        totalDuration: 420,
        totalLessons: 8,
        rating: 4.9,
        modules: [
          {
            _id: 'm1',
            title: 'Module 1: Foundations & Architecture',
            lessons: [
              { _id: 'l1', title: 'Lesson 1: Introduction to Clean Architecture', duration: 600, isPreview: true },
              { _id: 'l2', title: 'Lesson 2: Setting up Express and Mongoose Schemas', duration: 900, isPreview: false },
            ],
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please log in to enroll');
      navigate('/login');
      return;
    }

    try {
      const res = await api.post('/payments/checkout', {
        courseId: course._id,
        price: course.discountPrice || course.price,
        provider: 'stripe',
      });
      
      if (res.data.data.checkoutUrl) {
        window.location.href = res.data.data.checkoutUrl;
      } else {
        toast.success(res.data.data.message || 'Enrolled successfully!');
        navigate('/student/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    }
  };

  if (loading || !course) return <div className="p-12 text-center">Loading course detail...</div>;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Banner / Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: course.category?.color || '#4F46E5' }}>
            {course.category?.name}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {course.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            {course.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5 text-amber-500 font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{course.rating}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{Math.round(course.totalDuration / 60)} hrs total</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>{course.totalLessons} lessons</span>
            </div>
          </div>
        </div>

        {/* Pricing Card Sidebar */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-6 shadow-xl sticky top-24">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 group cursor-pointer" onClick={() => setIsPreviewOpen(true)}>
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/90 text-primary-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 ml-1 fill-primary-600" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">₹{course.discountPrice || course.price}</span>
              {course.discountPrice > 0 && <span className="text-sm text-slate-400 line-through">₹{course.price}</span>}
            </div>
            <p className="text-xs text-accent-success font-semibold">30-Day Money-Back Guarantee</p>
          </div>

          <button
            onClick={handleEnroll}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 shadow-glow hover:scale-[1.02] transition"
          >
            Enroll Now
          </button>
        </div>
      </div>

      {/* What you'll learn section */}
      {course.learningOutcomes && course.learningOutcomes.length > 0 && (
        <div className="border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">What you'll learn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            {course.learningOutcomes.map((outcome, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-accent-success shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600 dark:text-slate-300 leading-normal">{outcome}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Curriculum Accordion */}
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Course Curriculum</h2>
        <div className="space-y-4">
          {course.modules?.map((mod, idx) => (
            <div key={mod._id || idx} className="glass-panel p-5 rounded-2xl space-y-3">
              <h3 className="font-bold text-slate-800 dark:text-white text-base">{mod.title}</h3>
              <div className="space-y-2">
                {mod.lessons?.map((les) => (
                  <div key={les._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 text-sm">
                    <div className="flex items-center gap-3">
                      <Play className="w-4 h-4 text-primary-600" />
                      <span className="font-medium text-slate-700 dark:text-slate-200">{les.title}</span>
                    </div>
                    {les.isPreview && <span className="text-xs px-2 py-0.5 rounded bg-primary-500/10 text-primary-600 font-semibold">Preview</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Preview */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl glass-panel rounded-3xl p-4 space-y-4 relative">
            <button onClick={() => setIsPreviewOpen(false)} className="absolute top-4 right-4 text-white font-bold text-xl z-10">✕</button>
            <h3 className="text-lg font-bold text-white px-2">Course Preview</h3>
            <div className="aspect-video rounded-2xl overflow-hidden bg-black">
              <ReactPlayer url={course.previewVideo} controls width="100%" height="100%" playing />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
