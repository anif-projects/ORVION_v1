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
      icon: BookOpen,
      badge: 'Popular',
    },
    {
      id: 'ai-ml',
      title: 'AI & Data Science Engineering',
      duration: '3 Months (Remote)',
      description: 'Build and deploy Machine Learning models, analyze complex datasets, and work on Generative AI integrations using Python and popular deep learning frameworks.',
      requirements: ['Python programming', 'Basic Linear Algebra', 'Analytical mindset'],
      skills: ['Python & Pandas', 'Supervised / Unsupervised ML', 'Generative AI & LLMs', 'Model Deployment'],
      icon: Star,
      badge: 'Trending',
    },
    {
      id: 'ui-ux',
      title: 'UI/UX Design & Frontend Engineering',
      duration: '3 Months (Remote)',
      description: 'Bridge the gap between design and development. Design high-fidelity Figma mockups, user research maps, and convert designs into responsive React interfaces.',
      requirements: ['Interest in visual design', 'Basic CSS/JS', 'Attention to detail'],
      skills: ['Figma Mastery', 'User Research & Wireframes', 'TailwindCSS & React', 'Micro-interactions'],
      icon: Briefcase,
      badge: 'Highly Creative',
    },
    {
      id: 'devops-sec',
      title: 'DevOps & Cloud Security',
      duration: '3 Months (Remote)',
      description: 'Gain hands-on expertise in cloud infrastructure, containerization, automated pipelines, security auditing, and server administration.',
      requirements: ['Basic Linux commands', 'Understanding of web servers', 'Problem solving'],
      skills: ['Docker & Kubernetes', 'AWS / Google Cloud', 'CI/CD & Jenkins', 'Infrastructure as Code'],
      icon: HelpCircle,
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
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12"
    >
      <div className="space-y-8">
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Available Domains</h2>
          <p className="text-xs sm:text-sm text-slate-500">Select a specialization domain and apply to start your internship cohort.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {internshipDomains.map((domain) => {
            const Icon = domain.icon;
            return (
              <div
                key={domain.id}
                className="glass-card p-6 sm:p-8 rounded-[28px] border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition duration-200"
              >
                <div className="space-y-4">
                  {/* Top line with Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shadow-sm">
                      <Icon className="w-5.5 h-5.5" />
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-600/10 text-amber-600 border border-amber-600/20 uppercase tracking-wider">
                        {domain.badge}
                      </span>
                    </div>
                  </div>

                  {/* Header Details */}
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white leading-snug">{domain.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>{domain.duration}</span>
                      <span className="text-slate-300">•</span>
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>Remote Mode</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {domain.description}
                  </p>

                  {/* Curriculum / Skills bullet points */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Key Skills</h4>
                      <ul className="space-y-1">
                        {domain.skills.map((skill, index) => (
                          <li key={index} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-bold">
                            <span className="w-1 h-1 rounded-full bg-amber-600 shrink-0" />
                            <span>{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Eligibility</h4>
                      <ul className="space-y-1">
                        {domain.requirements.map((req, index) => (
                          <li key={index} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleOpenApplyModal(domain.title)}
                    className="w-full h-11 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                  >
                    <span>Apply for Cohort</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
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
