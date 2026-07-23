import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Video, Clock, Users, ArrowRight, Radio } from 'lucide-react';
import { pageVariants } from '../../utils/animations';

export default function LiveEventsPage() {
  const events = [
    {
      id: 1,
      title: 'Full-Stack Architecture & Microservices Masterclass',
      date: 'Tomorrow at 6:00 PM EST',
      speaker: 'Alex Rivera (Lead Engineer)',
      category: 'System Design',
      attendees: 342,
      status: 'upcoming',
    },
    {
      id: 2,
      title: 'Building AI Agents & RAG Pipelines with Node.js',
      date: 'Friday at 4:00 PM EST',
      speaker: 'Dr. Sarah Lin (AI Researcher)',
      category: 'Artificial Intelligence',
      attendees: 512,
      status: 'upcoming',
    },
    {
      id: 3,
      title: 'UI/UX Glassmorphism & Modern CSS Techniques',
      date: 'Next Monday at 7:00 PM EST',
      speaker: 'Elena Rostova (Senior Designer)',
      category: 'Frontend & Design',
      attendees: 289,
      status: 'upcoming',
    },
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12"
    >
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-secondary-500/30 text-xs font-semibold text-secondary-600 dark:text-secondary-400">
          <Radio className="w-4 h-4 text-accent-danger animate-pulse" />
          <span>Interactive Live Streams & Workshops</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Live Events & <span className="gradient-text">Webinars</span>
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          Join live code-alongs, Q&A sessions with senior engineers, and technology deep dives.
        </p>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {events.map((event) => (
          <div
            key={event.id}
            className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 space-y-6 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-600/10 text-primary-600 dark:text-primary-400">
                {event.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Users className="w-3.5 h-3.5" />
                {event.attendees} Registered
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                {event.title}
              </h3>
              <p className="text-xs font-semibold text-slate-500">{event.speaker}</p>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800">
              <Clock className="w-4 h-4 text-secondary-500" />
              <span>{event.date}</span>
            </div>

            <button className="w-full py-3 rounded-full font-bold text-xs text-white bg-gradient-to-r from-primary-600 to-primary-700 shadow-glow hover:scale-[1.02] transition flex items-center justify-center gap-2">
              <Video className="w-4 h-4" /> Reserve Free Seat
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
