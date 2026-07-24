import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Code2, 
  TrendingUp, 
  Zap, 
  GraduationCap, 
  Briefcase, 
  Award, 
  Sparkles, 
  Cpu, 
  ShieldCheck,
  ArrowUpRight 
} from 'lucide-react';

const WHY_ORVION_CARDS = [
  {
    number: '01',
    title: 'Expert Mentorship',
    description: 'Learn directly from experienced engineers and industry professionals working in top tech companies.',
    icon: GraduationCap,
    gradient: 'from-[#FFFDF9] to-[#FFF4EC] dark:from-[#281D17] dark:to-[#1E1611]',
    accentBg: 'bg-[#F97316]',
    glowGradient: 'from-amber-500 to-orange-600',
    iconBg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    badge: 'EXPERT MENTORS',
  },
  {
    number: '02',
    title: 'Project Based',
    description: 'Build practical applications instead of only watching tutorials to create a job-ready portfolio.',
    icon: Code2,
    gradient: 'from-[#F8FCFF] to-[#EEF6FF] dark:from-[#112133] dark:to-[#0B1522]',
    accentBg: 'bg-[#3B82F6]',
    glowGradient: 'from-blue-500 to-cyan-600',
    iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    badge: 'PROJECT BASED',
  },
  {
    number: '03',
    title: 'Industry Curriculum',
    description: 'Stay updated with modern tech stacks and production engineering standards used by market leaders.',
    icon: TrendingUp,
    gradient: 'from-[#F8FFF9] to-[#EEF9F1] dark:from-[#122618] dark:to-[#0B1910]',
    accentBg: 'bg-[#10B981]',
    glowGradient: 'from-emerald-500 to-teal-600',
    iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    badge: 'INDUSTRY READY',
  },
  {
    number: '04',
    title: 'Live Sessions',
    description: 'Interactive learning with real-time guidance, live coding walkthroughs, and instant doubt solving.',
    icon: Zap,
    gradient: 'from-[#FFF9FD] to-[#F8F2FF] dark:from-[#21172F] dark:to-[#150E20]',
    accentBg: 'bg-[#8B5CF6]',
    glowGradient: 'from-purple-500 to-indigo-600',
    iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    badge: 'LIVE LEARNING',
  },
  {
    number: '05',
    title: 'Career Roadmap',
    description: 'Follow a structured step-by-step path designed to take you from beginner to confident engineer.',
    icon: Briefcase,
    gradient: 'from-[#FFFDF7] to-[#FFF8EA] dark:from-[#272013] dark:to-[#1B150A]',
    accentBg: 'bg-[#F59E0B]',
    glowGradient: 'from-amber-500 to-yellow-600',
    iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    badge: 'CAREER ROADMAP',
  },
  {
    number: '06',
    title: 'Placement Support',
    description: 'Get dedicated resume reviews, 1-on-1 mock interviews, and hiring partner referrals.',
    icon: Award,
    gradient: 'from-[#FFFDF9] to-[#FFF4EC] dark:from-[#281D17] dark:to-[#1E1611]',
    accentBg: 'bg-[#F97316]',
    glowGradient: 'from-orange-500 to-amber-600',
    iconBg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    badge: 'CAREER READY',
  },
  {
    number: '07',
    title: 'Hands-on Practice',
    description: 'Solve real-world engineering challenges with guided implementation and production feedback.',
    icon: Sparkles,
    gradient: 'from-[#F8FCFF] to-[#EEF6FF] dark:from-[#112133] dark:to-[#0B1522]',
    accentBg: 'bg-[#3B82F6]',
    glowGradient: 'from-sky-500 to-blue-600',
    iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    badge: 'HANDS ON',
  },
  {
    number: '08',
    title: 'Community Learning',
    description: 'Grow together with a vibrant network of ambitious peer learners, alumni, and mentors.',
    icon: Users,
    gradient: 'from-[#F8FFF9] to-[#EEF9F1] dark:from-[#122618] dark:to-[#0B1910]',
    accentBg: 'bg-[#10B981]',
    glowGradient: 'from-teal-500 to-emerald-600',
    iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    badge: 'COMMUNITY',
  },
  {
    number: '09',
    title: 'AI Assisted Learning',
    description: 'Receive personalized guidance, smart code explanations, and adaptive practice throughout your journey.',
    icon: Cpu,
    gradient: 'from-[#FFF9FD] to-[#F8F2FF] dark:from-[#21172F] dark:to-[#150E20]',
    accentBg: 'bg-[#8B5CF6]',
    glowGradient: 'from-violet-500 to-purple-600',
    iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    badge: 'AI POWERED',
  },
  {
    number: '10',
    title: 'Continuous Growth',
    description: 'Keep upgrading your skills and accessing updated course materials even after course completion.',
    icon: ShieldCheck,
    gradient: 'from-[#FFFDF7] to-[#FFF8EA] dark:from-[#272013] dark:to-[#1B150A]',
    accentBg: 'bg-[#F59E0B]',
    glowGradient: 'from-yellow-500 to-amber-600',
    iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    badge: 'ORVION VERIFIED',
  },
];

