import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import orvionTreeImg from '../../assets/orvion-tree-logo.png';
import logoImg from '../../assets/logo.png';
import glassesImg from '../../assets/3d-glasses.png';
import megaphoneImg from '../../assets/3d-megaphone.png';
import trophyImg from '../../assets/3d-trophy.png';
import documentImg from '../../assets/3d-document.png';
import {
  Sparkles,
  ArrowRight,
  Target,
  Users,
  Shield,
  Award,
  CheckCircle2,
  Building2,
  Briefcase,
  Code2,
  Rocket,
  BookOpen,
  TrendingUp,
  GraduationCap,
  Globe,
  Linkedin,
  Star,
  Cpu,
  Layers,
  Terminal,
  Zap,
  Check,
  HeartHandshake,
  Lightbulb,
  Compass,
  Trophy,
  Network,
  ArrowUpRight,
  ChevronDown,
  Mail,
  PhoneCall,
  MapPin
} from 'lucide-react';
import { pageVariants } from '../../utils/animations';

// Orvion Tree Logo Watermark SVG
const OrvionTreeLogo = ({ className = "w-full h-full text-orange-600/10" }) => (
  <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="250" cy="250" r="230" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
    <circle cx="250" cy="250" r="180" stroke="currentColor" strokeWidth="1" />
    {/* Trunk */}
    <path d="M250 420 V260 M250 360 L200 310 M250 330 L300 270 M250 290 L180 220 M250 270 L320 200" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    {/* Tree Canopy Network Nodes */}
    <circle cx="250" cy="140" r="32" stroke="currentColor" strokeWidth="2.5" fill="none" />
    <circle cx="250" cy="140" r="12" fill="currentColor" />
    <circle cx="170" cy="190" r="26" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="170" cy="190" r="8" fill="currentColor" />
    <circle cx="330" cy="190" r="26" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="330" cy="190" r="8" fill="currentColor" />
    <circle cx="120" cy="260" r="20" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="120" cy="260" r="6" fill="currentColor" />
    <circle cx="380" cy="260" r="20" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="380" cy="260" r="6" fill="currentColor" />
    <circle cx="200" cy="110" r="18" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="300" cy="110" r="18" stroke="currentColor" strokeWidth="1.5" />
    {/* Connections */}
    <path d="M250 140 L170 190 M250 140 L330 190 M170 190 L120 260 M330 190 L380 260 M250 140 L200 110 M250 140 L300 110" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export default function AboutPage() {
  // Progressive Contact Form state
  const [contactForm, setContactForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    college: '',
    year: '',
    branch: '',
    address: '',
    message: ''
  });
  const [formStep, setFormStep] = useState(1); // 1 = initial 3 required fields, 2 = expanded fields
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const errors = {};
    if (!contactForm.fullName.trim()) {
      errors.fullName = 'Please fill in this field.';
    }
    if (!contactForm.email.trim()) {
      errors.email = 'Please fill in this field.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!contactForm.mobile.trim()) {
      errors.mobile = 'Please fill in this field.';
    } else if (contactForm.mobile.trim().replace(/\D/g, '').length < 10) {
      errors.mobile = 'Please enter a valid 10-digit mobile number.';
    }
    return errors;
  };

  const handleContinue = (e) => {
    e.preventDefault();
    const errors = validateStep1();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      setFormStep(2);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 1500);
  };

  // Hover states for "What We Stand For" section
  const [isLeftHovered, setIsLeftHovered] = useState(false);
  const [isRightHovered, setIsRightHovered] = useState(false);

  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroHeadingY = useTransform(heroScroll, [0, 1], [0, -10]);
  const heroTreeY = useTransform(heroScroll, [0, 1], [0, -8]);

  // Refined Premium Typewriter Effect for "Tech Leaders" (80ms type, 2.2s pause, 50ms delete, 800ms wait)
  const targetTechLeaders = "Tech Leaders";
  const [typedTechLeaders, setTypedTechLeaders] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    if (!isDeleting && typedTechLeaders.length < targetTechLeaders.length) {
      // Type slowly (80ms per character)
      timer = setTimeout(() => {
        setTypedTechLeaders(targetTechLeaders.slice(0, typedTechLeaders.length + 1));
      }, 80);
    } else if (!isDeleting && typedTechLeaders.length === targetTechLeaders.length) {
      // Pause for 2.2s after full text is typed
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2200);
    } else if (isDeleting && typedTechLeaders.length > 0) {
      // Delete slowly (50ms per character)
      timer = setTimeout(() => {
        setTypedTechLeaders(targetTechLeaders.slice(0, typedTechLeaders.length - 1));
      }, 50);
    } else if (isDeleting && typedTechLeaders.length === 0) {
      // Wait 800ms before re-typing
      timer = setTimeout(() => {
        setIsDeleting(false);
      }, 800);
    }

    return () => clearTimeout(timer);
  }, [typedTechLeaders, isDeleting]);

  // Desktop Mouse Parallax for Hero section (Subtle 8px shift)
  const [heroMousePos, setHeroMousePos] = useState({ x: 0, y: 0 });
  const handleHeroMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = ((e.clientX - centerX) / (rect.width / 2)) * 8;
    const y = ((e.clientY - centerY) / (rect.height / 2)) * 8;
    setHeroMousePos({ x, y });
  };
  const handleHeroMouseLeave = () => {
    setHeroMousePos({ x: 0, y: 0 });
  };

  // Desktop Mouse Parallax for Our Story section (5-10px subtle shift)
  const storyRef = useRef(null);
  const [storyMousePos, setStoryMousePos] = useState({ x: 0, y: 0 });
  const handleStoryMouseMove = (e) => {
    if (!storyRef.current) return;
    const rect = storyRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = ((e.clientX - centerX) / (rect.width / 2)) * 8; // Max 8px
    const y = ((e.clientY - centerY) / (rect.height / 2)) * 8;
    setStoryMousePos({ x, y });
  };
  const handleStoryMouseLeave = () => {
    setStoryMousePos({ x: 0, y: 0 });
  };

  // Mouse Parallax for Contact Section
  const contactSectionRef = useRef(null);
  const [contactMousePos, setContactMousePos] = useState({ x: 0, y: 0 });
  const handleContactMouseMove = (e) => {
    if (!contactSectionRef.current) return;
    const rect = contactSectionRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = ((e.clientX - centerX) / (rect.width / 2)) * 8;
    const y = ((e.clientY - centerY) / (rect.height / 2)) * 8;
    setContactMousePos({ x, y });
  };
  const handleContactMouseLeave = () => {
    setContactMousePos({ x: 0, y: 0 });
  };

  // 3D Tilt handlers for What We Stand For cards (Max 5deg tilt)
  const [card1Tilt, setCard1Tilt] = useState({ rotateX: 0, rotateY: 0 });
  const [card2Tilt, setCard2Tilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleCard1MouseMove = (e) => {
    setIsLeftHovered(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    setCard1Tilt({ rotateX, rotateY });
  };

  const handleCard1MouseLeave = () => {
    setIsLeftHovered(false);
    setCard1Tilt({ rotateX: 0, rotateY: 0 });
  };

  const handleCard2MouseMove = (e) => {
    setIsRightHovered(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    setCard2Tilt({ rotateX, rotateY });
  };

  const handleCard2MouseLeave = () => {
    setIsRightHovered(false);
    setCard2Tilt({ rotateX: 0, rotateY: 0 });
  };

  // What Makes Orvion Different - 4 Cards Hover & Tilt (Max 4deg)
  const [diffHoveredIndex, setDiffHoveredIndex] = useState(null);
  const [diffHovered, setDiffHovered] = useState([false, false, false, false]);
  const [diffTilts, setDiffTilts] = useState([
    { rotateX: 0, rotateY: 0 },
    { rotateX: 0, rotateY: 0 },
    { rotateX: 0, rotateY: 0 },
    { rotateX: 0, rotateY: 0 }
  ]);

  const handleDiffMouseMove = (index, e) => {
    setDiffHoveredIndex(index);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    setDiffTilts(prev => {
      const next = [...prev];
      next[index] = { rotateX, rotateY };
      return next;
    });
    setDiffHovered(prev => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  const handleDiffMouseLeave = (index) => {
    setDiffHoveredIndex(null);
    setDiffTilts(prev => {
      const next = [...prev];
      next[index] = { rotateX: 0, rotateY: 0 };
      return next;
    });
    setDiffHovered(prev => {
      const next = [...prev];
      next[index] = false;
      return next;
    });
  };

  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ["start end", "end start"]
  });
  const treeParallaxY = useTransform(scrollYProgress, [0, 1], [12, -12]);

  // Timeline story data
  const storyTimeline = [
    {
      year: "2021",
      title: "Engineered from Industry Pain",
      desc: "Founded by senior software architects who noticed a glaring gap: traditional college degrees were producing graduates unable to pass modern production code reviews."
    },
    {
      year: "2022",
      title: "The Project-First Engine",
      desc: "Pioneered our live deployment environment, replacing static video lectures with real-world Git repositories, CI/CD pipelines, and mandatory peer code reviews."
    },
    {
      year: "2023",
      title: "Industry Network Expansion",
      desc: "Partnered with over 150 tech companies and veteran engineering leads to deliver direct student mentorship, mock technical interviews, and internship guarantees."
    },
    {
      year: "2024+",
      title: "Global Tech Talent Incubator",
      desc: "Scaled into a premier outcome-driven EdTech platform with 10,000+ students, a 95% placement rate, and verifiable cryptographically signed credentials."
    }
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-[#FCFBF8] text-slate-800 font-sans min-h-screen relative selection:bg-orange-500 selection:text-white"
    >
      {/* ==================================================
          SECTION 1: BRAND-NEW LUXURY GLOBAL EDTECH HERO
         ================================================== */}
      <motion.section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="-mt-20 pt-28 pb-20 min-h-screen relative flex items-center justify-center overflow-hidden bg-[#FFFDF9] select-none"
      >
        {/* ANIMATED MINIMAL HERO BACKGROUND LAYER (Apple / Stripe / Framer Inspired) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0 pointer-events-none overflow-hidden z-0"
        >
          {/* Ultra-Light Dotted Grid Texture (2% Opacity) */}
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#F97316_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* SOFT LIGHT RAYS: Center Radial Light (Breathing scale 100% -> 105% -> 100% over 12s, Opacity 4%, Blur 120px) */}
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.03, 0.05, 0.03] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[650px] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.12)_0%,_transparent_70%)] blur-[120px] pointer-events-none"
          />

          {/* 3 ANIMATED FLOATING GRADIENT BLOBS (3-5% Opacity, Blur 150-170px, 20-30s Float) */}
          {/* Blob 1: Soft Orange (#F97316) */}
          <motion.div
            animate={{
              x: [heroMousePos.x * 0.8, heroMousePos.x * 0.8 + 20, heroMousePos.x * 0.8],
              y: [heroMousePos.y * 0.8, heroMousePos.y * 0.8 - 20, heroMousePos.y * 0.8]
            }}
            transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-32 -left-20 w-[650px] h-[650px] rounded-full bg-[#F97316] opacity-[0.04] blur-[160px] pointer-events-none"
          />
          {/* Blob 2: Warm Gold (#F5C16C) */}
          <motion.div
            animate={{
              x: [heroMousePos.x * 0.6, heroMousePos.x * 0.6 - 20, heroMousePos.x * 0.6],
              y: [heroMousePos.y * 0.6, heroMousePos.y * 0.6 + 20, heroMousePos.y * 0.6]
            }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/3 -right-24 w-[600px] h-[600px] rounded-full bg-[#F5C16C] opacity-[0.045] blur-[150px] pointer-events-none"
          />
          {/* Blob 3: Light Cream (#FFF6EB) */}
          <motion.div
            animate={{
              x: [heroMousePos.x * 0.7, heroMousePos.x * 0.7 + 15, heroMousePos.x * 0.7],
              y: [heroMousePos.y * 0.7, heroMousePos.y * 0.7 + 15, heroMousePos.y * 0.7]
            }}
            transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-24 left-1/4 w-[620px] h-[620px] rounded-full bg-[#FFF6EB] opacity-[0.05] blur-[170px] pointer-events-none"
          />

          {/* LARGE OUTLINE CIRCLES (3-4 Circles, 300px-700px, 1px Stroke, Brand Orange, 4% Opacity, 40-60s Rotation) */}
          {/* Circle 1: 340px (Top Left) */}
          <motion.div
            style={{ x: heroMousePos.x * 0.5, y: heroMousePos.y * 0.5 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-16 -left-12 w-[340px] h-[340px] rounded-full border border-[#F97316]/[0.04] pointer-events-none"
          />
          {/* Circle 2: 520px (Bottom Right) */}
          <motion.div
            style={{ x: heroMousePos.x * -0.5, y: heroMousePos.y * -0.5 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 52, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-20 -right-16 w-[520px] h-[520px] rounded-full border border-[#F97316]/[0.04] pointer-events-none"
          />
          {/* Circle 3: 680px (Center Right) */}
          <motion.div
            style={{ x: heroMousePos.x * 0.3, y: heroMousePos.y * 0.3 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 58, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/4 -right-32 w-[680px] h-[680px] rounded-full border border-[#F97316]/[0.035] pointer-events-none"
          />

          {/* SOFT FLOATING PARTICLES (20 Dots, 2-4px, Brand Orange, 6-10% Opacity, 500ms Delay) */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.03, 0.09, 0.03]
              }}
              transition={{
                duration: 14 + (i % 5) * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5 + i * 0.4
              }}
              className="absolute rounded-full bg-[#F97316]/[0.08] pointer-events-none"
              style={{
                width: `${(i % 3) + 2}px`,
                height: `${(i % 3) + 2}px`,
                left: `${(i * 5.1) % 92}%`,
                top: `${(i * 6.5) % 86}%`
              }}
            />
          ))}
        </motion.div>
        
        {/* CENTERED ORVION TREE WATERMARK BACKGROUND (Opacity 12-15%, Scale 1.05 -> 1, Blur 2px, Static) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.14, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-auto h-[78vh] lg:h-[85vh] max-h-[850px] flex items-center justify-center pointer-events-none"
          >
            <img
              src={orvionTreeImg}
              alt=""
              className="w-auto h-full max-h-[850px] object-contain blur-[2px] mix-blend-multiply select-none pointer-events-none"
              style={{
                maskImage: 'radial-gradient(circle at center, black 65%, transparent 98%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 65%, transparent 98%)',
              }}
            />
          </motion.div>
        </div>

        {/* HERO CONTENT CONTAINER */}
        <div className="max-w-[1100px] mx-auto text-center space-y-10 relative z-10 px-4 flex flex-col items-center justify-center">
          
          {/* Entire Heading Container (Entrance: translateY 40px -> 0, opacity 0 -> 1, duration 900ms) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="w-full text-center space-y-1 sm:space-y-2"
          >
            {/* Line 1: Building Tomorrow's (72px desktop, #111827, 1 line) */}
            <h1 className="text-[36px] sm:text-[54px] lg:text-[72px] font-serif font-medium text-[#111827] tracking-[-0.02em] leading-[1.05] block text-center whitespace-nowrap">
              Building Tomorrow's
            </h1>

            {/* Line 2: Tech Leaders (86px desktop, Orange Gradient #C86A00 -> #F59E0B, Typewriter loop) */}
            <div className="min-h-[1.1em] flex items-center justify-center overflow-hidden py-1">
              <span className="inline-flex items-center text-[44px] sm:text-[66px] lg:text-[86px] font-serif font-medium tracking-[-0.02em] leading-[1.05] bg-gradient-to-r from-[#C86A00] to-[#F59E0B] bg-clip-text text-transparent relative">
                <span>{typedTechLeaders}</span>

                {/* Thin Orange Caret Cursor: Width 2.5px, blinks smoothly at 750ms */}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-[2.5px] h-[0.75em] bg-[#F59E0B] rounded-[2px] ml-1.5 inline-block align-baseline"
                />
              </span>
            </div>

          </motion.div>

          {/* SINGLE CTA BUTTON: Explore Programs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center pt-2"
          >
            <Link
              to="/courses"
              className="inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-gradient-to-r from-[#C86A00] to-[#F59E0B] text-white font-semibold text-base shadow-[0_10px_25px_-5px_rgba(200,106,0,0.35)] hover:shadow-[0_15px_35px_-5px_rgba(200,106,0,0.50)] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 group"
            >
              <span>Explore Programs</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </motion.div>

        </div>
      </motion.section>

      {/* ==================================================
          SECTION 2: PREMIUM EDTECH OUR STORY SECTION
         ================================================== */}
      <motion.section
        ref={storyRef}
        id="our-story"
        onMouseMove={handleStoryMouseMove}
        onMouseLeave={handleStoryMouseLeave}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative pt-[140px] pb-[120px] px-[8%] min-h-[900px] bg-[#FFFDF8] overflow-hidden select-none flex items-center"
      >
        {/* ENHANCED ANIMATED BACKGROUND LAYER (Stripe / Linear / Apple Inspired) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0 pointer-events-none overflow-hidden z-0"
        >
          {/* Ultra-Light Dotted Grid Texture (2% Opacity) */}
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#F97316_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* 3 SOFT FLOATING RADIAL GRADIENT BLOBS (3-6% Opacity, Blur 140-160px, 18-25s Float) */}
          {/* Blob 1: Soft Orange (#F97316) */}
          <motion.div
            animate={{
              x: [storyMousePos.x * 0.8, storyMousePos.x * 0.8 + 25, storyMousePos.x * 0.8],
              y: [storyMousePos.y * 0.8, storyMousePos.y * 0.8 - 20, storyMousePos.y * 0.8]
            }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full bg-[#F97316] opacity-[0.045] blur-[150px] pointer-events-none"
          />
          {/* Blob 2: Warm Beige (#F5E7D6) */}
          <motion.div
            animate={{
              x: [storyMousePos.x * 0.6, storyMousePos.x * 0.6 - 20, storyMousePos.x * 0.6],
              y: [storyMousePos.y * 0.6, storyMousePos.y * 0.6 + 25, storyMousePos.y * 0.6]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/3 right-0 w-[550px] h-[550px] rounded-full bg-[#F5E7D6] opacity-[0.06] blur-[140px] pointer-events-none"
          />
          {/* Blob 3: Very Light Gold (#FFF3E6) */}
          <motion.div
            animate={{
              x: [storyMousePos.x * 0.7, storyMousePos.x * 0.7 + 15, storyMousePos.x * 0.7],
              y: [storyMousePos.y * 0.7, storyMousePos.y * 0.7 + 20, storyMousePos.y * 0.7]
            }}
            transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-20 left-1/3 w-[580px] h-[580px] rounded-full bg-[#FFF3E6] opacity-[0.05] blur-[160px] pointer-events-none"
          />

          {/* LARGE THIN OUTLINED GEOMETRIC CIRCLES (1px Border, 5% Opacity, Slow 40s Rotation) */}
          {/* Circle 1: 250px (Top Left) */}
          <motion.div
            style={{ x: storyMousePos.x * 0.5, y: storyMousePos.y * 0.5 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
            className="absolute top-12 left-16 w-[250px] h-[250px] rounded-full border border-[#F97316]/[0.05] pointer-events-none"
          />
          {/* Circle 2: 420px (Bottom Right) */}
          <motion.div
            style={{ x: storyMousePos.x * -0.5, y: storyMousePos.y * -0.5 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-10 right-12 w-[420px] h-[420px] rounded-full border border-[#F97316]/[0.05] pointer-events-none"
          />
          {/* Circle 3: 600px (Top Right Behind Logo) */}
          <motion.div
            style={{ x: storyMousePos.x * 0.3, y: storyMousePos.y * 0.3 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-32 right-1/4 w-[600px] h-[600px] rounded-full border border-[#F97316]/[0.04] pointer-events-none"
          />

          {/* TINY FLOATING PARTICLES (18 Dots, 2-4px, 8% Opacity, Float Upward, Fade In/Out) */}
          {[...Array(18)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [-15, 15, -15],
                opacity: [0.03, 0.09, 0.03]
              }}
              transition={{
                duration: 12 + (i % 6) * 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.6
              }}
              className="absolute rounded-full bg-[#F97316]/[0.08]"
              style={{
                width: `${(i % 3) + 2}px`,
                height: `${(i % 3) + 2}px`,
                left: `${(i * 5.8) % 94}%`,
                top: `${(i * 7.2) % 88}%`
              }}
            />
          ))}

          {/* SOFT LIGHT SWEEP (Moves diagonally every 15s over 4s at 3% opacity) */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 15, ease: 'easeInOut' }}
            className="absolute inset-0 w-[40%] h-full bg-gradient-to-r from-transparent via-[#F97316]/[0.03] to-transparent transform -skew-x-12 pointer-events-none"
          />
        </motion.div>

        {/* Content Container */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* CENTERED TOP LABEL: OUR STORY */}
          <div className="max-w-4xl mx-auto text-center mb-10 sm:mb-14">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center justify-center gap-4"
            >
              <span className="w-10 sm:w-16 h-[1px] bg-[#EA580C]/40" />
              <span className="text-[14px] font-semibold uppercase tracking-[10px] text-[#EA580C]">
                OUR STORY
              </span>
              <span className="w-10 sm:w-16 h-[1px] bg-[#EA580C]/40" />
            </motion.div>
          </div>

          {/* TWO-COLUMN SPLIT LAYOUT (Left 55%, Right 45%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* ==================== LEFT COLUMN (55%): LEFT-ALIGNED CONTENT ==================== */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left items-start z-10">
              
              {/* Left-Aligned Headline (Slide from left 900ms) */}
              <motion.h2
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="text-[32px] sm:text-[44px] lg:text-[50px] xl:text-[54px] font-serif tracking-tight leading-[1.08] mb-6 text-left"
              >
                <span className="font-normal text-[#111827]">Built by </span>
                <span className="italic font-normal bg-gradient-to-r from-[#EA580C] via-[#F59E0B] to-[#EA580C] bg-clip-text text-transparent">
                  Industry Experts.
                </span>
              </motion.h2>

              {/* Supporting Paragraphs (Fade Up with 150ms delay) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6 max-w-[620px] text-[#4B5563] font-sans text-[18px] leading-[1.8] font-normal mb-8 text-left"
              >
                <p>
                  Orvion was founded by engineers, innovators, and industry professionals who understood that classroom learning alone isn't enough for today's technology careers.
                </p>
                <p>
                  We bridge the gap between education and industry by combining expert mentorship, real-world projects, internships, and practical learning experiences that prepare students for success from day one.
                </p>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to="/courses"
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#EA580C] to-[#F59E0B] text-white font-semibold text-base shadow-[0_10px_25px_-5px_rgba(234,88,12,0.35)] hover:shadow-[0_15px_35px_-5px_rgba(234,88,12,0.50)] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300"
                >
                  <span>Explore Our Programs</span>
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                </Link>
              </motion.div>

            </div>

            {/* ==================== RIGHT COLUMN (45%): OFFICIAL ORVION LOGO ==================== */}
            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px] sm:min-h-[460px]">
              
              {/* Soft Pulsing Logo Glow (Scale 1 -> 1.03 over 6s, 5% Opacity, Blur 80px) */}
              <motion.div
                animate={{ scale: [1, 1.03, 1], opacity: [0.04, 0.07, 0.04] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-[380px] h-[380px] sm:w-[480px] sm:h-[480px] rounded-full bg-[#F97316] blur-[80px] pointer-events-none"
              />

              {/* Subtle Concentric Decorative Circles */}
              <div className="absolute w-[380px] h-[380px] sm:w-[460px] sm:h-[460px] flex items-center justify-center pointer-events-none opacity-05">
                <svg className="w-full h-full text-amber-600/10" viewBox="0 0 500 500" fill="none">
                  <circle cx="250" cy="250" r="230" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 8" />
                  <circle cx="250" cy="250" r="170" stroke="currentColor" strokeWidth="0.6" />
                </svg>
              </div>

              {/* Official Orvion Logo (Scale 0.96 -> 1, Fade In 1.1s, 5.5s Idle Float) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 flex items-center justify-center w-full p-4"
              >
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative flex items-center justify-center"
                >
                  {/* Soft Ambient Brand Glow */}
                  <div className="absolute inset-0 bg-[#EA580C]/[0.06] blur-[35px] rounded-full pointer-events-none" />

                  <img
                    src={logoImg}
                    alt="Orvion Logo - Unlock The Future"
                    className="w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[460px] h-auto object-contain filter drop-shadow-[0_20px_40px_rgba(234,88,12,0.14)] select-none pointer-events-none"
                  />
                </motion.div>
              </motion.div>

            </div>

          </div>
        </div>
      </motion.section>

      {/* ==================================================
          SECTION AFTER OUR STORY: WHAT WE STAND FOR (REFINED MINIMALIST LOOK)
         ================================================== */}
      <section className="w-full relative mt-0 pt-[90px] pb-[100px] bg-[#0B0B0B] text-white overflow-hidden select-none border-t border-[#173A73]/20">
        
        {/* Soft Blue Radial Glow Behind Everything Starting Immediately at Top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-[#173A73] opacity-[0.16] blur-[240px] rounded-full pointer-events-none" />

        {/* SINGLE Deep Navy Blue (#173A73) Flower Pattern Starting Immediately at Top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 z-0 pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
            className="w-[1000px] h-[1000px] sm:w-[1300px] sm:h-[1300px] lg:w-[1500px] lg:h-[1500px] text-[#173A73] opacity-[0.09]"
          >
            <svg viewBox="0 0 1000 1000" fill="none" className="w-full h-full text-current">
              {[...Array(36)].map((_, i) => (
                <path
                  key={i}
                  d="M 500 500 Q 600 280 500 80 Q 400 280 500 500"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  transform={`rotate(${i * 10} 500 500)`}
                />
              ))}
              <circle cx="500" cy="500" r="440" stroke="currentColor" strokeWidth="0.8" strokeDasharray="6 8" />
              <circle cx="500" cy="500" r="340" stroke="currentColor" strokeWidth="0.6" />
              <circle cx="500" cy="500" r="240" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 6" />
            </svg>
          </motion.div>
        </div>

        {/* Tiny Blue Floating Particles & Light Dots (Subtle Drift) */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [-12, 12, -12],
                x: [-6, 6, -6],
                opacity: [0.15, 0.40, 0.15]
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 1.1
              }}
              className="absolute w-1 h-1 rounded-full bg-[#3B82F6]/60 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
              style={{
                left: `${6 + i * 9.5}%`,
                top: `${12 + (i % 4) * 23}%`
              }}
            />
          ))}
        </div>

        {/* SECTION HEADER (REMOVED LARGE WHITE HEADING) */}
        <div className="max-w-4xl mx-auto text-center relative z-10 px-4 mb-10 sm:mb-12">
          {/* Small Label with Decorative Side Lines */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-4 mb-4"
          >
            <span className="w-10 sm:w-16 h-[1px] bg-[#F97316]/40" />
            <span className="text-[14px] font-semibold uppercase tracking-[10px] text-[#F97316] inline-block">
              WHAT WE STAND FOR
            </span>
            <span className="w-10 sm:w-16 h-[1px] bg-[#F97316]/40" />
          </motion.div>

          {/* Small Supporting Text Directly Below */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-[#B8B8B8] font-sans text-base sm:text-lg italic max-w-[760px] mx-auto leading-relaxed"
          >
            Our principles shape every decision, every learning experience, and every student success story.
          </motion.p>
        </div>

        {/* CARDS LAYOUT: TWO CARDS (460px W x 380px H, Gap 32px, Rounded 28px) */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            
            {/* ==================== CARD 1: PREMIUM EMERALD (#1F8B80) ==================== */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
              onMouseMove={handleCard1MouseMove}
              onMouseLeave={handleCard1MouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${card1Tilt.rotateX}deg) rotateY(${card1Tilt.rotateY}deg)`,
                transition: 'transform 0.15s ease-out'
              }}
              className="w-full max-w-[460px] h-[380px] rounded-[28px] bg-[#1F8B80] border border-white/10 hover:border-white/40 text-white p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden cursor-pointer group transition-all duration-600 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(31,139,128,0.35)]"
            >
              {/* Header: Icon & Category (Moved slightly upward) */}
              <div className="flex items-center justify-between z-10 -mt-1">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                  {isLeftHovered ? <Briefcase className="w-5 h-5 text-white" /> : <Target className="w-5 h-5 text-white" />}
                </div>
                <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-white/75">
                  PRINCIPLE 01
                </span>
              </div>

              {/* Main Content Area: Smooth Reveal */}
              <div className="relative z-10 my-auto w-full overflow-hidden">
                <AnimatePresence mode="wait">
                  {!isLeftHovered ? (
                    <motion.div
                      key="initial-1"
                      initial={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3, ease: 'easeIn' }}
                      className="space-y-2.5"
                    >
                      <h3 className="font-serif font-medium text-[26px] sm:text-[28px] text-white tracking-tight leading-tight">
                        Mission Driven
                      </h3>
                      <p className="font-sans text-[15px] sm:text-[16px] text-white/90 leading-[1.6]">
                        We bridge the gap between academic learning and real-world technology careers.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="revealed-1"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="space-y-2.5"
                    >
                      <h4 className="font-serif font-medium text-[24px] sm:text-[26px] text-white tracking-tight">
                        Industry First
                      </h4>
                      <p className="font-sans text-[14px] sm:text-[15px] text-white/90 leading-[1.6]">
                        Every learning path is designed with experienced industry professionals to ensure students master practical workflows, tools, and engineering standards used in real companies.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer: Badge 01 & Rotatable Arrow (Reduced bottom spacing) */}
              <div className="flex items-center justify-between pt-3 border-t border-white/15 z-10 -mb-1">
                <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center font-mono font-bold text-xs text-white">
                  01
                </span>
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-[#1F8B80] transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                </div>
              </div>
            </motion.div>

            {/* ==================== CARD 2: PREMIUM GOLD (#EFC14D) ==================== */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              onMouseMove={handleCard2MouseMove}
              onMouseLeave={handleCard2MouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${card2Tilt.rotateX}deg) rotateY(${card2Tilt.rotateY}deg)`,
                transition: 'transform 0.15s ease-out'
              }}
              className="w-full max-w-[460px] h-[380px] rounded-[28px] bg-[#EFC14D] border border-black/10 hover:border-black/30 text-[#111111] p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden cursor-pointer group transition-all duration-600 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(239,193,77,0.35)]"
            >
              {/* Header: Icon & Category (Moved slightly upward) */}
              <div className="flex items-center justify-between z-10 -mt-1">
                <div className="w-11 h-11 rounded-xl bg-black/10 flex items-center justify-center backdrop-blur-md">
                  {isRightHovered ? <TrendingUp className="w-5 h-5 text-[#111111]" /> : <Users className="w-5 h-5 text-[#111111]" />}
                </div>
                <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#111111]/75">
                  PRINCIPLE 02
                </span>
              </div>

              {/* Main Content Area: Smooth Reveal */}
              <div className="relative z-10 my-auto w-full overflow-hidden">
                <AnimatePresence mode="wait">
                  {!isRightHovered ? (
                    <motion.div
                      key="initial-2"
                      initial={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3, ease: 'easeIn' }}
                      className="space-y-2.5"
                    >
                      <h3 className="font-serif font-medium text-[26px] sm:text-[28px] text-[#111111] tracking-tight leading-tight">
                        Community Led
                      </h3>
                      <p className="font-sans text-[15px] sm:text-[16px] text-[#111111]/90 leading-[1.6]">
                        Students, mentors, professionals, and alumni grow together through one connected ecosystem.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="revealed-2"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="space-y-2.5"
                    >
                      <h4 className="font-serif font-medium text-[24px] sm:text-[26px] text-[#111111] tracking-tight">
                        Outcome Obsessed
                      </h4>
                      <p className="font-sans text-[14px] sm:text-[15px] text-[#111111]/90 leading-[1.6]">
                        We focus on measurable success through placements, career growth, real-world skills, and long-term professional success rather than certificates alone.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer: Badge 02 & Rotatable Arrow (Reduced bottom spacing) */}
              <div className="flex items-center justify-between pt-3 border-t border-black/15 z-10 -mb-1">
                <span className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center font-mono font-bold text-xs text-[#111111]">
                  02
                </span>
                <div className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-[#111111] group-hover:text-[#EFC14D] transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 4: WHAT MAKES ORVION DIFFERENT (PREMIUM UX INDIA INSPIRED)
         ================================================== */}
      <section className="w-full relative pt-[100px] pb-[80px] bg-[#F7F3EC] text-[#111111] overflow-hidden select-none">
        {/* Soft Noise Grain Texture (2% Opacity) */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:20px_20px]" />
        
        {/* Soft Radial Gradient Glow behind Cards */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] blur-[90px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(244,90,30,0.05) 0%, transparent 70%)'
          }}
        />

        {/* Small 120x120 Dotted Grid (Top-Left behind title, 8% Opacity) */}
        <svg
          className="absolute top-12 left-10 w-[120px] h-[120px] opacity-[0.08] text-[#F45A1E] pointer-events-none"
          viewBox="0 0 120 120"
          fill="none"
        >
          <pattern id="dotGrid" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="currentColor" />
          </pattern>
          <rect width="120" height="120" fill="url(#dotGrid)" />
        </svg>

        {/* Thin Circular Outline behind paragraph (1px border, 8% Opacity) */}
        <div className="absolute top-16 right-16 w-72 h-72 rounded-full border border-[#F45A1E]/[0.08] pointer-events-none" />

        {/* Elegant Thin Curved Stroke across section */}
        <svg
          className="absolute top-1/4 right-5 w-[600px] h-[300px] pointer-events-none opacity-[0.05]"
          viewBox="0 0 600 300"
          fill="none"
        >
          <path d="M 0 250 Q 300 0 600 200" stroke="#F45A1E" strokeWidth="1" />
        </svg>

        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 relative z-10 space-y-16 lg:space-y-20">
          
          {/* TWO-COLUMN HEADER LAYOUT (Max width 1400px, Gap 100px, Center Aligned) */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-[100px] max-w-[1400px]">
            
            {/* LEFT HEADING & LABEL */}
            <div className="lg:flex-1 space-y-3">
              {/* Small Label (Fade Up) */}
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-[14px] font-semibold uppercase tracking-[8px] text-[#F45A1E] block"
              >
                WHAT MAKES ORVION DIFFERENT
              </motion.span>

              {/* Main Heading (Fade Up + 40px, 60px/64px) */}
              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif font-medium leading-[0.92] tracking-[-0.03em]"
              >
                <span className="text-[32px] sm:text-[46px] lg:text-[60px] text-[#111827] block">
                  Don't Just Learn.
                </span>
                <span className="text-[34px] sm:text-[48px] lg:text-[64px] bg-gradient-to-r from-[#F45A1E] to-[#F59E0B] bg-clip-text text-transparent block">
                  Build a Real Career.
                </span>
              </motion.h2>
            </div>

            {/* RIGHT DESCRIPTION (Font Size 18px, Line Height 1.75, Weight 400, Color rgba(17,24,39,.72), Max Width 500px, Fade Up) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="lg:w-[480px] xl:w-[500px] flex items-center my-auto"
            >
              <p className="font-sans text-[16px] sm:text-[18px] text-[#111827]/72 font-normal leading-[1.75] max-w-[500px]">
                Orvion combines expert mentorship, real-world engineering projects, internships, and production-ready technology stacks to prepare students for successful technology careers, not just certifications.
              </p>
            </motion.div>

          </div>

          {/* CARDS LAYOUT: 1 Horizontal Row with 4 Equal Cards on Desktop (Stagger Delays: 0ms, 120ms, 240ms, 360ms) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1400px] mx-auto items-stretch justify-between">
            
            {/* ==================== CARD 1: DEEP NAVY (#243A63) ==================== */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0, ease: [0.22, 1, 0.36, 1] }}
              onMouseMove={(e) => handleDiffMouseMove(0, e)}
              onMouseLeave={() => handleDiffMouseLeave(0)}
              style={{
                transform: `perspective(1000px) rotateX(${diffTilts[0].rotateX}deg) rotateY(${diffTilts[0].rotateY}deg)`,
                transition: 'transform 0.15s ease-out'
              }}
              className={`w-full max-w-[320px] h-[415px] rounded-[28px] bg-[#243A63] border text-white p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden cursor-pointer group justify-self-center transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                diffHoveredIndex === 0
                  ? 'scale-[1.025] -translate-y-2.5 z-20 opacity-100 brightness-[1.05] border-white/20 shadow-[0_28px_70px_rgba(0,0,0,0.18)]'
                  : diffHoveredIndex !== null
                  ? 'scale-[0.98] z-10 opacity-75 saturate-[0.9] border-white/10 shadow-sm'
                  : 'scale-100 z-10 opacity-100 border-white/10 shadow-md hover:border-white/20'
              }`}
            >
              {/* Card Text Content */}
              <div className="space-y-4 z-10 pr-2">
                <span className="text-[13px] font-sans uppercase tracking-[2px] text-white/80 block font-medium">
                  1-on-1 Guidance
                </span>
                <h3 className="font-serif font-medium text-[34px] lg:text-[40px] text-white tracking-tight leading-none">
                  Industry Mentors
                </h3>
                <p className="font-sans text-[15px] lg:text-[18px] text-[rgba(255,255,255,0.82)] font-normal leading-[1.6]">
                  Learn directly from experienced engineers and technology leaders through one-on-one mentorship.
                </p>
              </div>

              {/* Floating 3D Object Illustration (Glasses) */}
              <motion.img
                src={glassesImg}
                alt="Industry Mentors Glasses"
                animate={{
                  scale: diffHovered[0] ? 1.08 : 1,
                  rotate: diffHovered[0] ? 4 : 0,
                  y: diffHovered[0] ? -8 : 0,
                  x: diffHovered[0] ? 0 : 12,
                  opacity: diffHovered[0] ? 1 : 0.88
                }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-3 -right-3 w-32 h-32 lg:w-36 lg:h-36 object-contain pointer-events-none z-20 filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.3)]"
              />
            </motion.div>

            {/* ==================== CARD 2: ORANGE (#F45A1E) ==================== */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              onMouseMove={(e) => handleDiffMouseMove(1, e)}
              onMouseLeave={() => handleDiffMouseLeave(1)}
              style={{
                transform: `perspective(1000px) rotateX(${diffTilts[1].rotateX}deg) rotateY(${diffTilts[1].rotateY}deg)`,
                transition: 'transform 0.15s ease-out'
              }}
              className={`w-full max-w-[320px] h-[415px] rounded-[28px] bg-[#F45A1E] border text-white p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden cursor-pointer group justify-self-center transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                diffHoveredIndex === 1
                  ? 'scale-[1.025] -translate-y-2.5 z-20 opacity-100 brightness-[1.05] border-white/20 shadow-[0_28px_70px_rgba(0,0,0,0.18)]'
                  : diffHoveredIndex !== null
                  ? 'scale-[0.98] z-10 opacity-75 saturate-[0.9] border-white/10 shadow-sm'
                  : 'scale-100 z-10 opacity-100 border-white/10 shadow-md hover:border-white/20'
              }`}
            >
              {/* Card Text Content */}
              <div className="space-y-4 z-10 pr-2">
                <span className="text-[13px] font-sans uppercase tracking-[2px] text-white/80 block font-medium">
                  Internship Opportunities
                </span>
                <h3 className="font-serif font-medium text-[34px] lg:text-[40px] text-white tracking-tight leading-none">
                  Career Experience
                </h3>
                <p className="font-sans text-[15px] lg:text-[18px] text-[rgba(255,255,255,0.82)] font-normal leading-[1.6]">
                  Gain practical internship experience and work on live industry projects before graduation.
                </p>
              </div>

              {/* Floating 3D Object Illustration (Megaphone) */}
              <motion.img
                src={megaphoneImg}
                alt="Career Experience Megaphone"
                animate={{
                  scale: diffHovered[1] ? 1.08 : 1,
                  rotate: diffHovered[1] ? 4 : 0,
                  y: diffHovered[1] ? -8 : 0,
                  x: diffHovered[1] ? 0 : 12,
                  opacity: diffHovered[1] ? 1 : 0.88
                }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-3 -right-3 w-32 h-32 lg:w-36 lg:h-36 object-contain pointer-events-none z-20 filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.3)]"
              />
            </motion.div>

            {/* ==================== CARD 3: MAGENTA (#C73B6E) ==================== */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              onMouseMove={(e) => handleDiffMouseMove(2, e)}
              onMouseLeave={() => handleDiffMouseLeave(2)}
              style={{
                transform: `perspective(1000px) rotateX(${diffTilts[2].rotateX}deg) rotateY(${diffTilts[2].rotateY}deg)`,
                transition: 'transform 0.15s ease-out'
              }}
              className={`w-full max-w-[320px] h-[415px] rounded-[28px] bg-[#C73B6E] border text-white p-7 lg:p-8 flex flex-col justify-between relative overflow-hidden cursor-pointer group justify-self-center transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                diffHoveredIndex === 2
                  ? 'scale-[1.025] -translate-y-2.5 z-20 opacity-100 brightness-[1.05] border-white/20 shadow-[0_28px_70px_rgba(0,0,0,0.18)]'
                  : diffHoveredIndex !== null
                  ? 'scale-[0.98] z-10 opacity-75 saturate-[0.9] border-white/10 shadow-sm'
                  : 'scale-100 z-10 opacity-100 border-white/10 shadow-md hover:border-white/20'
              }`}
            >
              {/* Card Text Content */}
              <div className="space-y-3 z-10">
                <span className="text-[13px] font-sans uppercase tracking-[2px] text-white/80 block font-medium">
                  Learn High-Class Courses
                </span>
                <h3 className="font-serif font-medium text-[34px] lg:text-[40px] text-white tracking-tight leading-none">
                  Industry Curriculum
                </h3>

                {/* Technology Skill Badges (6 Pills: Data Engineering, Data Science, SAP, Cybersecurity, AI & ML, DevOps) */}
                <div className="flex flex-wrap gap-2 pt-2 z-10 max-w-[210px]">
                  {[
                    "Data Engineering",
                    "Data Science",
                    "SAP",
                    "Cybersecurity",
                    "AI & ML",
                    "DevOps"
                  ].map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-full text-[13px] font-medium bg-white/14 border border-white/18 text-white backdrop-blur-md shadow-sm transition-colors duration-300 hover:bg-white/25"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Floating 3D Object Illustration (Trophy) */}
              <motion.img
                src={trophyImg}
                alt="Industry Curriculum Trophy"
                animate={{
                  scale: diffHovered[2] ? 1.08 : 1,
                  rotate: diffHovered[2] ? 4 : 0,
                  y: diffHovered[2] ? -8 : 0,
                  x: diffHovered[2] ? 0 : 12,
                  opacity: diffHovered[2] ? 1 : 0.88
                }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-3 -right-3 w-32 h-32 lg:w-36 lg:h-36 object-contain pointer-events-none z-20 filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.3)]"
              />
            </motion.div>

            {/* ==================== CARD 4: TEAL (#2A8D82) ==================== */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
              onMouseMove={(e) => handleDiffMouseMove(3, e)}
              onMouseLeave={() => handleDiffMouseLeave(3)}
              style={{
                transform: `perspective(1000px) rotateX(${diffTilts[3].rotateX}deg) rotateY(${diffTilts[3].rotateY}deg)`,
                transition: 'transform 0.15s ease-out'
              }}
              className={`w-full max-w-[320px] h-[415px] rounded-[28px] bg-[#2A8D82] border text-white p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden cursor-pointer group justify-self-center transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                diffHoveredIndex === 3
                  ? 'scale-[1.025] -translate-y-2.5 z-20 opacity-100 brightness-[1.05] border-white/20 shadow-[0_28px_70px_rgba(0,0,0,0.18)]'
                  : diffHoveredIndex !== null
                  ? 'scale-[0.98] z-10 opacity-75 saturate-[0.9] border-white/10 shadow-sm'
                  : 'scale-100 z-10 opacity-100 border-white/10 shadow-md hover:border-white/20'
              }`}
            >
              {/* Card Text Content */}
              <div className="space-y-4 z-10 pr-2">
                <span className="text-[13px] font-sans uppercase tracking-[2px] text-white/80 block font-medium">
                  Production Stacks
                </span>
                <h3 className="font-serif font-medium text-[34px] lg:text-[40px] text-white tracking-tight leading-none">
                  Real Projects
                </h3>
                <p className="font-sans text-[15px] lg:text-[18px] text-[rgba(255,255,255,0.82)] font-normal leading-[1.6]">
                  Build production-ready applications using modern tools, cloud infrastructure, and real workflows.
                </p>
              </div>

              {/* Floating 3D Object Illustration (Document & Pen) */}
              <motion.img
                src={documentImg}
                alt="Real Projects Document"
                animate={{
                  scale: diffHovered[3] ? 1.08 : 1,
                  rotate: diffHovered[3] ? 4 : 0,
                  y: diffHovered[3] ? -8 : 0,
                  x: diffHovered[3] ? 0 : 12,
                  opacity: diffHovered[3] ? 1 : 0.88
                }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-3 -right-3 w-32 h-32 lg:w-36 lg:h-36 object-contain pointer-events-none z-20 filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.3)]"
              />
            </motion.div>

          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 5: BRAND-NEW PREMIUM MINIMAL CONTACT FORM (#FCFAF7)
         ================================================== */}
      <motion.section
        ref={contactSectionRef}
        onMouseMove={handleContactMouseMove}
        onMouseLeave={handleContactMouseLeave}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
        className="w-full relative py-24 sm:py-32 bg-[#FCFAF7] text-[#111827] overflow-hidden select-none border-t border-[#111827]/08"
      >
        {/* PREMIUM ANIMATED BACKGROUND LAYER */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 pointer-events-none overflow-hidden z-0"
        >
          {/* Ultra-Light Dotted Grid Texture (2% Opacity) */}
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#F97316_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* FLOATING GRADIENT BLOBS (4% Opacity, 140px Blur, 20-25s Float) */}
          {/* Soft Orange */}
          <motion.div
            animate={{
              x: [contactMousePos.x * 0.8, contactMousePos.x * 0.8 + 20, contactMousePos.x * 0.8],
              y: [contactMousePos.y * 0.8, contactMousePos.y * 0.8 - 20, contactMousePos.y * 0.8]
            }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-24 -left-24 w-[550px] h-[550px] rounded-full bg-[#F97316] opacity-[0.04] blur-[140px] pointer-events-none"
          />
          {/* Warm Beige */}
          <motion.div
            animate={{
              x: [contactMousePos.x * 0.6, contactMousePos.x * 0.6 - 20, contactMousePos.x * 0.6],
              y: [contactMousePos.y * 0.6, contactMousePos.y * 0.6 + 20, contactMousePos.y * 0.6]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 -right-20 w-[500px] h-[500px] rounded-full bg-[#F5E7D6] opacity-[0.05] blur-[140px] pointer-events-none"
          />
          {/* Light Gold */}
          <motion.div
            animate={{
              x: [contactMousePos.x * 0.7, contactMousePos.x * 0.7 + 15, contactMousePos.x * 0.7],
              y: [contactMousePos.y * 0.7, contactMousePos.y * 0.7 + 15, contactMousePos.y * 0.7]
            }}
            transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-20 left-1/3 w-[520px] h-[520px] rounded-full bg-[#FFF3E6] opacity-[0.04] blur-[140px] pointer-events-none"
          />

          {/* DECORATIVE OUTLINE CIRCLES (4 Large Circles: Top Right, Bottom Left, Center Right, Top Left; 1px Stroke, 4% Opacity, 40s Rotation) */}
          <motion.div
            style={{ x: contactMousePos.x * 0.5, y: contactMousePos.y * 0.5 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute top-8 right-12 w-[340px] h-[340px] rounded-full border border-[#F97316]/[0.04] pointer-events-none"
          />
          <motion.div
            style={{ x: contactMousePos.x * -0.5, y: contactMousePos.y * -0.5 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-8 left-10 w-[380px] h-[380px] rounded-full border border-[#F97316]/[0.04] pointer-events-none"
          />
          <motion.div
            style={{ x: contactMousePos.x * 0.3, y: contactMousePos.y * 0.3 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 44, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/3 right-1/4 w-[460px] h-[460px] rounded-full border border-[#F97316]/[0.035] pointer-events-none"
          />
          <motion.div
            style={{ x: contactMousePos.x * -0.3, y: contactMousePos.y * -0.3 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-16 left-1/4 w-[280px] h-[280px] rounded-full border border-[#F97316]/[0.04] pointer-events-none"
          />

          {/* TINY FLOATING PARTICLES (20 Dots, 2-4px, 8% Opacity) */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [-15, 15, -15],
                opacity: [0.03, 0.08, 0.03]
              }}
              transition={{
                duration: 12 + (i % 5) * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.5
              }}
              className="absolute rounded-full bg-[#F97316]/[0.08]"
              style={{
                width: `${(i % 3) + 2}px`,
                height: `${(i % 3) + 2}px`,
                left: `${(i * 5.2) % 94}%`,
                top: `${(i * 6.8) % 88}%`
              }}
            />
          ))}

          {/* SOFT LIGHT SWEEP (Moves diagonally every 15s over 4s at 3% opacity) */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 15, ease: 'easeInOut' }}
            className="absolute inset-0 w-[35%] h-full bg-gradient-to-r from-transparent via-[#F97316]/[0.03] to-transparent transform -skew-x-12 pointer-events-none"
          />
        </motion.div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 sm:space-y-12">
          
          {/* SECTION HEADER */}
          <div className="max-w-3xl mx-auto text-center space-y-3">
            {/* Small Label */}
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-[15px] font-semibold uppercase tracking-[6px] text-[#F97316] block"
            >
              GET IN TOUCH
            </motion.span>

            {/* Main Heading (font-serif, 600-700 weight, leading 1.02, tracking -0.02em) */}
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-[26px] sm:text-[36px] lg:text-[46px] font-semibold text-center leading-[1.02] tracking-[-0.02em]"
            >
              <span className="text-[#111827] block">Let's Build Your</span>
              <span className="text-[#F97316] italic block font-serif">Future Together</span>
            </motion.h2>
          </div>

          {/* CONTACT FORM CARD (Max width 820px, 48px padding desktop, 28px mobile, rounded 28px, shadow 0 20px 70px rgba(0,0,0,.06)) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 25 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[820px] mx-auto bg-white border border-[#E7E7E7] rounded-[28px] shadow-[0_20px_70px_rgba(0,0,0,0.06)] p-7 sm:p-12 relative overflow-hidden backdrop-blur-md"
          >
            {submitSuccess ? (
              /* SUCCESS STATE */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#F97316]/10 text-[#F97316] mx-auto flex items-center justify-center text-3xl font-bold">
                  ✓
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#111827]">
                  Thank You!
                </h3>
                <p className="text-[#5F6E82] text-base sm:text-lg max-w-md mx-auto">
                  Our team will contact you shortly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={formStep === 1 ? handleContinue : handleSubmit} className="space-y-6">
                
                {/* STEP 1: INITIAL 3 REQUIRED FIELDS */}
                <div className="space-y-5">
                  
                  {/* Full Name */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                  >
                    <label htmlFor="fullName" className="block text-[14px] font-semibold text-[#111827] mb-2 text-left">
                      Full Name <span className="text-[#F97316]">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={contactForm.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                      className={`h-[56px] px-4 rounded-[16px] bg-white border ${
                        formErrors.fullName ? 'border-red-500 bg-red-50/20' : 'border-[#E7E7E7]'
                      } hover:border-[#F97316] focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/10 focus:outline-none transition-all duration-250 font-sans text-[15px] text-[#111827] placeholder-[#A0A8B5] w-full`}
                    />
                    {formErrors.fullName && (
                      <p className="text-red-500 text-xs mt-1.5 text-left font-medium">{formErrors.fullName}</p>
                    )}
                  </motion.div>

                  {/* Email */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.12 }}
                  >
                    <label htmlFor="email" className="block text-[14px] font-semibold text-[#111827] mb-2 text-left">
                      Email <span className="text-[#F97316]">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleInputChange}
                      placeholder="e.g. rahul@example.com"
                      className={`h-[56px] px-4 rounded-[16px] bg-white border ${
                        formErrors.email ? 'border-red-500 bg-red-50/20' : 'border-[#E7E7E7]'
                      } hover:border-[#F97316] focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/10 focus:outline-none transition-all duration-250 font-sans text-[15px] text-[#111827] placeholder-[#A0A8B5] w-full`}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1.5 text-left font-medium">{formErrors.email}</p>
                    )}
                  </motion.div>

                  {/* Mobile Number */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.19 }}
                  >
                    <label htmlFor="mobile" className="block text-[14px] font-semibold text-[#111827] mb-2 text-left">
                      Mobile Number <span className="text-[#F97316]">*</span>
                    </label>
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      value={contactForm.mobile}
                      onChange={handleInputChange}
                      placeholder="e.g. +91 98765 43210"
                      className={`h-[56px] px-4 rounded-[16px] bg-white border ${
                        formErrors.mobile ? 'border-red-500 bg-red-50/20' : 'border-[#E7E7E7]'
                      } hover:border-[#F97316] focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/10 focus:outline-none transition-all duration-250 font-sans text-[15px] text-[#111827] placeholder-[#A0A8B5] w-full`}
                    />
                    {formErrors.mobile && (
                      <p className="text-red-500 text-xs mt-1.5 text-left font-medium">{formErrors.mobile}</p>
                    )}
                  </motion.div>

                </div>

                {/* STEP 1 BUTTON: CONTINUE (Slide Up 300ms delay, hover lift, shadow, scale 1.02) */}
                {formStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="pt-2"
                  >
                    <button
                      type="submit"
                      className="w-full h-[56px] rounded-full bg-gradient-to-r from-[#F97316] to-[#F59E0B] text-white font-semibold text-base shadow-[0_10px_25px_-5px_rgba(249,115,22,0.35)] hover:shadow-[0_15px_35px_-5px_rgba(249,115,22,0.50)] hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-250 flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <span>Continue</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-250">→</span>
                    </button>
                  </motion.div>
                )}

                {/* STEP 2: REVEALED ADDITIONAL FIELDS (SMOOTH EXPANSION) */}
                <AnimatePresence>
                  {formStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="space-y-5 pt-2 border-t border-[#ECECEC]"
                    >
                      {/* College & Year Row */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.07 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                      >
                        {/* College */}
                        <div>
                          <label htmlFor="college" className="block text-[14px] font-semibold text-[#111827] mb-2 text-left">
                            College
                          </label>
                          <input
                            type="text"
                            id="college"
                            name="college"
                            value={contactForm.college}
                            onChange={handleInputChange}
                            placeholder="e.g. BITS Pilani"
                            className="h-[56px] px-4 rounded-[16px] bg-white border border-[#E7E7E7] hover:border-[#F97316] focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/10 focus:outline-none transition-all duration-250 font-sans text-[15px] text-[#111827] placeholder-[#A0A8B5] w-full"
                          />
                        </div>

                        {/* Year */}
                        <div>
                          <label htmlFor="year" className="block text-[14px] font-semibold text-[#111827] mb-2 text-left">
                            Year
                          </label>
                          <select
                            id="year"
                            name="year"
                            value={contactForm.year}
                            onChange={handleInputChange}
                            className="h-[56px] px-4 rounded-[16px] bg-white border border-[#E7E7E7] hover:border-[#F97316] focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/10 focus:outline-none transition-all duration-250 font-sans text-[15px] text-[#111827] w-full cursor-pointer"
                          >
                            <option value="">Select Year</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                            <option value="Graduated">Graduated / Working Professional</option>
                          </select>
                        </div>
                      </motion.div>

                      {/* Branch & Address Row */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.14 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                      >
                        {/* Branch */}
                        <div>
                          <label htmlFor="branch" className="block text-[14px] font-semibold text-[#111827] mb-2 text-left">
                            Branch
                          </label>
                          <select
                            id="branch"
                            name="branch"
                            value={contactForm.branch}
                            onChange={handleInputChange}
                            className="h-[56px] px-4 rounded-[16px] bg-white border border-[#E7E7E7] hover:border-[#F97316] focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/10 focus:outline-none transition-all duration-250 font-sans text-[15px] text-[#111827] w-full cursor-pointer"
                          >
                            <option value="">Select Branch</option>
                            <option value="Computer Science / IT">Computer Science / IT</option>
                            <option value="AI & ML / Data Science">AI & ML / Data Science</option>
                            <option value="ECE / EEE">ECE / EEE</option>
                            <option value="Mechanical / Civil">Mechanical / Civil</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        {/* Address */}
                        <div>
                          <label htmlFor="address" className="block text-[14px] font-semibold text-[#111827] mb-2 text-left">
                            Address
                          </label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={contactForm.address}
                            onChange={handleInputChange}
                            placeholder="e.g. Hyderabad, Telangana"
                            className="h-[56px] px-4 rounded-[16px] bg-white border border-[#E7E7E7] hover:border-[#F97316] focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/10 focus:outline-none transition-all duration-250 font-sans text-[15px] text-[#111827] placeholder-[#A0A8B5] w-full"
                          />
                        </div>
                      </motion.div>

                      {/* Message Box */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.21 }}
                      >
                        <label htmlFor="message" className="block text-[14px] font-semibold text-[#111827] mb-2 text-left">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={contactForm.message}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="Tell us about your goals, interests, or any questions you have..."
                          className="h-[160px] p-4 rounded-[16px] bg-white border border-[#E7E7E7] hover:border-[#F97316] focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/10 focus:outline-none transition-all duration-250 font-sans text-[15px] text-[#111827] placeholder-[#A0A8B5] w-full resize-none"
                        />
                      </motion.div>

                      {/* FINAL SUBMIT BUTTON: SEND MESSAGE */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.28 }}
                        className="pt-2"
                      >
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full h-[56px] rounded-full bg-gradient-to-r from-[#F97316] to-[#F59E0B] text-white font-semibold text-base shadow-[0_10px_25px_-5px_rgba(249,115,22,0.35)] hover:shadow-[0_15px_35px_-5px_rgba(249,115,22,0.50)] hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-250 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70"
                        >
                          {isSubmitting ? (
                            <span>Sending...</span>
                          ) : (
                            <>
                              <span>Send Message →</span>
                            </>
                          )}
                        </button>
                      </motion.div>

                    </motion.div>
                  )}
                </AnimatePresence>

              </form>
            )}
          </motion.div>

        </div>
      </motion.section>

    </motion.div>
  );
}
