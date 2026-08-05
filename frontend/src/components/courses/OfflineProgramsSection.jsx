import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, MapPin, Target, ArrowRight, X, Check, Phone, Mail
} from 'lucide-react';

export default function OfflineProgramsSection() {
  const [activeDetailProgram, setActiveDetailProgram] = useState(null);

  const programs = [
    {
      id: 'sap',
      badge: 'ENTERPRISE',
      title: 'SAP',
      duration: '4 Months',
      mode: 'Ongole',
      meta: 'Placement & Training Guidance',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      description: 'Master SAP fundamentals through hands-on enterprise workflows and business process simulations. Build practical ERP skills aligned with industry standards.',
      highlight: '✨ 3 Months Training + 1 Month Internship',
      overviewText: 'The SAP Career Accelerator is an intensive 4-month offline classroom cohort designed to bridge the gap between academic learning and enterprise ERP execution. During the first 3 months, students master SAP S/4HANA workflows, FICO financial accounting, and business process integration in hands-on computer labs. The final month concludes with a guaranteed 1-month industry internship working on live corporate project simulations.',
    },
    {
      id: 'cybersecurity',
      badge: 'HIGH DEMAND',
      title: 'Cybersecurity',
      duration: '4 Months',
      mode: 'Ongole',
      meta: 'Placement & Training Guidance',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop',
      description: 'Learn ethical hacking, network security, penetration testing, vulnerability assessment, and modern cyber defense techniques.',
      highlight: '✨ 3 Months Training + 1 Month Internship',
      overviewText: 'The Cybersecurity Career Accelerator provides a comprehensive hands-on journey through ethical hacking, network packet analysis, vulnerability management, and cyber defense operations. Over 3 months of immersive classroom training in dedicated security labs, learners master Linux, Metasploit, and OWASP penetration testing tools. The program concludes with a 1-month hands-on security audit internship.',
    },
    {
      id: 'data-science',
      badge: 'TRENDING',
      title: 'Data Science',
      duration: '4 Months',
      mode: 'Ongole',
      meta: 'Placement & Training Guidance',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
      description: 'Learn data analysis, visualization, machine learning, statistics, and real-world business analytics using Python.',
      highlight: '✨ 3 Months Training + 1 Month Internship',
      overviewText: 'The Data Science Accelerator equips learners with production-grade data manipulation, machine learning modeling, and business intelligence dashboarding skills. Students spend 3 months mastering Python, Pandas, Scikit-Learn, and Power BI through real dataset projects, followed by a 1-month corporate analytics internship experience to build a verified portfolio.',
    },
    {
      id: 'data-engineering',
      badge: 'INDUSTRY READY',
      title: 'Data Engineering',
      duration: '4 Months',
      mode: 'Ongole',
      meta: 'Placement & Training Guidance',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
      description: 'Build scalable data pipelines, ETL workflows, cloud-based architectures, and modern big data processing systems.',
      highlight: '✨ 3 Months Training + 1 Month Internship',
      overviewText: 'The Data Engineering Accelerator focuses on constructing scalable ETL pipelines, cloud data warehouses, and distributed big data workflows. Over 3 months of hands-on lab training, students master advanced SQL, Python pipelines, Apache Spark, and cloud data architecture, ending with a 1-month industry internship building enterprise data pipelines.',
    },
    {
      id: 'devops',
      badge: 'CLOUD',
      title: 'DevOps',
      duration: '4 Months',
      mode: 'Ongole',
      meta: 'Placement & Training Guidance',
      image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800&auto=format&fit=crop',
      description: 'Master CI/CD pipelines, Docker, Kubernetes, Linux administration, cloud deployment, monitoring, and automation.',
      highlight: '✨ 3 Months Training + 1 Month Internship',
      overviewText: 'The DevOps Career Accelerator prepares students for cloud engineering and infrastructure automation roles. Across 3 months of intensive lab work, learners gain deep proficiency in Linux administration, Docker containerization, Kubernetes orchestration, AWS cloud, and CI/CD pipelines, culminating in a 1-month cloud deployment internship.',
    },
  ];

  const eligibilityChecklist = [
    'Any Graduate / Final Year Student',
    'Basic Computer Knowledge',
    'Interest in Technology',
    'Willingness to Learn'
  ];

  const handleRegisterClick = (program) => {
    setActiveDetailProgram(program);
  };
  return (
    <section className="mt-[40px] pt-4 border-t border-[#F2E5D8] dark:border-slate-800">
      {/* Premium Redesigned Heading Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center mt-[40px] mb-[32px]"
      >
        <h2 className="text-[32px] sm:text-[42px] lg:text-[52px] font-extrabold text-[#111827] dark:text-white tracking-[-1px] leading-[1.1] text-center">
          Offline{' '}
          <span className="bg-gradient-to-r from-[#C96A00] to-[#F59E0B] bg-clip-text text-transparent">
            Classroom
          </span>{' '}
          Programs
        </h2>
      </motion.div>

      {/* ULTRA-COMPACT PREVIEW CARDS GRID (Shifted Upwards cleanly) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((prog, index) => (
          <motion.div
            key={prog.id}
            initial={{ opacity: 0, y: 35, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[420px] mx-auto bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200/80 dark:border-slate-800 shadow-[0_10px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 p-4 flex flex-col justify-between overflow-hidden group h-full"
          >
            <div className="space-y-3">
              {/* Cover Image Banner (h-[160px]) */}
              <div className="relative h-[160px] w-full rounded-[16px] overflow-hidden">
                {/* Category Badge */}
                <span className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md bg-gradient-to-r from-[#A65800] to-[#D47A00]">
                  {prog.badge}
                </span>

                <img
                  src={prog.image}
                  alt={prog.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
              </div>

              {/* Title & Meta Info */}
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-[#0F172A] dark:text-white tracking-tight line-clamp-1 group-hover:text-[#A65800] transition-colors">
                  {prog.title}
                </h3>

                {/* Single Row Meta Info: 🕒 4 Months • 📍 Ongole • 🎯 Placement & Training Guidance */}
                <div className="flex items-center flex-wrap gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#A65800]" />
                    {prog.duration}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#A65800]" />
                    {prog.mode}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-[#A65800]" />
                    {prog.meta}
                  </span>
                </div>

                {/* 2-line Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium line-clamp-2 pt-0.5">
                  {prog.description}
                </p>
              </div>
            </div>

          {/* Premium Light Theme Pill Register Button */}
          <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex justify-center mt-5 mb-1"
            >
              <button
                onClick={() => handleRegisterClick(prog)}
                className="w-[190px] h-[52px] rounded-full bg-white border-2 border-[#C96A00] text-[#C96A00] hover:bg-[#C96A00] hover:text-white hover:-translate-y-[2px] active:scale-[0.98] transition-all duration-300 ease-in-out shadow-[0_8px_24px_rgba(201,106,0,0.08)] flex items-center justify-center gap-2 group/btn cursor-pointer font-semibold text-[18px] tracking-normal"
              >
                <span>Register</span>
                <ArrowRight className="w-[18px] h-[18px] text-[#C96A00] group-hover/btn:text-white transition-all duration-300 group-hover/btn:translate-x-1.5" />
              </button>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* DEDICATED COURSE DETAILS MODAL WITH PURE WHITE BACKGROUND OUTSIDE HERO CARD */}
      <AnimatePresence>
        {activeDetailProgram && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white dark:bg-slate-900 rounded-[32px] max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col relative"
            >
              {/* Modal Header Bar */}
              <div className="sticky top-0 z-20 px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-end">
                <button
                  onClick={() => setActiveDetailProgram(null)}
                  className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content Body (Clean White Modal Background Outside Hero Card) */}
              <div className="overflow-y-auto p-6 sm:p-8 space-y-8 bg-white dark:bg-slate-900">
                {/* 1. HERO SECTION (Dark Navy Gradient Strictly Inside Rounded Hero Card) */}
                <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-[#1E2E4A] via-[#112338] to-[#0A1220] text-white p-6 sm:p-8 space-y-4 border border-slate-800 shadow-xl isolate">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-[#D47A00] text-white">
                      {activeDetailProgram.badge}
                    </span>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-slate-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#D47A00]" /> {activeDetailProgram.duration}
                    </span>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {activeDetailProgram.mode}
                    </span>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-slate-300 flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-amber-400" /> {activeDetailProgram.meta}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {activeDetailProgram.title} Program
                  </h1>

                  <p className="text-slate-300 text-xs sm:text-sm max-w-xl font-medium leading-relaxed">
                    {activeDetailProgram.description}
                  </p>

                  <div className="pt-1">
                    <a
                      href="#contact-section"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#A65800] to-[#D47A00] shadow-md hover:scale-105 transition"
                    >
                      <span>Contact Us</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* 2. PROGRAM OVERVIEW */}
                <div className="space-y-2">
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#A65800]">Program Overview</span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] dark:text-white">About the Course</h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {activeDetailProgram.overviewText}
                  </p>
                </div>

                {/* 3. ELIGIBILITY CRITERIA */}
                <div className="space-y-3">
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#A65800]">Requirements</span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] dark:text-white">Eligibility Criteria</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {eligibilityChecklist.map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/20 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#A65800] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          <Check className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-[#0F172A] dark:text-slate-200">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. CONTACT ORVION SECTION */}
                <motion.div 
                  id="contact-section"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="py-8 space-y-6 text-center"
                >
                  <div className="space-y-2">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#C96A00]">Contact Us</span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white">Contact Orvion</h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto font-medium">
                      Get in touch with our admissions team to register or learn more about this program.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto pt-2">
                    {/* Card 1: Mobile Number */}
                    <a 
                      href="tel:+918978226888"
                      className="p-6 rounded-[18px] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(201,106,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#C96A00] text-white flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                        <Phone className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Mobile Number</span>
                      <span className="text-sm font-bold text-[#0F172A] dark:text-white mt-1 group-hover:text-[#C96A00] transition-colors">+91 89782 26888</span>
                    </a>

                    {/* Card 2: Email Address */}
                    <a 
                      href="mailto:info@orvionlearn.co.in"
                      className="p-6 rounded-[18px] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(201,106,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#C96A00] text-white flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                        <Mail className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Email Address</span>
                      <span className="text-sm font-bold text-[#0F172A] dark:text-white mt-1 group-hover:text-[#C96A00] transition-colors">info@orvionlearn.co.in</span>
                    </a>

                    {/* Card 3: Location */}
                    <div 
                      className="p-6 rounded-[18px] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(201,106,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#C96A00] text-white flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Location</span>
                      <span className="text-sm font-bold text-[#0F172A] dark:text-white mt-1">Ongole, Andhra Pradesh</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
