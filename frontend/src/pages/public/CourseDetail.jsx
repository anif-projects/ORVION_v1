import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Check, Clock, BookOpen, Star, ShieldCheck, Award, Globe, 
  Calendar, ChevronDown, ChevronUp, Layers, Users, CheckCircle2, 
  Terminal, Briefcase, HelpCircle, Sparkles, Share2, Heart, 
  Video, Code, FileText, MessageSquare, ExternalLink, Linkedin, Twitter, Github,
  ChevronLeft, GraduationCap, MapPin, Laptop, Cpu, ShieldAlert, Key
} from 'lucide-react';
import ReactPlayer from 'react-player';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import CourseCard from '../../components/common/CourseCard';
import { pageVariants } from '../../utils/animations';

// Helper function to normalize course data
const normalizeCourseData = (rawCourse = {}) => {
  const modules = rawCourse.modules || [];

  let totalLessonsCount = 0;
  modules.forEach(m => {
    if (m.lessons && Array.isArray(m.lessons)) {
      totalLessonsCount += m.lessons.length;
    }
  });

  return {
    _id: rawCourse._id || rawCourse.id || 'c-default',
    slug: rawCourse.slug || 'course-detail',
    title: rawCourse.title || '',
    subtitle: rawCourse.subtitle || '',
    category: {
      name: typeof rawCourse.category === 'object' ? rawCourse.category?.name : (rawCourse.category || 'Engineering'),
      color: typeof rawCourse.category === 'object' ? (rawCourse.category?.color || '#b45309') : '#b45309',
    },
    type: rawCourse.type || 'online',
    thumbnail: rawCourse.thumbnail || '',
    previewVideo: rawCourse.previewVideo || '',
    price: rawCourse.price !== undefined && rawCourse.price !== null ? rawCourse.price : 0,
    discountPrice: rawCourse.discountPrice !== undefined && rawCourse.discountPrice !== null 
      ? rawCourse.discountPrice 
      : (rawCourse.price !== undefined && rawCourse.price !== null ? rawCourse.price : 0),
    rating: rawCourse.rating !== undefined && rawCourse.rating !== null ? rawCourse.rating : 4.8,
    enrolledCount: rawCourse.enrolledCount !== undefined && rawCourse.enrolledCount !== null ? rawCourse.enrolledCount : 0,
    totalDuration: rawCourse.totalDuration !== undefined && rawCourse.totalDuration !== null ? rawCourse.totalDuration : 0, // minutes
    totalLessons: rawCourse.totalLessons !== undefined && rawCourse.totalLessons !== null ? rawCourse.totalLessons : totalLessonsCount,
    language: rawCourse.language || 'English (Subtitles available)',
    updatedAt: rawCourse.updatedAt ? new Date(rawCourse.updatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'July 2026',
    certificate: rawCourse.isCertificateIncluded !== undefined && rawCourse.isCertificateIncluded !== null ? Boolean(rawCourse.isCertificateIncluded) : true,
    level: rawCourse.level ? rawCourse.level.replace('_', ' ') : 'All Levels',

    // Section 2: About This Course
    description: rawCourse.description || '',

    // What You'll Learn
    learningOutcomes: rawCourse.learningOutcomes || [],

    // Course Curriculum
    modules,
  };
};

// Return curriculum content dynamically if empty for offline courses
const getOfflineModules = (title) => {
  const design = [
    { title: 'Module 1: Introduction to UI/UX & Design Thinking', duration: '3 weeks', lessons: [{ title: 'Design fundamentals & color theories' }, { title: 'User persona & empathy mapping' }] },
    { title: 'Module 2: User Research & Low-Fidelity Wireframes', duration: '3 weeks', lessons: [{ title: 'Conducting user interviews & questionnaires' }, { title: 'Wireframing techniques & paper prototypes' }] },
    { title: 'Module 3: High-Fidelity UI Design in Figma', duration: '3 weeks', lessons: [{ title: 'Auto layouts, components, & design systems' }, { title: 'Interactive micro-animations & transitions' }] },
    { title: 'Module 4: Usability Testing & Design Handoffs', duration: '3 weeks', lessons: [{ title: 'A/B testing & heatmaps evaluation' }, { title: 'Developer handoffs & documentation' }] },
  ];
  const devops = [
    { title: 'Module 1: Linux Administration & Git Workflows', duration: '4 weeks', lessons: [{ title: 'Bash scripting & process automation' }, { title: 'Git branch branching strategies & merges' }] },
    { title: 'Module 2: Containerization with Docker', duration: '4 weeks', lessons: [{ title: 'Writing optimized Dockerfiles' }, { title: 'Multi-container setups with Docker Compose' }] },
    { title: 'Module 3: Orchestration with Kubernetes', duration: '4 weeks', lessons: [{ title: 'Kubernetes pods, deployments & services' }, { title: 'Ingress routing & configmaps' }] },
    { title: 'Module 4: Infrastructure as Code & CI/CD Pipelines', duration: '4 weeks', lessons: [{ title: 'IaC provisioning using Terraform' }, { title: 'Jenkins & GitHub Actions pipeline designs' }] },
  ];
  const ai = [
    { title: 'Module 1: Python Essentials & Data Wrangling', duration: '4 weeks', lessons: [{ title: 'Data wrangling with Pandas & NumPy' }, { title: 'Data visualizations using Seaborn' }] },
    { title: 'Module 2: Supervised & Unsupervised Machine Learning', duration: '4 weeks', lessons: [{ title: 'Linear & logistic regressions' }, { title: 'K-Means clustering & decision trees' }] },
    { title: 'Module 3: Neural Networks & Deep Learning', duration: '4 weeks', lessons: [{ title: 'Building ANN/CNN models using PyTorch' }, { title: 'Fine-tuning AI models' }] },
    { title: 'Module 4: OpenAI APIs & LLM Integrations', duration: '4 weeks', lessons: [{ title: 'Semantic search & vector databases' }, { title: 'Integrating GPT models into applications' }] },
  ];
  const security = [
    { title: 'Module 1: Introduction to Ethical Hacking & Networks', duration: '4 weeks', lessons: [{ title: 'Network topologies & subnet mapping' }, { title: 'Port scanning & vulnerability analysis' }] },
    { title: 'Module 2: Web Application Security & OWASP Top 10', duration: '4 weeks', lessons: [{ title: 'SQL Injection & XSS vulnerabilities' }, { title: 'Broken authentication patching' }] },
    { title: 'Module 3: Penetration Testing & Exploit Execution', duration: '4 weeks', lessons: [{ title: 'Metasploit exploit design' }, { title: 'Privilege escalation techniques' }] },
    { title: 'Module 4: Firewall Engineering & Defensive Auditing', duration: '4 weeks', lessons: [{ title: 'Setting up Intrusion Detection Systems' }, { title: 'Compliance & audit logs reporting' }] },
  ];

  if (title.includes('DevOps') || title.includes('Cloud')) return devops;
  if (title.includes('AI') || title.includes('Data Science') || title.includes('Machine Learning') || title.includes('Data Engineering')) return ai;
  if (title.includes('Cybersecurity') || title.includes('Security')) return security;
  return design;
};

const getOfflineCourseDetails = (title) => {
  const defaults = {
    techs: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Framer', 'Webflow'],
    outcomes: [
      'Master the complete design thinking process from user research to interactive prototyping.',
      'Build a verified professional portfolio of 3+ high-fidelity case studies.',
      'Design responsive layouts for web, mobile, and tablet platforms.',
      'Collaborate in design sprints and receive real-world feedback.'
    ],
    project: {
      title: 'E-Commerce App Redesign',
      problem: 'Optimize user conversion flows and checkout funnels for a high-traffic retail store.',
      audience: 'Gen Z and Millennial tech shoppers',
      techStack: 'Figma, FigJam, Miro',
      details: 'Conducted user research, mapped information architecture, built low-fidelity wireframes, and created a fully interactive high-fidelity prototype.',
      milestones: [
        'User Research & Empathy Maps',
        'Low-Fidelity Wireframes & Testing',
        'UI Component Library Creation',
        'High-Fidelity Interactive Prototype'
      ]
    }
  };

  if (title.includes('DevOps') || title.includes('Cloud')) {
    return {
      techs: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'GitHub Actions'],
      outcomes: [
        'Design and deploy highly available infrastructure on AWS.',
        'Containerize applications using Docker and orchestrate them with Kubernetes.',
        'Implement automated CI/CD pipelines with GitHub Actions and Jenkins.',
        'Manage infrastructure as code (IaC) using Terraform.'
      ],
      project: {
        title: 'Enterprise Microservices Scaling',
        problem: 'Automate deployment and scaling for a high-traffic microservices app.',
        audience: 'DevOps & System Engineering teams',
        techStack: 'AWS, Kubernetes, Terraform, Helm',
        details: 'Provisioned infrastructure using Terraform, built Docker containers, orchestrated pods via Kubernetes, and configured auto-scaling.',
        milestones: [
          'IaC Infrastructure Provisioning',
          'Docker Containerization',
          'Kubernetes Helm Chart Deployment',
          'Prometheus & Grafana Monitoring Setup'
        ]
      }
    };
  }

  if (title.includes('AI') || title.includes('Data Science') || title.includes('Machine Learning') || title.includes('Data Engineering')) {
    return {
      techs: ['Python', 'PyTorch', 'TensorFlow', 'OpenAI API', 'Pandas', 'Jupyter'],
      outcomes: [
        'Build and train predictive machine learning models from scratch.',
        'Implement deep learning architectures using PyTorch and TensorFlow.',
        'Integrate state-of-the-art LLMs using OpenAI and HuggingFace APIs.',
        'Clean, wrangle, and analyze large datasets using Pandas and NumPy.'
      ],
      project: {
        title: 'Predictive Recommendation Engine',
        problem: 'Design a personalized user recommendation engine based on behavior metrics.',
        audience: 'Streaming platform users',
        techStack: 'Python, PyTorch, Pandas, Scikit-learn',
        details: 'Analyzed streaming behavior datasets, trained collaborative filtering models, and implemented a REST API for real-time recommendations.',
        milestones: [
          'Data Ingestion & Cleaning Pipeline',
          'Collaborative Filtering Model Training',
          'Deep Learning Model Tuning',
          'Model Serving API Deployment'
        ]
      }
    };
  }

  if (title.includes('Cybersecurity') || title.includes('Security')) {
    return {
      techs: ['Wireshark', 'Kali Linux', 'Metasploit', 'Nmap', 'Burp Suite', 'OWASP'],
      outcomes: [
        'Identify and patch critical vulnerabilities using security tools.',
        'Conduct web application pentesting following OWASP guidelines.',
        'Analyze network traffic and investigate security breaches.',
        'Implement secure network configurations and firewall rules.'
      ],
      project: {
        title: 'Penetration Testing Audit',
        problem: 'Identify security vulnerabilities in a staging web application database.',
        audience: 'Internal security and compliance officers',
        techStack: 'Wireshark, Metasploit, Nmap, Burp Suite',
        details: 'Performed port scanning, conducted vulnerability mapping, executed staging exploits, and drafted a compliance mitigation report.',
        milestones: [
          'Reconnaissance & Port Scanning',
          'Vulnerability Scanning & Identification',
          'Staging Exploit Execution',
          'Patching & Security Remediation'
        ]
      }
    };
  }

  return defaults;
};

