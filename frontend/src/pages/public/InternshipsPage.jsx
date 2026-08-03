import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Calendar, MapPin, ChevronRight, X, Send, CheckCircle2, ArrowRight, ShieldCheck, UserCheck, Code2, Rocket,
  Compass, ClipboardList, Laptop, FileText, Award, Terminal, Sparkles 
} from 'lucide-react';
import { pageVariants } from '../../utils/animations';
import api from '../../services/api';
import toast from 'react-hot-toast';

const heroPhrases = [
  "Dreaming of Your First Job?",
  "Start with an Internship.",
  "The Best Time to Build Your Future Is Today.",
];

const fellowshipSteps = [
  {
    number: '01',
    title: 'Choose Specialization',
    description: 'Explore our industry-aligned domains and select the technical path that matches your career ambitions.',
    badgeIcon: Compass,
    bgGradient: 'bg-gradient-to-b from-[#F25A1D] to-[#E04D12]',
    glowColor: 'rgba(242, 90, 29, 0.35)',
    cardDelay: 0.0,
    lineDelay: 0.35,
  },
  {
    number: '02',
    title: 'Submit Application',
    description: 'Fill in your academic background and statement of purpose for evaluation by our admissions team.',
    badgeIcon: ClipboardList,
    bgGradient: 'bg-gradient-to-b from-[#334A7D] to-[#283A64]',
    glowColor: 'rgba(51, 74, 125, 0.35)',
    cardDelay: 0.65,
    lineDelay: 1.00,
  },
  {
    number: '03',
    title: 'Technical Screening',
    description: 'Complete a brief baseline assessment to help us pair you with appropriate project tiers and mentors.',
    badgeIcon: ShieldCheck,
    bgGradient: 'bg-gradient-to-b from-[#B73455] to-[#A02846]',
    glowColor: 'rgba(183, 52, 85, 0.35)',
    cardDelay: 1.30,
    lineDelay: 1.65,
  },
  {
    number: '04',
    title: 'Build & Graduate',
    description: 'Ship production features, receive weekly 1-on-1 code reviews, and earn verified credentials.',
    badgeIcon: Rocket,
    bgGradient: 'bg-gradient-to-b from-[#3F7F73] to-[#326B60]',
    glowColor: 'rgba(63, 127, 115, 0.35)',
    cardDelay: 1.95,
    lineDelay: 2.30,
  },
];

function FellowshipHeader({ isInView }) {
  const words = ["How", "the", "Internship", "Works"];

  // 8 subtle warm gold dust particles
  const dustParticles = [
    { left: '20%', top: '15%', size: '3px', duration: 8, delay: 0 },
    { left: '35%', top: '65%', size: '2px', duration: 11, delay: 1 },
    { left: '50%', top: '25%', size: '4px', duration: 9, delay: 0.5 },
    { left: '68%', top: '75%', size: '2.5px', duration: 12, delay: 2 },
    { left: '80%', top: '35%', size: '3px', duration: 7, delay: 1.5 },
    { left: '28%', top: '80%', size: '2px', duration: 10, delay: 0.8 },
    { left: '60%', top: '10%', size: '3.5px', duration: 13, delay: 2.2 },
    { left: '75%', top: '85%', size: '2px', duration: 9.5, delay: 1.2 },
  ];

  return (
    <div className="relative text-center space-y-4 mb-16 sm:mb-20 py-4 z-10 flex flex-col items-center justify-center">
      {/* SOFT RADIAL BACKGROUND GLOW */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
        className="absolute -inset-10 rounded-full bg-[rgba(255,170,70,0.08)] blur-[120px] pointer-events-none"
      />

      {/* FLOATING WARM GOLD DUST PARTICLES (#F7B15A) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {dustParticles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#F7B15A]"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
            }}
            animate={isInView ? {
              y: [-10, 10, -10],
              x: [-6, 6, -6],
              opacity: [0.2, 0.45, 0.2],
            } : { opacity: 0 }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* SMALL UPPERCASE LABEL */}
      <motion.span
        initial={{ opacity: 0, y: 15 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.5, delay: 0, ease: [0.22, 1, 0.36, 1] }}
        className="text-[14px] font-semibold tracking-[0.18em] uppercase text-[#C96A12] block select-none"
      >
        STRUCTURED FELLOWSHIP PATH
      </motion.span>

      {/* MAIN HEADING - WORD BY WORD REVEAL */}
      <h2 className="text-4xl sm:text-6xl lg:text-[68px] font-bold text-[#111827] dark:text-white font-['Cormorant_Garamond',serif] leading-[1.12] tracking-tight max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1 select-none">
        {words.map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.98 }}
            transition={{
              duration: 0.5,
              delay: index * 0.12, // 0ms, 120ms, 240ms, 360ms
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        ))}
      </h2>

      {/* ANIMATED GRADIENT DIVIDER LINE UNDERNEATH */}
      <div className="pt-2">
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'center' }}
          className="w-[80px] h-[2px] rounded-full bg-gradient-to-r from-[#FF8A00] to-[#FFC46B] shadow-[0_0_8px_rgba(255,138,0,0.5)]"
        />
      </div>
    </div>
  );
}

