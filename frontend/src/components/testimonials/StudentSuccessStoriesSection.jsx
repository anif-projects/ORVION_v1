import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, StarHalf } from 'lucide-react';

const REVIEWS_ROW_1 = [
  {
    id: '1',
    name: 'Arjun Sharma',
    initials: 'AS',
    role: 'DevOps & Cloud',
    rating: 5.0,
    color: 'from-orange-500 to-amber-600',
    review: 'The DevOps & Cloud program gave me real hands-on exposure to tools companies actually use. I built and deployed a full project by the end of it.',
  },
  {
    id: '2',
    name: 'Priya Reddy',
    initials: 'PR',
    role: 'Hackathon',
    rating: 4.0,
    color: 'from-blue-500 to-indigo-600',
    review: 'Joining the hackathon was one of the best decisions I made this year. The problem statements were realistic and the mentors guided us at every step.',
  },
  {
    id: '3',
    name: 'Rahul Kumar',
    initials: 'RK',
    role: 'UI/UX Design',
    rating: 4.0,
    color: 'from-emerald-500 to-teal-600',
    review: 'The UI/UX Design course completely changed how I approach design. My portfolio looks so much stronger now.',
  },
  {
    id: '4',
    name: 'Sneha Patel',
    initials: 'SP',
    role: 'AI & Machine Learning',
    rating: 5.0,
    color: 'from-purple-500 to-violet-600',
    review: 'I attended one of the webinars expecting a basic overview, but it went deep into practical AI applications. Really valuable session.',
  },
  {
    id: '5',
    name: 'Vikram Gupta',
    initials: 'VG',
    role: 'Cybersecurity',
    rating: 4.0,
    color: 'from-red-500 to-rose-600',
    review: 'The Cybersecurity internship let me work on actual security assessments, not just theory. I learned more in 16 weeks than I expected.',
  },
  {
    id: '6',
    name: 'Neha Singh',
    initials: 'NS',
    role: 'Cloud Computing',
    rating: 4.5,
    color: 'from-amber-500 to-yellow-600',
    review: 'Workshops here are fast-paced and practical. No filler content, just skills you can use immediately.',
  },
  {
    id: '7',
    name: 'Akhil Varma',
    initials: 'AV',
    role: 'Machine Learning',
    rating: 5.0,
    color: 'from-cyan-500 to-blue-600',
    review: "The Machine Learning program's live sessions made complex algorithms easy to understand. The instructors were patient and thorough.",
  },
  {
    id: '8',
    name: 'Rohan Mehta',
    initials: 'RM',
    role: 'Data Engineering',
    rating: 4.0,
    color: 'from-indigo-500 to-purple-600',
    review: 'I was nervous about Quantum Computing being too advanced, but the course broke it down really well for beginners.',
  },
  {
    id: '9',
    name: 'Ananya Rao',
    initials: 'AR',
    role: 'Internship Program',
    rating: 5.0,
    color: 'from-teal-500 to-emerald-600',
    review: 'Our hackathon team built a working prototype in 48 hours with guidance from industry mentors. Great experience overall.',
  },
  {
    id: '10',
    name: 'Karthik Reddy',
    initials: 'KR',
    role: 'Data Engineering',
    rating: 4.5,
    color: 'from-orange-500 to-red-600',
    review: 'The Data Engineering internship gave me experience building real pipelines, something I couldn\'t find in a typical course.',
  },
];

