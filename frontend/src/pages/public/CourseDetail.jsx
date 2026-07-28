import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Check, Clock, BookOpen, Star, ShieldCheck, Award, Globe, 
  Calendar, ChevronDown, ChevronUp, Layers, Users, CheckCircle2, 
  Terminal, Briefcase, HelpCircle, Sparkles, Share2, Heart, 
  Video, Code, FileText, MessageSquare, ExternalLink, Linkedin, Twitter, Github
} from 'lucide-react';
import ReactPlayer from 'react-player';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import CourseCard from '../../components/common/CourseCard';
import { pageVariants } from '../../utils/animations';

// Helper function to normalize course data & supply rich fallbacks for all sections
const normalizeCourseData = (rawCourse = {}) => {
  const isWeb = (rawCourse.category?.name || rawCourse.category || '').toLowerCase().includes('web') || (rawCourse.title || '').toLowerCase().includes('react');

  const modules = (rawCourse.modules && rawCourse.modules.length > 0)
    ? rawCourse.modules
    : [
        {
          _id: 'mod-1',
          title: 'Module 1: Architecture, Setup & Core Foundations',
          duration: '120 mins',
          lessons: [
            { _id: 'les-1', title: '1.1 Course Orientation & Enterprise Architecture Overview', duration: 15, isPreview: true },
            { _id: 'les-2', title: '1.2 Setting Up Your Professional Developer Environment', duration: 25, isPreview: true },
            { _id: 'les-3', title: '1.3 Deep Dive into Modern JavaScript & Async Patterns', duration: 45, isPreview: false },
            { _id: 'les-4', title: '1.4 Building Clean Component Hierarchies & Layout Tokens', duration: 35, isPreview: false },
          ],
        },
        {
          _id: 'mod-2',
          title: 'Module 2: Scalable Backend & REST API Development',
          duration: '160 mins',
          lessons: [
            { _id: 'les-5', title: '2.1 Express.js Server Setup & Controller Pattern', duration: 30, isPreview: true },
            { _id: 'les-6', title: '2.2 Database Schema Design & Normalization Best Practices', duration: 40, isPreview: false },
            { _id: 'les-7', title: '2.3 Authentication Pipeline: Passwords, JWT & Refresh Tokens', duration: 50, isPreview: false },
            { _id: 'les-8', title: '2.4 Middleware Validation, Rate-Limiting & Security Headers', duration: 40, isPreview: false },
          ],
        },
        {
          _id: 'mod-3',
          title: 'Module 3: Frontend Mastery, State & Glassmorphism UI',
          duration: '140 mins',
          lessons: [
            { _id: 'les-9', title: '3.1 Reactive State Management & Context API Architecture', duration: 35, isPreview: false },
            { _id: 'les-10', title: '3.2 Crafting Premium Dark Mode & Glassmorphism Interfaces', duration: 40, isPreview: false },
            { _id: 'les-11', title: '3.3 Integrating Axios Interceptors & React Query Caching', duration: 35, isPreview: false },
            { _id: 'les-12', title: '3.4 Smooth Page Transitions & Micro-Animations with Framer Motion', duration: 30, isPreview: false },
          ],
        },
        {
          _id: 'mod-4',
          title: 'Module 4: Deployment, CI/CD & Final Capstone Project',
          duration: '180 mins',
          lessons: [
            { _id: 'les-13', title: '4.1 Containerizing Applications with Docker & Docker Compose', duration: 45, isPreview: false },
            { _id: 'les-14', title: '4.2 Configuring Payment Gateways (Stripe & Razorpay Integration)', duration: 45, isPreview: false },
            { _id: 'les-15', title: '4.3 Automated CI/CD Deployment to Cloud Services (AWS / Vercel)', duration: 50, isPreview: false },
            { _id: 'les-16', title: '4.4 Final Capstone Code Review, Certification & Career Roadmap', duration: 40, isPreview: false },
          ],
        },
      ];

  let totalLessonsCount = 0;
  modules.forEach(m => {
    if (m.lessons && Array.isArray(m.lessons)) {
      totalLessonsCount += m.lessons.length;
    }
  });

  return {
    _id: rawCourse._id || rawCourse.id || 'c-default',
    slug: rawCourse.slug || 'course-detail',
    title: rawCourse.title || 'Full-Stack Web Development & AI Architecture Masterclass',
    subtitle: rawCourse.subtitle || 'Master modern full-stack development, cloud deployment, and AI integration through practical coding exercises and industry-focused concepts.',
    category: {
      name: typeof rawCourse.category === 'object' ? rawCourse.category?.name : (rawCourse.category || 'Engineering'),
      color: typeof rawCourse.category === 'object' ? (rawCourse.category?.color || '#D97706') : '#D97706',
    },
    thumbnail: rawCourse.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    previewVideo: rawCourse.previewVideo || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    price: rawCourse.price !== undefined && rawCourse.price !== null ? rawCourse.price : 99.99,
    discountPrice: rawCourse.discountPrice !== undefined && rawCourse.discountPrice !== null 
      ? rawCourse.discountPrice 
      : (rawCourse.price !== undefined && rawCourse.price !== null ? rawCourse.price : 49.99),
    rating: rawCourse.rating !== undefined && rawCourse.rating !== null ? rawCourse.rating : 4.9,
    enrolledCount: rawCourse.enrolledCount !== undefined && rawCourse.enrolledCount !== null ? rawCourse.enrolledCount : 2480,
    totalDuration: rawCourse.totalDuration !== undefined && rawCourse.totalDuration !== null ? rawCourse.totalDuration : 480, // minutes
    totalLessons: totalLessonsCount,
    language: rawCourse.language || 'English (Subtitles available)',
    updatedAt: rawCourse.updatedAt ? new Date(rawCourse.updatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'July 2026',
    certificate: rawCourse.isCertificateIncluded !== undefined && rawCourse.isCertificateIncluded !== null ? Boolean(rawCourse.isCertificateIncluded) : true,
    level: rawCourse.level ? rawCourse.level.replace('_', ' ') : 'All Levels',

    // Section 2: About This Course
    description: rawCourse.description || `Master Python from the ground up through practical coding exercises, real-world projects, and industry-focused concepts. This course is designed to help beginners build a strong programming foundation while preparing intermediate learners for professional software development and technical interviews.`,

    // What You'll Learn
    learningOutcomes: (rawCourse.learningOutcomes && rawCourse.learningOutcomes.length > 0)
      ? rawCourse.learningOutcomes
      : [
          'Build end-to-end full-stack web applications with clean, maintainable architecture',
          'Implement secure user authentication, JWT token handling, and role-based authorization',
          'Design RESTful APIs and integrate scalable database solutions (SQL & NoSQL)',
          'Deploy applications to cloud infrastructure with automated CI/CD pipelines',
          'Write optimized code using industry design patterns and performance best practices',
          'Master state management, async data fetching, and micro-interactions for modern UIs',
        ],

    // Course Curriculum
    modules,
  };
};

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [openModuleIndex, setOpenModuleIndex] = useState(0); // Module accordion state

  useEffect(() => {
    fetchCourseDetail();
  }, [slug]);

  useEffect(() => {
    if (course && user) {
      const checkEnrollment = async () => {
        try {
          const res = await api.get('/learning/my-courses');
          const enrollments = res.data.data.enrollments || [];
          const enrolled = enrollments.some(e => String(e.course?._id || e.course?.id) === String(course._id));
          setIsEnrolled(enrolled);
        } catch (err) {
          console.error(err);
        }
      };
      checkEnrollment();
    }
  }, [course, user]);

  const fetchCourseDetail = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/courses/slug/${slug}`);
      const rawData = res.data?.data?.course || res.data?.course;
      setCourse(normalizeCourseData(rawData));
    } catch (err) {
      console.error('Using dynamic fallback course detail:', err);
      setCourse(normalizeCourseData({ slug, title: slug ? slug.replace(/-/g, ' ').toUpperCase() : 'Full-Stack Masterclass' }));
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please log in to enroll in this course');
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

  // Reusable Purchase Card render function (ensures 100% identical styling for Mobile & Desktop)
  const renderPurchaseCard = (isMobile = false) => (
    <div className={`glass-card p-5 sm:p-6 rounded-[24px] border border-slate-200/90 dark:border-slate-800/90 space-y-5 sm:space-y-6 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl ${isMobile ? 'w-full my-2' : 'sticky top-28'}`}>
      
      {/* Course Thumbnail & Video Preview Trigger */}
      <div 
        className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 group cursor-pointer shadow-md"
        onClick={() => setIsPreviewOpen(true)}
      >
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-1 fill-white" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
            Preview Course
          </span>
        </div>
      </div>

      {/* Price Display */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white">
            ₹{course.discountPrice || course.price}
          </span>
          {course.discountPrice > 0 && course.price > course.discountPrice && (
            <span className="text-base text-slate-400 line-through font-medium">
              ₹{course.price}
            </span>
          )}
          {course.discountPrice > 0 && course.price > course.discountPrice && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
              SAVE {Math.round(((course.price - course.discountPrice) / course.price) * 100)}%
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={isEnrolled ? () => navigate('/student/dashboard') : handleEnroll}
          className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 via-amber-600 to-orange-600 shadow-lg shadow-amber-600/25 hover:opacity-95 hover:scale-[1.01] transition-all duration-200 text-sm tracking-wide"
        >
          {isEnrolled ? 'Access Granted (Go to Student Portal)' : 'Enroll Now'}
        </button>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Course link copied to clipboard!');
            }}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Share Course</span>
          </button>
        </div>
      </div>

      {/* Quick Includes List */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Full lifetime access with future updates</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Access on mobile, desktop, and tablet</span>
        </div>
        {course.certificate && (
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Official verifiable completion certificate</span>
          </div>
        )}
      </div>

    </div>
  );

  if (loading || !course) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-amber-500/30 border-t-amber-500 animate-spin" />
        <p className="text-slate-600 dark:text-slate-300 font-semibold text-sm">Loading Course Masterclass...</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 pb-16 sm:pb-20 text-slate-800 dark:text-slate-100 selection:bg-amber-500 selection:text-white"
    >
      {/* ====================================================
          UNIFIED LAYOUT CONTAINER
      ==================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN (col-span-7 on Desktop) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* 1. Category Badge & Level */}
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="px-3.5 py-1 rounded-full text-xs font-extrabold text-white uppercase tracking-wider shadow-sm"
                style={{ backgroundColor: course.category?.color || '#D97706' }}
              >
                {course.category?.name}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {course.level}
              </span>
            </div>

            {/* 2. Course Title */}
            <h1 className="text-2.5xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-[1.18]">
              {course.title}
            </h1>

            {/* 3. Short Description */}
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-lg leading-relaxed font-medium">
              {course.subtitle}
            </p>

            {/* 4. Ratings & Metadata Grid */}
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 pt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 border-t border-slate-200/70 dark:border-slate-800/70">
              <div className="flex items-center gap-1.5 text-amber-500 font-extrabold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{course.rating}</span>
                <span className="text-slate-400 font-normal">({course.enrolledCount.toLocaleString()} enrolled)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{Math.round(course.totalDuration / 60)} Hours Total</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>{course.totalLessons} Modules & Lessons</span>
              </div>
            </div>

            {/* Secondary Specs Row */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 dark:text-slate-400 pb-2">
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>{course.language}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Updated {course.updatedAt}</span>
              </div>
              {course.certificate && (
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Award className="w-3.5 h-3.5" />
                  <span>Certificate Included</span>
                </div>
              )}
            </div>

            {/* 5. MOBILE & TABLET PURCHASE CARD (< 1024px: Appears directly after metadata specs, BEFORE About This Course) */}
            <div className="block lg:hidden">
              {renderPurchaseCard(true)}
            </div>

            {/* 6. ABOUT THIS COURSE */}
            <section className="space-y-4 bg-white dark:bg-slate-900/80 p-5 sm:p-8 rounded-[22px] border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] dark:text-white tracking-tight flex items-center gap-2">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                <span>About This Course</span>
              </h2>
              <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
                {course.description.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </section>

            {/* 7. WHAT YOU'LL LEARN */}
            <section className="space-y-6 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent p-5 sm:p-8 rounded-[22px] border border-amber-500/20 dark:border-amber-500/30">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] dark:text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                <span>What You'll Learn</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {course.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">{outcome}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 8. COURSE CURRICULUM */}
            <section className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] dark:text-white tracking-tight flex items-center gap-2">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                  <span>Course Curriculum</span>
                </h2>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {course.modules.length} Modules • {course.totalLessons} Lessons
                </span>
              </div>

              <div className="space-y-3.5 sm:space-y-4">
                {course.modules.map((mod, idx) => {
                  const isOpen = openModuleIndex === idx;
                  const hasAccess = isEnrolled || user?.role === 'admin' || user?.role === 'super_admin' || idx === 0;
                  return (
                    <div key={mod._id || idx} className="rounded-[20px] border border-slate-200/80 dark:border-slate-800/80 overflow-hidden bg-white dark:bg-slate-900/80 shadow-sm">
                      <button
                        onClick={() => {
                          if (!hasAccess) {
                            toast.error('Please enroll in the course to unlock this module.');
                            return;
                          }
                          setOpenModuleIndex(isOpen ? null : idx);
                        }}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition"
                      >
                        <div className="space-y-1 pr-2">
                          <h3 className="font-bold text-sm sm:text-base text-[#0F172A] dark:text-white leading-snug">
                            {mod.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {mod.lessons?.length || 0} Lessons • {mod.duration || '45 mins'}
                          </p>
                        </div>
                        {!hasAccess ? (
                          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-lg shrink-0 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                            <span className="text-[10px] font-bold uppercase tracking-wider">Locked</span>
                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                        ) : (
                          isOpen ? <ChevronUp className="w-5 h-5 text-amber-600 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                        )}
                      </button>

                      <AnimatePresence>
                        {isOpen && hasAccess && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="p-3 sm:p-4 space-y-2 border-t border-slate-100 dark:border-slate-800/60"
                          >
                            {mod.lessons?.map((les) => (
                              <div key={les._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm gap-2">
                                <div className="flex items-center gap-3 min-w-0">
                                  <Play className="w-4 h-4 text-amber-600 shrink-0" />
                                  <span className="font-medium text-slate-700 dark:text-slate-200 truncate">{les.title}</span>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
                                  {les.isPreview && (
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); setIsPreviewOpen(true); }}
                                      className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition"
                                    >
                                      Preview
                                    </button>
                                  )}
                                  <span className="text-[11px] sm:text-xs text-slate-400">{Math.round((les.duration || 300) / 60)}m</span>
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN: DESKTOP STICKY PURCHASE SIDEBAR (≥ 1024px) */}
          <div className="hidden lg:block lg:col-span-5">
            {renderPurchaseCard(false)}
          </div>

        </div>
      </div>

      {/* VIDEO PREVIEW MODAL */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl glass-card rounded-[24px] p-4 space-y-4 relative bg-slate-900 text-white border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-base font-bold text-white truncate">{course.title} - Video Preview</h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition font-bold"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
              <ReactPlayer url={course.previewVideo} controls width="100%" height="100%" playing />
            </div>
          </div>
        </div>
      )}

    </motion.div>
  );
}