// Duplicate cards 3x for seamless infinite scrolling loop
const TRIPLE_CARDS = [...WHY_ORVION_CARDS, ...WHY_ORVION_CARDS, ...WHY_ORVION_CARDS];

export default function InfiniteCurvedCarousel() {
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartScrollX, setDragStartScrollX] = useState(0);
  const [containerWidth, setContainerWidth] = useState(1200);

  const currentSpeedRef = useRef(0.85);
  const targetSpeedRef = useRef(0.85);
  const resumeTimerRef = useRef(null);

  // Card dimensions (360px x 460px)
  const cardWidth = 360;
  const cardGap = 28;
  const totalSingleWidth = WHY_ORVION_CARDS.length * (cardWidth + cardGap);

  // Update container width on resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Smooth Speed Interpolation Loop (Decelerate to 0 on click, acceleration back to 0.85 after 600ms)
  const animate = useCallback(() => {
    // Smooth interpolation towards targetSpeedRef (200-300ms transition)
    currentSpeedRef.current += (targetSpeedRef.current - currentSpeedRef.current) * 0.12;

    if (!isDragging && currentSpeedRef.current > 0.001) {
      setScrollX((prev) => {
        let next = prev + currentSpeedRef.current;
        if (next >= totalSingleWidth) {
          next = next % totalSingleWidth;
        }
        return next;
      });
    }
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isDragging, totalSingleWidth]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate]);

  // Card Click Handler (Stops scrolling gracefully, focuses clicked card)
  const handleCardClick = (index, e) => {
    e.stopPropagation();

    // Clear any existing resume timer
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }

    // Set active card and gracefully decelerate scrolling over 200-300ms
    setActiveCardIndex(index);
    targetSpeedRef.current = 0;
  };

  // Card Mouse Leave Handler (Resumes scrolling after 600ms)
  const handleCardMouseLeave = (index) => {
    if (activeCardIndex === index) {
      resumeTimerRef.current = setTimeout(() => {
        setActiveCardIndex(null);
        targetSpeedRef.current = 0.85; // Resume scrolling from exact position
      }, 600);
    }
  };

  // Click Outside Container Handler (Resumes scrolling if active)
  const handleContainerClick = () => {
    if (activeCardIndex !== null) {
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
      resumeTimerRef.current = setTimeout(() => {
        setActiveCardIndex(null);
        targetSpeedRef.current = 0.85;
      }, 600);
    }
  };

  // Horizontal wheel scroll handler
  const handleWheel = (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
      e.preventDefault();
      const delta = e.deltaX || e.deltaY;
      setScrollX((prev) => {
        let next = prev + delta * 0.85;
        if (next < 0) next += totalSingleWidth;
        if (next >= totalSingleWidth) next = next % totalSingleWidth;
        return next;
      });
    }
  };

  // Drag interaction handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartScrollX(scrollX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const diff = dragStartX - e.clientX;
    let next = dragStartScrollX + diff;
    if (next < 0) next += totalSingleWidth;
    if (next >= totalSingleWidth) next = next % totalSingleWidth;
    setScrollX(next);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    setDragStartScrollX(scrollX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const diff = dragStartX - e.touches[0].clientX;
    let next = dragStartScrollX + diff;
    if (next < 0) next += totalSingleWidth;
    if (next >= totalSingleWidth) next = next % totalSingleWidth;
    setScrollX(next);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full overflow-hidden py-12 select-none cursor-grab active:cursor-grabbing"
      style={{ perspective: '1200px' }}
    >
      {/* Edge Blur Fades for smooth entry/exit */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-[#FCFBF9] dark:from-[#0B0F17] to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-[#FCFBF9] dark:from-[#0B0F17] to-transparent z-20 pointer-events-none" />

      {/* Cards Slider Track */}
      <div
        className="flex items-center"
        style={{
          transform: `translate3d(-${scrollX}px, 0, 0)`,
          willChange: 'transform',
        }}
      >
        {TRIPLE_CARDS.map((card, index) => {
          const Icon = card.icon;
          const isActive = activeCardIndex === index;

          // Calculate card position relative to viewport center for panoramic curve calculations
          const itemOffset = index * (cardWidth + cardGap);
          const currentPosOnScreen = itemOffset - scrollX + containerWidth / 2 - cardWidth / 2;
          const containerCenter = containerWidth / 2;

          // Normalized distance from center (-1 left edge, 0 center, +1 right edge)
          const distFromCenter = containerWidth > 0 ? (currentPosOnScreen - containerCenter) / (containerWidth / 1.5) : 0;
          const clampedDist = Math.max(-1.2, Math.min(1.2, distFromCenter));

          // Panoramic Arc calculations
          const rotateY = clampedDist * 7;
          const rotateZ = clampedDist * 2.5;
          const translateY = Math.pow(Math.abs(clampedDist), 2) * 28;
          const baseScale = 1 - Math.min(Math.abs(clampedDist) * 0.05, 0.1);
          const finalScale = isActive ? baseScale * 1.02 : baseScale;

          return (
            <div
              key={`${card.number}-${index}`}
              className="shrink-0 transition-transform duration-100 ease-out"
              style={{
                width: `${cardWidth}px`,
                marginRight: `${cardGap}px`,
                transform: `translateY(${translateY}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${finalScale})`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Feature Card (Hovering does NOT pause scroll; Click stops scroll & focuses card) */}
              <div
                onClick={(e) => handleCardClick(index, e)}
                onMouseLeave={() => handleCardMouseLeave(index)}
                className={`group relative w-full h-[460px] rounded-[32px] bg-gradient-to-br ${card.gradient} border ${
                  isActive
                    ? 'border-primary-500 dark:border-primary-400 ring-2 ring-primary-500/20 shadow-[0_24px_50px_rgba(15,23,42,0.14)]'
                    : 'border-black/[0.06] dark:border-white/[0.08] shadow-[0_12px_35px_rgba(15,23,42,0.08)]'
                } p-8 sm:p-9 flex flex-col justify-between cursor-pointer transition-all duration-300 overflow-hidden`}
              >
                
                {/* 1. Left Vertical 4px Accent Line */}
                <div className={`absolute left-0 top-7 bottom-7 w-1 rounded-r-full ${card.accentBg} shadow-sm`} />

                {/* 2. Top Section: Index Number & 48px Icon Container with Blob Glow */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                    STEP {card.number}
                  </span>
                  
                  {/* 48px Icon Container */}
                  <div className="relative">
                    <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${card.glowGradient} opacity-15 blur-sm`} />
                    <div className={`relative w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center border border-white/80 dark:border-slate-800 shadow-xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* 3. Title & Description */}
                <div className="space-y-3.5 my-auto">
                  <h3 className="text-2xl sm:text-[32px] font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-base sm:text-[17px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal line-clamp-3">
                    {card.description}
                  </p>
                </div>

                {/* 4. Bottom Section: Pill Badge + 40px Circular Arrow Button */}
                <div className="flex items-center justify-between pt-5 border-t border-black/[0.05] dark:border-white/[0.08]">
                  {/* Left Pill Badge */}
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-slate-200/50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-black/5 dark:border-white/5">
                    {card.badge}
                  </span>

                  {/* Right 40px Circular Arrow Button */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-xs border border-black/5 dark:border-white/5 transition-all duration-300 ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-200/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200'
                  }`}>
                    <ArrowUpRight className={`w-4.5 h-4.5 transition-transform duration-300 ${isActive ? 'rotate-45' : ''}`} />
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