function DomainsHeader({ isInView }) {
  const words = ["Available", "Internship", "Cohorts"];

  return (
    <div className="relative text-center space-y-3.5 mb-12 sm:mb-14 py-4 z-10 flex flex-col items-center justify-center">
      {/* SOFT RADIAL BACKGROUND GLOW */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
        className="absolute -inset-10 rounded-full bg-[rgba(255,166,43,0.08)] blur-[120px] pointer-events-none"
      />

      {/* SMALL UPPERCASE LABEL */}
      <motion.span
        initial={{ opacity: 0, y: 15 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.45, delay: 0, ease: [0.22, 1, 0.36, 1] }}
        className="text-xs font-semibold tracking-[0.2em] uppercase text-[#F97316] block select-none"
      >
        SPECIALIZATION TRACKS
      </motion.span>

      {/* MAIN HEADING WORD BY WORD */}
      <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-extrabold text-slate-900 dark:text-white tracking-tight font-['Cormorant_Garamond',serif] max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-1 select-none">
        {words.map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 25, scale: 0.98 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 25, scale: 0.98 }}
            transition={{
              duration: 0.5,
              delay: index * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        ))}
      </h2>

      {/* SUBTITLE */}
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-sans leading-relaxed"
      >
        Select a domain below to apply and join our upcoming internship cohort.
      </motion.p>
    </div>
  );
}

