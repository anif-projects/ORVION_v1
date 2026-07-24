import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Clock, BookOpen, User } from 'lucide-react';
import { cardHoverVariants } from '../../utils/animations';

export default function CourseCard({ course }) {
  const {
    title,
    slug,
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

  return (
    <motion.div
      variants={cardHoverVariants}
      initial="initial"
      whileHover="hover"
      className="glass-card rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between group transition-shadow hover:shadow-xl"
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
              style={{ backgroundColor: category.color || '#4F46E5' }}
            >
              {category.name}
            </span>
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
