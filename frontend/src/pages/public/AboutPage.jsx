import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import orvionTreeImg from '../../assets/orvion-tree-logo.png';
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
  ChevronDown
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
  const [activeTab, setActiveTab] = useState('all');
  const [activeStep, setActiveStep] = useState(0);

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

  // Pillars of Difference
  const pillars = [
    {
      icon: Users,
      title: "Industry Mentors",
      tagline: "1-on-1 Guidance",
      desc: "Learn directly from senior engineers and architects actively working at top tech firms, giving you insider knowledge."
    },
    {
      icon: Code2,
      title: "Real Projects",
      tagline: "Production Stacks",
      desc: "Build full-stack applications, microservices, and databases deployed to live cloud servers rather than toy todo apps."
    },
    {
      icon: Briefcase,
      title: "Guaranteed Internships",
      tagline: "Hands-on Experience",
      desc: "Gain real-world experience working on client-facing deliverables to put verifiable employment history on your resume."
    },
    {
      icon: Compass,
      title: "Career Guidance",
      tagline: "Strategic Roadmap",
      desc: "Tailored 1-on-1 career coaching, resume teardowns, and LinkedIn optimization designed to attract top recruiters."
    },
    {
      icon: Terminal,
      title: "Mock Interviews",
      tagline: "Technical & Behavioral",
      desc: "Practice real coding challenges, system design whiteboards, and behavioral rounds with instant expert feedback."
    },
    {
      icon: Trophy,
      title: "Portfolio Building",
      tagline: "Verifiable Code",
      desc: "Graduate with a stunning, production-ready GitHub portfolio and deployed web apps that prove your expertise."
    },
    {
      icon: TrendingUp,
      title: "Placement Preparation",
      tagline: "Salary & Negotiations",
      desc: "Comprehensive interview prep, referral networks, and offer negotiation tactics to secure your target compensation."
    }
  ];

  // Learning Approach Steps
  const learningSteps = [
    { number: "01", step: "Learn", title: "Core Fundamentals", desc: "Master system architecture, modern frameworks, and data structures through live interactive sessions." },
    { number: "02", step: "Build", title: "Production Projects", desc: "Write clean, modular code building real-world enterprise applications from architectural specs." },
    { number: "03", step: "Practice", title: "Code Reviews", desc: "Submit pull requests for strict line-by-line review by senior tech mentors to refine best practices." },
    { number: "04", step: "Deploy", title: "Cloud & DevOps", desc: "Ship your applications to production using Docker, CI/CD GitHub Actions, and AWS/Vercel environments." },
    { number: "05", step: "Interview", title: "Rigorous Drills", desc: "Master DSA challenges, system design teardowns, and behavioral questions with seasoned hiring managers." },
    { number: "06", step: "Get Hired", title: "Career Placement", desc: "Tap into our hiring partner network, get direct candidate referrals, and sign your dream job offer." }
  ];

  // Core Values
  const coreValues = [
    { icon: Shield, name: "Integrity", desc: "Transparent metrics, authentic student outcomes, and honest technical evaluation with no gimmicks." },
    { icon: Zap, name: "Innovation", desc: "Constantly evolving our curriculum to match real-time industry technology shifts and AI tools." },
    { icon: BookOpen, name: "Learning", desc: "Cultivating deep curiosity, problem-solving mindsets, and lifelong engineering mastery." },
    { icon: Users, name: "Community", desc: "A tight-knit, collaborative network of ambitious peers, mentors, and successful alumni." },
    { icon: Award, name: "Leadership", desc: "Empowering every student to take ownership of complex projects and guide technical decisions." },
    { icon: TrendingUp, name: "Growth", desc: "Relentless focus on measurable skill growth, career acceleration, and outcome achievement." }
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Aarav Sharma",
      role: "Software Development Engineer",
      company: "CloudTech Solutions",
      college: "BITS Pilani Alumnus",
      category: "engineering",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
      quote: "Orvion didn't just teach me React or Node — they taught me how software is actually built in production. The code reviews from senior mentors completely reshaped how I write code.",
      rating: 5
    },
    {
      name: "Priya Nair",
      role: "Backend Architect Intern",
      company: "Fintech Global",
      college: "VIT Vellore",
      category: "internships",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250",
      quote: "The internship program at Orvion gave me authentic client experience before I even graduated. Having live microservices deployed on AWS made my resume stand out immediately.",
      rating: 5
    },
    {
      name: "Rohan Varma",
      role: "Full Stack Engineer",
      company: "Nexus Systems",
      college: "IIT Hyderabad Alumnus",
      category: "engineering",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
      quote: "The mock technical interviews were harder than my actual company interviews! By the time I faced hiring managers, I felt completely in control and relaxed.",
      rating: 5
    }
  ];

  const filteredTestimonials = activeTab === 'all' 
    ? testimonials 
    : testimonials.filter(t => t.category === activeTab);

  // Ecosystem Diagram Nodes
  const ecosystemNodes = [
    { name: "Students", role: "Ambitious Tech Learners", color: "from-amber-500 to-orange-600", icon: GraduationCap },
    { name: "Mentors", role: "Senior Industry Leads", color: "from-orange-500 to-rose-600", icon: Users },
    { name: "Projects", role: "Production Codebases", color: "from-amber-600 to-amber-500", icon: Code2 },
    { name: "Internships", role: "Real-world Client Work", color: "from-orange-600 to-amber-700", icon: Briefcase },
    { name: "Industry", role: "Cutting-edge Tech Stacks", color: "from-amber-700 to-orange-500", icon: Building2 },
    { name: "Companies", role: "Global Hiring Partners", color: "from-orange-500 to-amber-600", icon: Globe },
    { name: "Placements", role: "High-impact Tech Roles", color: "from-emerald-600 to-teal-600", icon: Trophy }
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
          SECTION 1: LUXURY EDTECH HERO BACKGROUND & TREE WATERMARK
         ================================================== */}
      <section className="-mt-20 pt-32 pb-20 sm:pt-40 sm:pb-28 min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F1] to-[#FFFDFB]">
        
        {/* CENTERED AMBIENT BACKGROUND & ORVION TREE WATERMARK */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
          
          {/* Soft Golden Radial Glow (Breathing Effect: 8% -> 14%) */}
          <motion.div
            animate={{ opacity: [0.08, 0.14, 0.08] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-[80vw] max-w-[1000px] h-[75vh] max-h-[750px] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-300/35 via-amber-100/15 to-transparent blur-3xl pointer-events-none"
          />

          {/* Floating Centered ORVION Tree Image Watermark */}
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-auto h-[65vh] sm:h-[72vh] max-h-[720px] flex items-center justify-center"
          >
            <img
              src={orvionTreeImg}
              alt=""
              className="w-auto h-full max-h-[720px] object-contain opacity-[0.10] blur-[2.5px] mix-blend-multiply select-none pointer-events-none"
              style={{
                maskImage: 'radial-gradient(circle at center, black 65%, transparent 98%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 65%, transparent 98%)',
              }}
            />
          </motion.div>
        </div>

        {/* SIDE DECORATIONS (Minimal Luxury EdTech accents, opacity < 15%) */}
        {/* Left Side Accent */}
        <motion.svg
          animate={{ opacity: [0.06, 0.13, 0.06] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-3 sm:left-10 top-1/3 w-44 sm:w-60 h-60 pointer-events-none text-amber-600/30"
          viewBox="0 0 200 200"
          fill="none"
        >
          <path d="M10,20 Q90,100 10,180" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 4" />
          <circle cx="90" cy="100" r="42" stroke="currentColor" strokeWidth="0.7" />
        </motion.svg>
        <div className="absolute left-[7%] bottom-[22%] w-24 h-24 rounded-full border border-amber-500/15 pointer-events-none" />
        <div className="absolute left-[11%] top-[24%] w-1.5 h-1.5 rounded-full bg-amber-500/25 pointer-events-none" />

        {/* Right Side Accent */}
        <motion.svg
          animate={{ opacity: [0.06, 0.13, 0.06] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute right-3 sm:right-10 top-1/4 w-44 sm:w-60 h-60 pointer-events-none text-amber-600/30"
          viewBox="0 0 200 200"
          fill="none"
        >
          <path d="M190,20 Q110,100 190,180" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 4" />
          <circle cx="110" cy="100" r="48" stroke="currentColor" strokeWidth="0.7" />
        </motion.svg>
        <div className="absolute right-[8%] top-[28%] w-1.5 h-1.5 rounded-full bg-amber-500/20 pointer-events-none" />
        <div className="absolute right-[6%] bottom-[20%] w-20 h-20 rounded-full border border-amber-500/15 pointer-events-none" />

        {/* Floating Subtle Golden Spark Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 0, opacity: 0.05 }}
            animate={{
              y: [-8, -32, -8],
              opacity: [0.05, 0.12, 0.05]
            }}
            transition={{
              duration: 7 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.2
            }}
            className="absolute w-1.5 h-1.5 rounded-full bg-amber-400/30 pointer-events-none"
            style={{
              left: `${14 + (i * 14)}%`,
              top: `${28 + (i % 3) * 22}%`
            }}
          />
        ))}

        {/* HERO CONTENT */}
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10 px-4">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/25 backdrop-blur-md shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-bold tracking-wider text-orange-700 uppercase">
              ABOUT ORVION
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.15]"
          >
            We Train the Next Generation of{' '}
            <span className="font-serif italic bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent drop-shadow-sm block sm:inline mt-2 sm:mt-0">
              Tech Leaders
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal"
          >
            Orvion is an industry-focused EdTech platform dedicated to preparing students for real-world technology careers through live projects, expert mentorship, internships, and outcome-based learning.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold shadow-[0_10px_25px_-5px_rgba(234,88,12,0.4)] hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 group"
            >
              <span>Explore Programs</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#our-story"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/90 border border-slate-200/80 text-slate-700 font-semibold backdrop-blur-md shadow-sm hover:bg-slate-50 hover:border-orange-500/30 hover:-translate-y-1 hover:shadow-md active:scale-[0.98] transition-all duration-300"
            >
              <span>Our Story</span>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:translate-y-0.5 transition-transform" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ==================================================
          SECTION 2: OUR STORY
         ================================================== */}
      <section id="our-story" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Heading & Timeline */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100/60 px-3 py-1 rounded-full border border-orange-200">
                THE ORIGIN
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Built by Engineers.<br />
                <span className="font-serif italic bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Built for Future Leaders.
                </span>
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed pt-2">
                We started Orvion with a clear conviction: engineering is learned by building real systems, not by memorizing static slides. We stripped away academia filler to build an accelerator for serious technologists.
              </p>
            </div>

            {/* Interactive Timeline */}
            <div className="space-y-6 pt-2 border-l-2 border-orange-200/60 ml-2 pl-6 relative">
              {storyTimeline.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative group"
                >
                  {/* Marker node */}
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-orange-500 group-hover:scale-125 group-hover:bg-orange-500 transition-all duration-300 shadow-sm" />
                  
                  <div className="bg-white/80 p-5 rounded-[20px] border border-slate-200/70 shadow-sm hover:border-orange-500/30 hover:shadow-md transition-all duration-300 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-orange-500/10 text-orange-700">
                        {item.year}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base sm:text-lg">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Glass Card & Visual Graphic */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative p-8 rounded-[24px] bg-white/70 border border-orange-500/20 shadow-2xl backdrop-blur-xl space-y-6 overflow-hidden"
            >
              {/* Soft Orange Glow Overlay */}
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-orange-400/20 to-amber-300/20 blur-3xl rounded-full pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-600/10 text-orange-600 flex items-center justify-center font-bold">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">The Orvion Architecture</h3>
                    <p className="text-xs text-slate-500">Live Engineering Incubator</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active Network
                </span>
              </div>

              {/* Graphic Mock Diagram Card */}
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1 border-b border-slate-800">
                    <span>// incubator_status.config.ts</span>
                    <span className="text-amber-400">production: ready</span>
                  </div>
                  <p className="text-orange-400">const studentJourney = &#123;</p>
                  <p className="pl-4 text-emerald-300">mentorship: <span className="text-white">"1-on-1 Senior Engineers"</span>,</p>
                  <p className="pl-4 text-emerald-300">curriculum: <span className="text-white">"100% Production Codebases"</span>,</p>
                  <p className="pl-4 text-emerald-300">verifiableCredentials: <span className="text-white">true</span>,</p>
                  <p className="pl-4 text-emerald-300">outcomePlacementRate: <span className="text-amber-400">"95.4%"</span></p>
                  <p className="text-orange-400">&#125;;</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20 text-center space-y-1">
                    <p className="text-2xl font-extrabold text-slate-900">250+</p>
                    <p className="text-xs font-medium text-slate-600">Enterprise Projects</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-center space-y-1">
                    <p className="text-2xl font-extrabold text-slate-900">150+</p>
                    <p className="text-xs font-medium text-slate-600">Industry Mentors</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 3: OUR MISSION (Cinematic Black Section)
         ================================================== */}
      <section className="bg-[#0B0F17] text-white py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Soft Background Radial Orange Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-orange-600/15 via-amber-600/10 to-transparent blur-[140px] pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-4 py-1.5 rounded-full border border-orange-500/20">
              PURPOSE & DESTINATION
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Engineered for Real Impact
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              We operate on three foundational pillars designed to ensure every learner achieves world-class technical competence.
            </p>
          </div>

          {/* Three Large Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Mission */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-8 rounded-[24px] bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:border-orange-500/50 hover:bg-white/[0.05] transition-all duration-300 space-y-6 relative group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-semibold text-orange-400 uppercase tracking-widest">01 / DIRECTION</span>
                <h3 className="text-2xl font-bold text-white">Our Mission</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                To democratize high-caliber, outcome-based technology education by providing every student with direct mentorship, production-grade projects, and verifiable credentials.
              </p>
            </motion.div>

            {/* Card 2: Vision */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-8 rounded-[24px] bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:border-orange-500/50 hover:bg-white/[0.05] transition-all duration-300 space-y-6 relative group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Compass className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-semibold text-orange-400 uppercase tracking-widest">02 / NORTH STAR</span>
                <h3 className="text-2xl font-bold text-white">Our Vision</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                To build the world's most trusted software engineering incubator, setting the global benchmark for candidate quality, work ethics, and technical leadership.
              </p>
            </motion.div>

            {/* Card 3: Values */}
            <motion.div
              whileHover={{ y: -6 }}
              className="p-8 rounded-[24px] bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:border-orange-500/50 hover:bg-white/[0.05] transition-all duration-300 space-y-6 relative group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-semibold text-orange-400 uppercase tracking-widest">03 / PHILOSOPHY</span>
                <h3 className="text-2xl font-bold text-white">Our Values</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Proof over promises. We measure success by code shipped to production, architectural mastery, and long-term career growth rather than passive test scores.
              </p>
            </motion.div>

          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 4: WHAT MAKES ORVION DIFFERENT
         ================================================== */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100/60 px-3.5 py-1 rounded-full border border-orange-200">
            THE ORVION ADVANTAGE
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            What Makes Orvion Different
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            We don't offer generic video courses. We provide an end-to-end career transformation ecosystem designed for real outcomes.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="p-8 rounded-[24px] bg-white border border-slate-200/80 shadow-md hover:shadow-xl hover:border-orange-500/40 transition-all duration-300 space-y-5 relative group"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                    {pillar.tagline}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">{pillar.title}</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ==================================================
          SECTION 5: OUR LEARNING APPROACH
         ================================================== */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              METHODOLOGY
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Our 6-Step Learning Journey
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              A structured, high-intensity pipeline that takes you from raw curiosity to industry candidate.
            </p>
          </div>

          {/* Horizontal / Step Journey */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative">
            {learningSteps.map((stepItem, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                onClick={() => setActiveStep(idx)}
                className={`p-6 rounded-[24px] border cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-4 relative ${
                  activeStep === idx 
                    ? 'bg-gradient-to-b from-orange-600/20 to-slate-800/80 border-orange-500 shadow-lg scale-[1.03]' 
                    : 'bg-slate-800/40 border-slate-700/60 hover:border-orange-500/40 hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-orange-400">{stepItem.number}</span>
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-slate-300">
                    {stepItem.step}
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-base">{stepItem.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{stepItem.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 6: NUMBERS (IMPACT METRICS)
         ================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="p-10 rounded-[32px] bg-white border border-slate-200/80 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          
          <div className="text-center space-y-2 pt-4 md:pt-0">
            <h3 className="text-4xl sm:text-5xl font-black text-slate-900 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              10,000+
            </h3>
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Students Enrolled</p>
          </div>

          <div className="text-center space-y-2 pt-4 md:pt-0 md:pl-6">
            <h3 className="text-4xl sm:text-5xl font-black text-slate-900 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              250+
            </h3>
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Live Projects</p>
          </div>

          <div className="text-center space-y-2 pt-4 md:pt-0 md:pl-6">
            <h3 className="text-4xl sm:text-5xl font-black text-slate-900 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              150+
            </h3>
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Industry Mentors</p>
          </div>

          <div className="text-center space-y-2 pt-4 md:pt-0 md:pl-6">
            <h3 className="text-4xl sm:text-5xl font-black text-slate-900 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              95%
            </h3>
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Career Success Rate</p>
          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 7: WHY STUDENTS LOVE ORVION
         ================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100/60 px-3 py-1 rounded-full border border-orange-200">
            TESTIMONIALS & OUTCOMES
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Why Students Love Orvion
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Hear from real graduates who unlocked engineering careers through our platform.
          </p>

          {/* Filter Tabs */}
          <div className="flex items-center justify-center gap-2 pt-4">
            {['all', 'engineering', 'internships'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab === 'all' ? 'All Stories' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredTestimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-8 rounded-[24px] bg-white border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/30"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{t.name}</h4>
                  <p className="text-xs font-semibold text-orange-600">{t.role} @ {t.company}</p>
                  <p className="text-[11px] text-slate-400">{t.college}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================================================
          SECTION 8: MEET OUR LEADERSHIP
         ================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="p-8 sm:p-12 rounded-[32px] bg-gradient-to-br from-white via-amber-50/30 to-orange-50/40 border border-orange-500/20 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-[24px] overflow-hidden border-2 border-orange-500/30 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800"
                alt="Founder Leadership"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-slate-950/90 to-transparent text-white">
                <h4 className="text-xl font-bold">Vikramaditya Rao</h4>
                <p className="text-xs text-orange-400 font-medium">Founder & Chief Learning Officer</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100/60 px-3 py-1 rounded-full border border-orange-200">
              LEADERSHIP VISION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              "We are building the educational institution we wished existed when we were starting out."
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              With over 12 years of experience leading engineering teams across global tech hubs, Vikramaditya founded Orvion with one goal: replacing outdated rote learning with a high-caliber incubator where students ship real production software.
            </p>

            <div className="pt-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-orange-600 transition-colors shadow-md"
              >
                <Linkedin className="w-4 h-4" />
                <span>Connect on LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 9: OUR VALUES
         ================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100/60 px-3 py-1 rounded-full border border-orange-200">
            OUR CORE VALUES
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            The Principles That Drive Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreValues.map((val, idx) => {
            const Icon = val.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="p-8 rounded-[24px] bg-white border border-slate-200/80 shadow-md hover:border-orange-500/40 transition-all duration-300 space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{val.name}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{val.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ==================================================
          SECTION 10: OUR ECOSYSTEM
         ================================================== */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              CONNECTED TALENT GRAPH
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              The Orvion Ecosystem
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              How our interconnected platform seamlessly bridges students, mentorship, real projects, and hiring partners.
            </p>
          </div>

          {/* Diagram Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {ecosystemNodes.map((node, idx) => {
              const NodeIcon = node.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.03 }}
                  className="p-6 rounded-[24px] bg-white/[0.04] border border-white/10 backdrop-blur-md hover:border-orange-500/50 space-y-4 relative group"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${node.color} text-white flex items-center justify-center shadow-lg`}>
                    <NodeIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{node.name}</h3>
                    <p className="text-slate-400 text-xs">{node.role}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ==================================================
          SECTION 11: FINAL CTA (Cinematic Black Section)
         ================================================== */}
      <section className="py-28 bg-[#0B0F17] text-white px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-orange-600/20 via-amber-500/15 to-transparent blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Ready to Build<br />
            <span className="font-serif italic bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              Your Future?
            </span>
          </h2>

          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Join thousands of ambitious learners transforming their careers with Orvion’s industry-focused EdTech platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold shadow-[0_10px_25px_-5px_rgba(234,88,12,0.5)] hover:shadow-[0_15px_30px_-5px_rgba(234,88,12,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <span>Explore Programs</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold backdrop-blur-md hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <span>Contact Us</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </motion.div>
  );
}