function DomainCard({ domain, index, isInView, onApply }) {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.97 }}
      transition={{ duration: 0.65, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ willChange: 'transform, opacity' }}
      className="relative p-6 sm:p-7 rounded-[28px] border border-black/[0.08] dark:border-white/10 bg-white dark:bg-slate-900/90 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)] hover:-translate-y-[8px] hover:scale-[1.015] transition-all duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col justify-between space-y-5 max-w-[740px] w-full mx-auto select-none overflow-hidden group transform-gpu"
    >
      {/* APPLE-STYLE CURSOR SPOTLIGHT HIGHLIGHT (MAX OPACITY 0.06) */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-200 rounded-[28px]"
          style={{
            background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(184, 106, 14, 0.06), transparent 80%)`,
          }}
        />
      )}

      <div className="space-y-4 relative z-10">
        {/* TOP LINE WITH TITLE & POPULAR BADGE */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug tracking-tight font-['Cormorant_Garamond',serif]">
            {domain.title}
          </h3>

          {/* POPULAR BADGE */}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
            className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#B86A0E]/10 text-[#B86A0E] border border-[#B86A0E]/25 uppercase tracking-wider shrink-0"
          >
            {domain.badge}
          </motion.span>
        </div>

        {/* DURATION & META */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Calendar className="w-3.5 h-3.5 text-[#B86A0E]" />
          <span>{domain.duration}</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <MapPin className="w-3.5 h-3.5 text-[#A35A0A]" />
          <span>Remote Mode</span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {domain.description}
        </p>

        {/* SKILLS & ELIGIBILITY GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          
          {/* KEY SKILLS WITH STAGGERED BULLETS */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">
              Key Skills
            </h4>
            <ul className="space-y-1.5">
              {domain.skills.map((skill, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -6 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
                  transition={{ duration: 0.35, delay: 0.35 + idx * 0.04, ease: 'easeOut' }}
                  className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B86A0E] shrink-0" />
                  <span>{skill}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* ELIGIBILITY */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">
              Eligibility
            </h4>
            <ul className="space-y-1.5">
              {domain.requirements.map((req, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -6 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
                  transition={{ duration: 0.35, delay: 0.4 + idx * 0.04, ease: 'easeOut' }}
                  className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-normal"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
                  <span>{req}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ACTION BUTTON - PREMIUM ORVION BRONZE BRAND STYLE */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 relative z-10">
        <button
          onClick={() => onApply(domain.title)}
          style={{
            background: 'linear-gradient(135deg, #A35A0A 0%, #B86A0E 35%, #C97812 70%, #A85A08 100%)',
            boxShadow: '0 10px 30px rgba(166, 93, 14, 0.18)',
            willChange: 'transform, box-shadow, opacity',
          }}
          className="w-full h-[48px] rounded-[18px] text-white font-semibold text-xs sm:text-sm tracking-[0.2px] flex items-center justify-center gap-2 transition-all duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:-translate-y-[3px] hover:shadow-[0_14px_36px_rgba(166,93,14,0.28)] hover:brightness-[1.07] active:scale-[0.98] disabled:bg-[#D8D2CA] disabled:text-[#8C8C8C] disabled:shadow-none group/btn cursor-pointer transform-gpu"
        >
          <span>Apply for Cohort</span>
          <ChevronRight className="w-4 h-4 transition-transform duration-[280ms] ease-out group-hover/btn:translate-x-[4px]" />
        </button>
      </div>
    </motion.div>
  );
}

function CardConnector({ lineDelay, isParentInView }) {
  return (
    <div className="hidden lg:flex items-center absolute top-[50%] -translate-y-1/2 -right-[40px] w-[40px] h-[6px] pointer-events-none z-30 overflow-visible">
      {/* BASE GUIDE LINE (PALE ORANGE AMBIENT TRACK) */}
      <div className="w-full h-[2px] bg-[#FF8A00]/15 rounded-full absolute left-0 top-1/2 -translate-y-1/2" />

      {/* STRAIGHT CONNECTOR LINE WITH GRADIENT */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isParentInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.25, delay: lineDelay, ease: 'easeInOut' }}
        style={{ transformOrigin: 'left center' }}
        className="w-full h-[3px] rounded-full relative shadow-[0_0_8px_rgba(255,165,0,0.45),0_0_20px_rgba(255,165,0,0.25)]"
      >
        <div 
          className="w-full h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, rgba(255,140,0,0) 0%, #FF8A00 20%, #FFA62B 50%, #FF8A00 80%, rgba(255,140,0,0) 100%)',
            filter: 'drop-shadow(0 0 10px rgba(255,170,50,0.5))',
          }}
        />

        {/* MOVING LIGHT BEAM ORB */}
        <motion.div
          initial={{ opacity: 0, x: 0 }}
          animate={isParentInView ? {
            opacity: [0, 1, 1, 0],
            x: [0, 40],
          } : { opacity: 0, x: 0 }}
          transition={{ duration: 0.25, delay: lineDelay, ease: 'easeInOut' }}
          className="absolute top-1/2 -translate-y-1/2 -left-2 w-3.5 h-3.5 rounded-full bg-white border border-[#FF8A00] shadow-[0_0_12px_#FFA62B,0_0_24px_#FF8A00] pointer-events-none"
        />
      </motion.div>
    </div>
  );
}

function FellowshipCard({ step, idx, isParentInView }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const BadgeIcon = step.badgeIcon;

  const cardDelay = step.cardDelay;
  const lineDelay = step.lineDelay;

  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Max 4 degrees tilt
    setTilt({
      x: (y / (rect.height / 2)) * -4,
      y: (x / (rect.width / 2)) * 4,
    });
  };

  const handleCardMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="relative group w-full max-w-[280px]">
      {/* FLOATING AMBIENT RADIAL GLOW */}
      <div 
        className="absolute -inset-4 rounded-[36px] blur-3xl opacity-25 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none animate-pulse"
        style={{
          background: `radial-gradient(circle, ${step.glowColor} 0%, transparent 70%)`,
          animationDuration: '9s',
        }}
      />

      <motion.div
        onMouseMove={handleCardMouseMove}
        onMouseLeave={handleCardMouseLeave}
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={isParentInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.96 }}
        transition={{ duration: 0.45, delay: cardDelay, ease: [0.22, 1, 0.36, 1] }}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: tilt.x === 0 && tilt.y === 0 ? 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)' : 'transform 100ms ease-out',
        }}
        className={`relative flex flex-col justify-between p-7 rounded-[26px] ${step.bgGradient} border border-white/20 hover:border-white/50 shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.16)] hover:-translate-y-[10px] hover:scale-[1.02] transition-all duration-450 ease-[cubic-bezier(0.22,1,0.36,1)] h-[400px] sm:h-[420px] w-full select-none overflow-hidden gpu-layer`}
      >
        {/* TOP HEADER ROW: 52PX ELEGANT NUMBER + 58PX GLASS CIRCLE ICON BADGE */}
        <div>
          <div className="flex items-start justify-between">
            <span className="text-[52px] font-semibold font-['Cormorant_Garamond',serif] leading-none text-white/22 tracking-[-1px] group-hover:text-white/40 transition-colors duration-300 select-none">
              {step.number}
            </span>
            <div className="w-[58px] h-[58px] rounded-full bg-white/12 backdrop-blur-[12px] border border-white/25 text-white flex items-center justify-center shadow-sm group-hover:rotate-10 group-hover:-translate-y-1 transition-transform duration-300">
              <BadgeIcon className="w-5 h-5" />
            </div>
          </div>

          {/* TITLE */}
          <h3 className="text-[30px] font-semibold text-white font-['Cormorant_Garamond',serif] leading-[1.1] tracking-tight mt-6 sm:mt-7">
            {step.title}
          </h3>

          {/* DESCRIPTION */}
          <p className="text-[17px] text-white/90 leading-[1.8] font-normal mt-3.5 font-sans">
            {step.description}
          </p>
        </div>

        {/* SUBTLE CORNER LIGHTING HIGHLIGHT */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      </motion.div>

      {/* SVG CONNECTOR TO NEXT CARD */}
      {idx < fellowshipSteps.length - 1 && (
        <CardConnector 
          lineDelay={lineDelay}
          isParentInView={isParentInView}
        />
      )}
    </div>
  );
}

export default function InternshipsPage() {
  const processSectionRef = useRef(null);
  const isProcessInView = useInView(processSectionRef, { amount: 0.25, once: false });

  const domainsSectionRef = useRef(null);
  const isDomainsInView = useInView(domainsSectionRef, { amount: 0.2, once: true });

  const [selectedDomain, setSelectedDomain] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Typewriter effect state
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = heroPhrases[phraseIndex];
    let timer;

    // Check if we are on the final phrase
    const isLastPhrase = phraseIndex === heroPhrases.length - 1;

    if (!isDeleting) {
      if (displayText.length < currentPhrase.length) {
        timer = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        }, 70);
      } else if (!isLastPhrase) {
        // Only delete if NOT the final phrase
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
      // If it IS the final phrase and fully typed, it stays permanently!
    } else {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length - 1));
        }, 35);
      } else {
        setIsDeleting(false);
        setPhraseIndex((prev) => prev + 1);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIndex]);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    // Max 6px shift (-6px to +6px) strictly for the soft background glow
    const x = ((clientX / innerWidth) - 0.5) * 12;
    const y = ((clientY / innerHeight) - 0.5) * 12;
    setMousePos({ x, y });
  };

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    resumeLink: '',
    statement: '',
  });

  const internshipDomains = [
    {
      id: 'fs-web',
      title: 'Full-Stack Web Development',
      duration: '3 Months (Remote)',
      description: 'Master modern web architectures using React, Node.js, Express, and databases. Work on real-world collaborative sprints and production deployments.',
      requirements: ['Basic JavaScript', 'HTML & CSS knowledge', 'Familiarity with Git'],
      skills: ['React & Next.js', 'Node.js & REST APIs', 'MySQL / MongoDB', 'CI/CD Pipelines'],
      badge: 'Popular',
    },
    {
      id: 'ai-ml',
      title: 'AI & Data Science Engineering',
      duration: '3 Months (Remote)',
      description: 'Build and deploy Machine Learning models, analyze complex datasets, and work on Generative AI integrations using Python and popular deep learning frameworks.',
      requirements: ['Python programming', 'Basic Linear Algebra', 'Analytical mindset'],
      skills: ['Python & Pandas', 'Supervised / Unsupervised ML', 'Generative AI & LLMs', 'Model Deployment'],
      badge: 'Trending',
    },
    {
      id: 'ui-ux',
      title: 'UI/UX Design & Frontend Engineering',
      duration: '3 Months (Remote)',
      description: 'Bridge the gap between design and development. Design high-fidelity Figma mockups, user research maps, and convert designs into responsive React interfaces.',
      requirements: ['Interest in visual design', 'Basic CSS/JS', 'Attention to detail'],
      skills: ['Figma Mastery', 'User Research & Wireframes', 'TailwindCSS & React', 'Micro-interactions'],
      badge: 'Highly Creative',
    },
    {
      id: 'devops-sec',
      title: 'DevOps & Cloud Security',
      duration: '3 Months (Remote)',
      description: 'Gain hands-on expertise in cloud infrastructure, containerization, automated pipelines, security auditing, and server administration.',
      requirements: ['Basic Linux commands', 'Understanding of web servers', 'Problem solving'],
      skills: ['Docker & Kubernetes', 'AWS / Google Cloud', 'CI/CD & Jenkins', 'Infrastructure as Code'],
      badge: 'Enterprise Focus',
    },
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Choose Specialization',
      description: 'Explore our industry-aligned domains and select the technical path that matches your career ambitions.',
      icon: Code2
    },
    {
      number: '02',
      title: 'Submit Application',
      description: 'Fill in your academic background and statement of purpose for evaluation by our admissions team.',
      icon: UserCheck
    },
    {
      number: '03',
      title: 'Technical Screening',
      description: 'Complete a brief baseline assessment to help us pair you with appropriate project tiers and mentors.',
      icon: ShieldCheck
    },
    {
      number: '04',
      title: 'Build & Graduate',
      description: 'Ship production features, receive weekly 1-on-1 code reviews, and earn verified credentials.',
      icon: Rocket
    }
  ];

  const handleOpenApplyModal = (domainTitle) => {
    setSelectedDomain(domainTitle);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.college) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/internships/apply', {
        ...form,
        domain: selectedDomain,
      });
      toast.success('Your application has been submitted successfully!');
      setForm({
        name: '',
        email: '',
        phone: '',
        college: '',
        resumeLink: '',
        statement: '',
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-[#FCFAF6] dark:bg-[#070D1B] text-slate-900 dark:text-slate-100 selection:bg-[#F97316] selection:text-white overflow-hidden"
    >
      {/* ========================================================================= */}
      {/* PREMIUM CINEMATIC HERO SECTION (100VH, STRICTLY CONTAINED WATERMARK) */}
      {/* ========================================================================= */}
      <section className="internship-hero relative w-full h-screen min-h-[100vh] flex flex-col justify-center items-center overflow-hidden -mt-20 pt-20 select-none bg-gradient-to-b from-[#FFFDF8] via-[#FFF8EE] to-[#FFFDFB] dark:from-[#070D1B] dark:via-[#0A1224] dark:to-[#070D1B]">
        
        {/* HERO-ONLY FIXED WATERMARK BACKGROUND LOGO (STRICTLY CONTAINED TO HERO SECTION) */}
        <div 
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            backgroundImage: `url('/orvion_watermark.png')`,
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '65%',
            backgroundAttachment: 'fixed',
            opacity: 0.11,
            filter: 'blur(1px)',
          }}
        />

        {/* CORNER LIGHTING EFFECTS */}
        {/* Bottom Left Soft Golden Glow */}
        <div 
          className="absolute bottom-0 left-0 w-[45vw] h-[45vw] max-w-[600px] pointer-events-none z-0"
          style={{ background: 'radial-gradient(circle at bottom left, rgba(245,158,11,0.08) 0%, transparent 55%)' }}
        />
        {/* Bottom Right Soft Golden Glow */}
        <div 
          className="absolute bottom-0 right-0 w-[45vw] h-[45vw] max-w-[600px] pointer-events-none z-0"
          style={{ background: 'radial-gradient(circle at bottom right, rgba(245,158,11,0.08) 0%, transparent 55%)' }}
        />
        {/* Top Left Subtle Warm Glow */}
        <div 
          className="absolute top-0 left-0 w-[40vw] h-[40vw] max-w-[500px] pointer-events-none z-0"
          style={{ background: 'radial-gradient(circle at top left, rgba(255,248,238,0.15) 0%, transparent 50%)' }}
        />

        {/* REDUCED ORANGE GLOW (70% REDUCTION, MAX 6PX MOUSE MOVE) */}
        <div 
          className="absolute top-1/2 left-1/2 w-[85vw] max-w-[1000px] h-[480px] sm:h-[600px] rounded-full pointer-events-none animate-breathing-glow-soft z-0 blur-[80px] gpu-layer"
          style={{
            background: 'radial-gradient(circle at center, rgba(255,173,51,0.10) 0%, rgba(255,248,239,0.05) 35%, transparent 65%)',
            transform: `translate(calc(-50% + ${mousePos.x}px), calc(-50% + ${mousePos.y}px))`
          }}
        />

        {/* LARGE CINEMATIC RINGS (STROKE ONLY rgba(230,126,34,0.10), 90S ROTATE) */}
        <div
          className="absolute top-1/2 left-1/2 w-[720px] h-[720px] sm:w-[900px] sm:h-[900px] rounded-full border border-[rgba(230,126,34,0.10)] pointer-events-none z-0 animate-ring-rotate-90s gpu-layer"
        />

        {/* MOVING GLOSSY LIGHT SWEEP (EVERY 12 SECONDS, OPACITY 8%) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div 
            className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/15 dark:via-white/5 to-transparent animate-light-sweep-12s pointer-events-none gpu-layer"
          />
        </div>

        {/* SUBTLE GOLDEN PARTICLES (OPACITY 0.15, SLOW FLOAT, BLUR 2PX) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(20)].map((_, i) => {
            const size = (i % 3) + 2; // 2px to 4px
            const color = i % 2 === 0 ? '#E67E22' : '#F59E0B';
            return (
              <motion.div
                key={i}
                animate={{
                  y: [-16, 16, -16],
                  x: [-10, 10, -10],
                  opacity: [0.08, 0.15, 0.08],
                }}
                transition={{
                  duration: 12 + (i % 5) * 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: (i * 0.4) % 4,
                }}
                className="absolute rounded-full pointer-events-none gpu-layer"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  filter: 'blur(2px)',
                  boxShadow: `0 0 6px ${color}`,
                  left: `${((i * 19) % 92) + 4}%`,
                  top: `${((i * 23) % 88) + 6}%`,
                }}
              />
            );
          })}
        </div>

        {/* CENTERED CORMORANT GARAMOND HEADING (WEIGHT 700) */}
        <div className="relative z-10 w-full max-w-5xl mx-auto text-center flex flex-col items-center justify-center min-h-[220px] sm:min-h-[280px] px-4">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[82px] font-bold tracking-tight leading-[1.12] text-[#0F172A] dark:text-slate-100 font-['Cormorant_Garamond',serif] text-center max-w-4xl mx-auto drop-shadow-sm">
              <span>{displayText}</span>
              <span className="inline-block w-1 sm:w-1.5 h-[0.85em] bg-[#F97316] ml-2.5 align-middle animate-pulse rounded-full shadow-[0_0_12px_rgba(249,115,22,0.7)]" />
            </h1>
          </motion.div>
        </div>

        {/* BOTTOM SMOOTH GRADIENT TRANSITION INTO NEXT SECTION */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FCFAF6] dark:from-[#0B1329] to-transparent pointer-events-none z-10" />

      </section>

      {/* ========================================================================= */}
      {/* STRUCTURED FELLOWSHIP PATH SECTION (CINEMATIC AUTOMATIC TIMED EXPERIENCE) */}
      {/* ========================================================================= */}
      <section 
        id="process" 
        ref={processSectionRef} 
        className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto relative z-10 bg-[#F7F3EC] dark:bg-[#070D1B] rounded-[36px] my-12 border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden select-none"
      >
        
        {/* AMBIENT BACKGROUND BLOBS */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#C96A12]/[0.06] via-amber-500/[0.03] to-transparent blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-indigo-500/[0.05] via-emerald-500/[0.03] to-transparent blur-[120px]" />
          
          {[...Array(14)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-[#C96A12]/20 blur-[1px] pointer-events-none"
              style={{
                width: `${(i % 3) + 2}px`,
                height: `${(i % 3) + 2}px`,
                left: `${(i * 17) % 90 + 5}%`,
                top: `${(i * 23) % 85 + 8}%`,
              }}
            />
          ))}
        </div>

        {/* SECTION HEADER WITH WORD-BY-WORD CINEMATIC REVEAL & DUST PARTICLES */}
        <FellowshipHeader isInView={isProcessInView} />

        {/* 4 CINEMATIC TIMED ROADMAP CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 xl:gap-[40px] justify-items-center max-w-[1320px] mx-auto relative z-10">
          {fellowshipSteps.map((step, idx) => (
            <FellowshipCard 
              key={step.number} 
              step={step} 
              idx={idx} 
              isParentInView={isProcessInView} 
            />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* AVAILABLE DOMAINS SECTION (PREMIUM, ELEGANT & CINEMATIC) */}
      {/* ========================================================================= */}
      <section 
        id="domains" 
        ref={domainsSectionRef}
        className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 border-t border-slate-200/60 dark:border-slate-800/60"
      >
        {/* SUBTLE FLOATING GRADIENT ACCENT ORB */}
        <motion.div 
          animate={{
            x: [-15, 15, -15],
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-gradient-to-r from-[#FF8A00]/[0.04] to-amber-500/[0.03] blur-[140px] pointer-events-none -z-10"
        />

        {/* DOMAINS HEADER WITH WORD REVEAL */}
        <DomainsHeader isInView={isDomainsInView} />

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 sm:gap-8 max-w-[1280px] mx-auto">
          {internshipDomains.map((domain, index) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              index={index}
              isInView={isDomainsInView}
              onApply={handleOpenApplyModal}
            />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* APPLICATION MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
             <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[32px] p-6 sm:p-8 space-y-6 relative border border-slate-200 dark:border-slate-800 shadow-2xl overflow-y-auto max-h-[85vh]"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 dark:text-slate-500 dark:hover:text-white transition text-lg font-bold cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1.5 text-center">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight font-['Playfair_Display',serif]">
                  Apply for Internship
                </h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
                  Cohort Specialization: {selectedDomain}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#F97316] text-sm font-semibold text-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="e.g. john@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#F97316] text-sm font-semibold text-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +91 9876543210"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#F97316] text-sm font-semibold text-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">College / Organization *</label>
                    <input
                      type="text"
                      required
                      name="college"
                      value={form.college}
                      onChange={handleInputChange}
                      placeholder="e.g. ABC University"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#F97316] text-sm font-semibold text-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Resume Link (GDrive / LinkedIn / GitHub) *</label>
                  <input
                    type="url"
                    required
                    name="resumeLink"
                    value={form.resumeLink}
                    onChange={handleInputChange}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#F97316] text-sm font-semibold text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Why do you want to join this cohort? (SOP)</label>
                  <textarea
                    rows="3"
                    name="statement"
                    value={form.statement}
                    onChange={handleInputChange}
                    placeholder="Tell us about your learning goals and project interests..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#F97316] text-sm font-semibold text-slate-800 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-2xl font-bold text-white bg-[#F97316] hover:bg-[#EA580C] transition flex items-center justify-center gap-2 mt-2 shadow-sm border border-transparent disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting Application...' : 'Submit Application'}</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