const REVIEWS_ROW_2 = [
  {
    id: '11',
    name: 'Pooja Nair',
    initials: 'PN',
    role: 'AI & Data Science',
    rating: 4.0,
    color: 'from-violet-500 to-purple-600',
    review: 'Loved the structure of the AI & Data Science program — from data wrangling to deploying models, it covered everything end to end.',
  },
  {
    id: '12',
    name: 'Sai Charan',
    initials: 'SC',
    role: 'Career Mentorship',
    rating: 5.0,
    color: 'from-blue-600 to-cyan-500',
    review: 'The career mentorship after the program helped me prepare for interviews and land a role faster than I expected.',
  },
  {
    id: '13',
    name: 'Harsh Agarwal',
    initials: 'HA',
    role: 'UI/UX Design',
    rating: 4.5,
    color: 'from-emerald-600 to-green-500',
    review: 'As someone switching careers, the UI/UX internship gave me the confidence and portfolio pieces I needed to get noticed.',
  },
  {
    id: '14',
    name: 'Deepika Sharma',
    initials: 'DS',
    role: 'Cloud Computing',
    rating: 5.0,
    color: 'from-amber-600 to-orange-500',
    review: 'The webinar on cloud architecture was packed with insights I still refer back to.',
  },
  {
    id: '15',
    name: 'Nikhil Verma',
    initials: 'NV',
    role: 'DevOps & Cloud',
    rating: 4.0,
    color: 'from-rose-500 to-pink-600',
    review: 'Real-time projects during the DevOps course meant I wasn\'t just watching tutorials — I was actually building and troubleshooting.',
  },
  {
    id: '16',
    name: 'Aditya Rao',
    initials: 'AR',
    role: 'Cybersecurity',
    rating: 5.0,
    color: 'from-red-600 to-orange-600',
    review: 'The cybersecurity workshop covered both offensive and defensive techniques, which gave me a well-rounded understanding.',
  },
  {
    id: '17',
    name: 'Anusha Reddy',
    initials: 'AN',
    role: 'Internship Program',
    rating: 4.5,
    color: 'from-indigo-600 to-blue-500',
    review: 'Mentors in the internship program were always available and gave detailed feedback on my work.',
  },
  {
    id: '18',
    name: 'Ritika Jain',
    initials: 'RJ',
    role: 'Hackathon',
    rating: 4.0,
    color: 'from-pink-500 to-rose-500',
    review: 'I appreciated how the hackathon judges gave constructive feedback, not just rankings.',
  },
  {
    id: '19',
    name: 'Manoj Kumar',
    initials: 'MK',
    role: 'Machine Learning',
    rating: 5.0,
    color: 'from-teal-600 to-cyan-600',
    review: 'The Machine Learning internship let me apply what I learned in the course to an actual dataset and use case.',
  },
  {
    id: '20',
    name: 'Sanjana Patel',
    initials: 'SK',
    role: 'AI & Data Science',
    rating: 4.5,
    color: 'from-amber-500 to-orange-600',
    review: 'Every session felt live and interactive—not pre-recorded content dumped on us. That made a big difference.',
  },
];

// Helper to render star rating dynamically (Full, Half, Empty)
const renderStars = (rating = 5.0) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1 text-amber-400">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
      {hasHalfStar && (
        <StarHalf key="half" className="w-4 h-4 fill-amber-400 text-amber-400" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-slate-300 dark:text-slate-700" />
      ))}
    </div>
  );
};

// Triplicate cards for seamless 60FPS loop
const TRIPLE_ROW_1 = [...REVIEWS_ROW_1, ...REVIEWS_ROW_1, ...REVIEWS_ROW_1];
const TRIPLE_ROW_2 = [...REVIEWS_ROW_2, ...REVIEWS_ROW_2, ...REVIEWS_ROW_2];

