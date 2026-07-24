import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, BookOpen, Code2, Users, Briefcase, MousePointerClick, Sparkles } from 'lucide-react';

const CARDS_DATA = [
  {
    step: '01',
    title: 'JOIN',
    description: 'Enroll in your chosen learning program and begin your journey.',
    gradient: 'from-[#FFF4EC] to-[#FFD7B5] dark:from-[#3A2218] dark:to-[#2B170E]',
    textColor: 'text-[#3A1900] dark:text-amber-100',
    accentColor: 'bg-[#E76F51]',
    badgeBg: 'bg-black/10 text-[#2A170A] dark:text-amber-200',
    icon: UserPlus,
    initialRotation: -5,
    initialY: 0,
  },
  {
    step: '02',
    title: 'LEARN',
    description: 'Attend live classes and master skills from expert instructors.',
    gradient: 'from-[#FFFDF8] to-[#FFF5E8] dark:from-[#241E15] dark:to-[#1A1610]',
    textColor: 'text-[#3D2B14] dark:text-amber-100',
    accentColor: 'bg-[#F59E0B]',
    badgeBg: 'bg-[#F59E0B]/10 text-[#D97706] dark:text-amber-400',
    icon: BookOpen,
    initialRotation: -2.5,
    initialY: 6,
  },
  {
    step: '03',
    title: 'BUILD',
    description: 'Work on practical projects that strengthen your portfolio.',
    gradient: 'from-[#F2FBF7] to-[#E3F5EC] dark:from-[#132418] dark:to-[#0D1A11]',
    textColor: 'text-[#14351E] dark:text-emerald-100',
    accentColor: 'bg-[#10B981]',
    badgeBg: 'bg-[#10B981]/10 text-[#059669] dark:text-emerald-400',
    icon: Code2,
    initialRotation: 0,
    initialY: 12,
  },
  {
    step: '04',
    title: 'MENTOR',
    description: 'Receive one-on-one career guidance, reviews, and interview preparation.',
    gradient: 'from-[#F5F9FF] to-[#E7F0FF] dark:from-[#111F30] dark:to-[#0A1422]',
    textColor: 'text-[#122A47] dark:text-blue-100',
    accentColor: 'bg-[#3B82F6]',
    badgeBg: 'bg-[#3B82F6]/10 text-[#2563EB] dark:text-blue-400',
    icon: Users,
    initialRotation: 2.5,
    initialY: 18,
  },
  {
    step: '05',
    title: 'GET PLACED',
    description: 'Apply with confidence and launch your dream career.',
    gradient: 'from-[#FBF8FF] to-[#F2EBFF] dark:from-[#1E182D] dark:to-[#140F20]',
    textColor: 'text-[#2C184B] dark:text-purple-100',
    accentColor: 'bg-[#8B5CF6]',
    badgeBg: 'bg-[#8B5CF6]/10 text-[#7C3AED] dark:text-purple-400',
    icon: Briefcase,
    initialRotation: 5,
    initialY: 24,
  },
];

// Triple duplicate for seamless infinite scrolling loop
const TRIPLE_CARDS = [...CARDS_DATA, ...CARDS_DATA, ...CARDS_DATA];

