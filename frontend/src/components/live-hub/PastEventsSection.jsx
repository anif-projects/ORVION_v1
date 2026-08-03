import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Calendar, Clock, Users, User, ArrowRight, X, ExternalLink, CheckCircle2 } from 'lucide-react';
import ReactPlayer from 'react-player';

const pastEventsData = [
  {
    id: 'past-1',
    title: 'AI Career Bootcamp 2026',
    speaker: 'SAINADH NARNE',
    designation: 'Founder & CEO',
    date: 'January 18, 2026',
    duration: '2h 30m',
    attendees: '1,420',
    coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    summary: 'Comprehensive deep dive into building AI-driven career roadmaps, integrating LLM APIs, and mastering modern full-stack development skills.',
    topics: ['AI Integration', 'Career Roadmap', 'Full-Stack Architecture', 'Q&A Session'],
  },
  {
    id: 'past-2',
    title: 'Data Engineering Summit',
    speaker: 'SAINADH NARNE',
    designation: 'Founder & CEO',
    date: 'December 12, 2025',
    duration: '3h 15m',
    attendees: '980',
    coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    summary: 'Real-world masterclass on designing ETL pipelines, distributed database schemas, and streaming real-time analytics at scale.',
    topics: ['Data Pipelines', 'SQL & NoSQL', 'Spark & Kafka', 'ETL Best Practices'],
  },
  {
    id: 'past-3',
    title: 'Full Stack React Workshop',
    speaker: 'SAINADH NARNE',
    designation: 'Founder & CEO',
    date: 'November 05, 2025',
    duration: '4h 00m',
    attendees: '2,150',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    summary: 'Hands-on intensive workshop crafting enterprise React applications with custom state management, Tailwind CSS, and Node.js REST APIs.',
    topics: ['React 19 Hooks', 'State Management', 'REST API Integration', 'Deployments'],
  },
  {
    id: 'past-4',
    title: 'DevOps & Kubernetes Masterclass',
    speaker: 'SAINADH NARNE',
    designation: 'Founder & CEO',
    date: 'October 22, 2025',
    duration: '3h 00m',
    attendees: '840',
    coverImage: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    summary: 'Step-by-step walkthrough containerizing full-stack microservices with Docker, configuring Kubernetes clusters, and setting up automated CI/CD pipelines.',
    topics: ['Docker Containers', 'Kubernetes Clusters', 'CI/CD Pipelines', 'Cloud Deployment'],
  },
];

export default function PastEventsSection() {
  const [activeModalEvent, setActiveModalEvent] = useState(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white via-amber-50/20 to-white dark:from-slate-900 dark:via-slate-900/40 dark:to-slate-900 border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            Past <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">Events</span>
          </h2>
        </motion.div>

        {/* 4-Column Responsive Grid (Desktop: 4 cols, Tablet: 2 cols, Mobile: 1 col) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {pastEventsData.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="group bg-white dark:bg-slate-900 rounded-[22px] border border-slate-200/80 dark:border-slate-800/80 p-4 space-y-4 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                {/* Event Cover Image Container */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-sm">
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Completed Badge */}
                  <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/90 text-white backdrop-blur-md shadow-md">
                    Completed
                  </span>
                  {/* Play Overlay Trigger */}
                  <button
                    onClick={() => {
                      setActiveModalEvent(event);
                      setIsPlayingVideo(true);
                    }}
                    className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center"
                    aria-label={`Play ${event.title}`}
                  >
                    <div className="w-11 h-11 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5 fill-white" />
                    </div>
                  </button>
                </div>

                {/* Event Info */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-[#0F172A] dark:text-white leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  


                  {/* Meta Grid: Date, Duration, Attendees */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    <div className="flex items-center gap-1 truncate">
                      <Calendar className="w-3 h-3 text-amber-600 shrink-0" />
                      <span className="truncate">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                      <span>{event.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 col-span-2">
                      <Users className="w-3 h-3 text-amber-600 shrink-0" />
                      <span>{event.attendees} Attendees Enrolled</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setActiveModalEvent(event);
                    setIsPlayingVideo(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Highlights</span>
                </button>

                <button
                  onClick={() => {
                    setActiveModalEvent(event);
                    setIsPlayingVideo(false);
                  }}
                  className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-amber-600 transition flex items-center gap-1"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* EVENT DETAILS / HIGHLIGHTS MODAL */}
      <AnimatePresence>
        {activeModalEvent && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[24px] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    Past Event Recording
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] dark:text-white mt-1">
                    {activeModalEvent.title}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setActiveModalEvent(null);
                    setIsPlayingVideo(false);
                  }}
                  className="w-8 h-8 rounded-full bg-slate-200/80 dark:bg-slate-700/80 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600 transition text-slate-700 dark:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content Body */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
                {/* Video Player or Image */}
                <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-inner relative">
                  {isPlayingVideo ? (
                    <ReactPlayer
                      url={activeModalEvent.videoUrl}
                      controls
                      width="100%"
                      height="100%"
                      playing
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <img
                        src={activeModalEvent.coverImage}
                        alt={activeModalEvent.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setIsPlayingVideo(true)}
                        className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 group"
                      >
                        <div className="w-14 h-14 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 ml-1 fill-white" />
                        </div>
                        <span className="text-xs font-bold text-white uppercase tracking-wider bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
                          Play Event Highlights
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Event Summary & Info */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-amber-600" /> {activeModalEvent.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-600" /> {activeModalEvent.duration}</span>
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-amber-600" /> {activeModalEvent.attendees} Attendees</span>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {activeModalEvent.summary}
                  </p>

                  {/* Topics Covered */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">Key Topics Covered</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {activeModalEvent.topics.map((topic, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-lg font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="truncate">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
