import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Calendar, MapPin, Award, CheckCircle2, ChevronRight, X, Send, BookOpen, Star, HelpCircle } from 'lucide-react';
import { pageVariants } from '../../utils/animations';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function InternshipsPage() {
  const [selectedDomain, setSelectedDomain] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 space-y-12 overflow-hidden bg-[#FFFDF9]"
    >
      {/* PREMIUM MINIMAL ANIMATED BACKGROUND LAYER */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Ultra-Light Dotted Grid Texture (2% Opacity) */}
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#F97316_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* 3 LARGE FLOATING GRADIENT BLOBS (4% Opacity, 160px Blur, 22s Float) */}
        <motion.div
          animate={{
            x: [-15, 20, -15],
            y: [-15, 15, -15]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -left-24 w-[600px] h-[600px] rounded-full bg-[#F97316] opacity-[0.04] blur-[160px] pointer-events-none"
        />
        <motion.div
          animate={{
            x: [20, -15, 20],
            y: [15, -15, 15]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 -right-24 w-[550px] h-[550px] rounded-full bg-[#FFF6EB] opacity-[0.05] blur-[160px] pointer-events-none"
        />
        <motion.div
          animate={{
            x: [-10, 15, -10],
            y: [15, -10, 15]
          }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-24 left-1/3 w-[580px] h-[580px] rounded-full bg-[#F5E7D6] opacity-[0.04] blur-[160px] pointer-events-none"
        />

        {/* THIN OUTLINE CIRCLES (4 Large Circles: 1px Stroke, Brand Orange, 4% Opacity, 45s Rotation) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-20 right-10 w-[420px] h-[420px] rounded-full border border-[#F97316]/[0.04] pointer-events-none"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-10 -left-20 w-[460px] h-[460px] rounded-full border border-[#F97316]/[0.04] pointer-events-none"
        />

        {/* TINY FLOATING PARTICLES (18 Dots, 2-3px, 6% Opacity, Float Upward) */}
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-15, 15, -15],
              opacity: [0.02, 0.06, 0.02]
            }}
            transition={{
              duration: 12 + (i % 4) * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5
            }}
            className="absolute rounded-full bg-[#F97316]/[0.06]"
            style={{
              width: `${(i % 2) + 2}px`,
              height: `${(i % 2) + 2}px`,
              left: `${(i * 5.5) % 94}%`,
              top: `${(i * 7.1) % 88}%`
            }}
          />
        ))}

        {/* SOFT AMBIENT GLOW BEHIND CARDS (Scale breathing 100% -> 103%, 12s, 3% Opacity, Blur 120px) */}
        <motion.div
          animate={{ scale: [1, 1.03, 1], opacity: [0.02, 0.04, 0.02] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] rounded-full bg-[#F97316] blur-[120px] pointer-events-none"
        />
      </div>

      {/* CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* HEADER SECTION */}
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Available Domains
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Select a specialization domain and apply to start your internship cohort.
          </p>
        </div>

        {/* CARDS GRID (Compact 15-20% smaller cards, no top icons, h-48px button, hover elevation & glow) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {internshipDomains.map((domain, index) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.08, ease: 'easeOut' }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="p-5 sm:p-6 rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4 hover:border-[#F97316]/40 hover:shadow-[0_20px_50px_rgba(249,115,22,0.10)] transition-all duration-300 group cursor-pointer"
            >
              <div className="space-y-3.5">
                
                {/* Top Line with Title & Badge (NO ICON, Clean top alignment) */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug tracking-tight">
                    {domain.title}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 uppercase tracking-wider shrink-0">
                    {domain.badge}
                  </span>
                </div>

                {/* Duration & Mode Meta Info */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>{domain.duration}</span>
                  <span className="text-slate-300">•</span>
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Remote Mode</span>
                </div>

                {/* Description (15px equivalent, compact & readable) */}
                <p className="text-[13px] sm:text-[14px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {domain.description}
                </p>

                {/* Key Skills & Eligibility Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  
                  {/* Key Skills */}
                  <div className="space-y-1.5">
                    <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.08em]">
                      Key Skills
                    </h4>
                    <ul className="space-y-1">
                      {domain.skills.map((skill, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 font-semibold">
                          <span className="w-1 h-1 rounded-full bg-[#F97316] shrink-0" />
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Eligibility */}
                  <div className="space-y-1.5">
                    <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.08em]">
                      Eligibility
                    </h4>
                    <ul className="space-y-1">
                      {domain.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

              </div>

              {/* Action Button (Height 48px, rounded 14px, lift 2px, soft shadow, orange glow) */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleOpenApplyModal(domain.title)}
                  className="w-full h-[48px] rounded-[14px] bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-300 shadow-[0_4px_14px_rgba(249,115,22,0.25)] hover:shadow-[0_10px_25px_-5px_rgba(249,115,22,0.35)] hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Apply for Cohort</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* 4. Application Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
             <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[32px] p-6 sm:p-8 pb-10 sm:pb-8 space-y-6 relative border border-slate-200 dark:border-slate-800 shadow-2xl overflow-y-auto max-h-[80vh] sm:max-h-[90vh]"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 dark:text-slate-500 dark:hover:text-white transition text-lg font-bold"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1.5 text-center">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Apply for Internship</h3>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider text-amber-600">
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
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold text-slate-800 dark:text-white"
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
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold text-slate-800 dark:text-white"
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
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold text-slate-800 dark:text-white"
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
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold text-slate-800 dark:text-white"
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
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold text-slate-800 dark:text-white"
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
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold text-slate-800 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-2xl font-bold text-white bg-amber-600 hover:bg-amber-700 transition flex items-center justify-center gap-2 mt-2 shadow-sm border border-transparent disabled:opacity-75 disabled:cursor-not-allowed"
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