export default function StudentSuccessStoriesSection() {
  const [activeCardId, setActiveCardId] = useState(null);

  const scrollX1Ref = useRef(0);
  const scrollX2Ref = useRef(0);
  const animationFrameRef = useRef(null);

  const speed1Ref = useRef(0.65); // Row 1 Left to Right
  const targetSpeed1Ref = useRef(0.65);

  const speed2Ref = useRef(0.65); // Row 2 Right to Left
  const targetSpeed2Ref = useRef(0.65);

  const resumeTimerRef = useRef(null);

  const cardWidth = 340;
  const cardGap = 24;
  const totalSingleWidth = REVIEWS_ROW_1.length * (cardWidth + cardGap);

  // Smooth Animation Loop
  const animate = useCallback(() => {
    // Smooth speed interpolation
    speed1Ref.current += (targetSpeed1Ref.current - speed1Ref.current) * 0.12;
    speed2Ref.current += (targetSpeed2Ref.current - speed2Ref.current) * 0.12;

    if (speed1Ref.current > 0.001) {
      scrollX1Ref.current = (scrollX1Ref.current + speed1Ref.current) % totalSingleWidth;
    }
    if (speed2Ref.current > 0.001) {
      scrollX2Ref.current = (scrollX2Ref.current + speed2Ref.current) % totalSingleWidth;
    }

    // Direct DOM transform updates for 60FPS zero-lag execution
    const track1 = document.getElementById('review-track-1');
    const track2 = document.getElementById('review-track-2');

    if (track1) {
      track1.style.transform = `translate3d(-${scrollX1Ref.current}px, 0, 0)`;
    }
    if (track2) {
      track2.style.transform = `translate3d(${scrollX2Ref.current - totalSingleWidth}px, 0, 0)`;
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [totalSingleWidth]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate]);

  // Click card handler (Stops scrolling, focuses card)
  const handleCardClick = (id, e) => {
    e.stopPropagation();

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }

    setActiveCardId(id);
    targetSpeed1Ref.current = 0;
    targetSpeed2Ref.current = 0;
  };

  // Click outside handler (Resumes scrolling after 600ms)
  const handleOutsideClick = () => {
    if (activeCardId !== null) {
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
      resumeTimerRef.current = setTimeout(() => {
        setActiveCardId(null);
        targetSpeed1Ref.current = 0.65;
        targetSpeed2Ref.current = 0.65;
      }, 600);
    }
  };

  return (
    <section
      onClick={handleOutsideClick}
      className="w-full pt-[100px] pb-[100px] relative overflow-hidden bg-[#FFFCF8] dark:bg-[#0B0F17] select-none"
    >
      {/* 2% Opacity Engineering Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right, #ECE8DF 1px, transparent 1px), linear-gradient(to bottom, #ECE8DF 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Edge Blur Fades for Smooth Horizontal Entry/Exit */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-40 bg-gradient-to-r from-[#FFFCF8] dark:from-[#0B0F17] to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-40 bg-gradient-to-l from-[#FFFCF8] dark:from-[#0B0F17] to-transparent z-20 pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Single Clean Heading ONLY, 48px Bottom Margin) */}
        <div className="text-center max-w-[800px] mx-auto mb-12 flex flex-col items-center justify-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-[34px] sm:text-[48px] lg:text-[60px] font-extrabold text-[#0F172A] dark:text-white tracking-[-0.03em] leading-[1.05] text-center"
            style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif" }}
          >
            What Our Learners Say
          </motion.h2>
        </div>

        {/* Reviews Carousel Track Container */}
        <div className="space-y-6 overflow-hidden py-4">
          
          {/* Row 1: Left -> Right Scroll */}
          <div className="overflow-hidden w-full">
            <div id="review-track-1" className="flex items-center will-change-transform">
              {TRIPLE_ROW_1.map((item, index) => {
                const isActive = activeCardId === item.id;
                return (
                  <div
                    key={`row1-${item.id}-${index}`}
                    onClick={(e) => handleCardClick(item.id, e)}
                    style={{
                      width: `${cardWidth}px`,
                      height: `${cardHeight}px`,
                      marginRight: `${cardGap}px`,
                    }}
                    className={`shrink-0 rounded-[24px] bg-white dark:bg-slate-900 border ${
                      isActive
                        ? 'border-primary-500 dark:border-primary-400 ring-2 ring-primary-500/20 shadow-[0_20px_45px_rgba(15,23,42,0.14)] scale-[1.03]'
                        : 'border-black/[0.05] dark:border-white/[0.08] shadow-[0_10px_30px_rgba(15,23,42,0.06)]'
                    } p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 select-none`}
                  >
                    {/* Star Rating */}
                    {renderStars(item.rating)}

                    {/* Review Text (18px Medium) */}
                    <p className="text-[15px] sm:text-[18px] font-medium text-slate-900 dark:text-slate-100 leading-snug line-clamp-3 my-auto">
                      "{item.review}"
                    </p>

                    {/* Bottom Author Row: Gradient Initials Avatar + Name & Role */}
                    <div className="flex items-center gap-3 pt-3 border-t border-black/[0.05] dark:border-white/[0.08]">
                      {/* Circular Gradient Avatar with Initials */}
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${item.color} text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0`}>
                        {item.initials}
                      </div>

                      {/* Name & Role */}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[17px] font-bold text-slate-900 dark:text-white truncate leading-tight">
                          {item.name}
                        </h4>
                        <p className="text-[14px] text-slate-500 dark:text-slate-400 truncate leading-tight mt-0.5">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Row 2: Right -> Left Scroll */}
          <div className="overflow-hidden w-full">
            <div id="review-track-2" className="flex items-center will-change-transform">
              {TRIPLE_ROW_2.map((item, index) => {
                const isActive = activeCardId === item.id;
                return (
                  <div
                    key={`row2-${item.id}-${index}`}
                    onClick={(e) => handleCardClick(item.id, e)}
                    style={{
                      width: `${cardWidth}px`,
                      height: `${cardHeight}px`,
                      marginRight: `${cardGap}px`,
                    }}
                    className={`shrink-0 rounded-[24px] bg-white dark:bg-slate-900 border ${
                      isActive
                        ? 'border-primary-500 dark:border-primary-400 ring-2 ring-primary-500/20 shadow-[0_20px_45px_rgba(15,23,42,0.14)] scale-[1.03]'
                        : 'border-black/[0.05] dark:border-white/[0.08] shadow-[0_10px_30px_rgba(15,23,42,0.06)]'
                    } p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 select-none`}
                  >
                    {/* Star Rating */}
                    {renderStars(item.rating)}

                    {/* Review Text (18px Medium) */}
                    <p className="text-[15px] sm:text-[18px] font-medium text-slate-900 dark:text-slate-100 leading-snug line-clamp-3 my-auto">
                      "{item.review}"
                    </p>

                    {/* Bottom Author Row: Gradient Initials Avatar + Name & Role */}
                    <div className="flex items-center gap-3 pt-3 border-t border-black/[0.05] dark:border-white/[0.08]">
                      {/* Circular Gradient Avatar with Initials */}
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${item.color} text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0`}>
                        {item.initials}
                      </div>

                      {/* Name & Role */}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[17px] font-bold text-slate-900 dark:text-white truncate leading-tight">
                          {item.name}
                        </h4>
                        <p className="text-[14px] text-slate-500 dark:text-slate-400 truncate leading-tight mt-0.5">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

const cardHeight = 220;
