import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Clock, BookOpen, User } from 'lucide-react';
import { cardHoverVariants } from '../../utils/animations';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const cardAnimationVariants = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
};

export default function CourseCard({ course, index = 0 }) {
  const {
    _id,
    title,
    thumbnail,
    price,
    discountPrice,
    category,
    instructor,
    rating,
    enrolledCount,
    totalDuration,
    totalLessons,
    level,
  } = course;

  const slugify = (text) => text.toString().toLowerCase().replace(/\s+/g, '').replace(/[^\w\-]+/g, '');
  const slug = course.slug || (course.title ? slugify(course.title) : (course._id || course.id));
  const { user } = useAuth();
  const [isFeaturedState, setIsFeaturedState] = useState(course.isFeatured || false);

  const handleToggleFeatured = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await api.patch(`/courses/${_id || course.id}/toggle-featured`);
      if (res.data.data) {
        setIsFeaturedState(res.data.data.course.isFeatured);
        toast.success(res.data.data.course.isFeatured ? 'Course set as Featured!' : 'Course removed from Featured!');
      }
    } catch (err) {
      toast.error('Failed to toggle featured status');
    }
  };

  const isOffline = course.type === 'offline';

  if (isOffline) {
    return (
      <motion.div
        variants={cardAnimationVariants}
        initial="initial"
        whileInView="animate"
        whileHover="hover"
        viewport={{ once: true, amount: 0.25 }}
        transition={{ delay: index * 0.12 }}
        className="relative group block h-full w-full select-none"
      >
        <Link to={`/courses/${slug}`} className="block h-full">
          <div className="h-full w-full rounded-[24px] rounded-tr-[100px] p-[3px] bg-gradient-to-tr from-[#E2E8F0] via-[#E2E8F0]/30 to-primary-500 dark:to-primary-600 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col transition-all duration-300">
            <div className="h-full bg-[#f8fafc] dark:bg-slate-900 rounded-[21px] rounded-tr-[96px] p-5 sm:px-6 sm:py-6 flex flex-col items-start text-left relative overflow-hidden justify-between min-h-[300px]">
              
              {/* Top Row: Icon */}
              <div className="w-full flex items-center justify-between">
                <div className="w-[44px] h-[44px] bg-primary-500/10 dark:bg-primary-500/20 rounded-full flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="mt-4 space-y-2 flex-1 w-full">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-600 dark:text-primary-400">
                  {typeof category === 'object' ? category.name : category || 'Program'}
                </span>
                <h3 className="text-[18px] sm:text-[19px] font-extrabold text-[#0B0F19] dark:text-white leading-snug font-heading group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                  {title}
                </h3>
                <p className="text-[12.5px] text-[#4B5563] dark:text-slate-350 font-medium leading-relaxed line-clamp-3">
                  {course.subtitle || course.description}
                </p>
              </div>

              {/* Bottom Row: Specs & Go Arrow */}
              <div className="w-full flex justify-between items-end mt-5 pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
                <div className="bg-primary-500/10 dark:bg-slate-800/80 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-[11px] font-bold px-3 py-1.5 rounded-lg">
                  {totalLessons ? `${totalLessons} modules` : '12 weeks'}
                </div>
                
                <div className="w-[36px] h-[36px] rounded-full bg-gradient-to-r from-primary-600 to-primary-700 flex items-center justify-center relative overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-right w-4 h-4 text-white relative z-10" aria-hidden="true">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </div>

            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardAnimationVariants}
      initial="initial"
      whileInView="animate"
      whileHover="hover"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay: index * 0.12 }}
      className="glass-card rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between group transition-shadow duration-250 hover:shadow-2xl"
      style={{ willChange: 'transform, opacity' }}
    >
      <div>
        {/* Thumbnail Container */}
        <div className="relative aspect-video overflow-hidden bg-slate-900">
          <img
            src={thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {category && (
            <span
              className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold rounded-full text-white shadow-sm"
              style={{ backgroundColor: typeof category === 'object' ? (category.color || '#4F46E5') : '#4F46E5' }}
            >
              {typeof category === 'object' ? category.name : category}
            </span>
          )}
          {(user?.role === 'admin' || user?.role === 'super_admin') && (
            <button
              onClick={handleToggleFeatured}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:scale-110 transition shadow-sm z-10"
              title={isFeaturedState ? "Remove from Featured" : "Mark as Featured"}
            >
              <Star className={`w-3.5 h-3.5 ${isFeaturedState ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-400'}`} />
            </button>
          )}
          <span className="absolute bottom-3 right-3 px-2 py-0.5 text-[10px] font-semibold bg-black/60 backdrop-blur-md text-white rounded-md uppercase tracking-wider">
            {level ? level.replace('_', ' ') : 'All Levels'}
          </span>
        </div>

        {/* Details Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{rating || 4.8}</span>
            <span className="text-slate-400 font-normal">({enrolledCount || 0} enrolled)</span>
          </div>

          <h3 className="font-bold text-base line-clamp-2 text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {title}
          </h3>

          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{Math.round((totalDuration || 300) / 60)} hrs</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{totalLessons || 12} lessons</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Price & Action */}
      <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between mt-2">
        <div className="flex items-baseline gap-1.5">
          {price === 0 ? (
            <span className="text-lg font-extrabold text-accent-success">FREE</span>
          ) : (
            <>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                ₹{discountPrice || price}
              </span>
              {discountPrice > 0 && (
                <span className="text-xs text-slate-400 line-through">₹{price}</span>
              )}
            </>
          )}
        </div>
        <Link
          to={`/courses/${slug}`}
          className="px-3.5 py-1.5 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold text-xs hover:bg-primary-600 hover:text-white transition-all"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}