const getPreviewStreamUrl = (url) => {
  if (!url) return '';
  let videoId = null;
  if (url.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(url)) {
    videoId = url;
  } else {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|shorts\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    if (match) videoId = match[1];
  }

  if (videoId) {
    return `https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1&autoplay=1`;
  }
  return url;
};

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [openModuleIndex, setOpenModuleIndex] = useState(0); // Module accordion state

  useEffect(() => {
    fetchCourseDetail();
  }, [slug]);

  useEffect(() => {
    if (course && user) {
      const checkEnrollment = async () => {
        try {
          const res = await api.get('/learning/my-courses');
          const enrollments = res.data.data.enrollments || [];
          const enrolled = enrollments.some(e => String(e.course?._id || e.course?.id) === String(course._id));
          setIsEnrolled(enrolled);
        } catch (err) {
          console.error(err);
        }
      };
      checkEnrollment();
    }
  }, [course, user]);

  const fetchCourseDetail = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/courses/slug/${slug}`);
      const rawData = res.data?.data?.course || res.data?.course;
      setCourse(normalizeCourseData(rawData));
    } catch (err) {
      console.error('Failed to fetch course details from database:', err);
      toast.error('Failed to load course details from database.');
      setCourse(null);
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please log in to enroll in this course');
      navigate('/login');
      return;
    }

    const loadToast = toast.loading('Initiating enrollment...');
    try {
      const res = await api.post('/payments/checkout', {
        type: 'course',
        id: course._id
      });
      
      const { isPaid, orderId, amount, currency, keyId, message } = res.data.data;

      if (!isPaid) {
        toast.success(message || 'Enrolled in free course successfully!', { id: loadToast });
        navigate('/student/dashboard');
        return;
      }

      // Paid course flow: Load Razorpay
      toast.loading('Loading payment gateway...', { id: loadToast });
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load Razorpay SDK. Check your internet connection.', { id: loadToast });
        return;
      }

      toast.dismiss(loadToast);

      const options = {
        key: keyId,
        amount: amount, // in paise
        currency: currency || 'INR',
        name: 'Orvion Edu Tech',
        description: `Purchase: ${course.title}`,
        order_id: orderId,
        handler: async function (response) {
          const verifyToast = toast.loading('Verifying payment secure signature...');
          try {
            await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              type: 'course',
              itemId: course._id
            });
            toast.success('🎉 Purchase complete! Course access granted.', { id: verifyToast });
            navigate('/student/dashboard');
          } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Payment verification failed.', { id: verifyToast });
          }
        },
        prefill: {
          name: user.name || '',
          email: user.email || '',
          contact: user.phone || ''
        },
        theme: {
          color: '#b45309'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Checkout initialization failed', { id: loadToast });
    }
  };

  // Determine Brand Theme Settings based on type
  const isOffline = course?.type === 'offline';
  const primaryColor = 'text-primary-600 dark:text-primary-400';
  const primaryBg = 'bg-primary-500';
  const buttonGradient = 'bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg shadow-primary-600/25';
  const selectionTheme = 'selection:bg-primary-500';
  const playHoverClass = 'hover:bg-primary-500/20 text-primary-600 dark:text-primary-400';

  if (loading || !course) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-12 text-center space-y-4">
        <div className={`w-12 h-12 rounded-full border-4 border-primary-500/30 ${isOffline ? 'border-t-primary-600' : 'border-t-amber-500'} animate-spin`} />
        <p className="text-slate-605 dark:text-slate-300 font-semibold text-sm">Loading Course Masterclass...</p>
      </div>
    );
  }

  // ====================================================
  // PRESET 1: OFFLINE PREDEFINED COURSE DETAIL LAYOUT (Orvion Theme)
  // ====================================================
  if (isOffline) {
    const details = getOfflineCourseDetails(course.title);
    const modules = course.modules.length > 0 ? course.modules : getOfflineModules(course.title);

    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={`min-h-screen bg-slate-50/30 dark:bg-slate-950/30 pb-20 text-slate-800 dark:text-slate-100 ${selectionTheme} space-y-16 sm:space-y-24`}
      >
        {/* ================= HERO SECTION ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#1E2E4A] via-[#112338] to-[#0A1220] text-white p-6 sm:p-12 shadow-2xl border border-slate-800 flex flex-col lg:flex-row gap-10 items-center justify-between">
            {/* Ambient gold glow */}
            <div className="absolute right-0 top-0 w-80 h-80 bg-primary-600/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="space-y-6 flex-1 text-left relative z-10">
              <Link to="/courses?type=offline" className="inline-flex items-center gap-1 text-primary-400 font-extrabold text-xs uppercase tracking-wider hover:underline">
                <ChevronLeft className="w-4 h-4" /> Back to Programs
              </Link>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none font-heading">
                {course.title}
              </h1>
              
              <p className="text-slate-350 text-sm sm:text-lg max-w-xl font-medium leading-relaxed">
                {course.description || course.subtitle}
              </p>

              <div className="flex flex-wrap gap-3.5 pt-2 text-xs font-bold text-slate-300">
                <span className="bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary-400" /> 12 Weeks Duration</span>
                <span className="bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5"><Laptop className="w-3.5 h-3.5 text-emerald-400" /> In-person Cohort</span>
                <span className="bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-amber-400" /> Verified Certificate</span>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={handleEnroll}
                  className="px-8 py-4 rounded-xl font-bold bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25 transition-all text-xs tracking-wide uppercase"
                >
                  Enroll Now
                </button>
                <button
                  onClick={() => toast.success('Syllabus download started!')}
                  className="px-6 py-4 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition text-xs tracking-wide uppercase"
                >
                  Download Syllabus
                </button>
                <a
                  href="#contact"
                  className="px-6 py-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition text-xs tracking-wide uppercase flex items-center justify-center"
                >
                  Contact Us
                </a>
              </div>
            </div>

            {/* Right Card: What You'll Get */}
            <div className="w-full lg:w-[380px] bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white p-6 sm:p-8 rounded-[24px] border border-slate-200/90 dark:border-slate-850/90 shadow-2xl relative z-10 space-y-6">
              <h3 className="font-extrabold text-lg flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Sparkles className="w-5 h-5 text-primary-500" /> What You'll Get
              </h3>
              <ul className="space-y-4 text-xs font-semibold text-slate-600 dark:text-slate-350">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4.5 h-4.5 text-primary-500 shrink-0" />
                  <span>In-person Lab Practice & Coding Hubs</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4.5 h-4.5 text-primary-500 shrink-0" />
                  <span>1-on-1 Guidance from Working Engineers</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4.5 h-4.5 text-primary-500 shrink-0" />
                  <span>Verified Project Reviews & Portfolios</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4.5 h-4.5 text-primary-500 shrink-0" />
                  <span>Official Verifiable Orvion Certification</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4.5 h-4.5 text-primary-500 shrink-0" />
                  <span>Job Referrals & Interview Prep Assistance</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ================= TECHNOLOGIES SECTION ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading">
            Technologies You'll Master
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {details.techs.map((tech) => (
              <div 
                key={tech} 
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center space-y-3 hover:shadow-md transition-all hover:scale-105"
              >
                <div className="w-12 h-12 bg-primary-500/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center font-bold text-sm">
                  {tech[0]}
                </div>
                <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">{tech}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ================= LEARNING OUTCOMES ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading text-center">
            Learning Outcomes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {details.outcomes.map((outcome, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-[20px] p-6 shadow-sm flex items-start gap-4 hover:border-primary-500/30 transition">
                <div className="w-10 h-10 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <p className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-350 leading-relaxed pt-1.5">
                  {outcome}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CURRICULUM SECTION WITH PODIUM ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-black text-primary-600 uppercase tracking-widest bg-primary-500/10 px-3 py-1 rounded-full">Curriculum</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading">
              Master the Curriculum
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">A carefully structured path built to prepare you for actual production engineering roles.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Side: 3D-like Trophy Podium SVG Illustration */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center text-center space-y-4">
              <svg className="w-64 h-64 select-none" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Ground ellipse shadow */}
                <ellipse cx="100" cy="165" rx="70" ry="15" fill="#E2E8F0" className="dark:fill-slate-800/60" />
                {/* Podium Stage 3 (Bottom) */}
                <path d="M40 135 L160 135 L145 155 L55 155 Z" fill="#94A3B8" />
                {/* Podium Stage 2 (Middle) */}
                <path d="M55 110 L145 110 L135 135 L65 135 Z" fill="#B8C4D4" />
                {/* Podium Stage 1 (Top) */}
                <path d="M70 85 L130 85 L120 110 L80 110 Z" fill="#E2E8F0" />
                
                {/* Flag Pole */}
                <line x1="100" y1="35" x2="100" y2="85" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
                {/* Flag Banner */}
                <path d="M100 35 L145 45 L100 55 Z" fill="#b45309" />
                {/* Star on Flag */}
                <polygon points="112,43 115,45 114,48 111,46 109,48 110,45" fill="#FBBF24" />
                
                {/* Floating Graduation Cap */}
                <path d="M85 70 L100 65 L115 70 L100 75 Z" fill="#1E293B" />
                <path d="M92 73 L92 77 C92 79 108 79 108 77 L108 73" fill="#1E293B" />
                <line x1="115" y1="70" x2="119" y2="76" stroke="#b45309" strokeWidth="1.5" />
              </svg>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-slate-900 dark:text-white">Training & Portfolio</h4>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Get certified and stand out</p>
              </div>
            </div>

            {/* Right Side: Curriculum Accordions */}
            <div className="lg:col-span-7 space-y-4">
              {modules.map((mod, idx) => {
                const isOpen = openModuleIndex === idx;
                return (
                  <div key={idx} className="rounded-[20px] border border-slate-200/80 dark:border-slate-800/80 overflow-hidden bg-white dark:bg-slate-900/80 shadow-sm">
                    <button
                      onClick={() => setOpenModuleIndex(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-850 transition"
                    >
                      <div className="space-y-1 pr-2">
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                          {mod.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold font-sans">
                          {mod.duration || '3 weeks'} duration
                        </p>
                      </div>
                      {isOpen ? <ChevronUp className="w-5 h-5 text-primary-600 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="p-4 space-y-2 border-t border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900/40"
                        >
                          {mod.lessons?.map((les, lidx) => (
                            <div key={lidx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm">
                              <CheckCircle2 className="w-4.5 h-4.5 text-primary-500 shrink-0" />
                              <span className="font-semibold text-slate-700 dark:text-slate-200">{les.title}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= REAL-WORLD PROJECTS ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-black text-primary-600 uppercase tracking-widest bg-primary-500/10 px-3 py-1 rounded-full">Project-Based Learning</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading">
              Real-World Project Execution
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Build actual production-grade stacks instead of watching only video loops.</p>
          </div>

          {/* Three Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[22px] border border-slate-200/80 dark:border-slate-800/80 space-y-4 shadow-sm">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Laptop className="w-5 h-5 text-primary-500" /> Learning Stages
              </h4>
              <ul className="space-y-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> Build 5+ Medium and Hard Projects
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> Get feedback from industry mentors
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> Code Reviews & Pair Programming
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-[22px] border border-slate-200/80 dark:border-slate-800/80 space-y-4 shadow-sm">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-500" /> Real-world Scenarios
              </h4>
              <ul className="space-y-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> Production-grade codebases
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> Git and GitHub workflows
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> Deployment & CI/CD pipelines
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-[22px] border border-slate-200/80 dark:border-slate-800/80 space-y-4 shadow-sm">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" /> Impactful Outcomes
              </h4>
              <ul className="space-y-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> Showcase projects to recruiters
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> Add to Resume & LinkedIn
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> Stand out from certificate collectors
                </li>
              </ul>
            </div>
          </div>

          {/* Project Set Details Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col lg:flex-row gap-8 items-start">
            <div className="lg:w-1/3 space-y-4 text-xs font-semibold text-slate-500 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800/80 pr-6 w-full text-left font-sans">
              <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest bg-primary-500/10 px-2 py-0.5 rounded">Project Details</span>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">{details.project.title}</h3>
              <div className="space-y-3.5">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Problem Statement</span>
                  <p className="text-xs text-slate-700 dark:text-slate-350">{details.project.problem}</p>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Target Audience</span>
                  <p className="text-xs text-slate-700 dark:text-slate-350">{details.project.audience}</p>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Tech Stack</span>
                  <p className="text-xs text-primary-650 dark:text-primary-400 font-bold">{details.project.techStack}</p>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Scope</span>
                  <p className="text-xs text-slate-700 dark:text-slate-350">{details.project.details}</p>
                </div>
              </div>
            </div>

            {/* Milestones Flow */}
            <div className="flex-1 w-full text-left font-sans">
              <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest bg-primary-500/10 px-2 py-0.5 rounded">Milestone execution</span>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-6">Execution Steps</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {details.project.milestones.map((step, idx) => (
                  <div key={idx} className="flex gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-150 dark:border-slate-800/60 items-center">
                    <div className="w-8 h-8 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 font-extrabold flex items-center justify-center text-xs shrink-0">
                      {idx + 1}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= READY TO GET STARTED CTA ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#1E2E4A] to-[#112338] text-white p-8 sm:p-12 rounded-[32px] border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-primary-500/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="space-y-2.5">
              <h3 className="text-3xl font-black text-white font-heading">Ready to Get Started?</h3>
              <p className="text-slate-350 text-sm max-w-md font-medium">Join our next offline batch and accelerate your career with expert live mentorship.</p>
            </div>
            <button
              onClick={handleEnroll}
              className="px-8 py-4 rounded-xl font-bold bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25 transition text-xs tracking-wide uppercase shrink-0"
            >
              Enroll Now
            </button>
          </div>
        </section>

        {/* ================= OUTCOMES THAT MATTER ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FAF7F0] dark:bg-slate-900 border border-[#EBE6D5] dark:border-slate-800 p-8 sm:p-14 rounded-[32px] flex flex-col lg:flex-row items-center justify-between gap-12 shadow-sm text-slate-900 dark:text-white">
            <div className="space-y-6 flex-1 text-left">
              <span className="text-[11px] font-black text-[#b45309] uppercase tracking-widest bg-[#b45309]/10 px-3 py-1.5 rounded-full">Outcomes That Matter</span>
              
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-heading leading-none">Real Results for Real Students</h3>
                <h2 className="text-4xl sm:text-5xl font-black text-[#b45309] leading-tight font-heading">
                  Real Results for Real Students
                </h2>
              </div>
              
              <p className="text-slate-550 dark:text-slate-450 text-xs sm:text-sm font-semibold leading-relaxed max-w-lg">
                Join ambitious learners mastering design and development. Learn offline, build portfolio assets, and land engineering roles.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/courses"
                  className="px-6 py-3 rounded-lg font-bold bg-[#b45309] hover:bg-[#9a4900] text-white transition text-xs uppercase"
                >
                  Explore Programs
                </Link>
                <button
                  onClick={handleEnroll}
                  className="px-6 py-3 rounded-lg font-bold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 border border-[#EBE6D5] dark:border-slate-700 transition text-xs uppercase"
                >
                  Book Seats
                </button>
              </div>
            </div>

            {/* Tree Watermark SVG Graphic */}
            <div className="w-full lg:w-[350px] flex items-center justify-center shrink-0">
              <svg className="w-72 h-72 text-[#b45309]/20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Orvion Tree Structure */}
                <path d="M50 85 L50 45" stroke="#b45309" strokeWidth="5" strokeLinecap="round" />
                <path d="M50 65 Q35 55 30 45" stroke="#b45309" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M50 60 Q65 50 70 40" stroke="#b45309" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M50 50 Q40 40 45 30" stroke="#b45309" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M50 50 Q60 40 55 30" stroke="#b45309" strokeWidth="3.5" strokeLinecap="round" />
                
                {/* Leaves / Circles */}
                <circle cx="30" cy="45" r="4.5" fill="#b45309" />
                <circle cx="70" cy="40" r="4.5" fill="#b45309" />
                <circle cx="45" cy="30" r="4" fill="#b45309" />
                <circle cx="55" cy="30" r="4" fill="#b45309" />
                
                {/* Floating Graduation Caps */}
                <path d="M25 35 L30 33 L35 35 L30 37 Z" fill="#1E293B" />
                <path d="M68 25 L73 23 L78 25 L73 27 Z" fill="#1E293B" />
                <path d="M48 18 L53 16 L58 18 L53 20 Z" fill="#1E293B" />
              </svg>
            </div>
          </div>
        </section>
      </motion.div>
    );
  }

  // ====================================================
  // PRESET 2: ONLINE STANDARD LMS COURSE DETAIL LAYOUT
  // ====================================================
  const renderPurchaseCard = (isMobile = false) => (
    <div className={`glass-card p-5 sm:p-6 rounded-[24px] border border-slate-200/90 dark:border-slate-800/90 space-y-5 sm:space-y-6 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl ${isMobile ? 'w-full my-2' : 'sticky top-28'}`}>
      
      {/* Course Thumbnail & Video Preview Trigger */}
      <div 
        className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 group cursor-pointer shadow-md"
        onClick={() => setIsPreviewOpen(true)}
      >
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex flex-col items-center justify-center gap-2">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full ${primaryBg} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
            <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-1 fill-white" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
            Preview Course
          </span>
        </div>
      </div>

      {/* Price Display */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white">
            ₹{course.discountPrice || course.price}
          </span>
          {course.discountPrice > 0 && course.price > course.discountPrice && (
            <span className="text-base text-slate-400 line-through font-medium">
              ₹{course.price}
            </span>
          )}
          {course.discountPrice > 0 && course.price > course.discountPrice && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
              SAVE {Math.round(((course.price - course.discountPrice) / course.price) * 100)}%
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={isEnrolled ? () => navigate('/student/dashboard') : handleEnroll}
          className={`w-full py-4 rounded-xl font-bold text-white ${buttonGradient} hover:opacity-95 hover:scale-[1.01] transition-all duration-200 text-sm tracking-wide`}
        >
          {isEnrolled ? 'Access Granted (Go to Student Portal)' : 'Enroll Now'}
        </button>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Course link copied to clipboard!');
            }}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-350 flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Share2 className={`w-3.5 h-3.5 ${primaryColor}`} />
            <span>Share Course</span>
          </button>
        </div>
      </div>

      {/* Quick Includes List */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
        <div className="flex items-center gap-2">
          <Check className={`w-4.5 h-4.5 ${primaryColor} shrink-0`} />
          <span>Full lifetime access with future updates</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className={`w-4.5 h-4.5 ${primaryColor} shrink-0`} />
          <span>Access on mobile, desktop, and tablet</span>
        </div>
        {course.certificate && (
          <div className="flex items-center gap-2">
            <Check className={`w-4.5 h-4.5 ${primaryColor} shrink-0`} />
            <span>Official verifiable completion certificate</span>
          </div>
        )}
      </div>

    </div>
  );

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`min-h-screen bg-slate-50/50 dark:bg-slate-950/50 pb-16 sm:pb-20 text-slate-800 dark:text-slate-100 ${selectionTheme}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN (col-span-7 on Desktop) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* 1. Category Badge & Level */}
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="px-3.5 py-1 rounded-full text-xs font-extrabold text-white uppercase tracking-wider shadow-sm"
                style={{ backgroundColor: course.category?.color || '#D97706' }}
              >
                {course.category?.name}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {course.level}
              </span>
            </div>

            {/* 2. Course Title */}
            <h1 className="text-2.5xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-[1.18]">
              {course.title}
            </h1>

            {/* 3. Short Description */}
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-lg leading-relaxed font-medium">
              {course.subtitle}
            </p>

            {/* 4. Ratings & Metadata Grid */}
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 pt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 border-t border-slate-200/70 dark:border-slate-800/70">
              {!isOffline && (
                <div className="flex items-center gap-1.5 text-amber-500 font-extrabold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{course.rating}</span>
                  <span className="text-slate-400 font-normal">({course.enrolledCount.toLocaleString()} enrolled)</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Clock className={`w-4 h-4 ${primaryColor}`} />
                <span>{Math.round(course.totalDuration / 60)} Hours Total</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className={`w-4 h-4 ${primaryColor}`} />
                <span>{course.totalLessons} Modules & Lessons</span>
              </div>
            </div>

            {/* Secondary Specs Row */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 dark:text-slate-400 pb-2">
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>{course.language}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Updated {course.updatedAt}</span>
              </div>
              {course.certificate && (
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Award className="w-3.5 h-3.5" />
                  <span>Certificate Included</span>
                </div>
              )}
            </div>

            {/* 5. MOBILE & TABLET PURCHASE CARD */}
            <div className="block lg:hidden">
              {renderPurchaseCard(true)}
            </div>

            {/* 6. ABOUT THIS COURSE */}
            <section className="space-y-4 bg-white dark:bg-slate-900/80 p-5 sm:p-8 rounded-[22px] border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] dark:text-white tracking-tight flex items-center gap-2">
                <FileText className={`w-5 h-5 sm:w-6 sm:h-6 ${primaryColor}`} />
                <span>About This Course</span>
              </h2>
              <div className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
                {course.description.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </section>

            {/* 7. WHAT YOU'LL LEARN */}
            <section className={`space-y-6 p-5 sm:p-8 rounded-[22px] border ${isOffline ? 'bg-gradient-to-br from-primary-500/5 to-transparent border-primary-500/20' : 'bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent border-amber-500/20 dark:border-amber-500/30'}`}>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] dark:text-white tracking-tight flex items-center gap-2">
                <Sparkles className={`w-5 h-5 sm:w-6 sm:h-6 ${primaryColor}`} />
                <span>What You'll Learn</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {course.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                    <CheckCircle2 className={`w-5 h-5 ${primaryColor} shrink-0 mt-0.5`} />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">{outcome}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 8. COURSE CURRICULUM */}
            <section className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] dark:text-white tracking-tight flex items-center gap-2">
                  <BookOpen className={`w-5 h-5 sm:w-6 sm:h-6 ${primaryColor}`} />
                  <span>Course Curriculum</span>
                </h2>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {course.modules.length} Modules • {course.totalLessons} Lessons
                </span>
              </div>

              <div className="space-y-3.5 sm:space-y-4">
                {course.modules.map((mod, idx) => {
                  const isOpen = openModuleIndex === idx;
                  const hasAccess = isEnrolled || user?.role === 'admin' || user?.role === 'super_admin';
                  return (
                    <div key={mod._id || idx} className="rounded-[20px] border border-slate-200/80 dark:border-slate-800/80 overflow-hidden bg-white dark:bg-slate-900/80 shadow-sm">
                      <button
                        onClick={() => {
                          if (!hasAccess) {
                            toast.error('Please enroll in the course to unlock this module.');
                            return;
                          }
                          setOpenModuleIndex(isOpen ? null : idx);
                        }}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition"
                      >
                        <div className="space-y-1 pr-2">
                          <h3 className="font-bold text-sm sm:text-base text-[#0F172A] dark:text-white leading-snug">
                            {mod.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {mod.lessons?.length || 0} Lessons • {mod.duration || '45 mins'}
                          </p>
                        </div>
                        {!hasAccess ? (
                          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-lg shrink-0 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                            <span className="text-[10px] font-bold uppercase tracking-wider">Locked</span>
                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                        ) : (
                          isOpen ? <ChevronUp className={`w-5 h-5 ${primaryColor} shrink-0`} /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                        )}
                      </button>

                      <AnimatePresence>
                        {isOpen && hasAccess && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="p-3 sm:p-4 space-y-2 border-t border-slate-100 dark:border-slate-800/60"
                          >
                            {mod.lessons?.map((les) => (
                              <div key={les._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm gap-2">
                                <div className="flex items-center gap-3 min-w-0">
                                  {les.isPreview ? (
                                    <button
                                      onClick={() => setIsPreviewOpen(true)}
                                      className={`p-1 rounded-full ${playHoverClass} hover:scale-110 transition shrink-0`}
                                      title="Play Preview"
                                    >
                                      <Play className={`w-3.5 h-3.5 ${isOffline ? 'fill-primary-600' : 'fill-amber-600'}`} />
                                    </button>
                                  ) : (
                                    <Play className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  )}
                                  <span className="font-medium text-slate-700 dark:text-slate-200 truncate">{les.title}</span>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
                                  <span className="text-[11px] sm:text-xs text-slate-400">{Math.round((les.duration || 300) / 60)}m</span>
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN: DESKTOP STICKY PURCHASE SIDEBAR (≥ 1024px) */}
          <div className="hidden lg:block lg:col-span-5">
            {renderPurchaseCard(false)}
          </div>

        </div>
      </div>

      {/* VIDEO PREVIEW MODAL */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl glass-card rounded-[24px] p-4 space-y-4 relative bg-slate-900 text-white border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-base font-bold text-white truncate">{course.title} - Video Preview</h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition font-bold"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-inner relative">
              {(() => {
                const streamUrl = getPreviewStreamUrl(course.previewVideo);
                if (streamUrl.includes('youtube') || streamUrl.includes('youtube-nocookie')) {
                  return (
                    <iframe
                      src={streamUrl}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  );
                } else {
                  return (
                    <ReactPlayer url={streamUrl} controls width="100%" height="100%" playing />
                  );
                }
              })()}
            </div>
          </div>
        </div>
      )}

    </motion.div>
  );
}