export default function StackedDeckCarousel() {
  const [isUnfolded, setIsUnfolded] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
  const [scrollX, setScrollX] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartScrollX, setDragStartScrollX] = useState(0);
  const [deviceType, setDeviceType] = useState('desktop');

  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Responsive Card Dimensions (~25% smaller)
  // Desktop: 250x330 | Tablet: 230x310 | Mobile: 220x290
  let cardWidth = 250;
  let cardHeight = 330;
  if (deviceType === 'tablet') {
    cardWidth = 230;
    cardHeight = 310;
  } else if (deviceType === 'mobile') {
    cardWidth = 220;
    cardHeight = 290;
  }

  const cardGap = 24;
  const singleSetWidth = CARDS_DATA.length * (cardWidth + cardGap);

  // Handle responsive device sizing
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setDeviceType('mobile');
        setIsUnfolded(true); // Mobile defaults to swipeable horizontal row
      } else if (w < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sequential Rummy/Poker Card Dealing Sequence:
  // Card 01 -> Card 02 -> Card 03 -> Card 04 -> Card 05
  // Stagger: 120ms per card, duration: ~350ms.
  // Last card finishes settling at (4 * 120ms + 350ms) = 830ms.
  // Pause 500ms after last card settles => 830ms + 500ms = 1330ms total delay before auto-scroll starts.
  useEffect(() => {
    if (isUnfolded && deviceType !== 'mobile') {
      const timer = setTimeout(() => {
        setIsAutoScrolling(true);
      }, 1330);
      return () => clearTimeout(timer);
    }
  }, [isUnfolded, deviceType]);

  // GPU-Accelerated 60FPS Infinite Auto-Scroll Loop (Direction: RIGHT ➔ LEFT)
  const animateScroll = useCallback(() => {
    if (isUnfolded && (isAutoScrolling || deviceType === 'mobile') && !isPaused && !isDragging) {
      setScrollX((prev) => {
        let next = prev + 0.75;
        if (next >= singleSetWidth) {
          next = next % singleSetWidth;
        }
        return next;
      });
    }
    animationFrameRef.current = requestAnimationFrame(animateScroll);
  }, [isUnfolded, isAutoScrolling, deviceType, isPaused, isDragging, singleSetWidth]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animateScroll);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animateScroll]);

  // Click handler to deal cards and unfold deck
  const handleDeckClick = () => {
    if (!isUnfolded) {
      setIsUnfolded(true);
    }
  };

  // Horizontal trackpad/mouse wheel scroll
  const handleWheel = (e) => {
    if (!isUnfolded) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
      e.preventDefault();
      const delta = e.deltaX || e.deltaY;
      setScrollX((prev) => {
        let next = prev + delta * 0.8;
        if (next < 0) next += singleSetWidth;
        if (next >= singleSetWidth) next = next % singleSetWidth;
        return next;
      });
    }
  };

  // Drag interaction handlers
  const handleMouseDown = (e) => {
    if (!isUnfolded) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartScrollX(scrollX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !isUnfolded) return;
    const diff = dragStartX - e.clientX;
    let next = dragStartScrollX + diff;
    if (next < 0) next += singleSetWidth;
    if (next >= singleSetWidth) next = next % singleSetWidth;
    setScrollX(next);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (!isUnfolded) return;
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    setDragStartScrollX(scrollX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !isUnfolded) return;
    const diff = dragStartX - e.touches[0].clientX;
    let next = dragStartScrollX + diff;
    if (next < 0) next += singleSetWidth;
    if (next >= singleSetWidth) next = next % singleSetWidth;
    setScrollX(next);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative w-full overflow-hidden py-8 flex flex-col items-center select-none">
      
      {/* Interactive Click Prompt Badge */}
      {!isUnfolded && deviceType !== 'mobile' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          onClick={handleDeckClick}
          className="mb-8 cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md text-xs font-bold text-slate-800 dark:text-slate-200 hover:scale-105 transition-transform"
        >
          <MousePointerClick className="w-4 h-4 text-primary-600 animate-bounce" />
          <span>Click deck to deal cards (01 → 05)</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        </motion.div>
      )}

      {/* Main Interactive Deck Container */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          setIsDragging(false);
          setHoveredCardIndex(null);
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full flex justify-center items-center ${
          isUnfolded ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
        }`}
        style={{ perspective: '1200px' }}
      >
        {/* Edge Fade Gradients once unfolded */}
        {isUnfolded && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#FCFAF7] dark:from-[#0B0F17] to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#FCFAF7] dark:from-[#0B0F17] to-transparent z-20 pointer-events-none" />
          </>
        )}

        {/* --- STATE A: STACKED DECK (Before Unfolding) --- */}
        {!isUnfolded ? (
          <div
            onClick={handleDeckClick}
            className="relative w-[250px] h-[350px] flex items-center justify-center group"
          >
            {CARDS_DATA.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.step}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{
                    opacity: 1,
                    y: card.initialY,
                    rotate: card.initialRotation,
                    scale: 1 - idx * 0.02,
                  }}
                  whileHover={
                    idx === 0
                      ? { y: card.initialY - 10, scale: 1.03 }
                      : { y: card.initialY - 4 }
                  }
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className={`absolute top-0 left-0 w-[250px] h-[330px] rounded-[26px] bg-gradient-to-br ${card.gradient} border border-black/[0.05] dark:border-white/[0.08] p-6 flex flex-col justify-between shadow-[0_14px_35px_rgba(15,23,42,0.08)] transition-all`}
                  style={{
                    zIndex: CARDS_DATA.length - idx,
                    transformOrigin: 'bottom center',
                  }}
                >
                  {/* Top Row: Step & Minimal Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold tracking-widest text-slate-600/80 dark:text-slate-400 uppercase">
                      STEP {card.step}
                    </span>
                    <div className={`p-2 rounded-xl ${card.badgeBg}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-2 my-auto">
                    <h3 className={`text-lg font-extrabold tracking-tight ${card.textColor}`}>
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-700/90 dark:text-slate-300 leading-relaxed font-normal">
                      {card.description}
                    </p>
                  </div>

                  {/* Bottom Accent */}
                  <div className="flex items-center justify-between pt-3 border-t border-black/[0.05] dark:border-white/[0.08]">
                    <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                      Orvion Journey
                    </span>
                    <span className={`w-6 h-1 rounded-full ${card.accentColor}`} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* --- STATE B: UNFOLDED HORIZONTAL ROW (Sequential Dealing Animation 01 -> 05) --- */
          <div
            className="flex items-center"
            style={{
              transform: `translate3d(-${scrollX}px, 0, 0)`,
              willChange: 'transform',
            }}
          >
            {TRIPLE_CARDS.map((card, index) => {
              const Icon = card.icon;
              const isHovered = hoveredCardIndex === index;
              const cardIndexInSet = index % CARDS_DATA.length;
              
              // Sequential card dealing delay: 120ms per card for the first set (01 -> 05)
              const dealDelay = index < CARDS_DATA.length ? cardIndexInSet * 0.12 : 0;

              // Neighbor card shift displacement on hover (6px lift, neighbors shift 8px away)
              let extraTranslateX = 0;
              if (hoveredCardIndex !== null && hoveredCardIndex !== index) {
                if (index < hoveredCardIndex) extraTranslateX = -8;
                if (index > hoveredCardIndex) extraTranslateX = 8;
              }

              return (
                <motion.div
                  key={`${card.step}-${index}`}
                  initial={{
                    opacity: 0,
                    y: -14,
                    rotate: card.initialRotation,
                    scale: 0.94,
                  }}
                  animate={{
                    opacity: 1,
                    y: isHovered ? -6 : 0,
                    rotate: 0,
                    scale: isHovered ? 1.02 : 1,
                    x: extraTranslateX,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 220,
                    damping: 20,
                    delay: dealDelay,
                  }}
                  onMouseEnter={() => setHoveredCardIndex(index)}
                  onMouseLeave={() => setHoveredCardIndex(null)}
                  className="shrink-0"
                  style={{
                    width: `${cardWidth}px`,
                    marginRight: `${cardGap}px`,
                  }}
                >
                  {/* Refined Card (250x330px, 26px border-radius, 14px 35px shadow) */}
                  <div
                    className={`group relative w-full rounded-[26px] bg-gradient-to-br ${card.gradient} border border-black/[0.05] dark:border-white/[0.08] p-5 sm:p-6 flex flex-col justify-between shadow-[0_14px_35px_rgba(15,23,42,0.08)] ${
                      isHovered ? 'shadow-[0_20px_45px_rgba(15,23,42,0.12)]' : ''
                    } transition-shadow duration-300`}
                    style={{ height: `${cardHeight}px` }}
                  >
                    {/* Top Row */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold tracking-widest text-slate-600/80 dark:text-slate-400 uppercase">
                        STEP {card.step}
                      </span>
                      <div className={`p-2 rounded-xl ${card.badgeBg}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Title & Body */}
                    <div className="space-y-2 my-auto">
                      <h3 className={`text-lg sm:text-xl font-extrabold tracking-tight ${card.textColor}`}>
                        {card.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-700/90 dark:text-slate-300 leading-relaxed font-normal">
                        {card.description}
                      </p>
                    </div>

                    {/* Bottom Accent Line */}
                    <div className="flex items-center justify-between pt-3 border-t border-black/[0.05] dark:border-white/[0.08]">
                      <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                        Step {card.step} of 05
                      </span>
                      <span
                        className={`w-6 h-1 rounded-full ${card.accentColor} group-hover:w-11 transition-all duration-300`}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
